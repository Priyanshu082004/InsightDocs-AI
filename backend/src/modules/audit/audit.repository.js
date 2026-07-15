import { AuditLog } from "./auditLog.model.js";

export const createLog = async ({ userId, action, resourceType, resourceId, metadata, ipAddress }) => {
  return AuditLog.create({ userId, action, resourceType, resourceId, metadata, ipAddress });
};

export const listLogs = async ({
  userId,
  action,
  resourceType,
  resourceId,
  startDate,
  endDate,
  page = 1,
  limit = 50,
}) => {
  const filter = {};
  if (userId) filter.userId = userId;
  if (action) filter.action = action;
  if (resourceType) filter.resourceType = resourceType;
  if (resourceId) filter.resourceId = resourceId;
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = startDate;
    if (endDate) filter.createdAt.$lte = endDate;
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    AuditLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("userId", "name email"),
    AuditLog.countDocuments(filter),
  ]);

  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getResourceHistory = async (resourceType, resourceId) => {
  return AuditLog.find({ resourceType, resourceId })
    .sort({ createdAt: -1 })
    .populate("userId", "name email");
};

export const deleteLogsOlderThan = async (cutoffDate) => {
  const result = await AuditLog.deleteMany({ createdAt: { $lt: cutoffDate } });
  return result.deletedCount;
};