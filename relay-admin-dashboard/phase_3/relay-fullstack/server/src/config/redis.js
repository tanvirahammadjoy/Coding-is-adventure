// ─────────────────────────────────────────────────────────────────────────
// Redis connection, shared by every module that needs it.
//
// A single ioredis client instance is created here and imported wherever
// needed, rather than each module opening its own connection.
// ─────────────────────────────────────────────────────────────────────────

import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const redis = new Redis(redisUrl, {
  // Fail fast in dev rather than retrying forever if Redis isn't up yet —
  // makes connection problems obvious instead of hanging requests.
  maxRetriesPerRequest: 3,
});

redis.on("connect", () => {
  console.log(`[redis] connected → ${redisUrl}`);
});

redis.on("error", (err) => {
  console.error("[redis] connection error:", err.message);
});
