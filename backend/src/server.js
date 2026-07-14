import http from "http";
import app from "./app.js";
import { env } from "./config/env.config.js";
import { connectDB, disconnectDB } from "./config/db.config.js";
import { logger } from "./config/logger.config.js";
import { disconnectRedis } from "./config/redis.config.js";
import { ensureBucketExists } from "./storage/minio.client.js";
import { initSocketServer } from "./sockets/socket.server.js";

const start = async () => {
  await connectDB();
  await ensureBucketExists();
     // Created explicitly (not via app.listen's implicit server) because
    // Socket.IO needs a reference to the raw http.Server to attach to —
    // app.listen() would create one internally but never hand it back
    // until after listen() is already called.

  const httpServer= http.createServer(app)
  const io = initSocketServer(httpServer)

   httpServer.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });


  // Graceful shutdown — important once BullMQ workers/Socket.IO land in
  // later phases, so in-flight jobs/connections aren't killed abruptly.
  const shutdown = async (signal) => {
    logger.info(`${signal} received, shutting down gracefully`);
    io.close();
    httpServer.close(async () => {
      await disconnectDB();
      await disconnectRedis();
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