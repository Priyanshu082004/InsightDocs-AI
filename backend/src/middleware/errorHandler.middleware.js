import { ApiError } from "../utils/ApiError.js";
import { logger } from "../config/logger.config.js";
import { isProduction } from "../config/env.config.js";
import { HTTP_STATUS } from "../constants/httpStatus.constant.js";


//  Express recognizes this as an error handler purely by arguments (4 args) —
//  do not remove any of the four parameters even if unused, or Express
//  will treat it as regular middleware and it will never be invoked.
 
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Normalize any non-ApiError 
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const message = error.message || "Internal server error";
    error = new ApiError(statusCode, message, [], err.stack);
    error.isOperational = false; // this path means something unexpected broke
  }

  const isServerError = error.statusCode >= HTTP_STATUS.INTERNAL_SERVER_ERROR;

  logger.error(
    {
      err: { message: error.message, stack: error.stack },
      path: req.originalUrl,
      method: req.method,
      statusCode: error.statusCode,
    },
    "Request failed"
  );

  return res.status(error.statusCode).json({
    success: false,
    // Never leak internal error messages/stack traces for unexpected
    // (non-operational) 5xx errors in production — the client gets a
    // generic message, the full detail goes only to the logs above.
    message:
      isProduction && isServerError && !error.isOperational
        ? "Internal server error"
        : error.message,
    errors: error.errors,
    ...(isProduction ? {} : { stack: error.stack }),
  });
};