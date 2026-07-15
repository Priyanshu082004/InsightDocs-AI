import * as notificationRepository from "./notification.repository.js";
import { emitNotification } from "../../sockets/emitters/notification.emitter.js";
import { ApiError } from "../../utils/ApiError.js";
import { HTTP_STATUS } from "../../constants/httpStatus.constant.js";

const sanitizeNotification = (n) => ({
  id: n._id,
  type: n.type,
  message: n.message,
  relatedDocumentId: n.relatedDocumentId,
  isRead: n.isRead,
  createdAt: n.createdAt,
});


//   The one function every call site (document.service, the worker) uses
//   to notify a user..
 
export const createAndPushNotification = async ({ userId, type, message, relatedDocumentId = null }) => {
  const notification = await notificationRepository.createNotification({
    userId,
    type,
    message,
    relatedDocumentId,
  });

  const sanitized = sanitizeNotification(notification);
  emitNotification(userId, sanitized);
  return sanitized;
};

export const listNotifications = async (userId, query) => {
  const result = await notificationRepository.listForUser(userId, query);
  return { ...result, items: result.items.map(sanitizeNotification) };
};

export const markAsRead = async (userId, notificationId) => {
  const notification = await notificationRepository.markAsRead(userId, notificationId);
  if (!notification) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Notification not found");
  }
  return sanitizeNotification(notification);
};

export const markAllAsRead = async (userId) => {
  await notificationRepository.markAllAsRead(userId);
};

export const getUnreadCount = async (userId) => {
  const count = await notificationRepository.getUnreadCount(userId);
  return { count };
};