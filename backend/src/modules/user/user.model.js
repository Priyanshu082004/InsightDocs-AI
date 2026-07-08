import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // never returned by default queries
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
      index: true,
    },
    refreshTokenHash: {
      type: String,
      select: false, // hashed, and excluded from default queries
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Why store a hash of the refresh token instead of the raw token:
// if the DB is ever leaked, a stolen hash cannot be replayed as a valid
// refresh token, mirroring the same reasoning as password hashing.
export const User = mongoose.model("User", userSchema);