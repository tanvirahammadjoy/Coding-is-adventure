/**
 * Minimal structured logger. Swap for pino/winston later if you want
 * log shipping — kept dependency-free for now since this is a small
 * single-service agent.
 */
type Level = "info" | "warn" | "error";

function log(level: Level, scope: string, message: string, meta?: unknown) {
  const line = `[${new Date().toISOString()}] [${level.toUpperCase()}] [${scope}] ${message}`;
  if (meta !== undefined) {
    // eslint-disable-next-line no-console
    console[level === "error" ? "error" : "log"](line, meta);
  } else {
    // eslint-disable-next-line no-console
    console[level === "error" ? "error" : "log"](line);
  }
}

export const logger = {
  info: (scope: string, message: string, meta?: unknown) => log("info", scope, message, meta),
  warn: (scope: string, message: string, meta?: unknown) => log("warn", scope, message, meta),
  error: (scope: string, message: string, meta?: unknown) => log("error", scope, message, meta),
};
