import { redisClient } from "../config/redis.config.js";
import { logger } from "../config/logger.config.js";

const PRESENCE_KEY_PREFIX = "online:";
// A user is only "online" if their presence key was refreshed within
// this window — Socket.IO  will call refreshPresence on a
// heartbeat interval shorter than this, so a key expiring naturally
// (rather than needing an explicit disconnect handler to fire) is what
// marks a user offline if their connection drops silently.
const PRESENCE_TTL_SECONDS = 60;

const presenceKey = (userId) => `${PRESENCE_KEY_PREFIX}${userId}`;

export const markUserOnline = async (userId) => {
  try {
    await redisClient.set(presenceKey(userId), "1", "EX", PRESENCE_TTL_SECONDS);
  } catch (err) {
    logger.error({ err, userId }, "Failed to mark user online");
  }
};

export const refreshPresence = async (userId) => {
  try {
    await redisClient.expire(presenceKey(userId), PRESENCE_TTL_SECONDS);
  } catch (err) {
    logger.error({ err, userId }, "Failed to refresh presence");
  }
};

export const markUserOffline = async (userId) => {
  try {
    await redisClient.del(presenceKey(userId));
  } catch (err) {
    logger.error({ err, userId }, "Failed to mark user offline");
  }
};

export const isUserOnline = async (userId) => {
 try{ const result = await redisClient.exists(presenceKey(userId));
  return result === 1;}
  catch(err){
    logger.error({err,userId},"failed to check user presnce ")
    return false;
  }
};

//  Uses SCAN rather than KEYS for the same reason as cache.service —
//   this can be called from a "who's online" dashboard-style endpoint
//  later and must not block Redis while doing it.
 
export const getOnlineUserIds = async () => {
  const onlineIds = [];
  let cursor = "0";
  do {
    const [nextCursor, keys] = await redisClient.scan(
      cursor,
      "MATCH",
      `${PRESENCE_KEY_PREFIX}*`,
      "COUNT",
      100
    );
    cursor = nextCursor;
    onlineIds.push(...keys.map((k) => k.slice(PRESENCE_KEY_PREFIX.length)));
  } while (cursor !== "0");
  return onlineIds;
};