import * as auditRepository from "./audit.repository.js";
import { logger } from "../../config/logger.config.js";


export const logAction = async ({
  userId,
  action,
  resourceType,
  resourceId,
  metadata = {},
  ipAddress = null,
}) => {
  try {
    await auditRepository.createLog({ userId, action, resourceType, resourceId, metadata, ipAddress });
  } catch (err) {
    logger.error({ err, action, resourceType, resourceId }, "Failed to write audit log");
  }
};

export const listAuditLogs = async (filters) => {
  return auditRepository.listLogs(filters);
};

export const getResourceHistory = async (resourceType, resourceId) => {
  return auditRepository.getResourceHistory(resourceType, resourceId);
};

/**
 * Called by the auditCleanup worker (see jobs/workers/auditCleanup.worker.js),
 * once daily. Deletes anything older than AUDIT_RETENTION_DAYS —
 * audit logs are a compliance/security trail, not something users
 * interact with directly, so retention here is a straightforward hard
 * delete rather than a soft-delete-with-recovery-window like Document
 * uses. If a longer legal retention requirement ever applies, this is
 * the one function that changes.
 */
export const runRetentionCleanup = async (retentionDays) => {
  const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
  const deletedCount = await auditRepository.deleteLogsOlderThan(cutoffDate);
  logger.info({ deletedCount, cutoffDate, retentionDays }, "Audit log retention cleanup completed");
  return deletedCount;
};