import { EmbeddingMetadata } from "./embeddingMetadata.model.js";


export const upsertEmbeddingMetadata = async ({
  chunkId,
  documentId,
  modelName,
  dimensions,
  tokensUsed,
}) => {
  return EmbeddingMetadata.findOneAndUpdate(
    { chunkId },
    { documentId, modelName, dimensions, tokensUsed, generatedAt: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};