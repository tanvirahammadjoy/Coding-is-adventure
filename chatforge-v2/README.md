# Roomtone

A full-stack real-time chat application with group conversations, voice/video calls,
rich messaging (reactions, replies, edits, read receipts), and file attachments.

**Stack:** React (JavaScript, Vite) · Node.js/Express · MongoDB (Mongoose) · Socket.io · Cloudinary · WebRTC

## Features

- **Auth** — JWT access + refresh tokens, bcrypt password hashing, httpOnly refresh cookie
- **Messaging** — real-time 1-on-1 and group chat, typing indicators, online presence
- **Rich messages** — edit, soft-delete, emoji reactions, reply threading, read receipts
- **Attachments** — image/file uploads via Cloudinary
- **Groups** — create, rename, avatar, add/remove members, promote/demote admins, leave
- **Calls** — 1-on-1 and group voice/video calls over WebRTC (mesh topology), call history
  logged inline in the conversation
- **Responsive UI** — collapses to a single-pane mobile layout below the `md` breakpoint

## Project structure

```
chatforge-v2/
├── backend/
│   └── src/
│       ├── config/        # MongoDB, Cloudinary
│       ├── models/        # User, Conversation, Message
│       ├── controllers/   # auth, conversation, group, message, upload, user
│       ├── routes/
│       ├── middleware/    # auth (JWT), validate (Zod), upload (multer), errors
│       ├── sockets/       # all real-time logic: messaging, presence, calls
│       ├── validations/   # Zod schemas
│       ├── app.js         # Express app
│       └── server.js      # HTTP server + Socket.io entry point
└── frontend/
    └── src/
        ├── api/            # axios instance (token refresh interceptor)
        ├── lib/            # socket client, formatting, conversation-display helpers
        ├── store/          # Zustand: useAuthStore, useChatStore, useCallStore
        ├── components/
        │   ├── common/     # Avatar, ProtectedRoute, GuestRoute
        │   ├── chat/       # conversation list, message thread, composer, group panel
        │   └── calls/      # video tile, incoming-call modal, active-call view
        └── pages/          # Login, Register, Chat
```

## Prerequisites

- Node.js 18+
- A MongoDB instance (local `mongod`, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- A [Cloudinary](https://cloudinary.com) account (free tier is enough) — only needed for file attachments and group avatars

## Setup

**1. Backend**

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:
- `MONGODB_URI` — your connection string
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — any long random strings (e.g. `openssl rand -hex 32`)
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — from your Cloudinary dashboard

```bash
npm run dev
```

Runs on `http://localhost:5000`. On success you'll see `MongoDB connected: ...` and
`Server running on port 5000`.

**2. Frontend**

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Runs on `http://localhost:5173` and expects the backend at the URLs in `frontend/.env`
(`VITE_API_URL`, `VITE_SOCKET_URL`) — the defaults match the backend's default port, so
no changes are needed if you're running both locally.

Open two browser profiles (or one regular + one incognito window) with two different
accounts to see real-time messaging, presence, and calls actually working between them.

## API reference

All routes below are prefixed with `/api`. Everything except `/auth/register`,
`/auth/login`, and `/auth/refresh-token` requires an `Authorization: Bearer <token>` header.

| Method | Path | Description |
|---|---|---|
| POST | `/auth/register` | Create an account |
| POST | `/auth/login` | Log in |
| POST | `/auth/refresh-token` | Exchange the refresh cookie for a new access token |
| POST | `/auth/logout` | Log out, revoke the refresh token |
| GET | `/auth/me` | Current user |
| GET | `/conversations` | List conversations (with unread counts) |
| GET | `/conversations/:id` | Get one conversation |
| POST | `/conversations/direct` | Start (or reuse) a 1-on-1 conversation |
| POST | `/conversations/group` | Create a group |
| PATCH | `/conversations/:id/group` | Update group name/avatar/description (admin) |
| POST | `/conversations/:id/participants` | Add members (admin) |
| DELETE | `/conversations/:id/participants/:userId` | Remove a member (admin) |
| POST | `/conversations/:id/leave` | Leave a group |
| PATCH | `/conversations/:id/admins/:userId` | Promote/demote an admin |
| GET | `/messages/:conversationId` | Paginated message history (`?before=&limit=`) |
| GET | `/users?q=` | Search users to start a conversation with |
| POST | `/uploads` | Upload a file attachment (multipart, field name `file`) |

Sending, editing, deleting, and reacting to messages, plus all call signaling, happen
over Socket.io rather than REST — see `backend/src/sockets/index.js` for the full event
list (it's commented throughout).

## Known limitations

These were deliberate scope decisions, not oversights — noted here so they're not
mistaken for bugs:

- **No TURN server** — only Google's public STUN server is configured for WebRTC. This
  covers most home/office networks; a restrictive corporate firewall or symmetric NAT
  needs a TURN relay (self-hosted via coturn, or a paid service like Twilio/Xirsys).
- **Group calls are peer-to-peer mesh**, not an SFU. Fine up to ~4-6 participants;
  bandwidth/CPU cost grows quadratically beyond that. A production app at scale would
  use LiveKit or mediasoup instead.
- **Group conversations collect read receipts but don't display them** — the data is
  there (`Message.readBy`), direct conversations show a "Seen" indicator, group chats
  don't surface a "seen by" UI.
- **If a remote participant turns their camera off mid-call**, their tile shows a black
  frame rather than falling back to their avatar, since that needs an explicit
  media-state signal this build doesn't send.
- **Unread counts run one query per conversation** (in parallel) rather than a single
  aggregation — fine at the scale one user's conversation list actually reaches.

## Design system

The visual identity ("Roomtone") is defined as CSS custom properties in
`frontend/src/index.css` (`@theme` block) — deep plum-charcoal surfaces, a coral-flame
accent, seafoam for read/success states, Fraunces + Plus Jakarta Sans. Change the
values there to re-theme the whole app.
