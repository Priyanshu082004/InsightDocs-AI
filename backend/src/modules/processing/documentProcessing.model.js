import mongoose, { Schema } from "mongoose";

const documentProcessingSchema = new Schema(
  {
    documentId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: true,
      index: true,
    },
    stage: {
      type: String,
      enum: [
        "OCR",         //process of converting text inside an image into machine-readable text
        "TEXT_EXTRACTION",
        "CHUNKING",
        "EMBEDDING",
        "SUMMARY",
        "KEYWORDS",
        "RISK_ANALYSIS",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED"],
      default: "PENDING",
      index: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    error: {
      type: String,
      default: null,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    output: {
      type: Schema.Types.Mixed,
      default: null,
    },

  },
  { timestamps: true }
    
);

// One row per (document, stage) — lets a BullMQ worker resuming after a
// crash query "which stages are already COMPLETED for this document"
// and skip straight to the first PENDING/FAILED stage.
documentProcessingSchema.index({ documentId: 1, stage: 1 }, { unique: true });

export const DocumentProcessing = mongoose.model(
  "DocumentProcessing",
  documentProcessingSchema
);



// this is the heart of the concept where we provide the live stage of processing for a document, this is done by BUllMQ which is redis based library