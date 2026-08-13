import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // sends the httpOnly refresh-token cookie
});

// Attach the current access token to every outgoing request.
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// These three never trigger a refresh-and-retry: a 401 from them means
// "actually not authenticated", not "access token expired".
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh-token'];

let isRefreshing = false;
let pendingRequests = []; // requests that arrived while a refresh was in flight

const resolvePending = (token) => {
  pendingRequests.forEach(({ resolve }) => resolve(token));
  pendingRequests = [];
};

const rejectPending = (error) => {
  pendingRequests.forEach(({ reject }) => reject(error));
  pendingRequests = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint = AUTH_ENDPOINTS.some((url) => originalRequest?.url?.includes(url));

    if (error.response?.status !== 401 || originalRequest._retry || isAuthEndpoint) {
      return Promise.reject(error);
    }

    // A second request that 401s while a refresh is already in flight
    // waits for that refresh instead of firing its own.
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await api.post('/auth/refresh-token');
      const newToken = data.data.accessToken;
      useAuthStore.getState().setAccessToken(newToken);
      resolvePending(newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      rejectPending(refreshError);
      useAuthStore.getState().logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
