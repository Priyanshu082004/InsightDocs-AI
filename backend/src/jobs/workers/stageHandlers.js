import { getMimeCategory } from "../../constants/fileUpload.constant.js";
import { PROCESSING_STAGE } from "../../constants/document.constant.js";
import { env } from "../../config/env.config.js";
import * as storageService from "../../storage/storage.service.js";
import * as documentProcessingRepository from "../../modules/processing/documentProcessing.repository.js";
import * as documentChunkRepository from "../../modules/ai/documentChunk.repository.js";
import * as embeddingMetadataRepository from "../../modules/ai/embeddingMetadata.repository.js";
import * as llmService from "../../modules/ai/llm.service.js";
import * as embeddingService from "../../modules/ai/embedding.service.js";
import * as aiAnalysisService from "../../modules/ai/aiAnalysis.service.js";
import { extractText } from "../../modules/ai/textExtraction.service.js";
import { splitIntoChunks } from "../../modules/ai/chunking.service.js";

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
    const text = await llmService.extractTextFromImage(buffer, document.mimeType);

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

    const text = await extractText({ buffer, mimeType: document.mimeType, ocrText });

    return { text, charCount: text.length };
  },

  CHUNKING: async ({ document }) => {
    const extractionOutput = await documentProcessingRepository.getStageOutput(
      document._id,
      PROCESSING_STAGE.TEXT_EXTRACTION
    );
    const text = extractionOutput?.text ?? "";

    await documentChunkRepository.deleteChunksForDocument(document._id);

    const chunks = splitIntoChunks(text);
    if (chunks.length > 0) {
      await documentChunkRepository.bulkInsertChunks(
        chunks.map((chunk) => ({ documentId: document._id, ...chunk }))
      );
    }

    return { chunkCount: chunks.length };
  },

  EMBEDDING: async ({ document }) => {
    const chunks = await documentChunkRepository.listChunksForDocument(document._id);

    for (const chunk of chunks) {
      const vector = await embeddingService.generateEmbedding(chunk.text);
      await documentChunkRepository.updateChunkEmbedding(chunk._id, vector);
      await embeddingMetadataRepository.upsertEmbeddingMetadata({
        chunkId: chunk._id,
        documentId: document._id,
        modelName: env.OPENAI_EMBEDDING_MODEL,
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