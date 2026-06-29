import express from "express";

import {
  createLeave,
  getLeaves,
  updateLeave,
  deleteLeave,
} from "../../controllers/hr/leaveController";

const router = express.Router();

router.post("/", createLeave);

router.get("/", getLeaves);

router.put("/:id", updateLeave);

router.delete("/:id", deleteLeave);


export default router;