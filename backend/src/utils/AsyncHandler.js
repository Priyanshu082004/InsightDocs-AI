/**
 * Wraps an async controller so any thrown error (or rejected promise)
 * is forwarded to Express's `next(err)` automatically. Without this,
 * every controller would need its own try/catch — this is the single
 * place that guarantee lives instead.
 *
 * Usage: router.get("/:id", asyncHandler(documentController.getById));
 */
export const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};