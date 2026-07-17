import { Queue } from "bullmq";
import { createBullMQConnection } from "../../config/redis.config.js";
import { QUEUE_NAMES } from "../../constants/queue.constant.js";

export const auditCleanupQueue = new Queue(QUEUE_NAMES.AUDIT_CLEANUP, {
  connection: createBullMQConnection(),
});