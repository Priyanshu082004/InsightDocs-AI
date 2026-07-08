import { AuditLog } from "./auditLog.model.js";
import { logger } from "../../config/logger.config.js";

/**
 * Fire-and-log: audit writes must never break the request that
 * triggered them. If AuditLog.create fails, we log the failure to Pino
 * and move on — a missing audit row is bad, but failing someone's login
 * because Mongo hiccuped on a side-write would be worse.
 */
export const logAction = async ({
  userId,
  action,
  resourceType,
  resourceId,
  metadata = {},
  ipAddress = null,
}) => {
  try {
    await AuditLog.create({ userId, action, resourceType, resourceId, metadata, ipAddress });
  } catch (err) {
    logger.error({ err, action, resourceType, resourceId }, "Failed to write audit log");
  }
};