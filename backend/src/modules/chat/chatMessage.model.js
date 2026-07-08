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
  },
  { timestamps: true }
);

chatMessageSchema.index({ sessionId: 1, createdAt: 1 });

export const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);



// this model is used to store the chat messages for a chat session, each message has a role (user or assistant) and content, it can
//  also have cited chunks which are references to the document chunks that were cited in the message