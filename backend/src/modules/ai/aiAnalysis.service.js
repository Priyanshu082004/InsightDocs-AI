import * as llmService from "./llm.service.js";
import * as aiAnalysisRepository from "./aiAnalysis.repository.js";
import { env } from "../../config/env.config.js";


//  stageHandlers now just calls one of these three functions and returns
//  whatever it returns, matching the same thin-dispatcher role every
//   other stage handler already had (CHUNKING and EMBEDDING never did
//  their AI call and their DB write inline either — this brings SUMMARY/
//  KEYWORDS/RISK_ANALYSIS in line with that same shape). Behavior is
//   unchanged: still one upsert per stage into the same AIAnalysis row.
 

export const analyzeSummary = async (documentId, text) => {
  const summary = await llmService.generateSummary(text);
  await aiAnalysisRepository.upsertAnalysis(documentId, {
    summary,
    modelVersion: env.OPENROUTER_MODEL,
  });
  return { summaryLength: summary.length };
};

export const analyzeKeywords = async (documentId, text) => {
  const { keywords } = await llmService.generateKeywords(text);
  await aiAnalysisRepository.upsertAnalysis(documentId, {
    keywords,
    modelVersion: env.OPENROUTER_MODEL,
  });
  return { keywordCount: keywords.length };
};

export const analyzeRisk = async (documentId, text) => {
  const risk = await llmService.generateRiskAnalysis(text);
  await aiAnalysisRepository.upsertAnalysis(documentId, {
    risk,
    modelVersion: env.OPENROUTER_MODEL,
  });
  return { riskLevel: risk.level };
};