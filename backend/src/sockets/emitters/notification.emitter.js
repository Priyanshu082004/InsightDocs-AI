import { socketEmitter } from "../socketEmitter.util.js";


export const emitNotification = (userId, notification) => {
  socketEmitter.to(`user:${userId}`).emit("notification:new", notification);
};