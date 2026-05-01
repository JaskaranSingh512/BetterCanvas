import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: String,
    preview: String,
    date: String,
  },
  { _id: false }
);

const discussionSchema = new mongoose.Schema(
  {
    title: String,
    replies: Number,
    updatedAtLabel: String,
  },
  { _id: false }
);

const fileSchema = new mongoose.Schema(
  {
    name: String,
    uploadedAtLabel: String,
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseName: { type: String, required: true },
    courseCode: { type: String, required: true },
    term: { type: String, required: true },
    thumbnail: { type: String, enum: ["red", "green", "blue", "purple"], required: true },
    announcements: { type: Number, default: 0 },
    discussions: { type: Number, default: 0 },
    files: { type: Number, default: 0 },
    latestAnnouncement: announcementSchema,
    announcementFeed: [announcementSchema],
    discussionThreads: [discussionSchema],
    recentFiles: [fileSchema],
    focused: { type: Boolean, default: false },
    gradePercent: { type: Number, default: 0 },
    assignmentsDue: { type: Number, default: 0 },
    upcomingEvents: { type: Number, default: 0 },
    nextExamIn: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);
