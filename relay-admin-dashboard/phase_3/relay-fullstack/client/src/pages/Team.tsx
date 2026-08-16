// ─────────────────────────────────────────────────────────────────────────
// Team & Keys page — protected. This is the page's second incarnation:
// it now talks to the live Redis-backed /api/team endpoints (via
// lib/team-api.ts) instead of rendering static mock data, and supports
// full create/edit/delete rather than just search/filter over a fixture.
// ─────────────────────────────────────────────────────────────────────────

import { useEffect, useMemo, useState } from "react";
import { Copy, Eye, EyeOff, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
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
import { fetchTeam, createTeamMember, updateTeamMember, deleteTeamMember } from "@/lib/team-api";
import type { Role, TeamMember } from "@/lib/types";
import { ApiError } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const ROLE_STYLE: Record<Role, string> = {
  Owner: "border-primary/40 text-primary bg-primary/10",
  Admin: "border-accent/40 text-accent bg-accent/10",
  Developer: "border-border text-foreground/80 bg-secondary/60",
  Viewer: "border-border text-muted-foreground bg-secondary/40",
};

const ROLE_OPTIONS: Role[] = ["Owner", "Admin", "Developer", "Viewer"];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Empty form used both for "Invite" (create) and pre-filled for "Edit". */
interface MemberFormState {
  name: string;
  email: string;
  role: Role;
}

const EMPTY_FORM: MemberFormState = { name: "", email: "", role: "Developer" };

export function Team() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "All">("All");
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  // Dialog state shared between "invite" (create) and "edit" flows —
  // `editingId` is null for create, or the member's id when editing.
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<MemberFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadMembers() {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await fetchTeam();
      setMembers(data);
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : "Couldn't load team members.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadMembers();
  }, []);

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const matchesQuery =
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.email.toLowerCase().includes(query.toLowerCase());
      const matchesRole = roleFilter === "All" || m.role === roleFilter;
      return matchesQuery && matchesRole;
    });
  }, [members, query, roleFilter]);

  function openInviteDialog() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setDialogOpen(true);
  }

  function openEditDialog(member: TeamMember) {
    setEditingId(member.id);
    setForm({ name: member.name, email: member.email, role: member.role });
    setFormError(null);
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setIsSaving(true);
    try {
      if (editingId) {
        const updated = await updateTeamMember(editingId, form);
        setMembers((prev) => prev.map((m) => (m.id === editingId ? updated : m)));
      } else {
        const created = await createTeamMember(form);
        setMembers((prev) => [created, ...prev]);
      }
      setDialogOpen(false);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Couldn't save this member.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleActive(member: TeamMember) {
    // Optimistic update: flip the switch immediately, then reconcile with
    // the server response (or roll back on failure).
    const nextActive = !member.active;
    setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, active: nextActive } : m)));
    try {
      await updateTeamMember(member.id, { active: nextActive });
    } catch {
      setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, active: member.active } : m)));
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteTeamMember(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch {
      // Leave the row in place if the delete failed — silently dropping it
      // from the UI while it still exists server-side would be misleading.
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-3">
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
              {ROLE_OPTIONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openInviteDialog}
              className="h-9 gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-3.5 w-3.5" />
              Invite teammate
            </Button>
          </DialogTrigger>
          <DialogContent className="border-border bg-card">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit teammate" : "Invite a teammate"}</DialogTitle>
              <DialogDescription>
                {editingId
                  ? "Update this teammate's details."
                  : "They'll be added to the workspace immediately in this prototype (no email is actually sent)."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 py-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="member-name">Name</Label>
                <Input
                  id="member-name"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="border-border bg-secondary/50"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="member-email">Email</Label>
                <Input
                  id="member-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="teammate@company.com"
                  className="border-border bg-secondary/50"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="member-role">Role</Label>
                <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v as Role }))}>
                  <SelectTrigger id="member-role" className="border-border bg-secondary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formError && (
                <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {formError}
                </p>
              )}

              <DialogFooter className="mt-1">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingId ? "Save changes" : "Send invite"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading team…
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center gap-3 py-16 text-sm text-muted-foreground">
            <p>{loadError}</p>
            <Button variant="outline" onClick={loadMembers}>
              Try again
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-4 py-3 font-medium">Member</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">API key</th>
                  <th className="px-4 py-3 font-medium">Last active</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id} className="border-b border-border/60 last:border-0">
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-3">
                        <InitialsBadge className="h-8 w-8">{initials(m.name)}</InitialsBadge>
                        <div>
                          <div className="font-medium text-foreground">{m.name}</div>
                          <div className="text-xs text-muted-foreground">{m.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Badge variant="outline" className={cn("font-normal", ROLE_STYLE[m.role])}>
                        {m.role}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
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
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">{m.lastActive}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(m)}
                        className="flex items-center gap-1.5 text-xs"
                        title="Toggle active status"
                      >
                        <span className={cn("h-1.5 w-1.5 rounded-full", m.active ? "bg-primary" : "bg-muted-foreground")} />
                        {m.active ? "Active" : "Away"}
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditDialog(m)}
                          className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                          aria-label={`Edit ${m.name}`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(m.id)}
                          disabled={deletingId === m.id}
                          className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          aria-label={`Remove ${m.name}`}
                        >
                          {deletingId === m.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                      {members.length === 0
                        ? "No teammates yet — invite your first one above."
                        : `No teammates match "${query}".`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
