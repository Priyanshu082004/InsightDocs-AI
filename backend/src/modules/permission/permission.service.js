import * as permissionRepository from "./permission.repository.js";
import * as auditService from "../audit/audit.service.js";
import { ApiError } from "../../utils/ApiError.js";
import { HTTP_STATUS } from "../../constants/httpStatus.constant.js";
import { ACCESS_LEVEL_RANK } from "../../constants/auth.constant.js";
import { AUDIT_ACTION } from "../../constants/system.constant.js";


//   The single access-check primitive for the whole app. Every document
//   route  calls this rather than comparing Document.ownerId directly —
//   because the owner also holds an OWNER Permission row, this one
//  function correctly handles "I own it" and "it was shared with me"
//   with zero special-casing.
 
//  Returns the Permission record on success (callers sometimes need to
//  know the exact level, not just that access was sufficient).
 
export const requireAccess = async (documentId, userId, minLevel) => {
  const permission = await permissionRepository.findPermission(documentId, userId);

  if (!permission) {
    // 404, not 403 — confirming "this document exists but you can't see
    // it" leaks information (that the document exists at all) to users
    // who were never granted any access to it.
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Document not found");
  }

  if (ACCESS_LEVEL_RANK[permission.accessLevel] < ACCESS_LEVEL_RANK[minLevel]) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, "Insufficient permissions for this document");
  }

  return permission;
};

export const grantAccess = async ({ documentId, granterId, targetUserId, accessLevel }) => {
  await requireAccess(documentId, granterId, "OWNER");

  if (targetUserId.toString() === granterId.toString()) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "You already have access to your own document");
  }

  const permission = await permissionRepository.upsertPermission({
    documentId,
    userId: targetUserId,
    accessLevel,
    grantedBy: granterId,
  });

  await auditService.logAction({
    userId: granterId,
    action: AUDIT_ACTION.PERMISSION_GRANT,
    resourceType: "Document",
    resourceId: documentId,
    metadata: { targetUserId, accessLevel },
  });

  return permission;
};

export const revokeAccess = async ({ documentId, granterId, targetUserId }) => {
  await requireAccess(documentId, granterId, "OWNER");

  const targetPermission = await permissionRepository.findPermission(documentId, targetUserId);
  if (targetPermission?.accessLevel === "OWNER") {
    // Guards against ever ending up with a shared document that has no
    // OWNER row at all — a state nothing in this codebase expects.
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Cannot revoke the document owner's access");
  }

  await permissionRepository.deletePermission(documentId, targetUserId);

  await auditService.logAction({
    userId: granterId,
    action: AUDIT_ACTION.PERMISSION_REVOKE,
    resourceType: "Document",
    resourceId: documentId,
    metadata: { targetUserId },
  });
};

export const listCollaborators = async (documentId) => {
  const permissions = await permissionRepository.listPermissionsForDocument(documentId);
  return permissions.map((p) => ({
    user: p.userId, // populated: { _id, name, email, avatarUrl }
    accessLevel: p.accessLevel,
    grantedAt: p.createdAt,
  }));
};