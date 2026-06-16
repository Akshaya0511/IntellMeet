import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";


const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);

// CONNECT TO DATABASE (IMPORTANT)
connectDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Server Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});