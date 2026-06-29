import { Request, Response } from "express";
import * as taskService from "../../services/project/taskService";

// Get all tasks
export const getAllTasks = async (
  req: Request,
  res: Response
) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get task by ID
export const getTaskById = async (
  req: Request,
  res: Response
) => {
  try {
    const task = await taskService.getTaskById(req.params.id as string);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task fetched successfully",
      task,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create task
export const createTask = async (
  req: Request,
  res: Response
) => {
  try {
    const task = await taskService.createTask(req.body);

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error: any) {
    console.log("CREATE TASK ERROR:", error);
    
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update task
export const updateTask = async (
  req: Request,
  res: Response
) => {
  try {
    const task = await taskService.updateTask(
      req.params.id as string,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete task
export const deleteTask = async (
  req: Request,
  res: Response
) => {
  try {
    await taskService.deleteTask(req.params.id as string);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get tasks by project
export const getTasksByProject = async (
  req: Request,
  res: Response
) => {
  try {
    const tasks = await taskService.getTasksByProject(
      req.params.projectId as string
    );

    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get tasks assigned to an employee
export const getTasksByEmployee = async (
  req: Request,
  res: Response
) => {
  try {
    const tasks = await taskService.getTasksByEmployee(
      req.params.employeeId as string
    );

    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//upload attachments
export const uploadAttachments = async (
  req: Request,
  res: Response
) => {
  try {
    const taskId = req.params.id as string;

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const filePaths = files.map
      (file => `/uploads/${file.filename}`);

     const task = await taskService.uploadAttachments(
      taskId,
      filePaths
     );

     return res.status(200).json({
      success: true,
      message: 'Attachments uploaded successfully',
      task,
  });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

};