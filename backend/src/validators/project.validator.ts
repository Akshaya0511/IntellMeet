import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),

  description: z.string().optional(),

  startDate: z.string().datetime(),

  endDate: z.string().datetime(),

  manager: z.string().min(2, "Manager is required"),

  status: z.enum([
    "Planning",
    "In Progress",
    "Completed",
    "On Hold",
  ]).optional(),
});