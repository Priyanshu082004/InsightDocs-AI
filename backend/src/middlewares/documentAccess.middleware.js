import * as permissionService from "../modules/permission/permission.service.js";

/**
 * Usage: router.patch("/:id", authenticate, requireDocumentAccess("EDITOR"), ...)
 * Must run AFTER `authenticate` (needs req.user.id) and expects the
 * document id at req.params.id. Attaches req.documentAccess (the
 * Permission record) in case the controller/service needs the exact
 * granted level, not just confirmation it was sufficient.
 */
export const requireDocumentAccess = (minLevel) => {
  return async (req, res, next) => {
    try {
      const permission = await permissionService.requireAccess(
        req.params.id,
        req.user.id,
        minLevel
      );
      req.documentAccess = permission;
      next();
    } catch (err) {
      next(err);
    }
  };
};