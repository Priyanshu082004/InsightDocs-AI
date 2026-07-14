import { redisClient } from "../config/redis.config.js";
import { logger } from "../config/logger.config.js";

const DEFAULT_TTL_SECONDS = 5 * 60; // 5 minutes


//   Every value is JSON-serialized on the way in, parsed on the way out —
//   callers store real objects/arrays, never raw strings they have to
//   remember to (de)serialize themselves at every call site.
 
//  Cache failures never throw: a cache miss due to Redis being briefly
//  unavailable should degrade to "go fetch it from the source of truth,"
//   not take down the request. This mirrors the same fire-and-log
//   philosophy as audit.service 
 
export const getCache = async (key) => {
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    logger.error({ err, key }, "Cache read failed");
    return null;
  }
};

export const setCache = async (key, value, ttlSeconds = DEFAULT_TTL_SECONDS) => {
  try {
    await redisClient.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch (err) {
    logger.error({ err, key }, "Cache write failed");
  }
};

export const deleteCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (err) {
    logger.error({ err, key }, "Cache delete failed");
  }
};

/**
 * Uses SCAN, not KEYS — KEYS blocks the entire Redis event loop while
 * it walks the whole keyspace, which is fine on a laptop with 200 keys
 * and genuinely dangerous in production with millions. SCAN walks in
 * small cursored batches instead, at the cost of being slightly more
 * code to call.
 */
export const deleteCacheByPattern = async (pattern) => {
  try {
    let cursor = "0";
    do {
      const [nextCursor, keys] = await redisClient.scan(cursor, "MATCH", pattern, "COUNT", 100);
      cursor = nextCursor;
      if (keys.length) await redisClient.del(...keys);
    } while (cursor !== "0");
  } catch (err) {
    logger.error({ err, pattern }, "Cache pattern delete failed");
  }
};