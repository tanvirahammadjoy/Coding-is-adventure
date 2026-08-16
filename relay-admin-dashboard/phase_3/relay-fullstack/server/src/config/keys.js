// ─────────────────────────────────────────────────────────────────────────
// Redis key naming conventions, defined in one place so every module reads
// and writes the same shapes. Redis has no schema of its own, so this file
// is effectively our schema.
//
// Data model:
//   user:{id}            hash   — { id, name, email, passwordHash, role, createdAt }
//   user:email:{email}   string — user id, used as an email → id index (emails are unique)
//   refresh:{token}      string — user id, TTL'd; existence = a valid, unexpired refresh token
//   team:{id}            hash   — { id, name, email, role, apiKey, lastActive, active, createdAt }
//   team:ids             set    — every team member id, so we can list/enumerate them
// ─────────────────────────────────────────────────────────────────────────

export const keys = {
  user: (id) => `user:${id}`,
  userEmailIndex: (email) => `user:email:${email.toLowerCase()}`,
  refreshToken: (token) => `refresh:${token}`,
  teamMember: (id) => `team:${id}`,
  teamIds: () => "team:ids",
};
