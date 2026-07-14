import { Router } from "express";
import * as chatController from "./chat.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import { createSessionSchema, askQuestionSchema } from "./chat.validation.js";

const router = Router();

router.post(
  "/sessions",
  authenticate,
  validate(createSessionSchema),
  asyncHandler(chatController.createSession)
);

router.get("/sessions", authenticate, asyncHandler(chatController.listSessions));

router.get(
  "/sessions/:id/messages",
  authenticate,
  asyncHandler(chatController.getMessages)
);


router.post(
  "/sessions/:id/messages",
  authenticate,
  validate(askQuestionSchema),
  chatController.askQuestion
);

router.delete("/sessions/:id", authenticate, asyncHandler(chatController.deleteSession));

export default router;