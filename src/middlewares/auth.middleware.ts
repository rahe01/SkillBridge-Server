import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";


interface JwtPayload {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Type-safe verification
    const decoded = jwt.verify(token as string, config.jwtSecret!) as unknown as JwtPayload;

    req.user = decoded; // attach user to request
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
