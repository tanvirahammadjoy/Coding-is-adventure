import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { ApiError } from '../utils/response';
import { UserRole } from '../types';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate('jwt', { session: false }, (err: Error, user: Express.User | false) => {
    if (err) return next(err);
    if (!user) return next(ApiError.unauthorized('Authentication required'));
    req.user = user;
    next();
  })(req, res, next);
};

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(ApiError.unauthorized('Authentication required'));
    if (!roles.includes(req.user.role as UserRole)) {
      return next(ApiError.forbidden('You do not have permission to perform this action'));
    }
    next();
  };
};
