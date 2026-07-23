import mongoose, { Schema } from "mongoose";

const chatMessageSchema = new Schema(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "ChatSession",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["USER", "ASSISTANT"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  
    citedChunkIds: {
      type: [Schema.Types.ObjectId],
      ref: "DocumentChunk",
      default: [],
    },
    // Source attribution for ASSISTANT messages, in retrieval order —
    // sources[0] is what the answer cites as [Source 1]. documentName is
    // a SNAPSHOT taken at answer time, so history keeps showing the name
    // the user saw even if the document is renamed or deleted later.
    // chunkId/documentId/pageNumber are the hooks for future navigation
    // (open document, jump to page, highlight snippet). Messages created
    // before this field default to [] (backward compatible).
    sources: {
      type: [
        {
          _id: false,
          chunkId: { type: Schema.Types.ObjectId, ref: "DocumentChunk" },
          documentId: { type: Schema.Types.ObjectId, ref: "Document" },
          documentName: { type: String, default: null },
          pageNumber: { type: Number, default: null },
          snippet: { type: String, default: null },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

chatMessageSchema.index({ sessionId: 1, createdAt: 1 });

export const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);



// this model is used to store the chat messages for a chat session, each message has a role (user or assistant) and content, it can
//  also have cited chunks which are references to the document chunks that were cited in the message