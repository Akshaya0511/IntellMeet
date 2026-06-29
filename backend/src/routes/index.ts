import { Router } from "express";

import authRoutes from "./authRoutes";
import meetingRoutes from "./meetingRoutes";
import taskRoutes from "./taskRoutes";

import attendanceRoutes from "./hr/attendanceRoutes";
import employeeRoutes from "./hr/employeeRoutes";
import leaveRoutes from "./hr/leaveRoutes";
import payrollRoutes from "./hr/payrollRoutes";

import projectTaskRoutes from "./project/taskRoutes";


const router = Router();

// Authentication
router.use("/auth", authRoutes);

// Meetings
router.use("/meetings", meetingRoutes);

// General Tasks
router.use("/tasks", taskRoutes);

// HR
router.use("/attendance", attendanceRoutes);
router.use("/employees", employeeRoutes);
router.use("/leave", leaveRoutes);
router.use("/payroll", payrollRoutes);

// Projects
router.use("/projects-tasks", projectTaskRoutes);


export default router;