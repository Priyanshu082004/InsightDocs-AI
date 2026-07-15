import { connectDB, disconnectDB } from "./config/db.config.js";
import { disconnectRedis } from "./config/redis.config.js";
import { logger } from "./config/logger.config.js";

// Side-effect imports: constructing each Worker starts it listening
// immediately. Run this file with `node src/worker.js` as its own
// process, separate from `node src/server.js` — this is what lets the
// API and the job workers scale independently.
import { documentProcessingWorker } from "./jobs/workers/documentProcessing.worker.js";
import { auditCleanupWorker } from "./jobs/workers/auditCleanup.worker.js";
import { scheduleAuditCleanup } from "./jobs/producers/auditCleanup.producer.js";

const start = async () => {
  await connectDB();
  await scheduleAuditCleanup();
  logger.info("Worker process started — listening for jobs");
};

const shutdown = async (signal) => {
  logger.info(`${signal} received, shutting down worker gracefully`);
  // Waits for in-flight jobs on each worker to finish before closing,
  // rather than killing them mid-stage.
  await Promise.all([documentProcessingWorker.close(), auditCleanupWorker.close()]);
  await disconnectDB();
  await disconnectRedis();
  process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

start().catch((err) => {
  console.error("Failed to start worker process:", err);
  process.exit(1);
});import { connectDB, disconnectDB } from "./config/db.config.js";
import { disconnectRedis } from "./config/redis.config.js";
import { logger } from "./config/logger.config.js";

// Side-effect imports: constructing each Worker starts it listening
// immediately. Run this file with `node src/worker.js` as its own
// process, separate from `node src/server.js` — this is what lets the
// API and the job workers scale independently.
import { documentProcessingWorker } from "./jobs/workers/documentProcessing.worker.js";
import { auditCleanupWorker } from "./jobs/workers/auditCleanup.worker.js";
import { scheduleAuditCleanup } from "./jobs/producers/auditCleanup.producer.js";

const start = async () => {
  await connectDB();
  await scheduleAuditCleanup();
  logger.info("Worker process started — listening for jobs");
};

const shutdown = async (signal) => {
  logger.info(`${signal} received, shutting down worker gracefully`);
  // Waits for in-flight jobs on each worker to finish before closing,
  // rather than killing them mid-stage.
  await Promise.all([documentProcessingWorker.close(), auditCleanupWorker.close()]);
  await disconnectDB();
  await disconnectRedis();
  process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

start().catch((err) => {
  console.error("Failed to start worker process:", err);
  process.exit(1);
});