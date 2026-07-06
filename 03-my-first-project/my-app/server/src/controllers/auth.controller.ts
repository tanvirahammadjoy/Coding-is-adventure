import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { user, tokens } = await authService.register(req.body);
  sendSuccess({
    res,
    statusCode: 201,
    message: 'Account created successfully',
    data: { user, ...tokens },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { user, tokens } = await authService.login(req.body);
  sendSuccess({
    res,
    message: 'Logged in successfully',
    data: { user, ...tokens },
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const tokens = await authService.refresh(req.body.refreshToken);
  sendSuccess({ res, message: 'Token refreshed', data: tokens });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  // Stateless JWT: client discards tokens. If using refresh-token
  // denylisting/rotation, revoke it here.
  sendSuccess({ res, message: 'Logged out successfully' });
});
