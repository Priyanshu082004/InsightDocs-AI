import * as documentRepository from "./document.repository.js";
import * as permissionRepository from "../permission/permission.repository.js";
import * as permissionService from "../permission/permission.service.js";
import * as storageService from "../../storage/storage.service.js";
import * as userRepository from "../user/user.repository.js";
import * as auditService from "../audit/audit.service.js";
import * as notificationService from "../notification/notification.service.js"
import { NOTIFICATION_TYPE } from "../../constants/system.constant.js";
import { enqueueDocumentProcessing } from "../../jobs/producers/documentProcessing.producer.js";
import { emitDocumentShared } from "../../sockets/emitters/documentShared.emitter.js";
import { emitActivity } from "../../sockets/emitters/activity.emitter.js";
import { ApiError } from "../../utils/ApiError.js";
import { HTTP_STATUS } from "../../constants/httpStatus.constant.js";
import { DOCUMENT_STATUS } from "../../constants/document.constant.js";
import { ACCESS_LEVELS } from "../../constants/auth.constant.js";
import { AUDIT_ACTION } from "../../constants/system.constant.js";

const sanitizeDocument = (doc) => ({
  id: doc._id,
  ownerId: doc.ownerId,
  originalName: doc.originalName,
  displayName: doc.displayName,
  mimeType: doc.mimeType,
  sizeBytes: doc.sizeBytes,
  status: doc.status,
  version: doc.version,
  tags: doc.tags,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
 
});

export const uploadDocument = async (ownerId, file) => {
  if (!file) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "No file provided");
  }

  const storageKey = storageService.generateStorageKey(ownerId, file.originalname);

  await storageService.uploadObject({
    buffer: file.buffer,
    key: storageKey,
    mimeType: file.mimetype,
    size: file.size,
  });

  
  const document = await documentRepository.createDocument({
    ownerId,
    originalName: file.originalname,
    displayName: file.originalname,
    mimeType: file.mimetype,
    sizeBytes: file.size,
    storageKey,
    status: DOCUMENT_STATUS.PROCESSING,
  });

  await permissionRepository.createPermission({
    documentId: document._id,
    userId: ownerId,
    accessLevel: ACCESS_LEVELS.OWNER,
    grantedBy: ownerId,
  });

  await auditService.logAction({
    userId: ownerId,
    action: AUDIT_ACTION.DOCUMENT_UPLOAD,
    resourceType: "Document",
    resourceId: document._id,
    metadata: { originalName: file.originalname, sizeBytes: file.size },
  });


  await enqueueDocumentProcessing(document._id);

  emitActivity(ownerId, {
    type: "DOCUMENT_UPLOADED",
    message: `${file.originalname} was uploaded and is processing`,
    metadata: { documentId: document._id },
  });

  return sanitizeDocument(document);
};

export const listDocuments = async (userId, { page, limit, search, tags }) => {
  const documentIds = await permissionRepository.listDocumentIdsForUser(userId);
  const result = await documentRepository.findManyByIds(documentIds, {
    search,
    tags,
    page,
    limit,
  });
  return { ...result, items: result.items.map(sanitizeDocument) };
};

export const getDocumentMetadata = async (documentId) => {
  const document = await documentRepository.findById(documentId);
  if (!document) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Document not found");
  }
  return sanitizeDocument(document);
};

export const renameDocument = async (userId, documentId, displayName) => {
  const document = await documentRepository.findById(documentId);
  if (!document) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Document not found");
  }

  const previousName = document.displayName;
  const updated = await documentRepository.updateDisplayName(documentId, displayName);

  await auditService.logAction({
    userId,
    action: AUDIT_ACTION.DOCUMENT_RENAME,
    resourceType: "Document",
    resourceId: documentId,
    metadata: { from: previousName, to: displayName },
  });

  return sanitizeDocument(updated);
};

export const deleteDocument = async (userId, documentId) => {
  
  const document = await documentRepository.softDelete(documentId);
  if (!document) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Document not found");
  }

  await auditService.logAction({
    userId,
    action: AUDIT_ACTION.DOCUMENT_DELETE,
    resourceType: "Document",
    resourceId: documentId,
  });
};

export const getDownloadUrl = async (userId, documentId) => {
  const document = await documentRepository.findById(documentId);
  if (!document) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Document not found");
  }

  const url = await storageService.getPresignedDownloadUrl(document.storageKey);

  await auditService.logAction({
    userId,
    action: AUDIT_ACTION.DOCUMENT_DOWNLOAD,
    resourceType: "Document",
    resourceId: documentId,
  });

  return { url, expiresInSeconds: 15 * 60 };
};

export const shareDocument = async (granterId, documentId, { email, accessLevel }) => {
  const targetUser = await userRepository.findByEmail(email);
  if (!targetUser) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "No user found with that email");
  }

  await permissionService.grantAccess({
    documentId,
    granterId,
    targetUserId: targetUser._id,
    accessLevel,
  });

  const document = await documentRepository.findById(documentId);

  emitDocumentShared(targetUser._id, {
    documentId,
    documentName: document?.displayName,
    accessLevel,
    sharedBy: granterId,
  });
    

   await notificationService.createAndPushNotification({
    userId: targetUser._id,
    type: NOTIFICATION_TYPE.DOCUMENT_SHARED,
    message: `${granter?.name ?? "Someone"} shared "${document?.displayName}" with you (${accessLevel.toLowerCase()} access)`,
    relatedDocumentId: documentId,
  });

  
  return { message: `Document shared with ${email} as ${accessLevel}` };
};

export const revokeShare = async (granterId, documentId, targetUserId) => {
  await permissionService.revokeAccess({ documentId, granterId, targetUserId });
};

export const listCollaborators = async (documentId) => {
  return permissionService.listCollaborators(documentId);
};