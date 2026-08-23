# AI Launch Radar

An agent that watches multiple sources — Product Hunt, GitHub Trending,
Hacker News, Reddit, AI-company blogs (RSS) — and surfaces new AI tool
launches on a live dashboard the moment they're detected. Twitter/X and
Discord connectors are wired but disabled by default (see below).

## Architecture

```bash
backend/   Express + TypeScript API, Mongoose, Socket.io, node-cron scheduler
frontend/  React + TypeScript + Tailwind dashboard, live via Socket.io
```

Backend follows a layered Controller → Service → Repository pattern.
Each data source is a self-contained "connector" implementing the same
interface (`src/services/connectors/types.ts`) — adding a new source
means writing one file and registering it in `connectors/index.ts`;
nothing else in the app needs to change.

## Local setup (no Docker)

**Backend**

```bash
cd backend
cp .env.example .env
# generate a password hash and paste it into ADMIN_PASSWORD_HASH:
npx ts-node scripts/hash-password.ts "your-password"
# fill in JWT_SECRET with any long random string, e.g. `openssl rand -hex 32`
# fill in MONGO_URI (local Mongo or a free Atlas cluster)
npm install
npm run dev
```

**Frontend**

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open <http://localhost:5173> and log in with the password you hashed above.

## Running with Docker

```bash
cd backend && cp .env.example .env   # fill in ADMIN_PASSWORD_HASH and JWT_SECRET
cd ..
docker compose up --build
```

This starts Mongo, the backend API, and the frontend (served via nginx)
together. Dashboard: <http://localhost:5173>

## Enabling optional sources

| Source                                          | Status by default      | To enable                                                                                      |
| ----------------------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------- |
| GitHub Trending, Hacker News, Reddit, RSS blogs | **On** — no key needed | —                                                                                              |
| Product Hunt                                    | Off                    | Add a free dev token to `PRODUCTHUNT_TOKEN`                                                    |
| Twitter/X                                       | Off                    | Requires a **paid** X API tier (search isn't in the free tier) — add `TWITTER_BEARER_TOKEN`    |
| Discord                                         | Off (stub)             | Needs a bot invited per-server — see comments in `discord.connector.ts` for the follow-up work |

## Auth

Single-operator gate — one password, no user accounts. The password is
never stored in plaintext, only a bcrypt hash in `.env`. Tokens expire
after `JWT_EXPIRES_IN` (default 7 days).

## Notes on the AI-relevance classifier & categorizer

Both are keyword-weighted heuristics (`classifier.service.ts`,
`categorizer.service.ts`), not an LLM call — deliberate, to keep the
agent cheap to run continuously across 5+ sources. If you find it's
too strict or too loose, those two files are the only place to tune.
