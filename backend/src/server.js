import app from "./app.js";
import { env } from "./config/env.config.js";
import { connectDB, disconnectDB } from "./config/db.config.js";
import { logger } from "./config/logger.config.js";

const start = async () => {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  // Graceful shutdown — important once BullMQ workers/Socket.IO land in
  // later phases, so in-flight jobs/connections aren't killed abruptly.
  const shutdown = async (signal) => {
    logger.info(`${signal} received, shutting down gracefully`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});