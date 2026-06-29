import express from "express";
import upload from "../middleware/uploadMiddleware";
import protect from "../middleware/authMiddleware";
import { authLimiter } from "../middleware/rateLimit.middleware";

import {
  register,
  login,
  getProfile,
  refreshAccessToken,
  refreshTokenController,
  uploadAvatar,

} from "../controllers/authController";

import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", authLimiter, register);

router.post("/login", authLimiter, login);

router.get("/profile", protect, getProfile);

router.post("/refresh", refreshAccessToken);

router.post("/refresh", refreshTokenController);

router.post(
  "/avatar",
  authMiddleware,
  upload.single("avatar"),
  uploadAvatar
   );

router.get(
  "/profile",
  authMiddleware,
  getProfile,
);

export default router;