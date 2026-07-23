import { ChatMessage } from "./chatMessage.model.js";

export const createMessage = async ({ sessionId, role, content, citedChunkIds = [], sources = [] }) => {
  return ChatMessage.create({ sessionId, role, content, citedChunkIds });
};

export const listMessagesForSession = async (sessionId) => {
  return ChatMessage.find({ sessionId }).sort({ createdAt: 1 });
};