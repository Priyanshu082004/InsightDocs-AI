import * as auditService from "./audit.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { HTTP_STATUS } from "../../constants/httpStatus.constant.js";

export const list = async (req, res) => {
  const result = await auditService.listAuditLogs(req.query);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, result));
};

export const resourceHistory = async (req, res) => {
  const logs = await auditService.getResourceHistory(
    req.params.resourceType,
    req.params.resourceId
  );
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, { logs }));
};