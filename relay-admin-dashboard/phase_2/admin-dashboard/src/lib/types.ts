// ─────────────────────────────────────────────────────────────────────────
// Shared type definitions for the Relay dashboard.
// Kept separate from mock-data.ts and the components that consume them so
// that types can be imported without pulling in the (fake) data itself.
// ─────────────────────────────────────────────────────────────────────────

/** Health state used for events, queues, and their status indicators. */
export type EventStatus = "ok" | "warn" | "error";

/** A single API/webhook request captured in the live events feed. */
export interface RelayEvent {
  id: string;
  time: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
  status: EventStatus;
  code: number;
  latencyMs: number;
}

/** Depth/capacity snapshot for one background job queue. */
export interface QueueStat {
  name: string;
  depth: number;
  capacity: number;
  status: EventStatus;
}

/** Access level assigned to a team member. Controls what the Badge shows. */
export type Role = "Owner" | "Admin" | "Developer" | "Viewer";

/** A workspace member row shown on the Team & Keys page. */
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  apiKey: string;
  lastActive: string;
  active: boolean;
}
