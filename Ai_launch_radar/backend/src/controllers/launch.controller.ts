import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { launchRepository } from "../repositories/launch.repository";
import { AppError } from "../utils/AppError";

// Zod schemas validate query params before they ever touch the repository —
// matches the pattern from your earlier TS/Express scaffold.
const listQuerySchema = z.object({
  source: z
    .enum(["producthunt", "github", "hackernews", "reddit", "rss", "twitter", "discord"])
    .optional(),
  category: z
    .enum(["llm", "agent", "image_video_gen", "dev_tool", "voice_audio", "data_rag", "other"])
    .optional(),
  search: z.string().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const launchController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = listQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        throw new AppError(parsed.error.issues[0]?.message ?? "Invalid query params", 400);
      }

      const data = await launchRepository.list({ ...parsed.data, isAiRelevant: true });
      res.json({ success: true, ...data });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const launch = await launchRepository.findById(req.params.id);
      if (!launch) throw new AppError("Launch not found", 404);
      res.json({ success: true, data: launch });
    } catch (err) {
      next(err);
    }
  },
};
