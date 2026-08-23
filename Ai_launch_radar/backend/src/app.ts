import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import launchRoutes from "./routes/launch.routes";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/errorHandler";
import { requireAuth } from "./middleware/requireAuth";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.clientOrigin }));
  app.use(express.json());
  app.use(morgan(env.nodeEnv === "development" ? "dev" : "combined"));

  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  // /auth/login is the one public API route — everything else needs
  // the token it hands back.
  app.use("/api/auth", authRoutes);
  app.use("/api/launches", requireAuth, launchRoutes);

  // Must be registered last — see middleware/errorHandler.ts
  app.use(errorHandler);

  return app;
}
