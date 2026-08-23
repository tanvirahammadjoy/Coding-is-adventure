import cron from "node-cron";
import { Server as SocketServer } from "socket.io";
import { env } from "../config/env";
import { runIngestionCycle } from "./ingestion.service";
import { logger } from "../utils/logger";

export function startScheduler(io: SocketServer): void {
  if (!cron.validate(env.pollCron)) {
    throw new Error(`[scheduler] Invalid POLL_CRON expression: "${env.pollCron}"`);
  }

  logger.info("scheduler", `Polling on schedule: ${env.pollCron}`);

  // Run once immediately on boot so the feed isn't empty while waiting
  // for the first cron tick, then follow the schedule after that.
  runIngestionCycle(io).catch((err) => logger.error("scheduler", "Initial cycle failed", err));

  cron.schedule(env.pollCron, () => {
    runIngestionCycle(io).catch((err) => logger.error("scheduler", "Scheduled cycle failed", err));
  });
}
