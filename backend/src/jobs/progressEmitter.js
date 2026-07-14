import { socketEmitter } from "../../sockets/socketEmitter.util.js";

/**
 * Replaces the Phase 9 stub (which only logged). Call signature is
 * IDENTICAL — documentProcessing.worker.js needed zero changes for this
 * upgrade, which was the entire point of routing progress through one
 * function instead of importing socket infrastructure directly into the
 * worker. Runs in the WORKER process, not the API process — publishes
 * via socketEmitter (Redis pub/sub), which the API process's
 * redis-adapter picks up and delivers to the actual connected socket.
 * See the Phase 12 decision log for why this indirection exists.
 */
export const emitProcessingProgress = (ownerId, documentId, stage, status) => {
  socketEmitter.to(`user:${ownerId}`).emit("document:progress", { documentId, stage, status });
};