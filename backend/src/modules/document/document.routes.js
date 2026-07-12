import { Router } from "express";
import * as documentController from "./document.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireDocumentAccess } from "../../middlewares/documentAccess.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { uploadSingleFile } from "../../storage/fileValidator.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import { ACCESS_LEVELS } from "../../constants/auth.constant.js";
import {
  renameDocumentSchema,
  listDocumentsQuerySchema,
  shareDocumentSchema,
} from "./document.validation.js";

const router = Router();

router.post("/", authenticate, uploadSingleFile, asyncHandler(documentController.upload));

router.get(
  "/",
  authenticate,
  validate(listDocumentsQuerySchema, "query"),
  asyncHandler(documentController.list)
);

router.get(
  "/:id",
  authenticate,
  requireDocumentAccess(ACCESS_LEVELS.VIEWER),
  asyncHandler(documentController.getMetadata)
);

router.patch(
  "/:id",
  authenticate,
  requireDocumentAccess(ACCESS_LEVELS.EDITOR),
  validate(renameDocumentSchema),
  asyncHandler(documentController.rename)
);

router.delete(
  "/:id",
  authenticate,
  requireDocumentAccess(ACCESS_LEVELS.OWNER),
  asyncHandler(documentController.remove)
);

router.get(
  "/:id/download",
  authenticate,
  requireDocumentAccess(ACCESS_LEVELS.VIEWER),
  asyncHandler(documentController.download)
);

router.post(
  "/:id/share",
  authenticate,
  requireDocumentAccess(ACCESS_LEVELS.OWNER),
  validate(shareDocumentSchema),
  asyncHandler(documentController.share)
);

router.delete(
  "/:id/share/:userId",
  authenticate,
  requireDocumentAccess(ACCESS_LEVELS.OWNER),
  asyncHandler(documentController.revokeShare)
);

router.get(
  "/:id/collaborators",
  authenticate,
  requireDocumentAccess(ACCESS_LEVELS.VIEWER),
  asyncHandler(documentController.listCollaborators)
);

export default router;