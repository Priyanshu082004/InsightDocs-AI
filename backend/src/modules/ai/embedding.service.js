import { getEmbeddingProvider } from "./providers/providerFactory.js";


export const generateEmbedding = async (text) => {
  const provider = getEmbeddingProvider();
  return provider.embedText(text);
};