import { Request, Response } from "express";
import * as projectService from "../../services/project/projectService";
import Project from "../../models/project/Project";
import { isValidObjectId } from "../../utils/validators";
import { asyncHandler } from "../../utils/asyncHandler";




// Get all projects
export const getAllProjects = async (
  req: Request,
  res: Response
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const data = await projectService.getAllProjects(
      page,
      limit
    );

    res.status(200).json({
      success: true,
      message: "Project fetched successfully",
      ...data,
    });

  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Get project by ID
export const getProjectById = async (
  req: Request,
  res: Response
) => {
  try {
    const project = await projectService.getProjectById(req.params.id as string);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json(project);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


// Create project
export const createProject = async (
  req: Request,
  res: Response
) => {
  try {
    const project = await projectService.createProject(req.body);
    res.status(201).json(project);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update project
export const updateProject = async (
  req: Request,
  res: Response
) => {
  try {
    const project = await projectService.updateProject(
      req.params.id as string,
      req.body
    );

    res.status(200).json(project);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete project
export const deleteProject = 
async (req: Request, res: Response) => {
    try {
         const { id } = req.params as { id: string };

        //Validate ObjectId
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid project ID",
            });
        }
        
        // find project
        const project = await Project.findById(id);

        
  if (!project || project.isDeleted) {
    return res.status(404).json({ 
        message: "Project not found" 
    });
  }

        // soft delete
           project.isDeleted = true;
            await project.save();

            return res.json({ 
              message: "Project deleted successfully (soft delete)" 
            });
          } catch (error: any) {
            return res.status(500).json({
                message: error.message,
            });
          }
    };
 