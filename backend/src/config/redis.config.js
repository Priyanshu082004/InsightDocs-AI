import Redis from "ioredis";
import { env } from "./env.config.js";
import { logger } from "./logger.config.js";

// General-purpose client — used by cache.service, rate limiting, and
// onlineUsers.service. NOT shared with BullMQ
export const redisClient = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  lazyConnect: false,
});

redisClient.on("connect", () => logger.info("Redis connected"));
redisClient.on("error", (err) => logger.error({ err }, "Redis connection error"));


export const createBullMQConnection = () => {
  return new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });
};

export const disconnectRedis = async () => {
  await redisClient.quit();
};

export const createRedisAdapterClients = () => {
  const pubClient = redisClient.duplicate();
  const subClient = redisClient.duplicate();
  return { pubClient, subClient };
};