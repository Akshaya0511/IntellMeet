import dotenv from "dotenv";
dotenv.config();

import http from "http";
import connectDB from "./config/db";
import { initSocket } from "./sockets/socket";
import redisClient from "./config/redis";
import app from "./app";

import express, { NextFunction, Request, Response } from "express";
import path from "path";
import cors from "cors";
import meetingRoutes from "./routes/meetingRoutes";

import authRoutes from "./routes/authRoutes";


// ADD CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5173",
    "http://localhost:5174",
  ],
  credentials: true
}));


// Middleware
app.use(express.json());

// Local uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// meetings
app.use("/api/meetings", meetingRoutes);

// Routes
app.use("/api/auth", authRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  res.status(500).json({ message: "Server error" });
});

// Create HTTP SERVER
const server = http.createServer(app);

// INIT SOCKET 
initSocket(server);

// DB Connection + Redis connection
connectDB()
    .then(async () => {
      console.log("DB connected");

      await redisClient.connect();
      console.log("Redis Connected");
    })
   .catch((err) => console.log("Connection ERROR:", err));


app.get("/", (req: Request, res: Response) => {
  res.send("Server Running 🚀");
});

// START SERVER 
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

