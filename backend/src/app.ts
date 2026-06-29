import cors from "cors";
import path from "path";
import authRoutes from "./routes/authRoutes";
import meetingRoutes from "./routes/meetingRoutes";
import express from "express";
import employeeRoutes from "./routes/hr/employeeRoutes";
import taskRoutes from "./routes/taskRoutes";
import attendanceRoutes from "./routes/hr/attendanceRoutes";
import leaveRoutes from "./routes/hr/leaveRoutes";
import payrollRoutes from "./routes/hr/payrollRoutes";
import payslipRoutes from "./routes/hr/payslipRoutes";
import chartOfAccountsRoutes from "./routes/finance/chartofAccountsRoutes";
import journalEntryRoutes from "./routes/finance/journalEntryRoutes";
import invoiceRoutes from "./routes/finance/invoiceRoutes";
import paymentRoutes from "./routes/finance/paymentRoutes";
import currencyRoutes from "./routes/finance/currencyRoutes";
import { errorHandler } from "./middleware/errorHandler.middleware";
import projectRoutes from "./routes/project/projectRoutes";
import projectTaskRoutes from "./routes/project/taskRoutes";
import budgetRoutes from "./routes/project/budgetRoutes";
import resourceRoutes from "./routes/project/resourceRoutes";

const app = express();

// CORS
app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:5174"],
        credentials: true,
    })
);

// JSON MIDDLEWARE
app.use(express.json());

// STATIC UPLOADS
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Auth routes
app.use("/api/auth", authRoutes);

//meeting
app.use("/api/meetings", meetingRoutes);

//task
app.use("/api/tasks", taskRoutes);

//employee
app.use("/api/employee", employeeRoutes);

//attendance
app.use("/api/attendance", attendanceRoutes);

//leave
app.use("/api/leave", leaveRoutes);

//payroll
app.use("/api/payroll", payrollRoutes);

//payslip
app.use("/api/payslip", payslipRoutes);

//chartofAccounts
app.use("/api/chartofaccounts", chartOfAccountsRoutes);

//journalEntry
app.use("/api/journalentry", journalEntryRoutes);

//invoice
app.use("/api/invoice", invoiceRoutes);

//invoice
app.use("/api/payment", paymentRoutes);

//Currency
app.use("/api/currency", currencyRoutes);

//Projects
app.use("/api/projects", projectRoutes);

//Project Tasks
app.use("/api/project-tasks", projectTaskRoutes);

//Budgets
app.use("/api/budget", budgetRoutes);

//Resources
app.use("/api/resources", resourceRoutes);


// HEALTH CHECK
app.get("/", (req, res) => {
    res.send("Server Running");
});

//ERROR HANDLER
app.use(errorHandler);


export default app;