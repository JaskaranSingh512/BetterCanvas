import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    unreadMessages: { type: Number, default: 0 },
    accountStatus: { type: String, default: "Active" },
    settings: [{ type: String }],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
