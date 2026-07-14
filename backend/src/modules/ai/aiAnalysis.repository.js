import { AIAnalysis } from "./aiAnalysis.model.js";

// Upsert on documentId — SUMMARY, KEYWORDS, and RISK_ANALYSIS are three
// separate pipeline stages that each write to a different field on the
// SAME row, not three different records.

export const upsertAnalysis = async (documentId, updates) => {
  return AIAnalysis.findOneAndUpdate(
    { documentId },
    { $set: updates },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

export const getAnalysis = async (documentId) => {
  return AIAnalysis.findOne({ documentId });
};