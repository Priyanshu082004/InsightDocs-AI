import { Router } from "express";
import * as authController from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { strictRateLimiter } from "../../middlewares/strictRate.middleware.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import { registerSchema, loginSchema } from "./auth.validation.js";

const router = Router();

const loginLimiter = strictRateLimiter({ max:20,keyPrefix: "login" });
const registerLimiter = strictRateLimiter({ max: 5, keyPrefix: "register" });

router.post(
  "/register",
  registerLimiter,
  validate(registerSchema),
  asyncHandler(authController.register)
);
router.post("/login", loginLimiter, validate(loginSchema), asyncHandler(authController.login));
router.post("/refresh", asyncHandler(authController.refresh));
router.post("/logout", authenticate, asyncHandler(authController.logout));
router.get("/me", authenticate, asyncHandler(authController.getCurrentUser));

export default router;