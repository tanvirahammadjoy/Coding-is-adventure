// ─────────────────────────────────────────────────────────────────────────
// App — top-level shell.
//
// This is a single-page prototype, so "routing" is just a piece of state
// (`page`) rather than react-router: simpler for a bundled single-HTML-file
// artifact, and easy to swap for real routing later since Sidebar, Topbar,
// and each page component are already decoupled from how navigation works.
// ─────────────────────────────────────────────────────────────────────────

import { Sidebar, type Page } from '@/components/relay/Sidebar';
import { Topbar } from '@/components/relay/Topbar';
import { Overview } from '@/pages/Overview';
import { Settings } from '@/pages/Settings';
import { Team } from '@/pages/Team';
import { useState } from 'react';

/** Maps the active Page id to the component that renders it. */
function PageContent({ page }: { page: Page }) {
    switch (page) {
        case 'overview':
            return <Overview />;
        case 'team':
            return <Team />;
        case 'settings':
            return <Settings />;
    }
}

export default function App() {
    // The single source of truth for "which page are we on" — passed down
    // to Sidebar (to highlight the active item and request navigation) and
    // to Topbar (to render the matching title/breadcrumb).
    const [page, setPage] = useState<Page>('overview');

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background font-sans text-foreground">
            <Sidebar active={page} onNavigate={setPage} />

            <div className="flex min-w-0 flex-1 flex-col">
                <Topbar page={page} />
                <main className="flex-1 overflow-y-auto p-6">
                    <PageContent page={page} />
                </main>
            </div>
        </div>
    );
}
