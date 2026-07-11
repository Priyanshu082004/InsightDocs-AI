import { Client } from "minio";
import { env } from "../config/env.config.js";
import { logger } from "../config/logger.config.js";
 
export const minioClient = new Client({
  endPoint: env.MINIO_ENDPOINT,
  port: env.MINIO_PORT,
  useSSL: env.MINIO_USE_SSL,
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
});
 
/**
 * Idempotent — safe to call on every server boot. Creates the bucket if
 * it doesn't exist yet (fresh dev environment, fresh Docker volume) and
 * is a no-op otherwise. The bucket is created with NO public read
 * policy: every access goes through a presigned URL from
 * storage.service.js, never a bare bucket URL.
 */
export const ensureBucketExists = async () => {
  const exists = await minioClient.bucketExists(env.MINIO_BUCKET).catch(() => false);
 
  if (!exists) {
    await minioClient.makeBucket(env.MINIO_BUCKET);
    logger.info(`MinIO bucket "${env.MINIO_BUCKET}" created`);
  } else {
    logger.info(`MinIO bucket "${env.MINIO_BUCKET}" ready`);
  }
};
 