# Relay — Infrastructure Admin Dashboard

A full-stack admin dashboard prototype: a React client and an Express +
Redis API server, with real authentication, protected routes, a user
profile, and live CRUD.

```bash
relay-fullstack/
├── client/     React + TypeScript + Tailwind + shadcn/ui (Vite)
├── server/     Express + Redis API (register/login/refresh, team CRUD)
└── docker-compose.yml   Redis, for local development
```

## What's in here

- **Auth** — register, login, logout, and silent session refresh.
  Access tokens are short-lived JWTs held in memory on the client;
  refresh tokens are random opaque strings stored in Redis (not JWTs),
  set as an httpOnly cookie, and rotated on every use.
- **Protected routes** — `/`, `/team`, `/profile`, and `/settings` all
  require a session; visiting them signed out redirects to `/login` and
  sends you back after you sign in.
- **User profile** — view your account and edit your display name.
- **Team CRUD** — the Team & Keys page is fully live: invite, edit,
  delete, and toggle-active all hit real protected API endpoints backed
  by Redis.
- **Two themes** — "Relay" (dark, technical) and "Aurora" (light,
  editorial serif/sans pairing), switchable from the topbar and
  persisted to `localStorage`.
- **Responsive layout** — the sidebar becomes a slide-in drawer below the
  `lg` breakpoint; tables scroll horizontally; grids collapse to a single
  column on small screens.

The Overview page's traffic/queue data is still simulated (there's no
real infrastructure behind it to monitor) — everything involving actual
accounts and team members is live against the API.

## Prerequisites

- Node.js 20+
- pnpm (`corepack enable` will provide it) for the client; npm for the
  server
- Redis — either via Docker, or installed locally

## 1. Start Redis

```bash
docker compose up -d redis
```

Or, if you have Redis installed locally, just make sure it's running on
port 6379 (or update `REDIS_URL` in `server/.env` to match).

## 2. Start the API server

```bash
cd server
cp .env.example .env    # defaults work as-is for local dev
npm install
npm run dev              # listens on http://localhost:4000
```

## 3. Start the client

```bash
cd client
cp .env.example .env.local   # defaults work as-is for local dev
pnpm install
pnpm dev                      # opens http://localhost:5173
```

Open `http://localhost:5173`, register an account, and you're in.

## Notes on the auth design

- The **access token** never touches `localStorage` or `sessionStorage`
  — it lives only in React state (`AuthContext`), which keeps it out of
  reach of an XSS attack reading persistent storage. It's lost on a full
  page reload by design; `AuthContext` silently calls `/api/auth/refresh`
  on mount to get a new one from the refresh cookie.
- The **refresh token** is the opposite trade-off: long-lived, so it
  can't live in memory, but it's httpOnly (invisible to any client-side
  JS at all, XSS included) and stored server-side in Redis, which means
  it can be revoked instantly — logging out just deletes the Redis key.
- Every refresh **rotates** the token: the old one is deleted from Redis
  and a new one issued, so a leaked-but-unused refresh token has a
  shrinking window of usefulness.

## Redis data model

See `server/src/config/keys.js` for the full key schema. In short:

| Key                  | Type   | Holds                             |
| -------------------- | ------ | --------------------------------- |
| `user:{id}`          | hash   | user record (incl. password hash) |
| `user:email:{email}` | string | id, for email → user lookups      |
| `refresh:{token}`    | string | user id, TTL'd                    |
| `team:{id}`          | hash   | team member record                |
| `team:ids`           | set    | every team member id              |

## Building for production

```bash
cd client && pnpm build     # outputs client/dist
cd server && npm start       # or deploy behind a process manager (pm2, etc.)
```

You'll want a real `JWT_ACCESS_SECRET`, a managed Redis instance, and to
serve the client build behind a proper web server / CDN — none of that
is set up here since this is a local-development-focused prototype.
