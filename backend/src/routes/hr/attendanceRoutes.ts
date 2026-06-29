import express from "express";

import {
  createAttendance,
  getAttendance,
  updateAttendance,
  deleteAttendance,
  checkOutAttendance,
} from "../../controllers/hr/attendanceController";

const router = express.Router();

router.post("/", createAttendance);
router.get("/", getAttendance);
router.put("/:id", updateAttendance);
router.delete("/:id", deleteAttendance);
router.put("/:id/checkout/", checkOutAttendance);

export default router;