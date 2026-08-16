// ─────────────────────────────────────────────────────────────────────────
// AuthContext — the single source of truth for "who is logged in".
//
// Holds the access token and current user in React state only (never
// localStorage/sessionStorage — keeps the token out of reach of XSS).
// The refresh token lives entirely in an httpOnly cookie the browser
// manages automatically; this context never sees it directly.
//
// On mount, it silently tries /api/auth/refresh so a page reload doesn't
// force a re-login as long as the refresh cookie is still valid.
// ─────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { apiRequest, registerTokenAccessors, ApiError } from "@/lib/api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  /** True until the initial silent-refresh check on mount has resolved. */
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  /** Updates the in-memory user after a successful profile edit. */
  setUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // A ref (not state) for the access token: api.ts reads it synchronously
  // via a getter function, and we don't want every token refresh to
  // trigger a re-render of every consumer — only `user` changes should.
  const accessTokenRef = useRef<string | null>(null);

  // Give lib/api.ts a way to read/write the token without importing React.
  useEffect(() => {
    registerTokenAccessors(
      () => accessTokenRef.current,
      (token) => {
        accessTokenRef.current = token;
      }
    );
  }, []);

  // On first mount, attempt a silent refresh so an existing session
  // (valid refresh cookie) survives a full page reload.
  useEffect(() => {
    (async () => {
      try {
        const data = await apiRequest<{ user: AuthUser; accessToken: string }>(
          "/api/auth/refresh",
          { method: "POST" }
        );
        accessTokenRef.current = data.accessToken;
        setUser(data.user);
      } catch {
        // No valid refresh cookie — that's a normal "not logged in" state,
        // not an error worth surfacing.
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  async function login(email: string, password: string) {
    const data = await apiRequest<{ user: AuthUser; accessToken: string }>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    accessTokenRef.current = data.accessToken;
    setUser(data.user);
  }

  async function register(name: string, email: string, password: string) {
    const data = await apiRequest<{ user: AuthUser; accessToken: string }>("/api/auth/register", {
      method: "POST",
      body: { name, email, password },
    });
    accessTokenRef.current = data.accessToken;
    setUser(data.user);
  }

  async function logout() {
    try {
      await apiRequest("/api/auth/logout", { method: "POST" });
    } catch {
      // Even if the network call fails, clear local state so the UI
      // reflects "logged out" — a failed logout call shouldn't trap the
      // user in a session they meant to end.
    }
    accessTokenRef.current = null;
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider.");
  return ctx;
}

// Re-exported so pages can distinguish "wrong password" from "network
// down" without importing lib/api.ts directly.
export { ApiError };
