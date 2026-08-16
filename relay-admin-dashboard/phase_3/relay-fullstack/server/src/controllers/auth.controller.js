// ─────────────────────────────────────────────────────────────────────────
// Auth controller: register, login, refresh, logout.
//
// Cookie strategy: the refresh token is set as an httpOnly cookie (not
// readable by client JS — mitigates XSS token theft). The access token is
// returned in the JSON body for the client to hold in memory and attach
// as an Authorization header. This is the standard "JWT in memory,
// refresh token in httpOnly cookie" pattern.
// ─────────────────────────────────────────────────────────────────────────

import { v4 as uuid } from "uuid";
import { redis } from "../config/redis.js";
import { keys } from "../config/keys.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signAccessToken, generateRefreshToken } from "../utils/tokens.js";

const REFRESH_TTL_SECONDS = Number(process.env.REFRESH_TOKEN_TTL_SECONDS || 604800); // 7 days

const REFRESH_COOKIE_NAME = "relay_refresh";
const isProd = process.env.NODE_ENV === "production";

/** Shared cookie options so set and clear stay in sync. */
function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: REFRESH_TTL_SECONDS * 1000,
    path: "/api/auth",
  };
}

/** Strips passwordHash before a user object is ever sent to the client. */
function toPublicUser(user) {
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}

/** Issues a fresh access + refresh token pair and sets the refresh cookie. */
async function issueSession(res, user) {
  const accessToken = signAccessToken(user);
  const refreshToken = generateRefreshToken();

  await redis.set(keys.refreshToken(refreshToken), user.id, "EX", REFRESH_TTL_SECONDS);
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions());

  return accessToken;
}

export async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "name, email, and password are all required." });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters." });
  }

  const emailIndexKey = keys.userEmailIndex(email);
  const existingId = await redis.get(emailIndexKey);
  if (existingId) {
    return res.status(409).json({ error: "An account with that email already exists." });
  }

  const id = uuid();
  const passwordHash = await hashPassword(password);
  const user = {
    id,
    name,
    email: email.toLowerCase(),
    passwordHash,
    role: "Developer",
    createdAt: new Date().toISOString(),
  };

  // Write the user hash and the email→id index together. Redis doesn't
  // give us a multi-key transaction as simply as a SQL COMMIT, but a
  // pipeline sends both writes in one round trip, keeping them close
  // together in practice for this simple, single-writer case.
  const pipeline = redis.pipeline();
  pipeline.hset(keys.user(id), user);
  pipeline.set(emailIndexKey, id);
  await pipeline.exec();

  const accessToken = await issueSession(res, user);
  res.status(201).json({ user: toPublicUser(user), accessToken });
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required." });
  }

  const userId = await redis.get(keys.userEmailIndex(email));
  if (!userId) {
    // Same error for "no such user" and "wrong password" below — avoids
    // leaking which emails are registered.
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const user = await redis.hgetall(keys.user(userId));
  if (!user || !user.passwordHash) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const passwordMatches = await comparePassword(password, user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const accessToken = await issueSession(res, user);
  res.json({ user: toPublicUser(user), accessToken });
}

export async function refresh(req, res) {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!refreshToken) {
    return res.status(401).json({ error: "No refresh token provided." });
  }

  const userId = await redis.get(keys.refreshToken(refreshToken));
  if (!userId) {
    return res.status(401).json({ error: "Refresh token is invalid or expired." });
  }

  const user = await redis.hgetall(keys.user(userId));
  if (!user || !user.id) {
    return res.status(401).json({ error: "User no longer exists." });
  }

  // Rotate the refresh token on every use: invalidate the one just spent
  // and issue a new one. This limits how long a stolen refresh token
  // stays useful — replaying an old one after rotation will fail because
  // it's already been deleted from Redis.
  await redis.del(keys.refreshToken(refreshToken));
  const accessToken = await issueSession(res, user);

  res.json({ user: toPublicUser(user), accessToken });
}

export async function logout(req, res) {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
  if (refreshToken) {
    await redis.del(keys.refreshToken(refreshToken));
  }
  res.clearCookie(REFRESH_COOKIE_NAME, { path: "/api/auth" });
  res.status(204).send();
}
