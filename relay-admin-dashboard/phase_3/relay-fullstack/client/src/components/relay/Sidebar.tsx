// ─────────────────────────────────────────────────────────────────────────
// Sidebar — left navigation, now driven by react-router's NavLink (active
// state comes from the actual URL) instead of locally-passed page state.
//
// Responsive behavior: on screens below `lg`, this renders as a slide-in
// drawer (fixed position, translated off-screen when closed) with a
// backdrop; at `lg` and above it's a normal static column. DashboardLayout
// owns the open/close state and passes it down.
// ─────────────────────────────────────────────────────────────────────────

import { Activity, LogOut, Radio, Settings, User, Users, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "Overview", icon: Activity, end: true },
  { to: "/team", label: "Team & Keys", icon: Users, end: false },
  { to: "/profile", label: "Profile", icon: User, end: false },
  { to: "/settings", label: "Settings", icon: Settings, end: false },
];

interface SidebarProps {
  /** Whether the mobile drawer is open. Ignored at `lg` and above. */
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Backdrop — mobile only, closes the drawer on tap. */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full w-60 shrink-0 flex-col border-r border-border bg-card transition-transform duration-200 ease-in-out",
          "lg:static lg:z-auto lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 text-primary">
              <Radio className="h-4 w-4" />
            </div>
            <span className="font-display text-sm font-semibold tracking-[0.08em] text-foreground">
              RELAY
            </span>
          </div>
          {/* Close button — mobile only. */}
          <button onClick={onClose} className="text-muted-foreground lg:hidden" aria-label="Close menu">
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",
                    isActive
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    {item.label}
                    {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="mx-3 mb-3 rounded-md border border-border bg-secondary/40 px-3 py-3">
          <div className="text-xs font-medium text-foreground">Free tier</div>
          <div className="mt-0.5 text-xs text-muted-foreground">42,110 / 100,000 events</div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div className="h-full w-[42%] rounded-full bg-primary" />
          </div>
        </div>

        {/* Signed-in-as footer + logout, always visible since it's the
            primary way to end a session from anywhere in the app. */}
        <button
          onClick={logout}
          className="mx-3 mb-4 flex items-center gap-2 rounded-md border border-border px-3 py-2 text-left text-xs text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
        >
          <LogOut className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">Sign out {user ? `(${user.name})` : ""}</span>
        </button>
      </aside>
    </>
  );
}
