import * as chatSessionRepository from "./chatSession.repository.js";
import * as chatMessageRepository from "./chatMessage.repository.js";
import * as permissionService from "../permission/permission.service.js";
import { ApiError } from "../../utils/ApiError.js";
import { HTTP_STATUS } from "../../constants/httpStatus.constant.js";
import { ACCESS_LEVELS } from "../../constants/auth.constant.js";

const sanitizeSession = (session) => ({
  id: session._id,
  documentId: session.documentId,
  title: session.title,
  createdAt: session.createdAt,
  updatedAt: session.updatedAt,
});

const sanitizeMessage = (message) => ({
  id: message._id,
  role: message.role,
  content: message.content,
  citedChunkIds: message.citedChunkIds,
  createdAt: message.createdAt,
});

const requireOwnSession = async (sessionId, userId) => {
  const session = await chatSessionRepository.findSessionById(sessionId);
  if (!session || session.userId.toString() !== userId.toString()) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Chat session not found");
  }
  return session;
};

export const createSession = async (userId, { documentId, title }) => {
  if (documentId) {
    // Fail at creation time if the user can't even see the document —
    // no point creating a session that every question will immediately
    // reject in rag.service anyway.
    await permissionService.requireAccess(documentId, userId, ACCESS_LEVELS.VIEWER);
  }

  const session = await chatSessionRepository.createSession({ userId, documentId, title });
  return sanitizeSession(session);
};

export const listSessions = async (userId) => {
  const sessions = await chatSessionRepository.listSessionsForUser(userId);
  return sessions.map(sanitizeSession);
};

export const getSessionMessages = async (userId, sessionId) => {
  await requireOwnSession(sessionId, userId);
  const messages = await chatMessageRepository.listMessagesForSession(sessionId);
  return messages.map(sanitizeMessage);
};

export const deleteSession = async (userId, sessionId) => {
  await requireOwnSession(sessionId, userId);
  await chatSessionRepository.deleteSession(sessionId);
};