// ─────────────────────────────────────────────────────────────────────────
// DashboardLayout — the shell every protected page renders inside:
// Sidebar + Topbar + a scrollable content area holding the routed page
// (via react-router's <Outlet />).
//
// Owns `sidebarOpen` because it's the one piece of state both Sidebar
// (renders the drawer) and Topbar (has the button that opens it) need to
// share — lifting it here avoids either component needing to know about
// the other directly.
// ─────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/relay/Sidebar";
import { Topbar } from "@/components/relay/Topbar";

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
