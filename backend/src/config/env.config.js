import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();


const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().positive().default(8000),

  // Database
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  // Auth 
  JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET must be at least 32 chars"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 chars"),
  JWT_ACCESS_EXPIRY: z.string().default("15m"),
  JWT_REFRESH_EXPIRY: z.string().default("7d"),

  // CORS
  CORS_ORIGIN: z.string().default("http://localhost:5173"),

  // Redis 
  REDIS_URL: z.string().default("redis://localhost:6379"),

  // MinIO 
  MINIO_ENDPOINT: z.string().default("localhost"),
  MINIO_PORT: z.coerce.number().int().positive().default(9000),
  MINIO_ACCESS_KEY: z.string().min(1).optional(),
  MINIO_SECRET_KEY: z.string().min(1).optional(),
  MINIO_BUCKET: z.string().default("document-vault"),
  // z.coerce.boolean() would turn the string "false" into true (any
  // non-empty string is truthy) — parse the string explicitly instead.
  MINIO_USE_SSL: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),

  // Embeddings (names match .env — provider-agnostic)
  EMBEDDING_PROVIDER: z.string().default("bge"),
  EMBEDDING_MODEL: z.string().default("BAAI/bge-m3"),
  EMBEDDING_DIMENSIONS: z.coerce.number().int().positive().default(1024),

  // OpenRouter — LLM provider for all text generation
  OPENROUTER_API_KEY: z.string().min(1).optional(),
  OPENROUTER_MODEL: z.string().default("openrouter/free"),

  // Audit
  AUDIT_RETENTION_DAYS: z.coerce.number().int().positive().default(90),

  // Internal AI service (FastAPI) — the ONLY consumer is aiService.client.js
  AI_SERVICE_URL: z.string().default("http://localhost:8001"),

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // Fail fast, fail loud — this is the ONLY place in the app allowed to
  // console.error + exit directly, since the logger itself hasn't been
  // proven safe to construct yet (it may depend on env values).
  console.error(" Invalid environment configuration:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

// Exported once, imported everywhere else. 

export const env = parsed.data;
export const isProduction = env.NODE_ENV === "production";
export const isDevelopment = env.NODE_ENV === "development";