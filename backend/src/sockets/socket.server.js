import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { env } from "../config/env.config.js";
import { createRedisAdapterClients } from "../config/redis.config.js";
import { verifyAccessToken } from "../utils/token.util.js";
import { logger } from "../config/logger.config.js";
import { registerPresenceHandlers } from "./handlers/presence.handler.js";
import { registerDocumentHandlers } from "./handlers/document.handler.js";

export const initSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN,
      credentials: true,
    },
  });

  const { pubClient, subClient } = createRedisAdapterClients();
  io.adapter(createAdapter(pubClient, subClient));

  
//     Handshake-time auth — same JWT verification as auth.middleware.js,
//     but sockets carry the token via `handshake.auth.token` (set by the
//    client at `io(url, { auth: { token } })`), not an Authorization
//    eader, since there's no per-message header on a persistent
//     connection.

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    try {
      const decoded = verifyAccessToken(token);
      socket.user = { id: decoded.id, role: decoded.role };
      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    logger.info({ userId: socket.user.id, socketId: socket.id }, "Socket connected");

    // Every socket auto-joins its own user room — this is the room
    // every emitter (progress, shared, notification) targets.
    socket.join(`user:${socket.user.id}`);

    registerPresenceHandlers(socket);
    registerDocumentHandlers(socket);

    socket.on("disconnect", () => {
      logger.info({ userId: socket.user.id, socketId: socket.id }, "Socket disconnected");
    });
  });

  return io;
};