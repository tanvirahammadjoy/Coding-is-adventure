// ─────────────────────────────────────────────────────────────────────────
// Thin fetch wrapper for talking to the Relay API server.
//
// Responsibilities:
//   - Prefix every request with the API base URL.
//   - Attach the current access token as an Authorization header.
//   - On a 401 (expired access token), attempt exactly one silent refresh
//     (via the httpOnly cookie) and retry the original request once.
//   - Always send credentials: "include" so the refresh cookie travels
//     on cross-origin requests between the Vite dev server and the API.
//
// The access token itself is NOT stored here — it's held in AuthContext's
// React state (in memory only, never localStorage) and passed in on each
// call via getAccessToken(). This module doesn't know about React at all;
// it just needs a function that returns the current token.
// ─────────────────────────────────────────────────────────────────────────

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type GetAccessToken = () => string | null;
type SetAccessToken = (token: string | null) => void;

// Populated once by AuthProvider on mount so this module can read/refresh
// the token without importing React context directly.
let getAccessToken: GetAccessToken = () => null;
let setAccessToken: SetAccessToken = () => {};

export function registerTokenAccessors(getter: GetAccessToken, setter: SetAccessToken) {
  getAccessToken = getter;
  setAccessToken = setter;
}

/** Hits the refresh endpoint using the httpOnly cookie; returns the new access token or null. */
async function attemptRefresh(): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.accessToken ?? null;
  } catch {
    return null;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  /** Internal flag to prevent infinite refresh-retry loops. */
  _isRetry?: boolean;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, _isRetry = false } = options;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Access token expired mid-session: try one silent refresh, then retry
  // the original call once with the new token. If refresh also fails,
  // fall through and surface the original 401 to the caller (typically
  // AuthContext, which will then sign the user out).
  if (res.status === 401 && !_isRetry) {
    const newToken = await attemptRefresh();
    if (newToken) {
      setAccessToken(newToken);
      return apiRequest<T>(path, { ...options, _isRetry: true });
    }
  }

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // Response body wasn't JSON — fall back to the generic message above.
    }
    throw new ApiError(message, res.status);
  }

  // 204 No Content has no body to parse.
  if (res.status === 204) return undefined as T;
  return res.json();
}
