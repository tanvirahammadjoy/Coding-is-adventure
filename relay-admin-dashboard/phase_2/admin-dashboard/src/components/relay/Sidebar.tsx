// ─────────────────────────────────────────────────────────────────────────
// Sidebar — fixed left navigation.
//
// Owns the `Page` type (the union of routable views) because it's the
// component that defines what "pages" exist in this prototype. App.tsx
// imports that type to drive its own page-switch logic.
// ─────────────────────────────────────────────────────────────────────────

import { Activity, Radio, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";

/** The set of views this single-page prototype can switch between. */
export type Page = "overview" | "team" | "settings";

/** Nav item definitions — label + icon + which Page id they activate. */
const NAV_ITEMS: { id: Page; label: string; icon: typeof Activity }[] = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "team", label: "Team & Keys", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  /** Which page is currently active, so the matching nav item can highlight. */
  active: Page;
  /** Called with the target page id when a nav item is clicked. */
  onNavigate: (page: Page) => void;
}

export function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-card">
      {/* Logo mark */}
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 text-primary">
          <Radio className="h-4 w-4" />
        </div>
        <span className="font-mono text-sm font-semibold tracking-[0.08em] text-foreground">
          RELAY
        </span>
      </div>

      {/* Nav links — active state uses a filled background + colored icon +
          trailing dot, rather than just a color change, so it reads clearly
          even for someone scanning quickly. */}
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",
                isActive
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {item.label}
              {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
            </button>
          );
        })}
      </nav>

      {/* Plan usage widget — static in this prototype, but shaped like it
          would read from a billing/usage API in a real app. */}
      <div className="mx-3 mb-4 rounded-md border border-border bg-secondary/40 px-3 py-3">
        <div className="text-xs font-medium text-foreground">Free tier</div>
        <div className="mt-0.5 text-xs text-muted-foreground">42,110 / 100,000 events</div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
          <div className="h-full w-[42%] rounded-full bg-primary" />
        </div>
      </div>
    </aside>
  );
}
