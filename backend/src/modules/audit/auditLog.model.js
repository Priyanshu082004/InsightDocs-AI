import mongoose, { Schema } from "mongoose";

const auditLogSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true, // e.g. "LOGIN", "DOCUMENT_DOWNLOAD", "PERMISSION_GRANT"
      index: true,
    },
    resourceType: {
      type: String,
      required: true, // e.g. "Document", "User", "Permission"
    },
    resourceId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed, // flexible payload, e.g. { from: "VIEWER", to: "EDITOR" }
      default: {},
    },
    ipAddress: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // append-only — never updated
  }
);

auditLogSchema.index({ resourceType: 1, resourceId: 1, createdAt: -1 });

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);


// audit log model to track user actions on resources, including the action type, resource type and ID, optional metadata, and IP address. 
// This is useful for security and compliance purposes.