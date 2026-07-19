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

/**
 * Returns [{ chunkIndex, text, tokenCount }] — exactly the shape
 * CHUNKING's bulkInsertChunks spreads into DocumentChunk rows (the
 * caller adds documentId).
 */
export const splitIntoChunks = (text) => {
  const trimmed = (text ?? "").trim();
  if (!trimmed) return [];

  // Build the packing units: paragraphs, with oversized ones pre-split.
  const units = trimmed
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .flatMap((p) => (p.length > TARGET_CHARS ? splitOversized(p) : [p]));

  const chunks = [];
  let current = "";

  const push = () => {
    const chunkText = current.trim();
    if (!chunkText) return;
    chunks.push({
      chunkIndex: chunks.length,
      text: chunkText,
      tokenCount: estimateTokens(chunkText),
    });
  };

  for (const unit of units) {
    if (current && current.length + unit.length > TARGET_CHARS) {
      push();
      // Seed the next chunk with the tail of this one for overlap —
      // facts near the boundary stay retrievable from both sides.
      current = current.slice(-OVERLAP_CHARS);
    }
    current = current ? `${current}\n\n${unit}` : unit;
  }
  push();

  return chunks;
};
