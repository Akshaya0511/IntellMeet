import express from "express";

import {
  register,
  login,
  getProfile,
  refreshAccessToken,
} from "../controllers/authController";

import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/refresh", refreshAccessToken);

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

export default router;