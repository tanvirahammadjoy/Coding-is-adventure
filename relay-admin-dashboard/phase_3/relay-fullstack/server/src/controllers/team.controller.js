// ─────────────────────────────────────────────────────────────────────────
// Team member CRUD, backed by Redis.
//
// Storage shape (see config/keys.js):
//   team:{id}   hash — the member record
//   team:ids    set  — every member id, so we can enumerate all members
//
// All five routes are mounted behind requireAuth in team.routes.js, so
// every handler here can assume req.user is a valid, authenticated caller.
// ─────────────────────────────────────────────────────────────────────────

import { v4 as uuid } from "uuid";
import { redis } from "../config/redis.js";
import { keys } from "../config/keys.js";

const ROLES = new Set(["Owner", "Admin", "Developer", "Viewer"]);

/** Generates a display-only masked API key, e.g. "rly_live_4f9a...c22e". */
function generateMaskedApiKey() {
  const raw = uuid().replace(/-/g, "");
  return `rly_live_${raw.slice(0, 4)}...${raw.slice(-4)}`;
}

export async function listTeam(req, res) {
  const ids = await redis.smembers(keys.teamIds());
  if (ids.length === 0) {
    return res.json({ members: [] });
  }

  // Fetch every member hash in parallel rather than sequentially — with a
  // handful of members this barely matters, but it's the right shape as
  // the team grows.
  const members = await Promise.all(ids.map((id) => redis.hgetall(keys.teamMember(id))));

  // Newest first, so a just-added member appears at the top of the table.
  members.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ members });
}

export async function createTeamMember(req, res) {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ error: "name, email, and role are all required." });
  }
  if (!ROLES.has(role)) {
    return res.status(400).json({ error: `role must be one of: ${[...ROLES].join(", ")}` });
  }

  const id = uuid();
  const member = {
    id,
    name,
    email: email.toLowerCase(),
    role,
    apiKey: generateMaskedApiKey(),
    lastActive: "Just now",
    active: "true", // Redis hashes store strings; parsed back to boolean client-side.
    createdAt: new Date().toISOString(),
  };

  const pipeline = redis.pipeline();
  pipeline.hset(keys.teamMember(id), member);
  pipeline.sadd(keys.teamIds(), id);
  await pipeline.exec();

  res.status(201).json({ member });
}

export async function updateTeamMember(req, res) {
  const { id } = req.params;
  const { name, email, role, active } = req.body;

  const memberKey = keys.teamMember(id);
  const exists = await redis.exists(memberKey);
  if (!exists) {
    return res.status(404).json({ error: "Team member not found." });
  }
  if (role && !ROLES.has(role)) {
    return res.status(400).json({ error: `role must be one of: ${[...ROLES].join(", ")}` });
  }

  // Only patch the fields that were actually sent, so a partial update
  // (e.g. just toggling `active`) doesn't clobber the rest of the record.
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email.toLowerCase();
  if (role !== undefined) updates.role = role;
  if (active !== undefined) updates.active = String(active);

  if (Object.keys(updates).length > 0) {
    await redis.hset(memberKey, updates);
  }

  const member = await redis.hgetall(memberKey);
  res.json({ member });
}

export async function deleteTeamMember(req, res) {
  const { id } = req.params;
  const memberKey = keys.teamMember(id);

  const exists = await redis.exists(memberKey);
  if (!exists) {
    return res.status(404).json({ error: "Team member not found." });
  }

  const pipeline = redis.pipeline();
  pipeline.del(memberKey);
  pipeline.srem(keys.teamIds(), id);
  await pipeline.exec();

  res.status(204).send();
}
