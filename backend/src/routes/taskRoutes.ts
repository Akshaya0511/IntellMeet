import express from "express";
import { createTask, getTasks, updateTask } from "../controllers/taskController";

const router = express.Router();

router.post("/", createTask);
router.get("/", getTasks);
router.put("/:id", updateTask);


export default router;