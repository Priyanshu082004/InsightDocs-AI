import * as permissionService from "../modules/permission/permission.service.js";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.constant.js";
import { ROLES } from "../constants/auth.constant.js";
import { ACCESS_LEVELS } from "../constants/auth.constant.js";


 
export const requireAuditResourceAccess = async (req, res, next) => {
  try {
    if (req.user.role === ROLES.ADMIN) {
      return next();
    }

    const { resourceType, resourceId } = req.params;

    if (resourceType !== "Document") {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Resource not found");
    }

    await permissionService.requireAccess(resourceId, req.user.id, ACCESS_LEVELS.OWNER);
    next();
  } catch (err) {
    next(err);
  }
};