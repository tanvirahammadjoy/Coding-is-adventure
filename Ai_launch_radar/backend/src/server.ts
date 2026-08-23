import http from "http";
import { Server as SocketServer } from "socket.io";
import { createApp } from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import { startScheduler } from "./services/scheduler.service";
import { authService } from "./services/auth.service";
import { logger } from "./utils/logger";

async function bootstrap() {
  await connectDB(env.mongoUri);

  const app = createApp();
  const httpServer = http.createServer(app);

  // Socket.io shares the same HTTP server instance as Express — no
  // second port to manage. The dashboard connects here for the
  // "launch:new" event emitted by the ingestion service.
  const io = new SocketServer(httpServer, {
    cors: { origin: env.clientOrigin },
  });

  // Same JWT that gates the REST API also gates the socket connection —
  // the dashboard passes it in the handshake `auth` payload. Without
  // this, anyone could open a raw socket connection and watch the live
  // feed even without logging in through the API.
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Missing auth token"));
    try {
      authService.verifyToken(token);
      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    logger.info("socket", `Client connected: ${socket.id}`);
    socket.on("disconnect", () => logger.info("socket", `Client disconnected: ${socket.id}`));
  });

  startScheduler(io);

  httpServer.listen(env.port, () => {
    logger.info("server", `Listening on http://localhost:${env.port}`);
  });
}

bootstrap().catch((err) => {
  logger.error("server", "Fatal error during bootstrap", err);
  process.exit(1);
});
