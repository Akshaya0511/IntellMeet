import * as projectRepository from "../../repositories/project/projectRepository";
import Project from "../../models/project/Project";

// Get all projects Pagination
export const getAllProjects = async (
  page: number,
  limit: number
) => {
   const skip = (page - 1) * limit;

   const filter = { isDeleted: false };

   const projects = await Project.find(filter)
     .skip(skip)
     .limit(limit);

    const total = await Project.countDocuments(filter);

  return {
    projects,
    total,
    page,
    limit,
  };
};

// Get project by ID
export const getProjectById = async (
  id: string
) => {
  return await Project.findOne({
    _id: id,
    isDeleted: false,
  });
};

// Create project
export const createProject = async (
  data: any
) => {
  return await projectRepository.createProject(data);
};

// Update project
export const updateProject = async (
    id: string,
    data: any
) => {
    return await Project.findOneAndUpdate(
        {
            _id: id,
            isDeleted: false,
        },
        data,
        { new: true }
    );
};


// Delete project
export const deleteProject = async (
  id: string
) => {
  return await projectRepository.deleteProject(id);
};