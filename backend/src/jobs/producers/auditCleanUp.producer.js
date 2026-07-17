import { auditCleanupQueue } from "../queues/auditCleanUp.queue.js";
import { JOB_NAMES } from "../../constants/queue.constant.js";

/**
 * Registers a REPEATABLE job (daily at 02:00 server time), not a
 * one-off. BullMQ dedupes repeatable jobs by their jobId + repeat
 * config, so calling this on every worker process boot is idempotent —
 * it does NOT create a duplicate schedule on each restart, which is why
 * worker.js can safely call this unconditionally at startup rather than
 * needing a "only register once" guard of its own.
 */
export const scheduleAuditCleanup = async () => {
  await auditCleanupQueue.add(
    JOB_NAMES.RUN_AUDIT_CLEANUP,
    {},
    {
      repeat: { pattern: "0 2 * * *" }, // every day at 02:00
      jobId: "audit-cleanup-daily",
      removeOnComplete: true,
      removeOnFail: { age: 86400 },
    }
  );
};