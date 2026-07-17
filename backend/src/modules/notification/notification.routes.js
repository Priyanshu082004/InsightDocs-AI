import { Router } from "express";
import * as notificationController from "./notification.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import { listNotificationsQuerySchema } from "./notification.validation.js";

const router = Router();

router.get(
  "/",
  authenticate,
  validate(listNotificationsQuerySchema, "query"),
  asyncHandler(notificationController.list)
);

router.get("/unread-count", authenticate, asyncHandler(notificationController.getUnreadCount));

router.patch("/:id/read", authenticate, asyncHandler(notificationController.markAsRead));

router.patch("/read-all", authenticate, asyncHandler(notificationController.markAllAsRead));

export default router;