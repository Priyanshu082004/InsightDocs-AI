import mongoose, { Schema } from "mongoose";

const permissionSchema = new Schema(
  {
    documentId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    accessLevel: {
      type: String,
      enum: ["OWNER", "EDITOR", "VIEWER"],
      required: true,
    },
    grantedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// A user can only have ONE permission entry per document — prevents
// duplicate/conflicting grants 
permissionSchema.index({ documentId: 1, userId: 1 }, { unique: true });

export const Permission = mongoose.model("Permission", permissionSchema);