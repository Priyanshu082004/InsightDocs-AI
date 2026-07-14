import { DocumentProcessing } from "./documentProcessing.model.js";
import { PROCESSING_STATUS } from "../../constants/document.constant.js";

export const getOrCreateStage = async (documentId, stage) => {
  return DocumentProcessing.findOneAndUpdate(
    { documentId, stage },
    { $setOnInsert: { status: PROCESSING_STATUS.PENDING } },
    { upsert: true, new: true }
  );
};

export const markStageInProgress = async (documentId, stage) => {
  return DocumentProcessing.findOneAndUpdate(
    { documentId, stage },
    { status: PROCESSING_STATUS.IN_PROGRESS, startedAt: new Date(), $inc: { attempts: 1 } },
    { new: true }
  );
};

export const markStageCompleted = async (documentId, stage) => {
  return DocumentProcessing.findOneAndUpdate(
    { documentId, stage },
    { status: PROCESSING_STATUS.COMPLETED, completedAt: new Date(), error: null },
    { new: true }
  );
};

export const markStageFailed = async (documentId, stage, errorMessage) => {
  return DocumentProcessing.findOneAndUpdate(
    { documentId, stage },
    { status: PROCESSING_STATUS.FAILED, error: errorMessage },
    { new: true }
  );
};

export const getStagesForDocument = async (documentId) => {
  return DocumentProcessing.find({ documentId }).sort({ createdAt: 1 });
};