import { Router } from "express";
import * as auditController from "./audit.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/rbac.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import { ROLES } from "../../constants/auth.constant.js";
import { listAuditLogsQuerySchema } from "./audit.validation.js";

const router = Router();

// Admin-only for both routes — audit trails are a compliance/security
// surface, not user-facing data. Even a document owner can't browse
// their own document's audit history through this endpoint; that's a
// deliberate scope boundary, not an oversight.
router.get(
  "/",
  authenticate,
  authorize(ROLES.ADMIN),
  validate(listAuditLogsQuerySchema, "query"),
  asyncHandler(auditController.list)
);

router.get(
  "/resource/:resourceType/:resourceId",
  authenticate,
  authorize(ROLES.ADMIN),
  asyncHandler(auditController.resourceHistory)
);

export default router;