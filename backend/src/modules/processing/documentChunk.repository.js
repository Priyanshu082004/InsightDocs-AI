import { DocumentChunk } from "./documentChunk.model.js";

// Name of the Atlas Vector Search index on the `embedding` field. The
// index is created in the Atlas UI/API (see documentChunk.model.js) and
// must be built with the SAME dimension count the AI service embeds at
// (bge-m3 -> 1024). Change one, rebuild the other.
const VECTOR_SEARCH_INDEX = "vector_index";

export const bulkInsertChunks = async (chunks) => {
  return DocumentChunk.insertMany(chunks);
};

export const deleteChunksForDocument = async (documentId) => {
  return DocumentChunk.deleteMany({ documentId });
};

export const listChunksForDocument = async (documentId) => {
  return DocumentChunk.find({ documentId }).sort({ chunkIndex: 1 });
};

export const updateChunkEmbedding = async (chunkId, embedding) => {
  return DocumentChunk.findByIdAndUpdate(chunkId, { embedding }, { new: true });
};

/**
 * Atlas Vector Search over chunk embeddings, permission-scoped.
 *
 * `filter` on documentId keeps retrieval inside the caller's allowed
 * set — the security boundary is enforced IN the query, not by
 * post-filtering results (post-filtering could silently return fewer
 * than topK relevant chunks and leak timing information).
 *
 * numCandidates is topK * 15: Atlas recommends over-fetching candidates
 * well above the final limit for recall; 15x is a sane middle ground
 * for collections this size.
 *
 * Returns plain objects: { _id, documentId, chunkIndex, text, score }.
 * The embedding field is excluded — callers never need the raw vector
 * back, and each one is ~8KB of JSON.
 */
export const vectorSearchChunks = async ({ queryEmbedding, allowedDocumentIds, topK }) => {
  return DocumentChunk.aggregate([
    {
      $vectorSearch: {
        index: VECTOR_SEARCH_INDEX,
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: topK * 15,
        limit: topK,
        filter: { documentId: { $in: allowedDocumentIds } },
      },
    },
    {
      $project: {
        documentId: 1,
        chunkIndex: 1,
        text: 1,
        pageNumber: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ]);
};
