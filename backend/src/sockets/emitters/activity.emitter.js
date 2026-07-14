import { socketEmitter } from "../socketEmitter.util.js";


export const emitActivity = (userId, { type, message, metadata = {} }) => {
  socketEmitter.to(`user:${userId}`).emit("activity:new", { type, message, metadata, at: new Date() });
};