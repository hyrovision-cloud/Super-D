import { UserModel, IUser } from './user.model';
import { NotFoundError, ConflictError } from '../../common/errors/AppError';
import { hashPassword } from '../../common/auth/token.service';

export class UserService {
  async getAllUsers(filter: Record<string, any> = {}): Promise<IUser[]> {
    return UserModel.find(filter).select('-passwordHash').sort({ name: 1 });
  }

  async getUserById(userId: string): Promise<IUser> {
    const user = await UserModel.findOne({
      $or: [{ userId }, { _id: userId }],
    }).select('-passwordHash');

    if (!user) {
      throw new NotFoundError('User', userId);
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email: email.toLowerCase().trim() });
  }

  async createUser(data: Partial<IUser> & { password?: string }): Promise<IUser> {
    const existing = await this.getUserByEmail(data.email!);
    if (existing) {
      throw new ConflictError(`User with email '${data.email}' already exists.`);
    }

    const passwordHash = await hashPassword(data.password || 'admin123');
    const newUser = await UserModel.create({
      ...data,
      passwordHash,
      status: data.status || 'ACTIVE',
    });

    const sanitized = newUser.toObject();
    delete (sanitized as any).passwordHash;
    return sanitized as any;
  }

  async updateUserStatus(userId: string, status: IUser['status']): Promise<IUser> {
    const user = await UserModel.findOneAndUpdate(
      { $or: [{ userId }, { _id: userId }] },
      { $set: { status } },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      throw new NotFoundError('User', userId);
    }
    return user;
  }

  async revokeSessions(userId: string): Promise<void> {
    const result = await UserModel.updateOne(
      { $or: [{ userId }, { _id: userId }] },
      { $set: { activeSessionTokens: [] } }
    );
    if (result.matchedCount === 0) {
      throw new NotFoundError('User', userId);
    }
  }
}

export const userService = new UserService();
