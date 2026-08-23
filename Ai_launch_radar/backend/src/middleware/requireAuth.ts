import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { AppError } from "../utils/AppError";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    next(new AppError("Missing authorization token", 401));
    return;
  }

  try {
    authService.verifyToken(token);
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
}
