import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.constant.js";


//authorize: Express middleware to enforce role-based access control (RBAC).
//  Usage: router.get("/admin", authenticate, authorize("admin"), controller.adminOnly)

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, "Not authenticated"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(HTTP_STATUS.FORBIDDEN, "Insufficient permissions"));
    }

    next();
  };
};