import { Request, Response, NextFunction, RequestHandler } from "express";

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authorize =
  (...roles: string[]): RequestHandler =>
  (req, res, next) => {
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    if (!roles.includes(authReq.user.role)) {
      res.status(403).json({
        message: "Forbidden",
      });
      return;
    }

    next();
  };