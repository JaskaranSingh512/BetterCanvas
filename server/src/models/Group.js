import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    members: { type: Number, required: true },
    course: { type: String, required: true },
    lastActive: { type: String, required: true },
    color: { type: String, required: true },
  },
  { timestamps: true }
);

export const Group = mongoose.model("Group", groupSchema);
