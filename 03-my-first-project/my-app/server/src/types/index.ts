export type UserRole = 'user' | 'admin';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Extend Express Request with authenticated user info
declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: UserRole;
    }
    interface Request {
      user?: User;
    }
  }
}

export {};
