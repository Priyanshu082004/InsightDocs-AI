import { Queue } from "bullmq";
import { createBullMQConnection } from "../../config/redis.config.js";
import { QUEUE_NAMES } from "../../constants/queue.constant.js";

// Each Queue/Worker gets its OWN connection via the factory
export const documentProcessingQueue = new Queue(QUEUE_NAMES.DOCUMENT_PROCESSING, {
  connection: createBullMQConnection(),
});