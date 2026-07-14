import { logger } from "../../config/logger.config.js";


export const emitProcessingProgress = (ownerId, documentId, stage, status) => {
  logger.info({ ownerId, documentId, stage, status }, "Processing progress (socket stub)");
};