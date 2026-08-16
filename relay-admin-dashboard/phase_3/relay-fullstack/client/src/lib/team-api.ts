// ─────────────────────────────────────────────────────────────────────────
// Team API layer — typed wrappers around apiRequest for the /api/team
// endpoints. Kept separate from Team.tsx so the page component only deals
// with UI state, not fetch details or the server's string-encoded booleans.
// ─────────────────────────────────────────────────────────────────────────

import { apiRequest } from "@/lib/api";
import type { TeamMember, Role } from "@/lib/types";

/** Raw shape returned by the server, where Redis hash values are all strings. */
interface RawTeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  apiKey: string;
  lastActive: string;
  active: string; // "true" | "false" — Redis hashes only store strings.
  createdAt: string;
}

function normalize(raw: RawTeamMember): TeamMember {
  return { ...raw, active: raw.active === "true" };
}

export async function fetchTeam(): Promise<TeamMember[]> {
  const data = await apiRequest<{ members: RawTeamMember[] }>("/api/team");
  return data.members.map(normalize);
}

export async function createTeamMember(input: {
  name: string;
  email: string;
  role: Role;
}): Promise<TeamMember> {
  const data = await apiRequest<{ member: RawTeamMember }>("/api/team", {
    method: "POST",
    body: input,
  });
  return normalize(data.member);
}

export async function updateTeamMember(
  id: string,
  input: Partial<{ name: string; email: string; role: Role; active: boolean }>
): Promise<TeamMember> {
  const data = await apiRequest<{ member: RawTeamMember }>(`/api/team/${id}`, {
    method: "PUT",
    body: input,
  });
  return normalize(data.member);
}

export async function deleteTeamMember(id: string): Promise<void> {
  await apiRequest<void>(`/api/team/${id}`, { method: "DELETE" });
}
