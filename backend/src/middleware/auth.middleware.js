
import { verifyAccessToken } from "../utils/token.util.js";
import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.constants.js";


//   Attaches req.user = { id, role } from the JWT payload directly —
//   deliberately does NOT hit the database on every request. The access
//   token is short-lived (15m default), so a role change takes effect
//   within one token cycle rather than requiring a DB round-trip per
//   request. Routes that need fresher user data (e.g. checking isActive)
//  should look the user up explicitly in their own service.
 
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!bearerToken) {
    return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, "Access token missing"));
  }

  try {
    const decoded = verifyAccessToken(bearerToken);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    next(new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid or expired access token"));
  }
};