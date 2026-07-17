import mongoose, { Schema } from "mongoose";

const embeddingMetadataSchema = new Schema(
  {
    chunkId: {
      type: Schema.Types.ObjectId,
      ref: "DocumentChunk",
      required: true,
      unique: true, // one metadata record per chunk's current embedding
    },
    documentId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: true,
      index: true,
    },
    modelName: {
      type: String,
      required: true,
    },
    dimensions: {
      type: Number,
      required: true,       //these are the values of embeeding models , these are generatred in form of vector of 1536 or 768 or 512
    },                        // depending on the model used for embedding, useful when we want to re-embed with a different model 
    tokensUsed: {
      type: Number,
      required: true,         
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

//audit record for embeddings — kept separate from DocumentChunk
// so re-embedding with a newer model doesn't force schema churn on the
// searchable chunk collection itself.
export const EmbeddingMetadata = mongoose.model(
  "EmbeddingMetadata",
  embeddingMetadataSchema
);