import { api } from "./api";

const TOKEN_KEY = "radar_token";

export const auth = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  async login(password: string): Promise<void> {
    const res = await api.post<{ success: boolean; token: string }>("/auth/login", { password });
    auth.setToken(res.data.token);
  },
};
