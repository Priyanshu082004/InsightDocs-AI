import mongoose, { Schema } from "mongoose";

const aiAnalysisSchema = new Schema(
  {
    documentId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: true,
      unique: true, // one analysis record per document 
    },
    summary: {
      type: String,
      default: null,
    },
    keywords: {
      type: [String],
      default: [],
    },
    risk: {
      level: {
        type: String,
        enum: ["LOW", "MEDIUM", "HIGH"],
        default: "LOW",
      },
      flags: {
        type: [String], // e.g. ["contains_pii", "contains_financial_data"]
        default: [],
      },
      details: {
        type: String,
        default: null,
      },
    },
    modelVersion: {
      type: String,
      required: true, // which Gemini model produced this analysis
    },
  },
  { timestamps: true }
);

export const AIAnalysis = mongoose.model("AIAnalysis", aiAnalysisSchema);