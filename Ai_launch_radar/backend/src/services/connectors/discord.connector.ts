import { logger } from "../../utils/logger";
import { Connector, RawLaunch } from "./types";
import { env } from "../../config/env";

/**
 * Unlike the other connectors, Discord has no "public firehose" —
 * a bot can only read servers it's been invited into, and each AI
 * company's Discord has its own #announcements channel ID. This is
 * architecturally different (event-driven via gateway websocket, not
 * a poll-on-a-timer fetch), so it's intentionally left as a stub for
 * now rather than faked. When you're ready:
 *   1. Create a bot at https://discord.com/developers/applications
 *   2. Invite it (read-only) to the servers you care about
 *   3. Replace this fetch() with a discord.js Client that listens for
 *      messageCreate events in specific channel IDs and pushes them
 *      through the same ingestion pipeline as the polled connectors.
 * Kept in the Connector list so the scheduler already has a slot for
 * it — flipping it on later is a drop-in, not a rearchitecture.
 */
export const discordConnector: Connector = {
  name: "discord",
  enabled: false,

  async fetch(): Promise<RawLaunch[]> {
    if (!env.discordBotToken) {
      logger.warn("discord", "Skipped — not configured (see connector source comments for setup)");
    }
    return [];
  },
};
