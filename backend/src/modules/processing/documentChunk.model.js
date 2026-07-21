import mongoose, { Schema } from "mongoose";

const documentChunkSchema = new Schema(
  {
    documentId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: true,
      index: true,
    },
    chunkIndex: {
      type: Number,
      required: true, // ordering within the document
    },
    text: {
      type: String,
      required: true,
    },
    tokenCount: {
      type: Number,
      required: true,
    },
    // Provenance: 1-based page this chunk came from. Only PDFs have
    // reliable page boundaries (verified against pdf-parse at runtime);
    // null for DOCX/TXT/CSV/OCR text and for chunks created before
    // this field existed.
    pageNumber: {
      type: Number,
      default: null,
    },
    // The actual embedding vector lives here (not in EmbeddingMetadata)
    // because Atlas Vector Search builds its index on a field within
    // this collection — the vector must be co-located with the chunk
    // it describes for the index to query against it directly.
    embedding: {
      type: [Number],
      default: undefined, // absent until the embedding stage completes
    },
  },
  { timestamps: true }
);

documentChunkSchema.index({ documentId: 1, chunkIndex: 1 }, { unique: true });

// NOTE: the Atlas Vector Search index itself (on the `embedding` field)
// is created via the Atlas UI/API, not through a Mongoose schema index 


export const DocumentChunk = mongoose.model("DocumentChunk", documentChunkSchema);