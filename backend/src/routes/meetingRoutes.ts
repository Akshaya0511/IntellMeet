import express from "express";
import {
  createMeeting,
  updateMeeting,
  getMeetings,
  getMeetingByCode,
  deleteMeeting,
  generateSummary,
  getMeetingSummary,
  getDashboardStats,
  downloadMeetingPDF,

} from "../controllers/meetingController";

import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

// Protected Routes
router.post("/create", authMiddleware, createMeeting);
router.get("/", authMiddleware, getMeetings);
router.get("/join/:code", authMiddleware, getMeetingByCode);
router.post("/summary", authMiddleware, generateSummary);
router.get("/summary/:id", authMiddleware, getMeetingSummary);
router.delete("/:id", authMiddleware, deleteMeeting);
router.put("/:id", authMiddleware, updateMeeting);
router.get("/dashboard/stats", authMiddleware, getDashboardStats);
router.get("/pdf/:id", downloadMeetingPDF);
export default router;
