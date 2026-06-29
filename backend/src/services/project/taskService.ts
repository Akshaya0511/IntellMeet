import * as taskRepository from "../../repositories/project/taskRepository";

// Get all tasks
export const getAllTasks = async () => {
  return await taskRepository.getAllTasks();
};

// Get task by ID
export const getTaskById = async (id: string) => {
  return await taskRepository.getTaskById(id);
};

// Create task
export const createTask = async (data: any) => {
  return await taskRepository.createTask(data);
};

// Update task
export const updateTask = async (
  id: string,
  data: any
) => {
  return await taskRepository.updateTask(
    id,
    data,
);
};

// Delete task
export const deleteTask = async (id: string) => {
  return await taskRepository.deleteTask(id);
};

// Get tasks by project
export const getTasksByProject = async (
  projectId: string
) => {
  return await taskRepository.getTasksByProject(
    projectId
);
};

// Get tasks assigned to employee
export const getTasksByEmployee = async (
  employeeId: string
) => {
  return await taskRepository.getTasksByEmployee(
     employeeId
);
};

//upload
export const uploadAttachments = async (
  taskId: string,
  attachments: string[]
) => {
  return await taskRepository.uploadAttachments(
    taskId,
    attachments
    
  );

};