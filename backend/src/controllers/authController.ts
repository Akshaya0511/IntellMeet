import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({
        message: "User already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// LOGIN
export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user: any = await User.findOne({ email });

    if (!user) {
      res.status(400).json({
        message: "Invalid credentials",
      });
      return;
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      res.status(400).json({
        message: "Invalid credentials",
      });
      return;
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET PROFILE
export const getProfile = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password");

    res.json(user);
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};