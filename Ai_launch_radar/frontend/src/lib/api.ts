import axios from "axios";
import { Launch, LaunchCategory, LaunchSource } from "../types/launch";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export const api = axios.create({ baseURL: `${API_BASE}/api` });

// Attach the stored token to every request. Reads localStorage directly
// (rather than importing lib/auth) to avoid a circular import, since
// auth.ts itself uses `api` to call /auth/login.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("radar_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// A 401 on an authenticated request means the token expired — clear it
// and reload so the login screen reappears. The login endpoint itself
// also returns 401 on a wrong password, so that case is excluded here;
// LoginScreen handles that response directly instead.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const isLoginCall = error.config?.url?.includes("/auth/login");
    if (error.response?.status === 401 && !isLoginCall) {
      localStorage.removeItem("radar_token");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export interface ListLaunchesParams {
  source?: LaunchSource;
  category?: LaunchCategory;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ListLaunchesResponse {
  success: boolean;
  items: Launch[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function listLaunches(params: ListLaunchesParams): Promise<ListLaunchesResponse> {
  const res = await api.get<ListLaunchesResponse>("/launches", { params });
  return res.data;
}
