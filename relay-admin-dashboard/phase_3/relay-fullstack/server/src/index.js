// ─────────────────────────────────────────────────────────────────────────
// Server entry point: middleware setup, route mounting, listen.
// ─────────────────────────────────────────────────────────────────────────

import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';

import { authRouter } from './routes/auth.routes.js';
import { teamRouter } from './routes/team.routes.js';
import { userRouter } from './routes/user.routes.js';

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(
    cors({
        origin: CLIENT_ORIGIN,
        // Required so the browser sends/receives the httpOnly refresh-token
        // cookie on cross-origin requests between the Vite dev server and
        // this API server.
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/team', teamRouter);

// Catch-all error handler — anything an async controller throws (e.g. a
// Redis connection blip) lands here instead of crashing the process or
// hanging the request.
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error.' });
});

app.listen(PORT, () => {
    console.log(`[server] Relay API listening on http://localhost:${PORT}`);
});
