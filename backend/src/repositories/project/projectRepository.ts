import Project from "../../models/project/Project";

// Get all projects
export const getAllProjects = async (
  page: number,
  limit: number
) => {
  const skip = (page -1) * limit;

  const projects = await Project.find({
    isDeleted: false,
  })

  .skip(skip)
  .limit(limit);

  const total = await Project.countDocuments({
    isDeleted: false,
  });

  return {
    projects,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

// Get project by ID
export const getProjectById = async (id: string) => {
  return await Project.findById(id);
};

// Create project
export const createProject = async (data: any) => {
  return await Project.create(data);
};

// Update project
export const updateProject = async (
  id: string,
  data: any
) => {
  return await Project.findByIdAndUpdate(
    id,
    data,
    { new: true }
  );
};

// Delete project
export const deleteProject = async (
  id: string
) => {
  return await Project.findByIdAndDelete(id);
};