export class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code to send
   * @param {string} message - safe, user-facing message
   * @param {Array} errors - optional array of field-level validation errors
   * @param {string} [stack] - override stack (rarely needed)
   */
  constructor(statusCode, message = "Something went wrong", errors = [], stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.data = null;
    this.success = false;

    // isOperational distinguishes "expected" errors (bad input, not
    // found, unauthorized — things we deliberately throw) from
    // programming bugs. The error handler uses this to decide whether
    // it's safe to expose `message` to the client at all.
    this.isOperational = true;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}