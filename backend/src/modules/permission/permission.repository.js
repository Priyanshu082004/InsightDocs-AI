import { Permission } from "./permission.model.js";

export const createPermission = async ({ documentId, userId, accessLevel, grantedBy }) => {
  return Permission.create({ documentId, userId, accessLevel, grantedBy });
};

export const findPermission = async (documentId, userId) => {
  return Permission.findOne({ documentId, userId });
};

// Upsert: sharing with someone who already has access just updates
// their level, rather than erroring on the unique (documentId, userId)
// index or requiring the caller to branch on "grant vs. update".
export const upsertPermission = async ({ documentId, userId, accessLevel, grantedBy }) => {
  return Permission.findOneAndUpdate(
    { documentId, userId },
    { accessLevel, grantedBy },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

export const deletePermission = async (documentId, userId) => {
  return Permission.findOneAndDelete({ documentId, userId });
};

export const listPermissionsForDocument = async (documentId) => {
  return Permission.find({ documentId }).populate("userId", "name email avatarUrl");
};

// Distinct document IDs a user can see at all (owner or shared-with) —
// this is the join document.service uses to answer "list my documents".
export const listDocumentIdsForUser = async (userId) => {
  return Permission.distinct("documentId", { userId });
};