import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/response';
import { ApiError } from '../utils/response';

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const user = await userService.getProfile(req.user.id);
  sendSuccess({ res, data: user });
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();
  const user = await userService.updateProfile(req.user.id, req.body);
  sendSuccess({ res, message: 'Profile updated', data: user });
});

export const listUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await userService.listUsers();
  sendSuccess({ res, data: users });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await userService.deleteUser(req.params.id);
  sendSuccess({ res, message: 'User deleted' });
});
