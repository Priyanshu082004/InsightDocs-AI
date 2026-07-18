import * as chatSessionRepository from "./chatSession.repository.js";
import * as chatMessageRepository from "./chatMessage.repository.js";
import * as permissionRepository from "../permission/permission.repository.js";
import * as permissionService from "../permission/permission.service.js";
import * as retrievalService from "./retrieval.service.js";
import * as aiServiceClient from "../../services/aiService.client.js";
import { ApiError } from "../../utils/ApiError.js";
import { HTTP_STATUS } from "../../constants/httpStatus.constant.js";
import { ACCESS_LEVELS } from "../../constants/auth.constant.js";

const TOP_K_CHUNKS = 5;

/**
 * Resolves which documents this question is allowed to retrieve from.
 * A document-scoped session is re-checked against permission on EVERY
 * question, not just at session creation — if access was revoked
 * mid-conversation, the very next question should fail rather than
 * keep answering from a document the user no longer has rights to.
 */
const resolveAllowedDocumentIds = async (session, userId) => {
  if (session.documentId) {
    await permissionService.requireAccess(session.documentId, userId, ACCESS_LEVELS.VIEWER);
    return [session.documentId];
  }
  // Cross-document session: retrieval is scoped to every document the
  // user currently holds ANY Permission row for — same source of truth
  // document.service uses for "list my documents".
  return permissionRepository.listDocumentIdsForUser(userId);
};

export const askQuestion = async ({ userId, sessionId, question, onToken }) => {
  const session = await chatSessionRepository.findSessionById(sessionId);
  if (!session || session.userId.toString() !== userId.toString()) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Chat session not found");
  }

  const allowedDocumentIds = await resolveAllowedDocumentIds(session, userId);

  await chatMessageRepository.createMessage({
    sessionId,
    role: "USER",
    content: question,
  });

  // Embed the question via the AI service (a query is just a
  // one-element batch), retrieve backend-side (Atlas Vector Search
  // stays backend-owned), then hand question + chunks to the AI
  // service, which builds the RAG prompt internally and streams tokens.
  const { embeddings } = await aiServiceClient.generateEmbeddings([question]);
  const chunks = await retrievalService.retrieveRelevantChunks({
    queryEmbedding: embeddings[0],
    allowedDocumentIds,
    topK: TOP_K_CHUNKS,
  });

  const answer = await aiServiceClient.streamChatResponse({ question, chunks }, onToken);

  const assistantMessage = await chatMessageRepository.createMessage({
    sessionId,
    role: "ASSISTANT",
    content: answer,
    citedChunkIds: chunks.map((c) => c._id),
  });

  return assistantMessage;
};