import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { logger } from "../utils/logger";

/**
 * Placed last in the middleware chain (see app.ts). Express recognizes
 * this as an error handler because it takes 4 params. Every route in
 * this app should call next(err) instead of trying to format its own
 * error response — keeps response shape consistent across the API.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }

  logger.error("errorHandler", "Unhandled error", err);
  res.status(500).json({ success: false, message: "Internal server error" });
}
