// ─────────────────────────────────────────────────────────────────────────
// ProtectedRoute — gates access to the dashboard shell.
//
// Three states to handle:
//   1. Still loading (initial silent-refresh check hasn't resolved yet)
//      → show a full-screen loading state, not the login page. Otherwise
//        every reload would flash the login screen before redirecting
//        back in.
//   2. Not authenticated → redirect to /login, remembering where the user
//      was headed (via `state.from`) so login can send them back.
//   3. Authenticated → render the protected content.
// ─────────────────────────────────────────────────────────────────────────

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-sm text-muted-foreground">
        Checking your session…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
