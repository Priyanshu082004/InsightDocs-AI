import * as onlineUsersService from "../../cache/onlineUsers.service.js";

export const registerPresenceHandlers = (socket) => {
  onlineUsersService.markUserOnline(socket.user.id);

  // Client sends this on an interval shorter than PRESENCE_TTL_SECONDS
  // (60s, set in Phase 8) — if heartbeats stop because the connection
  // dropped silently (not a clean disconnect), presence expires on its
  // own rather than requiring a disconnect event we might never get.
  socket.on("presence:heartbeat", () => {
    onlineUsersService.refreshPresence(socket.user.id);
  });

  socket.on("disconnect", () => {
    onlineUsersService.markUserOffline(socket.user.id);
  });
};