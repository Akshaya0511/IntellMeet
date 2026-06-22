import cors from "cors";
import path from "path";
import authRoutes from "./routes/authRoutes";
import meetingRoutes from "./routes/meetingRoutes";
import express, { NextFunction, Request, Response } from "express";

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

// routes
app.use("/api/auth", authRoutes);
app.use("/api/meetings", meetingRoutes);

// HEALTH CHECK
app.get("/", (req, res) => {
    res.send("Server Running");
});

//ERROR HANDLER
app.use((err: any, req: any, res: any, next: any) => {
    console.log(err);
    res.status(500).json({ message: "Server error"});
});

export default app;