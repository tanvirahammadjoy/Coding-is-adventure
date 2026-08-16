// ─────────────────────────────────────────────────────────────────────────
// requireAuth — protects a route by requiring a valid `Authorization:
// Bearer <access token>` header. On success, attaches the decoded token
// payload to `req.user` so downstream handlers know who's calling.
//
// This only checks the JWT's signature/expiry — it does NOT hit Redis, by
// design, so protected routes stay fast. Revocation (logout) is handled
// separately by deleting the refresh token; a still-valid access token
// simply expires naturally within ACCESS_TOKEN_TTL of a logout.
// ─────────────────────────────────────────────────────────────────────────

import { verifyAccessToken } from "../utils/tokens.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or malformed Authorization header." });
  }

  const token = header.slice("Bearer ".length);

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch (err) {
    // Covers both an invalid signature and a naturally expired token —
    // the client's response to either is the same: refresh and retry.
    return res.status(401).json({ error: "Invalid or expired access token." });
  }
}
