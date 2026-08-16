// ─────────────────────────────────────────────────────────────────────────
// App — top-level route table.
//
// /login and /register are public. Everything else renders inside
// DashboardLayout, gated by ProtectedRoute so an unauthenticated visitor
// is redirected to /login before the layout (or any page's data fetch)
// ever mounts.
// ─────────────────────────────────────────────────────────────────────────

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/relay/DashboardLayout";
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import { Overview } from "@/pages/Overview";
import { Team } from "@/pages/Team";
import { Profile } from "@/pages/Profile";
import { Settings } from "@/pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Overview />} />
          <Route path="/team" element={<Team />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Anything unmatched falls back to the dashboard root, which
            itself redirects to /login if there's no session. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
