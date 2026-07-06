import { UserModel, IUser } from '../models/User.model';

export const userRepository = {
  async create(data: Partial<IUser>): Promise<IUser> {
    return UserModel.create(data);
  },

  async findByEmail(email: string, withPassword = false): Promise<IUser | null> {
    const query = UserModel.findOne({ email: email.toLowerCase() });
    if (withPassword) query.select('+password');
    return query.exec();
  },

  async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id).exec();
  },

  async updateById(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
  },

  async deleteById(id: string): Promise<IUser | null> {
    return UserModel.findByIdAndDelete(id).exec();
  },

  async findAll(): Promise<IUser[]> {
    return UserModel.find().exec();
  },
};
