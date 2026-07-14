import { ChatSession } from "./chatSession.model.js";

export const createSession = async ({ userId, documentId = null, title }) => {
  return ChatSession.create({ userId, documentId, title: title || "New chat" });
};

export const findSessionById = async (sessionId) => {
  return ChatSession.findById(sessionId);
};

export const listSessionsForUser = async (userId) => {
  return ChatSession.find({ userId }).sort({ updatedAt: -1 });
};

export const deleteSession = async (sessionId) => {
  return ChatSession.findByIdAndDelete(sessionId);
};