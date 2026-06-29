import express from "express";
import {
  createMeeting,
  updateMeeting,
  getMeetings,
  getMeetingByCode,
  deleteMeeting,
  generateSummary,
} from "../controllers/meetingController";

import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

// Protected Routes
router.post("/create", authMiddleware, createMeeting);
router.get("/", authMiddleware, getMeetings);
router.get("/join/:code", authMiddleware, getMeetingByCode);
router.post("/summary", authMiddleware, generateSummary);
router.delete("/:id", authMiddleware, deleteMeeting);
router.put("/:id", authMiddleware, updateMeeting);
export default router;