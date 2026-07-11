import crypto from "crypto";
import path from "path";
import { minioClient } from "./minio.client.js";
import { env } from "../config/env.config.js";
import { logger } from "../config/logger.config.js";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.constant.js";

const DEFAULT_SIGNED_URL_EXPIRY_SECONDS = 15 * 60; // 15 minutes


//   Storage keys are `${ownerId}/${randomUUID}${ext}` — never the
//   original filename. it prevents key collisions between two users uploading files with the same name, and
//  it means a leaked/guessed key reveals nothing about the file's
//   contents (unlike `invoices/march-salary.pdf`). The human-readable
//  name lives only in Document.originalName in MongoDB, never in MinIo



export const generateStorageKey = (ownerId, originalName) => {
  const ext = path.extname(originalName);
  return `${ownerId}/${crypto.randomUUID()}${ext}`;
};

export const uploadObject = async ({ buffer, key, mimeType, size }) => {
  try {
    await minioClient.putObject(env.MINIO_BUCKET, key, buffer, size, {
      "Content-Type": mimeType,
    });
    return key;
  } catch (err) {
    logger.error({ err, key }, "MinIO upload failed");
    throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to upload file to storage");
  }
};

/**
 * Every download goes through a short-lived signed URL — the app never
 * proxies file bytes through itself, and no object is ever reachable
 * via a permanent public link.
 */
export const getPresignedDownloadUrl = async (
  key,
  expirySeconds = DEFAULT_SIGNED_URL_EXPIRY_SECONDS
) => {
  try {
    return await minioClient.presignedGetObject(env.MINIO_BUCKET, key, expirySeconds);
  } catch (err) {
    logger.error({ err, key }, "Failed to generate presigned URL");
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "File not found in storage");
  }
};

export const deleteObject = async (key) => {
  try {
    await minioClient.removeObject(env.MINIO_BUCKET, key);
  } catch (err) {
    logger.error({ err, key }, "MinIO delete failed");
    throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to delete file from storage");
  }
};

export const objectExists = async (key) => {
  try {
    await minioClient.statObject(env.MINIO_BUCKET, key);
    return true;
  } catch {
    return false;
  }
};