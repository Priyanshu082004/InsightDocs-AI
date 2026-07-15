import { Notification } from "./notification.model.js";

export const createNotification = async ({ userId, type, message, relatedDocumentId = null }) => {
  return Notification.create({ userId, type, message, relatedDocumentId });
};

export const listForUser = async (userId, { page = 1, limit = 20, unreadOnly = false }) => {
  const filter = { userId };
  if (unreadOnly) filter.isRead = false;

  const skip = (page - 1) * limit;

  const [items, total, unreadCount] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Notification.countDocuments(filter),
    Notification.countDocuments({ userId, isRead: false }),
  ]);

  return { items, total, page, limit, totalPages: Math.ceil(total / limit), unreadCount };
};

export const markAsRead = async (userId, notificationId) => {
  return Notification.findOneAndUpdate({ _id: notificationId, userId }, { isRead: true }, { new: true });
};

export const markAllAsRead = async (userId) => {
  return Notification.updateMany({ userId, isRead: false }, { isRead: true });
};

export const getUnreadCount = async (userId) => {
  return Notification.countDocuments({ userId, isRead: false });
};