import { getMimeCategory } from "../../constants/fileUpload.constant.js";
import { PROCESSING_STAGE } from "../../constants/document.constant.js";
import * as storageService from "../../storage/storage.service.js";
import * as documentProcessingRepository from "../../modules/processing/documentProcessing.repository.js";
import * as documentChunkRepository from "../../modules/processing/documentChunk.repository.js";
import * as embeddingMetadataRepository from "../../modules/processing/embeddingMetadata.repository.js";
import * as aiServiceClient from "../../services/aiService.client.js";
import * as aiAnalysisService from "../../modules/analysis/aiAnalysis.service.js";
import { extractText } from "../../modules/processing/textExtraction.service.js";
import { splitIntoChunks } from "../../modules/processing/chunking.service.js";

// Generous cap that keeps a single OpenRouter call fast and predictably
// priced even for a large document. A document longer than this gets
// truncated for SUMMARY/KEYWORDS/RISK_ANALYSIS purposes — full
// map-reduce summarization is a documented future enhancement, not
// built in this phase. Unchanged from the pre-refactor value.
const MAX_TEXT_CHARS_FOR_PROMPT = 100_000;

const getExtractedTextForPrompt = async (documentId) => {
  const extractionOutput = await documentProcessingRepository.getStageOutput(
    documentId,
    PROCESSING_STAGE.TEXT_EXTRACTION
  );
  const text = extractionOutput?.text ?? "";
  return text.slice(0, MAX_TEXT_CHARS_FOR_PROMPT);
};

/**
 * Same interface as before the provider refactor: every handler is
 * ({ document, job }) => Promise<result>, and the worker persists
 * whatever a handler returns as that stage's `output` — nothing about
 * documentProcessing.worker.js changed for this refactor. Only the
 * imports each handler body calls into changed: gemini.client is gone,
 * replaced by llm.service / embedding.service / aiAnalysis.service.
 */
export const stageHandlers = {
  OCR: async ({ document }) => {
    const category = getMimeCategory(document.mimeType);

    if (category !== "IMAGES") {
      return { skipped: true };
    }

    const buffer = await storageService.getObjectBuffer(document.storageKey);
    const text = await aiServiceClient.extractTextFromImage(buffer, document.mimeType);

    return { skipped: false, text };
  },

  TEXT_EXTRACTION: async ({ document }) => {
    const category = getMimeCategory(document.mimeType);
    let ocrText = null;
    let buffer = null;

    if (category === "IMAGES") {
      const ocrOutput = await documentProcessingRepository.getStageOutput(
        document._id,
        PROCESSING_STAGE.OCR
      );
      ocrText = ocrOutput?.text ?? "";
    } else {
      buffer = await storageService.getObjectBuffer(document.storageKey);
    }

    const { text, pages } = await extractText({
      buffer,
      mimeType: document.mimeType,
      ocrText,
    });

    // `pages` (PDFs only, null otherwise) rides along in the stage
    // output so CHUNKING can stamp per-chunk page provenance.
    return { text, charCount: text.length, pages };
  },

  CHUNKING: async ({ document }) => {
    const extractionOutput = await documentProcessingRepository.getStageOutput(
      document._id,
      PROCESSING_STAGE.TEXT_EXTRACTION
    );
    const text = extractionOutput?.text ?? "";

    await documentChunkRepository.deleteChunksForDocument(document._id);

    // Old extraction outputs have no `pages` — splitIntoChunks treats
    // that as "no provenance" and stamps pageNumber null (back-compat).
    const chunks = splitIntoChunks(text, extractionOutput?.pages ?? null);
    if (chunks.length > 0) {
      await documentChunkRepository.bulkInsertChunks(
        chunks.map((chunk) => ({ documentId: document._id, ...chunk }))
      );
    }

    return { chunkCount: chunks.length };
  },

  EMBEDDING: async ({ document }) => {
    const chunks = await documentChunkRepository.listChunksForDocument(document._id);
    if (chunks.length === 0) {
      return { chunksEmbedded: 0 };
    }

    // One batched call for every chunk — the AI service embeds them in
    // order, so embeddings[i] belongs to chunks[i].
    const { embeddings, modelName } = await aiServiceClient.generateEmbeddings(
      chunks.map((chunk) => chunk.text)
    );

    for (const [i, chunk] of chunks.entries()) {
      const vector = embeddings[i];
      await documentChunkRepository.updateChunkEmbedding(chunk._id, vector);
      await embeddingMetadataRepository.upsertEmbeddingMetadata({
        chunkId: chunk._id,
        documentId: document._id,
        modelName,
        dimensions: vector.length,
        tokensUsed: chunk.tokenCount,
      });
    }

    return { chunksEmbedded: chunks.length };
  },

  // SUMMARY/KEYWORDS/RISK_ANALYSIS now delegate their generate+persist
  // pairing to aiAnalysis.service — see that file's header comment for
  // why this moved out of the handler body.
  SUMMARY: async ({ document }) => {
    const text = await getExtractedTextForPrompt(document._id);
    return aiAnalysisService.analyzeSummary(document._id, text);
  },

  KEYWORDS: async ({ document }) => {
    const text = await getExtractedTextForPrompt(document._id);
    return aiAnalysisService.analyzeKeywords(document._id, text);
  },

  RISK_ANALYSIS: async ({ document }) => {
    const text = await getExtractedTextForPrompt(document._id);
    return aiAnalysisService.analyzeRisk(document._id, text);
  },
};