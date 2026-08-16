// ─────────────────────────────────────────────────────────────────────────
// AuthLayout — shared chrome for Login and Register: centered card over a
// branded backdrop. Kept separate from the two pages so their forms stay
// focused on just the fields/validation/submit logic.
// ─────────────────────────────────────────────────────────────────────────

import { Radio } from "lucide-react";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/15 text-primary">
            <Radio className="h-5 w-5" />
          </div>
          <h1 className="mt-3 font-display text-2xl font-semibold text-foreground">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">{children}</div>

        <div className="mt-5 text-center text-sm text-muted-foreground">{footer}</div>
      </div>
    </div>
  );
}
