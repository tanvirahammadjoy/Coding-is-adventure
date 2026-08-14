// ─────────────────────────────────────────────────────────────────────────
// StatusDot — small colored indicator + matching text-color helper, both
// driven by the shared EventStatus type so every status render (events
// table, queue list) stays visually consistent.
// ─────────────────────────────────────────────────────────────────────────

import type { EventStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

/** Background color for each status, as a Tailwind class. */
const STATUS_COLOR: Record<EventStatus, string> = {
    ok: 'bg-primary',
    warn: 'bg-warn',
    error: 'bg-destructive',
};

export function StatusDot({ status, className }: { status: EventStatus; className?: string }) {
    return <span className={cn('inline-block h-1.5 w-1.5 rounded-full', STATUS_COLOR[status], className)} />;
}

/**
 * Text-color counterpart to STATUS_COLOR, for places that color a status
 * code or label rather than render a dot (e.g. the events table's HTTP
 * status column).
 */
export function statusTextColor(status: EventStatus): string {
    return status === 'ok' ? 'text-primary' : status === 'warn' ? 'text-warn' : 'text-destructive';
}
