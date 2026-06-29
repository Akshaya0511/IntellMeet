import { api } from "./api";
import type { Task } from "../types/task";

// Get all tasks
export const getTasks = async () => {
  const response = await api.get("/project-tasks");
  return response.data.tasks;
};

// Create task
export const createTask = async (
  task: Partial<Task>
) => {
  const response = await api.post("/project-tasks", task);
  return response.data.task;
};

// Update task
export const updateTask = async (
  id: string,
  task: Partial<Task>
) => {
  const response = await api.put(`/project-tasks/${id}`, task);
  return response.data.task;
};

// Delete task
export const deleteTask = async (id: string) => {
    const response = await api.delete(`/project-tasks/${id}`);
    return response.data;
};

//get all employees
export const getEmployees = async () => {
    const response = await api.get("/employee");
    return response.data.data;
};

//upload task attachments
export const uploadAttachments = async (
  taskId: string,
  files: File[]
) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("attachments", file);
  });

  const response = await api.post(
    `/project-tasks/${taskId}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.task;
};