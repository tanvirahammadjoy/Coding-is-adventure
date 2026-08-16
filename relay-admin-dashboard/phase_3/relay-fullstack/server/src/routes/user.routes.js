// ─────────────────────────────────────────────────────────────────────────
// /api/users/me — protected profile routes.
// ─────────────────────────────────────────────────────────────────────────

import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getMe, updateMe } from "../controllers/user.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const userRouter = Router();

userRouter.use(requireAuth);
userRouter.get("/me", asyncHandler(getMe));
userRouter.patch("/me", asyncHandler(updateMe));
