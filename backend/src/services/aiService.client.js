import { env } from "../config/env.config.js";
import { logger } from "../config/logger.config.js";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.constant.js";

/**
 * aiService.client — the ONLY backend component aware of the AI service.
 *
 * Every AI operation (analysis, embeddings, OCR, chat streaming) goes
 * through here as an HTTP call to the internal FastAPI service. The
 * backend sends STRUCTURED payloads (text, question + chunks, image
 * bytes) — never prompt strings; prompt engineering lives entirely in
 * the AI service. No other file may import fetch-to-AI logic directly.
 *
 * Error contract: failures surface as ApiError, same as the old
 * in-process providers did, so callers and the error middleware need no
 * changes. Uses Node's built-in fetch (Node >= 18) — no new dependency.
 */

const BASE_URL = env.AI_SERVICE_URL.replace(/\/$/, "");

const postJSON = async (path, body, { signal } = {}) => {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
  } catch (err) {
    logger.error({ err: err.message, path }, "AI service unreachable");
    throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "AI service unavailable");
  }

  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    logger.error({ path, status: response.status, detail }, "AI service returned an error");
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      detail?.message || "AI request failed"
    );
  }

  return response.json();
};

// --- Analysis -------------------------------------------------------------

// Each returns the AI service's structured result; persistence stays with
// the caller (MongoDB is backend-owned).
export const generateSummary = async (text, { documentId } = {}) =>
  postJSON("/api/v1/analysis/summary", { text, document_id: documentId?.toString() });

export const generateKeywords = async (text, { documentId } = {}) =>
  postJSON("/api/v1/analysis/keywords", { text, document_id: documentId?.toString() });

export const generateRisk = async (text, { documentId } = {}) =>
  postJSON("/api/v1/analysis/risk", { text, document_id: documentId?.toString() });

// --- Embeddings -----------------------------------------------------------

/** Batch-first: pass every chunk text in one call. Returns
 * { embeddings: number[][], modelName, dimensions }. */
export const generateEmbeddings = async (texts) => {
  const data = await postJSON("/api/v1/embeddings", { texts });
  return {
    embeddings: data.embeddings,
    modelName: data.model_name,
    dimensions: data.dimensions,
  };
};

// --- OCR ------------------------------------------------------------------

/** Sends raw image bytes as multipart (the backend fetched them from
 * MinIO — storage never crosses into the AI service). Returns the
 * extracted text string, same contract as the old extractTextFromImage. */
export const extractTextFromImage = async (buffer, mimeType) => {
  const form = new FormData();
  form.append("file", new Blob([buffer], { type: mimeType }), "image");

  let response;
  try {
    response = await fetch(`${BASE_URL}/api/v1/ocr`, { method: "POST", body: form });
  } catch (err) {
    logger.error({ err: err.message }, "AI service unreachable (OCR)");
    throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "AI service unavailable");
  }

  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    logger.error({ status: response.status, detail }, "AI OCR request failed");
    throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, detail?.message || "AI OCR failed");
  }

  const data = await response.json();
  return data.text;
};

// --- Chat streaming -------------------------------------------------------

/**
 * Streams a RAG answer. Same caller contract as the old
 * llm.service.streamChatResponse: fires onToken per token and resolves
 * with the full answer text. Input is structured (question + retrieved
 * chunks) — the RAG prompt is built inside the AI service.
 *
 * `signal` (AbortSignal) propagates cancellation: when the frontend
 * drops the SSE connection, aborting here cancels the HTTP request to
 * the AI service, which cancels its OpenRouter stream.
 */
export const streamChatResponse = async ({ question, chunks }, onToken, { signal } = {}) => {
  let response;
  try {
    response = await fetch(`${BASE_URL}/api/v1/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        chunks: chunks.map((chunk) => ({
          text: chunk.text,
          chunk_id: chunk._id?.toString(),
        })),
      }),
      signal,
    });
  } catch (err) {
    logger.error({ err: err.message }, "AI service unreachable (chat)");
    throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "AI service unavailable");
  }

  if (!response.ok || !response.body) {
    const detail = await response.json().catch(() => null);
    logger.error({ status: response.status, detail }, "AI chat request failed");
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      detail?.message || "AI generation failed"
    );
  }

  // Parse the SSE stream: each event is a `data: {...}` line. Events may
  // arrive split across network reads, so buffer until "\n\n".
  let fullText = "";
  let buffer = "";
  const decoder = new TextDecoder();

  for await (const part of response.body) {
    buffer += decoder.decode(part, { stream: true });

    let boundary;
    while ((boundary = buffer.indexOf("\n\n")) !== -1) {
      const rawEvent = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);

      const dataLine = rawEvent.split("\n").find((line) => line.startsWith("data: "));
      if (!dataLine) continue;

      const event = JSON.parse(dataLine.slice(6));
      if (event.token) {
        fullText += event.token;
        onToken?.(event.token);
      } else if (event.error) {
        throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, event.error);
      }
      // { done: true } is the terminal marker — nothing to do; the loop
      // ends when the AI service closes the stream.
    }
  }

  return fullText;
};
