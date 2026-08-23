import "dotenv/config";

/**
 * Single source of truth for config. Fail fast at boot if something
 * critical (DB) is missing, but let optional connector keys (Twitter,
 * Discord) be blank — the ingestion service checks those individually
 * and just skips that connector rather than crashing the whole agent.
 */
function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`[env] Missing required env var: ${key}`);
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 5000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
  mongoUri: required("MONGO_URI"),
  pollCron: process.env.POLL_CRON ?? "*/10 * * * *",

  productHuntToken: process.env.PRODUCTHUNT_TOKEN ?? "",
  redditUserAgent: process.env.REDDIT_USER_AGENT ?? "ai-launch-radar/1.0",
  twitterBearerToken: process.env.TWITTER_BEARER_TOKEN ?? "",
  discordBotToken: process.env.DISCORD_BOT_TOKEN ?? "",

  // Auth — single-operator gate, not a multi-user system. See
  // scripts/hash-password.ts for generating adminPasswordHash.
  adminPasswordHash: required("ADMIN_PASSWORD_HASH"),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
};
