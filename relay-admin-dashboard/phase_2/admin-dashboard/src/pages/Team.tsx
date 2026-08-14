// ─────────────────────────────────────────────────────────────────────────
// Team & Keys page — searchable/filterable member table, plus an
// "Invite teammate" dialog. All state here (search text, role filter,
// which keys are revealed, dialog open/closed) is local to this page —
// nothing needs to be shared with other pages.
// ─────────────────────────────────────────────────────────────────────────

import { useMemo, useState } from "react";
import { Copy, Eye, EyeOff, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { InitialsBadge } from "@/components/relay/InitialsBadge";
import { teamMembers } from "@/lib/mock-data";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Border/text/background classes per role, used on the role Badge. */
const ROLE_STYLE: Record<Role, string> = {
  Owner: "border-primary/40 text-primary bg-primary/10",
  Admin: "border-accent/40 text-accent bg-accent/10",
  Developer: "border-border text-foreground/80 bg-secondary/60",
  Viewer: "border-border text-muted-foreground bg-secondary/40",
};

/** "Priya Nandakumar" -> "PN", for the InitialsBadge avatar. */
function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Team() {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "All">("All");
  // Tracks which member rows have their API key revealed, keyed by member id.
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [inviteOpen, setInviteOpen] = useState(false);

  // Recomputed only when the query or filter actually changes, rather than
  // filtering on every render — cheap here with 6 rows, but the pattern
  // scales if this data eventually comes from a larger API response.
  const filtered = useMemo(() => {
    return teamMembers.filter((m) => {
      const matchesQuery =
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.email.toLowerCase().includes(query.toLowerCase());
      const matchesRole = roleFilter === "All" || m.role === roleFilter;
      return matchesQuery && matchesRole;
    });
  }, [query, roleFilter]);

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar: search + role filter on the left, invite action on the right. */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or email…"
              className="h-9 border-border bg-card pl-8 text-sm"
            />
          </div>
          <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as Role | "All")}>
            <SelectTrigger className="h-9 w-40 border-border bg-card text-sm">
              <SelectValue placeholder="Filter role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All roles</SelectItem>
              <SelectItem value="Owner">Owner</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Developer">Developer</SelectItem>
              <SelectItem value="Viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Invite dialog — UI-only here (no real submit handler); both
            buttons just close the dialog since there's no backend to call. */}
        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button className="h-9 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-3.5 w-3.5" />
              Invite teammate
            </Button>
          </DialogTrigger>
          <DialogContent className="border-border bg-card">
            <DialogHeader>
              <DialogTitle>Invite a teammate</DialogTitle>
              <DialogDescription>
                They'll get an email with a link to join this workspace.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 py-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="invite-email">Email</Label>
                <Input id="invite-email" placeholder="teammate@company.com" className="border-border bg-secondary/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="invite-role">Role</Label>
                <Select defaultValue="Developer">
                  <SelectTrigger id="invite-role" className="border-border bg-secondary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Developer">Developer</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setInviteOpen(false)}
              >
                Send invite
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Member table */}
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-4 py-3 font-medium">Member</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">API key</th>
              <th className="px-4 py-3 font-medium">Last active</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} className="border-b border-border/60 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <InitialsBadge className="h-8 w-8">{initials(m.name)}</InitialsBadge>
                    <div>
                      <div className="font-medium text-foreground">{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={cn("font-normal", ROLE_STYLE[m.role])}>
                    {m.role}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {/* Key is masked by default; toggled per-row via `revealed`,
                      never all-at-once, to mirror how a real secrets UI
                      would minimize what's on-screen at any moment. */}
                  <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                    <span>{revealed[m.id] ? m.apiKey : "rly_live_••••••••••••"}</span>
                    <button
                      onClick={() => setRevealed((r) => ({ ...r, [m.id]: !r[m.id] }))}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label="Toggle key visibility"
                    >
                      {revealed[m.id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                    <button className="text-muted-foreground hover:text-foreground" aria-label="Copy key">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{m.lastActive}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className={cn("h-1.5 w-1.5 rounded-full", m.active ? "bg-primary" : "bg-muted-foreground")} />
                    {m.active ? "Active" : "Away"}
                  </div>
                </td>
              </tr>
            ))}
            {/* Empty state when search/filter matches nothing. */}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No teammates match "{query}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
