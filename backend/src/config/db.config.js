import mongoose from "mongoose";
import { env } from "./env.config.js";
import { logger } from "./logger.config.js";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return mongoose.connection;

  try {
    mongoose.set("strictQuery", true);

    const connection = await mongoose.connect(env.MONGODB_URI, {
      // Fail fast instead of buffering commands indefinitely against a
      // dead connection — surfaces infra problems immediately at boot.
      serverSelectionTimeoutMS: 10000,
    });

    isConnected = true;
    logger.info(
      { host: connection.connection.host, db: connection.connection.name },
      "MongoDB connected"
    );

    mongoose.connection.on("error", (err) => {
      logger.error({ err }, "MongoDB connection error");
    });

    mongoose.connection.on("disconnected", () => {
      isConnected = false;
      logger.warn("MongoDB disconnected");
    });

    return connection;
  } catch (err) {
    logger.error({ err }, "MongoDB initial connection failed");
    // A DB-less app is not a degraded app, it's a non-functional one —
    // exit so an orchestrator (Docker/PM2/k8s) can restart cleanly
    // instead of serving requests that will fail on every DB call.
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  isConnected = false;
};