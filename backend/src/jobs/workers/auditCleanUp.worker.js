import { Worker } from "bullmq";
import { createBullMQConnection } from "../../config/redis.config.js";
import { QUEUE_NAMES } from "../../constants/queue.constant.js";
import { env } from "../../config/env.config.js";
import * as auditService from "../../modules/audit/audit.service.js";
import { logger } from "../../config/logger.config.js";

const processAuditCleanup = async () => {
  const deletedCount = await auditService.runRetentionCleanup(env.AUDIT_RETENTION_DAYS);
  return { deletedCount };
};

export const auditCleanupWorker = new Worker(QUEUE_NAMES.AUDIT_CLEANUP, processAuditCleanup, {
  connection: createBullMQConnection(),
});

auditCleanupWorker.on("completed", (job, result) => {
  logger.info({ jobId: job.id, ...result }, "Audit cleanup job completed");
});

auditCleanupWorker.on("failed", (job, err) => {
  logger.error({ jobId: job?.id, err: err.message }, "Audit cleanup job failed");
});