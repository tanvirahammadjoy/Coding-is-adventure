import { api } from './api';
import type { ApiSuccess, AuthResponse } from '../types';

export const authService = {
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<ApiSuccess<AuthResponse>>('/auth/register', {
      name,
      email,
      password,
    });
    return data.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<ApiSuccess<AuthResponse>>('/auth/login', { email, password });
    return data.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },
};
