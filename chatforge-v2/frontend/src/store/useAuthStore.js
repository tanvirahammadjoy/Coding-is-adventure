import { create } from 'zustand';
import api from '../api/axios';
import { socket } from '../lib/socket';
import useChatStore from './useChatStore';

const connectSocket = (accessToken) => {
  socket.auth = { token: accessToken };
  socket.connect();
};

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuthChecked: false, // flips true once the initial silent-auth check resolves
  authError: null,

  setAccessToken: (accessToken) => set({ accessToken }),

  register: async ({ username, email, password }) => {
    set({ authError: null });
    try {
      const { data } = await api.post('/auth/register', { username, email, password });
      set({ user: data.data.user, accessToken: data.data.accessToken });
      connectSocket(data.data.accessToken);
      return true;
    } catch (err) {
      set({ authError: err.response?.data?.message || 'Registration failed' });
      return false;
    }
  },

  login: async ({ email, password }) => {
    set({ authError: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      set({ user: data.data.user, accessToken: data.data.accessToken });
      connectSocket(data.data.accessToken);
      return true;
    } catch (err) {
      set({ authError: err.response?.data?.message || 'Login failed' });
      return false;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Even if the network call fails, still clear local state below so
      // the user isn't stuck "logged in" on a dead session.
    } finally {
      socket.disconnect();
      useChatStore.getState().reset();
      set({ user: null, accessToken: null });
    }
  },

  // Called once on app load. The refresh token lives in an httpOnly cookie
  // (invisible to JS), so this is how a page refresh restores a session
  // instead of bouncing straight to the login page every time.
  checkAuth: async () => {
    try {
      const { data } = await api.post('/auth/refresh-token');
      set({ accessToken: data.data.accessToken, user: data.data.user });
      connectSocket(data.data.accessToken);
    } catch {
      set({ user: null, accessToken: null });
    } finally {
      set({ isAuthChecked: true });
    }
  },
}));

export default useAuthStore;
