import { Router } from "express";
import * as projectController from "../../controllers/project/projectcontroller";
import protect from "../../middleware/authMiddleware";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";
import { createProjectSchema } from "../../validators/project.validator";

const router = Router();

// Get all projects
router.get("/", projectController.getAllProjects);

// Get project by ID
router.get("/:id", projectController.getProjectById);

// Create project
router.post("/", 
    protect,
    authorize("Admin", "Manager"),
    validate(createProjectSchema),
    projectController.createProject
);

// Update project
router.put("/:id", projectController.updateProject);

// Delete project
router.delete(
    "/:id", 
    protect,
    authorize("Admin"),
    projectController.deleteProject
);

export default router;