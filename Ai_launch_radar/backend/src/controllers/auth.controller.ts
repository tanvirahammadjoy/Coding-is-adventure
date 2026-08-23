import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { authService } from "../services/auth.service";
import { AppError } from "../utils/AppError";

const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(
          parsed.error.issues[0]?.message ?? "Invalid request",
          400,
        );
      }

      const valid = await authService.verifyPassword(parsed.data.password);
      if (!valid) {
        // Same message either way — don't hint whether a password
        // attempt was "close". There's only one account, so anything
        // more specific just helps someone brute-forcing it.
        throw new AppError("Invalid password", 401);
      }

      const token = authService.signToken();
      res.json({ success: true, token });
    } catch (err) {
      next(err);
    }
  },
};
