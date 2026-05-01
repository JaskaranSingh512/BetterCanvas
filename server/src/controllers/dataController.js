import { Course } from "../models/Course.js";
import { Task } from "../models/Task.js";
import { Group } from "../models/Group.js";
import { HelpTopic } from "../models/HelpTopic.js";
import { User } from "../models/User.js";

function toDateLabel(dateValue) {
  const date = new Date(`${dateValue}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

/** Local calendar week: Monday–Sunday (inclusive), YYYY-MM-DD strings. */
function getLocalWeekRange(reference = new Date()) {
  const ref = new Date(reference);
  const day = ref.getDay(); // 0 Sun .. 6 Sat
  const mondayDelta = day === 0 ? -6 : 1 - day;
  const monday = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate() + mondayDelta);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const start = `${monday.getFullYear()}-${pad2(monday.getMonth() + 1)}-${pad2(monday.getDate())}`;
  const end = `${sunday.getFullYear()}-${pad2(sunday.getMonth() + 1)}-${pad2(sunday.getDate())}`;
  const weekLabel = `${monday.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} – ${sunday.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}`;
  return { start, end, weekLabel };
}

function taskMatchesFocusedCourse(task, course) {
  if (!course) return false;
  const courseCode = (course.courseCode || "").trim();
  const taskCode = (task.courseCode || "").trim();
  if (courseCode && taskCode) {
    const a = courseCode.replace(/\s+/g, "").toLowerCase();
    const b = taskCode.replace(/\s+/g, "").toLowerCase();
    if (a === b) return true;
    if (taskCode.toLowerCase().includes(courseCode.toLowerCase())) return true;
  }
  const courseName = (course.courseName || "").trim().toLowerCase();
  const taskName = (task.courseName || "").trim().toLowerCase();
  if (courseName && taskName) {
    const tokens = courseName.split(/\s+/).filter((word) => word.length > 2);
    if (tokens.some((word) => taskName.includes(word))) return true;
  }
  return false;
}

export async function getDashboard(req, res) {
  const userId = req.user.sub;
  const focusedCourse = await Course.findOne({ userId, focused: true }).lean();
  const recentTask = await Task.findOne({ userId }).sort({ eventDate: 1, createdAt: -1 }).lean();
  const tasks = await Task.find({ userId })
    .select("eventDate courseCode courseName")
    .lean();
  const taskMarkers = tasks.reduce((accumulator, task) => {
    const key = task.eventDate;
    const courseLabel = task.courseCode || task.courseName;
    if (!accumulator[key]) {
      accumulator[key] = { count: 0, courses: [] };
    }
    accumulator[key].count += 1;
    if (courseLabel && !accumulator[key].courses.includes(courseLabel)) {
      accumulator[key].courses.push(courseLabel);
    }
    return accumulator;
  }, {});
  const taskDates = Object.keys(taskMarkers);

  const { start, end, weekLabel } = getLocalWeekRange();
  let focusedWeek = {
    weekLabel,
    start,
    end,
    assignmentsDue: [],
    calendarEvents: [],
  };
  if (focusedCourse) {
    const weekTasks = await Task.find({
      userId,
      eventDate: { $gte: start, $lte: end },
    })
      .select("taskTitle taskType eventDate dueTime time checked courseCode courseName")
      .sort({ eventDate: 1, createdAt: 1 })
      .lean();
    const matched = weekTasks.filter((task) => taskMatchesFocusedCourse(task, focusedCourse));
    const assignmentsDue = matched.filter((task) => task.taskType === "assignment" && !task.checked);
    const calendarEvents = matched.filter((task) => task.taskType === "calendar");
    focusedWeek = {
      weekLabel,
      start,
      end,
      assignmentsDue: assignmentsDue.map((task) => ({
        id: String(task._id),
        title: task.taskTitle,
        eventDate: task.eventDate,
        dateLabel: toDateLabel(task.eventDate),
        dueTime: task.dueTime || "",
      })),
      calendarEvents: calendarEvents.map((task) => ({
        id: String(task._id),
        title: task.taskTitle,
        eventDate: task.eventDate,
        dateLabel: toDateLabel(task.eventDate),
        time: task.time || "",
      })),
    };
  }

  res.json({ focusedCourse, recentTask, taskDates, taskMarkers, focusedWeek });
}

export async function getCourses(req, res) {
  const userId = req.user.sub;
  const courses = await Course.find({ userId }).sort({ createdAt: 1 }).lean();
  res.json({ term: "Spring 2026", courses });
}

export async function getCourseById(req, res) {
  const userId = req.user.sub;
  const { id } = req.params;
  const course = await Course.findOne({ _id: id, userId }).lean();
  if (!course) {
    return res.status(404).json({ message: "Course not found." });
  }
  res.json({ course });
}

export async function getCalendarTasks(req, res) {
  const userId = req.user.sub;
  const tasks = await Task.find({ userId }).sort({ eventDate: 1, createdAt: 1 }).lean();
  const byDate = tasks.reduce((accumulator, task) => {
    const key = task.eventDate;
    if (!accumulator[key]) {
      accumulator[key] = [];
    }
    accumulator[key].push(task);
    return accumulator;
  }, {});
  const groups = Object.keys(byDate).map((key) => ({
    dateKey: key,
    dateLabel: toDateLabel(key),
    tasks: byDate[key],
  }));
  const taskDates = Object.keys(byDate);
  res.json({ groups, taskDates });
}

export async function updateTask(req, res) {
  const userId = req.user.sub;
  const { id } = req.params;
  const updated = await Task.findOneAndUpdate(
    { _id: id, userId },
    { checked: !!req.body.checked },
    { returnDocument: "after" }
  ).lean();
  if (!updated) {
    return res.status(404).json({ message: "Task not found" });
  }
  return res.json(updated);
}

export async function createTask(req, res) {
  const userId = req.user.sub;
  const payload = req.body;
  const missing = [];
  if (!payload.eventDate) missing.push("date");
  if (!payload.courseName) missing.push("course");
  if (!payload.taskTitle) missing.push("task name");
  if (!payload.taskType) missing.push("entry type");

  if (missing.length > 0) {
    return res.status(400).json({
      message: `Please fill in: ${missing.join(", ")}.`,
    });
  }

  const created = await Task.create({
    userId,
    eventDate: payload.eventDate,
    courseCode: payload.courseCode || "",
    courseName: payload.courseName,
    taskTitle: payload.taskTitle,
    taskType: payload.taskType,
    points: payload.points,
    dueTime: payload.dueTime,
    time: payload.time,
    checked: false,
    thumbnail: payload.thumbnail || "red",
    taskSubtitle: payload.taskSubtitle || "",
    thumbnailLabel: payload.thumbnailLabel || "",
    dateLabel: toDateLabel(payload.eventDate),
  });
  res.status(201).json(created);
}

export async function getGroups(req, res) {
  const userId = req.user.sub;
  const groups = await Group.find({ userId }).sort({ createdAt: 1 }).lean();
  res.json({ groups });
}

export async function getAccount(req, res) {
  const userId = req.user.sub;
  const user = await User.findById(userId).lean();
  const enrolledCourses = await Course.countDocuments({ userId });
  res.json({
    profile: {
      name: user?.name,
      email: user?.email,
      enrolledCourses,
      unreadMessages: user?.unreadMessages ?? 0,
      accountStatus: user?.accountStatus ?? "Active",
      settings: user?.settings ?? [],
    },
  });
}

export async function updateAccount(req, res) {
  const userId = req.user.sub;
  const { settings } = req.body;
  const user = await User.findByIdAndUpdate(
    userId,
    { settings: Array.isArray(settings) ? settings : [] },
    { returnDocument: "after" }
  ).lean();
  res.json({ settings: user?.settings ?? [] });
}

export async function getHelpTopics(req, res) {
  const topics = await HelpTopic.find({}).sort({ createdAt: 1 }).lean();
  res.json({ topics });
}

export async function updateFocusedCourse(req, res) {
  const userId = req.user.sub;
  const { id } = req.params;
  await Course.updateMany({ userId, focused: true }, { focused: false });
  const course = await Course.findOneAndUpdate(
    { _id: id, userId },
    { focused: true },
    { returnDocument: "after" }
  ).lean();
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }
  return res.json({ course });
}
