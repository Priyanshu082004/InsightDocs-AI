import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redisClient } from "../config/redis.config.js";

//  The global limiter in app.js (100 req / 15 min by default) is far too
//  loose to slow down a credential-stuffing attempt against /auth/login.
//   This factory makes a tighter, endpoint-specific limiter — same Redis
//  store, so it's still correct across multiple app instances.
 
//  Usage: router.post("/login", strictRateLimiter({ max: 5 }), ...)
 
export const strictRateLimiter = ({ windowMs = 15 * 60 * 1000, max = 5, keyPrefix }) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
      prefix: keyPrefix ? `rl:${keyPrefix}:` : "rl:strict:",
      sendCommand: (...args) => redisClient.call(...args),
    }),
    message: { success: false, message: "Too many attempts, please try again later" },
  });
};