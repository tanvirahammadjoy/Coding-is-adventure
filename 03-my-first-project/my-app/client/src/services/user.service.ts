import { api } from './api';
import type { ApiSuccess, User } from '../types';

export const userService = {
  async getMe(): Promise<User> {
    const { data } = await api.get<ApiSuccess<User>>('/users/me');
    return data.data;
  },
};
