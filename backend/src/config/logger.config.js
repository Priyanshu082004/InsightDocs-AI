import pino from "pino";
import { env, isProduction } from "./env.config.js";

// Single logger instance, imported everywhere. No module should ever
// call console.log/console.error directly 
export const logger = pino({
  level: env.NODE_ENV === "test" ? "silent" : "info",
  base: undefined, // omit pid/hostname noise
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: isProduction
    ? undefined // production: raw JSON lines, ready for a log aggregator
    : {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:HH:MM:ss",
          ignore: "pid,hostname",
        },
      },
});