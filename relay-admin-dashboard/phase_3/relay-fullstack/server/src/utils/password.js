// ─────────────────────────────────────────────────────────────────────────
// Thin wrapper around bcryptjs so callers never import bcrypt directly —
// keeps the hashing algorithm/cost swappable from one place.
// ─────────────────────────────────────────────────────────────────────────

import bcrypt from "bcryptjs";

// 10 salt rounds is bcrypt's commonly recommended default: strong enough
// for production, fast enough not to make login noticeably slow.
const SALT_ROUNDS = 10;

export function hashPassword(plainTextPassword) {
  return bcrypt.hash(plainTextPassword, SALT_ROUNDS);
}

export function comparePassword(plainTextPassword, passwordHash) {
  return bcrypt.compare(plainTextPassword, passwordHash);
}
