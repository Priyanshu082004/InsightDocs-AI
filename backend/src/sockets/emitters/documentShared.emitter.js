import { socketEmitter } from "../socketEmitter.util.js";

export const emitDocumentShared = (targetUserId, { documentId, documentName, accessLevel, sharedBy }) => {
  socketEmitter
    .to(`user:${targetUserId}`)
    .emit("document:shared", { documentId, documentName, accessLevel, sharedBy });
};