import * as notificationService from "./notification.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { HTTP_STATUS } from "../../constants/httpStatus.constant.js";

export const list = async (req, res) => {
  const result = await notificationService.listNotifications(req.user.id, req.query);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
};

export const getUnreadCount = async (req, res) => {
  const result = await notificationService.getUnreadCount(req.user.id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
};

export const markAsRead = async (req, res) => {
  const notification = await notificationService.markAsRead(req.user.id, req.params.id);
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, { notification }, "Marked as read"));
};

export const markAllAsRead = async (req, res) => {
  await notificationService.markAllAsRead(req.user.id);
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, null, "All notifications marked as read"));
};