// ─────────────────────────────────────────────────────────────────────────
// Topbar — header bar shown above every protected page.
//
// Title/breadcrumb now derive from the current route (useLocation) rather
// than a page prop, since navigation is real routing now. Also owns the
// mobile menu button (opens the Sidebar drawer) and the theme switcher.
// ─────────────────────────────────────────────────────────────────────────

import { Menu, Moon, Search, Sun } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InitialsBadge } from "@/components/relay/InitialsBadge";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

/** Route path → heading copy. Falls back to a generic title if unmatched. */
const ROUTE_TITLES: Record<string, string> = {
  "/": "Overview",
  "/team": "Team & Keys",
  "/profile": "Profile",
  "/settings": "Settings",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const location = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const title = ROUTE_TITLES[location.pathname] ?? "Relay";
  // Breadcrumb segment: "/" → "overview", "/team" → "team", etc.
  const segment = location.pathname === "/" ? "overview" : location.pathname.slice(1);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="text-muted-foreground lg:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <span className="font-mono">relay</span>
            <span>/</span>
            <span className="font-mono text-foreground">{segment}</span>
          </div>
          <h1 className="font-display text-sm font-semibold text-foreground sm:text-base">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search events, keys, endpoints…"
            className="h-8 w-64 border-border bg-secondary/50 pl-8 text-xs placeholder:text-muted-foreground"
          />
        </div>

        <div className="hidden items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-xs text-muted-foreground sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          All systems operational
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8 border-border text-muted-foreground"
          aria-label="Toggle theme"
          title={theme === "relay" ? "Switch to Aurora theme" : "Switch to Relay theme"}
        >
          {theme === "relay" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {user && <InitialsBadge className="h-8 w-8">{initials(user.name)}</InitialsBadge>}
      </div>
    </header>
  );
}
