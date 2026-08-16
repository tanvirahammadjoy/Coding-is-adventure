// ─────────────────────────────────────────────────────────────────────────
// /api/auth/* routes — all public (no requireAuth), since their entire
// purpose is establishing or ending a session.
// ─────────────────────────────────────────────────────────────────────────

import { Router } from "express";
import { register, login, refresh, logout } from "../controllers/auth.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authRouter = Router();

authRouter.post("/register", asyncHandler(register));
authRouter.post("/login", asyncHandler(login));
authRouter.post("/refresh", asyncHandler(refresh));
authRouter.post("/logout", asyncHandler(logout));
