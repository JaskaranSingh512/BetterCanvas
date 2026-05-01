import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    section: { type: String, default: "today" },
    dateLabel: { type: String, default: "" },
    courseCode: { type: String, default: "" },
    courseName: { type: String, required: true },
    taskTitle: { type: String, required: true },
    taskType: { type: String, enum: ["assignment", "calendar"], required: true },
    points: Number,
    dueTime: String,
    time: String,
    checked: { type: Boolean, default: false },
    thumbnail: { type: String, enum: ["red", "green", "blue", "purple"], default: "red" },
    taskSubtitle: String,
    thumbnailLabel: String,
    eventDate: { type: String, required: true },
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);
