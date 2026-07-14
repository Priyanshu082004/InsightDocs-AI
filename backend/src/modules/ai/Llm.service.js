import { getLLMProvider } from "./providers/providerFactory.js";
import { buildSummaryPrompt, buildKeywordsPrompt, buildRiskAnalysisPrompt } from "./prompts/index.js";


//   Every text-generation call site in the app (stage handlers,
//   aiAnalysis.service, rag.service) calls through here — never through
//  providers/llm/openrouter.provider.js directly. This is the layer that
//  knows WHAT to generate (summary, keywords, risk, a streamed chat
//   answer); the provider only knows HOW to talk to OpenRouter.
 

export const generateSummary = async (text) => {
  const provider = getLLMProvider();
  return provider.generateText(buildSummaryPrompt(text));
};

export const generateKeywords = async (text) => {
  const provider = getLLMProvider();
  return provider.generateJSON(buildKeywordsPrompt(text));
};

export const generateRiskAnalysis = async (text) => {
  const provider = getLLMProvider();
  return provider.generateJSON(buildRiskAnalysisPrompt(text));
};


export const streamChatResponse = async (prompt, onToken) => {
  const provider = getLLMProvider();
  return provider.generateTextStream(prompt, onToken);
};

export const extractTextFromImage = async (buffer, mimeType) => {
  const provider = getLLMProvider();
  return provider.generateVisionText(
    "Extract all readable text from this image. Return plain text only — no commentary, no formatting.",
    { buffer, mimeType }
  );
};