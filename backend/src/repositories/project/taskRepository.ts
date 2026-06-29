import Task from "../../models/project/Task";

// Get all tasks
export const getAllTasks = async () => {
  return await Task.find();
};

// Get task by ID
export const getTaskById = async (id: string) => {
  return await Task.findById(id);
};

// Create task
export const createTask = async (data: any) => {
  return await Task.create(data);
};

// Update task
export const updateTask = async (
  id: string,
  data: any
) => {
  return await Task.findByIdAndUpdate(
    id,
    data,
    {
      returnDocument: "after",
    }
  );
};

// Delete task
export const deleteTask = async (id: string) => {
  return await Task.findByIdAndDelete(id);
};

// Get tasks by project
export const getTasksByProject = async (
  projectId: string
) => {
  return await Task.find({
    projectId,
  });
};

// Get tasks assigned to employee
export const getTasksByEmployee = async (
  employeeId: string
) => {
  return await Task.find({
    assignedTo: employeeId,
  });
};

//upload
export const uploadAttachments = async (
  taskId: string,
  attachments: string[]
) => {
  console.log("Task ID:", taskId);

  const task =  await Task.findByIdAndUpdate(
    taskId,
    {
      $push: {
        attachments: {
          $each: attachments,
        },
      },
    },
    { new: true }
  );

  console.log(task);
  
  return task;

};