import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// autoConnect is off - useAuthStore sets socket.auth = { token } and calls
// socket.connect() once login/register/checkAuth succeeds. Phase 3 adds the
// server-side handshake verification and the actual message/presence events.
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
});
