import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import {RedisStore} from "rate-limit-redis";

import { env } from "./config/env.config.js";
import { redisClient } from "./config/redis.config.js";
import { requestLogger } from "./middlewares/requestLogger.middleware.js";
import { notFound } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import routes from "./routes/index.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true, 
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());
app.use(requestLogger);

// Global rate limit — module-specific stricter limits (e.g. on /auth/login
// to slow brute force) can be layered on top in their own route files.
app.use(
  rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

app.use("/api/v1", routes);

// Order matters: notFound catches anything no route matched, then
// errorHandler is the true last middleware and handles everything
// (including errors notFound itself forwards via next()).
app.use(notFound);
app.use(errorHandler);

export default app;