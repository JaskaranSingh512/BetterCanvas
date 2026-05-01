import mongoose from "mongoose";

const helpTopicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    color: { type: String, required: true },
  },
  { timestamps: true }
);

export const HelpTopic = mongoose.model("HelpTopic", helpTopicSchema);
