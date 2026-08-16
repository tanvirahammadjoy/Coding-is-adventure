// ─────────────────────────────────────────────────────────────────────────
// Current-user profile: read and update. Both routes are protected —
// `req.user.sub` (the JWT subject claim) identifies whose profile to act
// on, so there's no id param to trust from the client.
// ─────────────────────────────────────────────────────────────────────────

import { redis } from "../config/redis.js";
import { keys } from "../config/keys.js";

function toPublicUser(user) {
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}

export async function getMe(req, res) {
  const user = await redis.hgetall(keys.user(req.user.sub));
  if (!user || !user.id) {
    return res.status(404).json({ error: "User not found." });
  }
  res.json({ user: toPublicUser(user) });
}

export async function updateMe(req, res) {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "name is required." });
  }

  const userKey = keys.user(req.user.sub);
  const exists = await redis.exists(userKey);
  if (!exists) {
    return res.status(404).json({ error: "User not found." });
  }

  await redis.hset(userKey, { name: name.trim() });
  const user = await redis.hgetall(userKey);
  res.json({ user: toPublicUser(user) });
}
