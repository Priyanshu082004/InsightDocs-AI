import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { getMimeCategory } from "../../constants/fileUpload.constant.js";
import { ApiError } from "../../utils/ApiError.js";
import { HTTP_STATUS } from "../../constants/httpStatus.constant.js";
import { logger } from "../../config/logger.config.js";

/**
 * Text extraction — normalizes every supported upload type to plain
 * text for the pipeline (CHUNKING and the analysis stages consume it).
 *
 * Images never reach the parsers here: the OCR stage already produced
 * their text via the AI service, and TEXT_EXTRACTION passes it in as
 * `ocrText`. Everything else is parsed from the raw buffer locally —
 * deliberately NOT an AI concern, which is why this lives in
 * modules/processing, not in the AI service.
 */

// Returns { text, pages } — pages is [{ pageNumber, text }], verified
// at runtime: pdf-parse v2 getText() exposes result.pages[{text,num}].
// The combined text is rebuilt from the per-page texts (normalized
// individually, joined with "\n\n") instead of using result.text, which
// injects "-- N of M --" separator artifacts between pages.
const extractPdf = async (buffer) => {
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const result = await parser.getText();
    const pages = (result.pages ?? [])
      .map((page) => ({ pageNumber: page.num, text: normalize(page.text ?? "") }))
      .filter((page) => page.text.length > 0);
    return {
      text: pages.map((page) => page.text).join("\n\n"),
      pages,
    };
  } finally {
    await parser.destroy();
  }
};

const extractDocx = async (buffer) => {
  const { value } = await mammoth.extractRawText({ buffer });
  return value ?? "";
};

// Normalize away parser artifacts: collapse 3+ newlines, strip trailing
// spaces, trim — keeps chunk boundaries meaningful instead of splitting
// on runs of blank lines.
const normalize = (text) =>
  text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

/**
 * Returns { text, pages }.
 * `pages` is provenance: [{ pageNumber, text }] — only for PDFs, the
 * one format with reliable page boundaries (runtime-verified). All
 * other formats return pages: null; chunks from them carry no page.
 */
export const extractText = async ({ buffer, mimeType, ocrText }) => {
  // Image path: OCR stage already did the work via the AI service.
  if (getMimeCategory(mimeType) === "IMAGES") {
    return { text: normalize(ocrText ?? ""), pages: null };
  }

  try {
    switch (mimeType) {
      case "application/pdf":
        // extractPdf normalizes per page and reports page provenance.
        return await extractPdf(buffer);

      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return { text: normalize(await extractDocx(buffer)), pages: null };

      case "text/plain":
      case "text/csv":
        return { text: normalize(buffer.toString("utf-8")), pages: null };

      default:
        // In the upload whitelist but with no parser wired yet
        // (.doc, .xls, .xlsx) — fail the stage with a clear message
        // rather than feeding garbage downstream.
        throw new ApiError(
          HTTP_STATUS.UNPROCESSABLE_ENTITY,
          `Text extraction not supported for ${mimeType}`
        );
    }
  } catch (err) {
    if (err instanceof ApiError) throw err;
    logger.error({ err: err.message, mimeType }, "Text extraction failed");
    throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Text extraction failed");
  }
};
