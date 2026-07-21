/**
 * Chunking — splits extracted text into overlapping, token-bounded
 * chunks for embedding and retrieval.
 *
 * Strategy: paragraph-aware packing. Paragraphs are the natural unit of
 * meaning, so chunks are built by packing whole paragraphs up to the
 * size target, splitting oversized paragraphs on sentence boundaries as
 * a fallback. Neighboring chunks overlap so a fact straddling a
 * boundary is retrievable from at least one chunk.
 *
 * Token counts are approximated at ~4 characters per token — the usual
 * heuristic for English text. It only needs to be roughly right: it
 * bounds chunk size and fills DocumentChunk.tokenCount; nothing bills
 * against it.
 */

const CHARS_PER_TOKEN = 4;
const TARGET_TOKENS = 1000; // ~4000 chars per chunk
const OVERLAP_TOKENS = 150; // ~15% carried into the next chunk

const TARGET_CHARS = TARGET_TOKENS * CHARS_PER_TOKEN;
const OVERLAP_CHARS = OVERLAP_TOKENS * CHARS_PER_TOKEN;

const estimateTokens = (text) => Math.ceil(text.length / CHARS_PER_TOKEN);

// Split an oversized paragraph on sentence ends; hard-slice anything
// still too big (e.g. minified/unpunctuated text) so no piece can
// exceed the target.
const splitOversized = (paragraph) => {
  const sentences = paragraph.match(/[^.!?\n]+[.!?]*\s*/g) ?? [paragraph];
  const pieces = [];

  for (const sentence of sentences) {
    if (sentence.length <= TARGET_CHARS) {
      pieces.push(sentence);
      continue;
    }
    for (let i = 0; i < sentence.length; i += TARGET_CHARS) {
      pieces.push(sentence.slice(i, i + TARGET_CHARS));
    }
  }

  return pieces;
};

// Paragraph units from one span of text, each tagged with its page (or
// null when the source format has no page provenance).
const buildUnits = (text, pageNumber) =>
  text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .flatMap((p) => (p.length > TARGET_CHARS ? splitOversized(p) : [p]))
    .map((unitText) => ({ text: unitText, pageNumber }));

/**
 * Returns [{ chunkIndex, text, tokenCount, pageNumber }] — exactly the
 * shape CHUNKING's bulkInsertChunks spreads into DocumentChunk rows
 * (the caller adds documentId).
 *
 * `pages` is optional provenance from extraction ([{ pageNumber, text }],
 * PDFs only). When present, units are built per page so each chunk can
 * record the page its fresh content starts on; the extraction layer
 * guarantees joining page texts with "\n\n" reproduces `text`, so both
 * paths chunk the identical corpus. When absent, pageNumber is null —
 * same behavior as before this field existed (backward compatible).
 */
export const splitIntoChunks = (text, pages = null) => {
  const trimmed = (text ?? "").trim();
  if (!trimmed) return [];

  const units =
    pages && pages.length > 0
      ? pages.flatMap((page) => buildUnits(page.text, page.pageNumber))
      : buildUnits(trimmed, null);

  const chunks = [];
  let current = "";
  // Page where the current chunk's own (non-overlap) content begins.
  let currentPage = null;
  let pageAssigned = false;

  const push = () => {
    const chunkText = current.trim();
    if (!chunkText) return;
    chunks.push({
      chunkIndex: chunks.length,
      text: chunkText,
      tokenCount: estimateTokens(chunkText),
      pageNumber: currentPage,
    });
  };

  for (const unit of units) {
    if (current && current.length + unit.text.length > TARGET_CHARS) {
      push();
      // Seed the next chunk with the tail of this one for overlap —
      // facts near the boundary stay retrievable from both sides. The
      // overlap belongs to the PREVIOUS page context, so the next
      // chunk's page comes from its first fresh unit instead.
      current = current.slice(-OVERLAP_CHARS);
      pageAssigned = false;
    }
    if (!pageAssigned) {
      currentPage = unit.pageNumber;
      pageAssigned = true;
    }
    current = current ? `${current}\n\n${unit.text}` : unit.text;
  }
  push();

  return chunks;
};
