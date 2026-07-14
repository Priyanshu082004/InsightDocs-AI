import { openrouterProvider } from "./llm/openRouter.provider.js";
import { openaiEmbeddingProvider } from "./embedding/openAI.provider.js";


export const getLLMProvider = () => openrouterProvider;
export const getEmbeddingProvider = () => openaiEmbeddingProvider;