import { userRepository } from '../repositories/user.repository';
import { ApiError } from '../utils/response';
import { IUser } from '../models/User.model';

export const userService = {
  async getProfile(userId: string): Promise<IUser> {
    const user = await userRepository.findById(userId);
    if (!user) throw ApiError.notFound('User not found');
    return user;
  },

  async updateProfile(userId: string, data: Partial<Pick<IUser, 'name' | 'email'>>): Promise<IUser> {
    const user = await userRepository.updateById(userId, data);
    if (!user) throw ApiError.notFound('User not found');
    return user;
  },

  async listUsers(): Promise<IUser[]> {
    return userRepository.findAll();
  },

  async deleteUser(userId: string): Promise<void> {
    const user = await userRepository.deleteById(userId);
    if (!user) throw ApiError.notFound('User not found');
  },
};
