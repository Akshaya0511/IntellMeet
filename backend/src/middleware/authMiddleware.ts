import { Request, Response, NextFunction, ErrorRequestHandler  } from "express";
import jwt, { Jwt, JwtPayload } from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "No token provided",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    console.log("AUTH HEADER:", authHeader);
    console.log("TOKEN RECEIVED:", token);
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.user = decoded;

    next();
  } catch (error) {
    console.log("JWT ERROR:", error);
    res.status(401).json({
      message: "Invalid token",
    });
  }
};

export default protect;