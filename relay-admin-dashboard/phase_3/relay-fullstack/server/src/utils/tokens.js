// ─────────────────────────────────────────────────────────────────────────
// Token helpers.
//
// Two different token strategies are used on purpose:
//
// 1. Access token — a signed JWT, short-lived (15m default). The server
//    never has to look it up anywhere; verifying the signature is enough.
//    This is what makes JWTs fast for authenticating most requests.
//
// 2. Refresh token — a random opaque string (NOT a JWT), long-lived
//    (7d default), stored in Redis mapped to the user id with a matching
//    TTL. Because it's just a Redis key, it can be revoked instantly
//    (delete the key) — something a stateless JWT can't do without extra
//    infrastructure (a blocklist). This is why refresh tokens live in
//    Redis: revocability matters more for a long-lived credential.
// ─────────────────────────────────────────────────────────────────────────

import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "dev-only-change-me-access-secret";
const ACCESS_TTL = process.env.ACCESS_TOKEN_TTL || "15m";

/** Signs a short-lived access token carrying the user's id, email, and role. */
export function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    ACCESS_SECRET,
    { expiresIn: ACCESS_TTL }
  );
}

/** Verifies an access token, throwing if it's invalid or expired. */
export function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

/** Generates a cryptographically random opaque refresh token string. */
export function generateRefreshToken() {
  return randomBytes(48).toString("hex");
}
