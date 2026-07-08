import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "DOCUMENT_READY",
        "DOCUMENT_FAILED",
        "DOCUMENT_SHARED",
        "SYSTEM",
      ],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedDocumentId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);