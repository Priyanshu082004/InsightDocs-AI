import mongoose, { Schema } from "mongoose";

const documentSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true, // used when editable via rename
    },
    mimeType: {
      type: String,
      required: true,
    },
    sizeBytes: {
      type: Number,
      required: true,
    },
    storageKey: {
      type: String, // MinIO object key not  the raw bucket URL
      required: true,
    },
    status: {
      type: String,
      enum: ["UPLOADING", "PROCESSING", "READY", "FAILED"],
      default: "UPLOADING",
      index: true,
    },
    version: {
      type: Number,
      default: 1,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true, // soft delete — queries always filter isDeleted: false
    },
  },
  { timestamps: true }
);

// Compound index: most common query is "documents I own that aren't deleted,
// most recent first" — this index serves that directly without a full scan.
documentSchema.index({ ownerId: 1, isDeleted: 1, createdAt: -1 });

export const Document = mongoose.model("Document", documentSchema);



//  compound indexing works as per the way  fields are creatred in it if first field is ownerId then it will first sort by ownerId and then
//  isDeleted and then createdAt. So if we query for ownerId and isDeleted then it will use the index but if we query for isDeleted and 
// createdAt then it will not use the index.   