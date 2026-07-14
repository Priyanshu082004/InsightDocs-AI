import { Router } from "express";
import * as auditController from "./audit.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/rbac.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { requireAuditResourceAccess } from "../../middlewares/auditResourceAccess.middleware.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import { ROLES } from "../../constants/auth.constant.js";
import { listAuditLogsQuerySchema } from "./audit.validation.js";

const router = Router();

// Unchanged: browsing the full audit log across all resources stays
// admin-only. Only the single-resource history endpoint below gained
// an owner exception.
router.get(
  "/",
  authenticate,
  authorize(ROLES.ADMIN),
  validate(listAuditLogsQuerySchema, "query"),
  asyncHandler(auditController.list)
);

// authorize(ROLES.ADMIN) replaced with requireAuditResourceAccess —
// admins still pass (checked first, inside the middleware), but a
// document's owner can now also reach their own document's audit
// history. Editors, viewers, and non-owners get the same 404 pattern
// used everywhere else in the app for insufficient document access.
router.get(
  "/resource/:resourceType/:resourceId",
  authenticate,
  requireAuditResourceAccess,
  asyncHandler(auditController.resourceHistory)
);

export default router;