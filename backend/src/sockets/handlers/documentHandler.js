import * as permissionService from "../../modules/permission/permission.service.js";
import { ACCESS_LEVELS } from "../../constants/auth.constant.js";
import { logger } from "../../config/logger.config.js";

/**
 * A socket only receives doc:<id>-scoped events (e.g. live processing
 * progress for a document currently open in the UI) after explicitly
 * asking to join that room — and joining is permission-checked exactly
 * like the HTTP routes are, via the same permission.service.requireAccess
 * used everywhere else. A socket connection alone grants no document
 * access; the same access-control boundary applies here as on every
 * REST endpoint.
 */
export const registerDocumentHandlers = (socket) => {
  socket.on("document:join", async ({ documentId }, callback) => {
    try {
      await permissionService.requireAccess(documentId, socket.user.id, ACCESS_LEVELS.VIEWER);
      socket.join(`doc:${documentId}`);
      callback?.({ success: true });
    } catch (err) {
      logger.warn(
        { userId: socket.user.id, documentId, err: err.message },
        "Socket denied document room access"
      );
      callback?.({ success: false, message: err.message });
    }
  });

  socket.on("document:leave", ({ documentId }) => {
    socket.leave(`doc:${documentId}`);
  });
};