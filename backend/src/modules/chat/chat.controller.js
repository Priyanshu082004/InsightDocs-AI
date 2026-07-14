import * as chatService from "./chat.service.js";
import * as ragService from "./rag.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { HTTP_STATUS } from "../../constants/httpStatus.constant.js";
import { logger } from "../../config/logger.config.js";

export const createSession = async (req, res) => {
  const session = await chatService.createSession(req.user.id, req.body);
  return res
    .status(HTTP_STATUS.CREATED)
    .json(new ApiResponse(HTTP_STATUS.CREATED, { session }, "Chat session created"));
};

export const listSessions = async (req, res) => {
  const sessions = await chatService.listSessions(req.user.id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, { sessions }));
};

export const getMessages = async (req, res) => {
  const messages = await chatService.getSessionMessages(req.user.id, req.params.id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, { messages }));
};

export const deleteSession = async (req, res) => {
  await chatService.deleteSession(req.user.id, req.params.id);
  return res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, null, "Session deleted"));
};

export const askQuestion = async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    const message = await ragService.askQuestion({
      userId: req.user.id,
      sessionId: req.params.id,
      question: req.body.question,
      onToken: (token) => {
        res.write(`data: ${JSON.stringify({ token })}\n\n`);
      },
    });

    res.write(
      `data: ${JSON.stringify({
        done: true,
        messageId: message._id,
        citedChunkIds: message.citedChunkIds,
      })}\n\n`
    );
  } catch (err) {
    logger.error({ err: err.message }, "RAG streaming request failed");
    res.write(`data: ${JSON.stringify({ error: err.message || "Something went wrong" })}\n\n`);
  } finally {
    res.end();
  }
};