import mongoose, { Schema } from "mongoose";

const chatSessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    documentId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      default: null,
      index: true,
    },
    title: {
      type: String,
      default: "New chat",
    },
  },
  { timestamps: true }
);

export const ChatSession = mongoose.model("ChatSession", chatSessionSchema);


// this model is used to store the chat sessions for a user, it can be linked to a document or not, if linked to a document then the
//  chat session is about that document, if not linked to a document then the chat session is about general chat