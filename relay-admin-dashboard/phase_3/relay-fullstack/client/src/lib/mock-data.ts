// ─────────────────────────────────────────────────────────────────────────
// Mock data for the Relay dashboard prototype.
//
// In a real app this file would be replaced by API calls / a data-fetching
// layer (React Query, SWR, etc). Keeping all fixture data in one place
// makes that swap-out straightforward later: pages import from here, not
// from inline literals scattered across components.
// ─────────────────────────────────────────────────────────────────────────

import type { RelayEvent, QueueStat } from "./types";

/** Feed shown in the Overview page's "Recent events" table. */
export const recentEvents: RelayEvent[] = [
  { id: "evt_8f2a", time: "12:04:51", method: "POST", endpoint: "/webhooks/stripe/charge.succeeded", status: "ok", code: 200, latencyMs: 84 },
  { id: "evt_8f29", time: "12:04:49", method: "POST", endpoint: "/webhooks/github/push", status: "ok", code: 200, latencyMs: 112 },
  { id: "evt_8f28", time: "12:04:44", method: "GET", endpoint: "/api/v1/jobs/queue-depth", status: "ok", code: 200, latencyMs: 31 },
  { id: "evt_8f27", time: "12:04:40", method: "POST", endpoint: "/webhooks/slack/interactive", status: "warn", code: 200, latencyMs: 1420 },
  { id: "evt_8f26", time: "12:04:33", method: "PUT", endpoint: "/api/v1/subscriptions/sub_442", status: "ok", code: 200, latencyMs: 96 },
  { id: "evt_8f25", time: "12:04:29", method: "POST", endpoint: "/webhooks/twilio/sms.status", status: "error", code: 503, latencyMs: 2210 },
  { id: "evt_8f24", time: "12:04:21", method: "DELETE", endpoint: "/api/v1/cache/keys/session_9a3", status: "ok", code: 204, latencyMs: 18 },
  { id: "evt_8f23", time: "12:04:15", method: "GET", endpoint: "/api/v1/health", status: "ok", code: 200, latencyMs: 9 },
  { id: "evt_8f22", time: "12:04:08", method: "POST", endpoint: "/webhooks/stripe/invoice.paid", status: "ok", code: 200, latencyMs: 77 },
  { id: "evt_8f21", time: "12:03:59", method: "POST", endpoint: "/webhooks/github/pull_request", status: "warn", code: 200, latencyMs: 980 },
];

/** Queue depth snapshot shown in the Overview page's side panel. */
export const queues: QueueStat[] = [
  { name: "webhooks.inbound", depth: 42, capacity: 500, status: "ok" },
  { name: "email.transactional", depth: 8, capacity: 200, status: "ok" },
  { name: "jobs.reports", depth: 311, capacity: 400, status: "warn" },
  { name: "jobs.exports", depth: 3, capacity: 150, status: "ok" },
  { name: "retries.dead-letter", depth: 19, capacity: 100, status: "error" },
];

/**
 * Generates a deterministic pseudo-random series of values (0-100) used to
 * seed the PulseStrip chart on first render.
 *
 * Deliberately avoids Math.random() so the initial chart shape is stable
 * across reloads/dev refreshes — only the live interval tick (in
 * PulseStrip.tsx) introduces genuine variation after mount.
 *
 * @param points - how many data points to generate
 * @param seed - shifts the sine waves so different callers can get different shapes
 */
export function generatePulseSeries(points: number, seed = 7): number[] {
  const series: number[] = [];
  let value = 60;
  for (let i = 0; i < points; i++) {
    // Layer two sine waves at different frequencies so the line looks like
    // organic traffic rather than a single perfect wave.
    const wobble = Math.sin(i / 3.1 + seed) * 14 + Math.sin(i / 1.3 + seed * 2) * 6;
    // Every 17th point gets a small spike to mimic bursty traffic.
    value = 55 + wobble + (i % 17 === 0 ? 22 : 0);
    series.push(Math.max(8, Math.round(value)));
  }
  return series;
}
