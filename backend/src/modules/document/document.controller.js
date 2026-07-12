import * as documentService from "./document.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { HTTP_STATUS } from "../../constants/httpStatus.constant.js";

export const upload = async (req, res) => {
  const document = await documentService.uploadDocument(req.user.id, req.file);
  return res
    .status(HTTP_STATUS.CREATED)
    .json(new ApiResponse(HTTP_STATUS.CREATED, { document }, "Document uploaded"));
};

export const list = async (req, res) => {
  const result = await documentService.listDocuments(req.user.id, req.query);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
};

export const getMetadata = async (req, res) => {
  const document = await documentService.getDocumentMetadata(req.params.id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, { document }));
};

export const rename = async (req, res) => {
  const document = await documentService.renameDocument(
    req.user.id,
    req.params.id,
    req.body.displayName
  );
  return res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(HTTP_STATUS.OK, { document }, "Document renamed"));
};

export const remove = async (req, res) => {
  await documentService.deleteDocument(req.user.id, req.params.id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, null, "Document deleted"));
};

export const download = async (req, res) => {
  const result = await documentService.getDownloadUrl(req.user.id, req.params.id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
};

export const share = async (req, res) => {
  const result = await documentService.shareDocument(req.user.id, req.params.id, req.body);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
};

export const revokeShare = async (req, res) => {
  await documentService.revokeShare(req.user.id, req.params.id, req.params.userId);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, null, "Access revoked"));
};

export const listCollaborators = async (req, res) => {
  const collaborators = await documentService.listCollaborators(req.params.id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, { collaborators }));
};