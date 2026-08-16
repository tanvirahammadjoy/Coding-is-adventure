// ─────────────────────────────────────────────────────────────────────────
// /api/team — protected CRUD routes for team members.
// ─────────────────────────────────────────────────────────────────────────

import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  listTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "../controllers/team.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const teamRouter = Router();

teamRouter.use(requireAuth);
teamRouter.get("/", asyncHandler(listTeam));
teamRouter.post("/", asyncHandler(createTeamMember));
teamRouter.put("/:id", asyncHandler(updateTeamMember));
teamRouter.delete("/:id", asyncHandler(deleteTeamMember));
