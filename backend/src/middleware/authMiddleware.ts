import { Request, Response, NextFunction  } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";



interface JwtUser extends JwtPayload {
  userid: string;
  role?: string;
}

interface AuthRequest extends Request {
  user?: JwtUser;
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

       const decoded = jwt.verify(
         token,
         process.env.JWT_SECRET as string
      ) as JwtUser;

      req.user = decoded;

      next();
     } catch (error) {
        res.status(401).json({
        message: "Invalid token",
    });
     return;
  }
};

export default protect;

   
