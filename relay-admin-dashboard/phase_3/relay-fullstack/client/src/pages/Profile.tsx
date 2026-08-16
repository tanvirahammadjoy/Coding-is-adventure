// ─────────────────────────────────────────────────────────────────────────
// Profile page — protected. Shows the current user's account details and
// lets them edit their display name via PATCH /api/users/me.
//
// Email and role are shown read-only: this prototype's backend doesn't
// expose endpoints to change them (email changes usually need
// verification; role changes usually need an admin), so the UI doesn't
// pretend they're editable.
// ─────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { InitialsBadge } from "@/components/relay/InitialsBadge";
import { useAuth, ApiError } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import type { AuthUser } from "@/context/AuthContext";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  if (!user) return null; // ProtectedRoute guarantees this won't render, but keeps TS happy.

  const isDirty = name.trim() !== user.name;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isDirty || !name.trim()) return;

    setStatus("saving");
    setError(null);
    try {
      const data = await apiRequest<{ user: AuthUser }>("/api/users/me", {
        method: "PATCH",
        body: { name: name.trim() },
      });
      setUser(data.user);
      setStatus("saved");
      // Clear the "Saved" confirmation after a moment rather than leaving
      // it up indefinitely.
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      setStatus("error");
      setError(err instanceof ApiError ? err.message : "Couldn't save your changes.");
    }
  }

  return (
    <div className="max-w-xl">
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <InitialsBadge className="h-14 w-14 text-base">{initials(user.name)}</InitialsBadge>
          <div>
            <div className="font-display text-lg font-semibold text-foreground">{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>

        <Separator className="my-5 bg-border" />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-name">Display name</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="max-w-sm border-border bg-secondary/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-email">Email</Label>
            <Input
              id="profile-email"
              value={user.email}
              disabled
              className="max-w-sm border-border bg-secondary/30 text-muted-foreground"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-role">Role</Label>
            <Input
              id="profile-role"
              value={user.role}
              disabled
              className="max-w-sm border-border bg-secondary/30 text-muted-foreground"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="mt-1 flex items-center gap-3">
            <Button
              type="submit"
              disabled={!isDirty || status === "saving"}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {status === "saving" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save changes
            </Button>
            {status === "saved" && <span className="text-sm text-primary">Saved.</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
