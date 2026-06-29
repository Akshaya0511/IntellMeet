import { Router } from "express";
import * as taskController from "../../controllers/project/taskController";
import upload from "../../middleware/upload";


const router = Router();


// Get all tasks
router.get("/", taskController.getAllTasks);

// Get tasks by project
router.get("/project/:projectId", taskController.getTasksByProject);

// Get tasks by employee
router.get("/employee/:employeeId", taskController.getTasksByEmployee);

// Get task by ID
router.get("/:id", taskController.getTaskById);

// Create task
router.post("/", taskController.createTask);

// Update task
router.put("/:id", taskController.updateTask);

// Delete task
router.delete("/:id", taskController.deleteTask);

//upload attachments
router.post("/:id/upload", upload.array("attachments"), taskController.uploadAttachments);

export default router;