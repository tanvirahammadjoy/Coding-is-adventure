# my-app

Full-stack starter: **React + TypeScript** client, **Express + TypeScript + MongoDB + Passport JWT** server.

## Structure

```
my-app/
├── client/    React (Vite) + TypeScript frontend
├── server/    Express + TypeScript + Mongoose backend
└── package.json   root scripts to run both together
```

## What's already wired up

- Register / login / logout with JWT access + refresh tokens
- Password hashing (bcrypt), request validation (zod), centralized error handling
- Passport JWT strategy protecting API routes, role-based `authorize()` guard
- Layered backend: routes → controllers → services → repositories → models
- React auth context + hooks, protected/public-only route wrappers, axios client with automatic token refresh on 401
- A working Dashboard page that reads the logged-in user's profile from the API

## Getting started

### 1. Prerequisites

- Node.js 18+
- A running MongoDB instance (local or Atlas)

### 2. Install dependencies

```bash
npm run install:all
```

### 3. Configure environment variables

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Edit `server/.env` and set `MONGO_URI`, `JWT_SECRET`, and `JWT_REFRESH_SECRET` (use long random strings for the secrets).

### 4. Run in development

From the root:

```bash
npm run dev
```

This runs the client (http://localhost:5173) and server (http://localhost:5000) in parallel.

Or run them separately:

```bash
npm run dev:server
npm run dev:client
```

### 5. Try it

1. Open http://localhost:5173
2. Click **Sign up**, create an account
3. You'll be redirected to **Dashboard**, which pulls your profile from `GET /api/v1/users/me`

## API overview

| Method | Route                  | Auth        | Description             |
|--------|-------------------------|-------------|--------------------------|
| POST   | `/api/v1/auth/register` | Public      | Create an account        |
| POST   | `/api/v1/auth/login`    | Public      | Log in                   |
| POST   | `/api/v1/auth/refresh`  | Public      | Exchange refresh token   |
| POST   | `/api/v1/auth/logout`   | Public      | Log out                  |
| GET    | `/api/v1/users/me`      | Bearer      | Current user profile     |
| PATCH  | `/api/v1/users/me`      | Bearer      | Update current user      |
| GET    | `/api/v1/users`         | Bearer+admin| List all users           |
| DELETE | `/api/v1/users/:id`     | Bearer+admin| Delete a user            |

## Next steps you'll likely want

- Add refresh-token rotation/denylisting in a `RefreshToken` collection for real revocation
- Add email verification / password reset flows
- Add rate limiting (e.g. `express-rate-limit`) on auth routes
- Swap `console`-adjacent logging for structured request logging (already using winston — wire up request-id correlation)
- Add CI (lint + typecheck + test) and Dockerfiles for client/server
