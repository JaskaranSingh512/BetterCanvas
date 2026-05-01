import { Router } from "express";
import { login } from "../controllers/authController.js";
import {
  createTask,
  getAccount,
  getCalendarTasks,
  getCourseById,
  getCourses,
  getDashboard,
  getGroups,
  getHelpTopics,
  updateFocusedCourse,
  updateAccount,
  updateTask,
} from "../controllers/dataController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

router.post("/auth/login", login);

router.get("/dashboard", requireAuth, getDashboard);
router.get("/courses", requireAuth, getCourses);
router.get("/courses/:id", requireAuth, getCourseById);
router.get("/calendar/tasks", requireAuth, getCalendarTasks);
router.post("/calendar/tasks", requireAuth, createTask);
router.patch("/calendar/tasks/:id", requireAuth, updateTask);
router.patch("/courses/:id/focused", requireAuth, updateFocusedCourse);
router.get("/groups", requireAuth, getGroups);
router.get("/account", requireAuth, getAccount);
router.patch("/account", requireAuth, updateAccount);
router.get("/help/topics", getHelpTopics);

export { router };
