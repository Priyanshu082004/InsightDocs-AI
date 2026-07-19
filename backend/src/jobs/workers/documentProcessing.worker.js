import { Worker } from "bullmq";
import { createBullMQConnection } from "../../config/redis.config.js";
import { QUEUE_NAMES } from "../../constants/queue.constant.js";
import {
  PROCESSING_STAGE_ORDER,
  PROCESSING_STATUS,
} from "../../constants/document.constant.js";
import * as notificationService from "../../modules/notification/notification.service.js";
import { NOTIFICATION_TYPE } from "../../constants/system.constant.js";
import { DOCUMENT_STATUS } from "../../constants/document.constant.js";
import * as documentProcessingRepository from "../../modules/processing/documentProcessing.repository.js";
import * as documentRepository from "../../modules/document/document.repository.js";
import { stageHandlers } from "./stageHandlers.js";
import { emitProcessingProgress } from "../progressEmitter.js";
import { logger } from "../../config/logger.config.js";

const processDocumentJob = async (job) => {
  const { documentId } = job.data;

  const document = await documentRepository.findById(documentId);
  if (!document) {
    // Document was deleted between enqueue and processing — nothing to
    // do. Not an error worth retrying over.
    logger.warn({ documentId }, "Document not found — aborting processing job");
    return;
  }

  for (const stage of PROCESSING_STAGE_ORDER) {
    const stageRecord = await documentProcessingRepository.getOrCreateStage(documentId, stage);

    if (stageRecord.status === PROCESSING_STATUS.COMPLETED) {
      // Resume support: if this job is a BullMQ retry after a crash
      // partway through, every already-COMPLETED stage is skipped —
      // only the stage that failed (and everything after it) re-runs.
      continue;
    }

    await documentProcessingRepository.markStageInProgress(documentId, stage);
    emitProcessingProgress(document.ownerId, documentId, stage, PROCESSING_STATUS.IN_PROGRESS);

    try {
      // Persist whatever the handler returns as the stage's output —
      // this is how later stages read earlier stages' results (see
      // getStageOutput in documentProcessing.repository.js).
      const output = await stageHandlers[stage]({ document, job });
      await documentProcessingRepository.markStageCompleted(documentId, stage, output);
      emitProcessingProgress(document.ownerId, documentId, stage, PROCESSING_STATUS.COMPLETED);
    } catch (err) {
      await documentProcessingRepository.markStageFailed(documentId, stage, err.message);
      emitProcessingProgress(document.ownerId, documentId, stage, PROCESSING_STATUS.FAILED);
      // Rethrow so BullMQ applies its retry/backoff policy to the WHOLE
      // job — the checkpoint above is what makes a full-job retry cheap
      // instead of redoing every stage from scratch.
      throw err;
    }
  }

  await documentRepository.updateStatus(documentId, DOCUMENT_STATUS.READY);
     
   await notificationService.createAndPushNotification({
    userId: document.ownerId,
    type: NOTIFICATION_TYPE.DOCUMENT_READY,
    message: `"${document.displayName}" has finished processing and is ready to use`,
    relatedDocumentId: documentId,
  });
};

 

export const documentProcessingWorker = new Worker(
  QUEUE_NAMES.DOCUMENT_PROCESSING,
  processDocumentJob,
  {
    connection: createBullMQConnection(),
    concurrency: 5, // up to 5 documents processed in parallel per worker process
  }
);

documentProcessingWorker.on("completed", (job) => {
  logger.info(
    { jobId: job.id, documentId: job.data.documentId },
    "Document processing job completed"
  );
});

documentProcessingWorker.on("failed", async (job, err) => {
  logger.error(
    { jobId: job?.id, documentId: job?.data?.documentId, err: err.message },
    "Document processing job failed"
  );

  // Only flip the Document to FAILED once BullMQ has exhausted every
  // configured retry attempt (JOB_OPTIONS.attempts = 3). A single
  // attempt failing — e.g. a transient network blip — should not
  // surface as a failed document to the user while retries are still
  // pending; job.attemptsMade tells us whether this was the last one.
  if (job && job.attemptsMade >= job.opts.attempts) {
    await documentRepository.updateStatus(job.data.documentId, DOCUMENT_STATUS.FAILED);

    const document = await documentRepository.findById(job.data.documentId);
    if (document) {
      await notificationService.createAndPushNotification({
        userId: document.ownerId,
        type: NOTIFICATION_TYPE.DOCUMENT_FAILED,
        message: `"${document.displayName}" failed to process. Please try re-uploading.`,
        relatedDocumentId: document._id,
      });
    }
  }
});