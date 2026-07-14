import * as chatSessionRepository from "./chatSession.repository.js";
import * as chatMessageRepository from "./chatMessage.repository.js";
import * as permissionRepository from "../permission/permission.repository.js";
import * as permissionService from "../permission/permission.service.js";
import * as retrievalService from "./retrieval.service.js";
import { buildRagPrompt } from "./ragPromptBuilder.js";
import { generateEmbedding } from "../ai/embedding.service.js";
import { streamChatResponse } from "../ai/llm.service.js";
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

  const queryEmbedding = await generateEmbedding(question);
  const chunks = await retrievalService.retrieveRelevantChunks({
    queryEmbedding,
    allowedDocumentIds,
    topK: TOP_K_CHUNKS,
  });

  const prompt = buildRagPrompt(question, chunks);
  const answer = await streamChatResponse(prompt, onToken);

  const assistantMessage = await chatMessageRepository.createMessage({
    sessionId,
    role: "ASSISTANT",
    content: answer,
    citedChunkIds: chunks.map((c) => c._id),
  });

  return assistantMessage;
};