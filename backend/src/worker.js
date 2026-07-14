import { connectDB, disconnectDB } from "./config/db.config.js";
import { disconnectRedis } from "./config/redis.config.js";
import { logger } from "./config/logger.config.js";

// Side-effect import: constructing the Worker starts it listening
// immediately. Run this file with `node src/worker.js` as its own
// process, separate from `node src/server.js` — this is what lets the
// API and the job workers scale independently (e.g. 2 API instances,
// 5 worker instances, deployed and scaled on their own schedules).
import { documentProcessingWorker } from "./jobs/workers/documentProcessing.worker.js";

const start = async () => {
  await connectDB();
  logger.info("Worker process started — listening for jobs");
};

const shutdown = async (signal) => {
  logger.info(`${signal} received, shutting down worker gracefully`);
  // Waits for in-flight jobs on this worker to finish before closing,
  // rather than killing them mid-stage.
  await documentProcessingWorker.close();
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