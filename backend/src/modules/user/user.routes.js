import { Router } from "express";
import * as userController from "./user.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/rbac.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ROLES } from "../../constants/roles.constants.js";
import {
  updateProfileSchema,
  changePasswordSchema,
  updateRoleSchema,
  listUsersQuerySchema,
} from "./user.validation.js";

const router = Router();

// --- Self-service routes (any authenticated user) ---
router.get("/me", authenticate, asyncHandler(userController.getProfile));
router.patch(
  "/me",
  authenticate,
  validate(updateProfileSchema),
  asyncHandler(userController.updateProfile)
);
router.patch(
  "/me/password",
  authenticate,
  validate(changePasswordSchema),
  asyncHandler(userController.changePassword)
);

// --- Admin-only routes ---
router.get(
  "/",
  authenticate,
  authorize(ROLES.ADMIN),
  validate(listUsersQuerySchema, "query"),
  asyncHandler(userController.listUsers)
);
router.get(
  "/:id",
  authenticate,
  authorize(ROLES.ADMIN),
  asyncHandler(userController.getUserById)
);
router.patch(
  "/:id/role",
  authenticate,
  authorize(ROLES.ADMIN),
  validate(updateRoleSchema),
  asyncHandler(userController.updateUserRole)
);
router.patch(
  "/:id/deactivate",
  authenticate,
  authorize(ROLES.ADMIN),
  asyncHandler(userController.deactivateUser)
);
router.patch(
  "/:id/activate",
  authenticate,
  authorize(ROLES.ADMIN),
  asyncHandler(userController.activateUser)
);

export default router;