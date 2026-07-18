import * as aiServiceClient from "../../services/aiService.client.js";
import * as aiAnalysisRepository from "./aiAnalysis.repository.js";


//  stageHandlers now just calls one of these three functions and returns
//  whatever it returns, matching the same thin-dispatcher role every
//   other stage handler already had (CHUNKING and EMBEDDING never did
//  their AI call and their DB write inline either — this brings SUMMARY/
//  KEYWORDS/RISK_ANALYSIS in line with that same shape). Behavior is
//   unchanged: still one upsert per stage into the same AIAnalysis row.
//
//  Post-migration: generation happens in the AI service over HTTP via
//  aiService.client — persistence stays here, since MongoDB is
//  backend-owned. modelVersion comes from the AI service's response
//  (what actually generated the result), not from backend env.


export const analyzeSummary = async (documentId, text) => {
  const { summary, model_version } = await aiServiceClient.generateSummary(text, { documentId });
  await aiAnalysisRepository.upsertAnalysis(documentId, {
    summary,
    modelVersion: model_version,
  });
  return { summaryLength: summary.length };
};

export const analyzeKeywords = async (documentId, text) => {
  const { keywords, model_version } = await aiServiceClient.generateKeywords(text, { documentId });
  await aiAnalysisRepository.upsertAnalysis(documentId, {
    keywords,
    modelVersion: model_version,
  });
  return { keywordCount: keywords.length };
};

export const analyzeRisk = async (documentId, text) => {
  const { level, flags, details, model_version } = await aiServiceClient.generateRisk(text, {
    documentId,
  });
  await aiAnalysisRepository.upsertAnalysis(documentId, {
    risk: { level, flags, details },
    modelVersion: model_version,
  });
  return { riskLevel: level };
};
