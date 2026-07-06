import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/response';

export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  next(ApiError.notFound(`Route not found - ${req.originalUrl}`));
};
