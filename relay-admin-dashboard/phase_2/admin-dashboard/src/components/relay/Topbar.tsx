// ─────────────────────────────────────────────────────────────────────────
// Topbar — header bar shown above every page: breadcrumb, page title,
// search, system-status pill, and the current user's avatar.
// ─────────────────────────────────────────────────────────────────────────

import { InitialsBadge } from '@/components/relay/InitialsBadge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { Page } from './Sidebar';

/** Per-page title/subtitle copy, keyed by the active Page id. */
const TITLES: Record<Page, { title: string; subtitle: string }> = {
    overview: { title: 'Overview', subtitle: 'Real-time system telemetry' },
    team: { title: 'Team & Keys', subtitle: 'Manage access and API credentials' },
    settings: { title: 'Settings', subtitle: 'Workspace configuration' },
};

export function Topbar({ page }: { page: Page }) {
    const { title } = TITLES[page];

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-6">
            {/* Breadcrumb + heading, driven entirely by the active page id so
          this component needs no local state of its own. */}
            <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">relay</span>
                    <span>/</span>
                    <span className="font-mono text-foreground">{page}</span>
                </div>
                <h1 className="text-sm font-semibold text-foreground">{title}</h1>
            </div>

            <div className="flex items-center gap-4">
                {/* Search input — UI only in this prototype; wiring it up would
            mean lifting a query string to App.tsx or a search context. */}
                <div className="relative hidden sm:block">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search events, keys, endpoints…"
                        className="h-8 w-64 border-border bg-secondary/50 pl-8 text-xs placeholder:text-muted-foreground"
                    />
                </div>

                {/* Static "all systems operational" pill — in a real dashboard this
            would reflect an aggregate of the event/queue statuses. */}
                <div className="flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-xs text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    All systems operational
                </div>

                <InitialsBadge className="h-8 w-8">PN</InitialsBadge>
            </div>
        </header>
    );
}
