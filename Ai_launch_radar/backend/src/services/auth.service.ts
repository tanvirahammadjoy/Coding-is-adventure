import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

/**
 * Single-operator auth: there's no user collection, no signup, no
 * roles. One password gates the whole dashboard. Kept as a real
 * bcrypt+JWT flow rather than a hardcoded header check because the
 * token still needs to expire, and the password still shouldn't sit
 * in plaintext in the env file.
 */

export interface TokenPayload {
  sub: "admin";
}

export const authService = {
  async verifyPassword(plain: string): Promise<boolean> {
    return bcrypt.compare(plain, env.adminPasswordHash);
  },

  signToken(): string {
    const payload: TokenPayload = { sub: "admin" };
    return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn } as jwt.SignOptions);
  },

  verifyToken(token: string): TokenPayload {
    return jwt.verify(token, env.jwtSecret) as TokenPayload;
  },
};
