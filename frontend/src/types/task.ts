export interface Task {
  _id: string;
  title: string;
  description?: string;

  projectId: string;

  assignedTo: string;
  createdBy?: string;

  status: "Todo" | "In Progress" | "Done";

  priority: "Low" | "Medium" | "High";

  dueDate?: string;

  estimatedHours?: number;
  actualhours?: number;

  attachments?: string[];
  lables?: string[];
  comments?: string[];

  createdAt?: string;
  updatedAt?: string;
}