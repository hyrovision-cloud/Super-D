import { User } from '@/types';
import { httpClient } from '@/services/api/httpClient';

type CreateUser = Omit<User, '_id'> & { password: string };
const mapUser = (row: any): User => ({ ...row, _id: String(row._id), branchIds: row.assignedBranches || [], avatarUrl: row.avatarUrl || '' });

// Compatibility import path; data and mutations are backend-authoritative.
export const userService = {
  async getAllUsers(): Promise<User[]> { return (await httpClient.get<any[]>('/users')).map(mapUser); },
  async getUserById(userId: string): Promise<User | undefined> { return (await userService.getAllUsers()).find((user) => user._id === userId); },
  async toggleUserStatus(userId: string): Promise<User> {
    const current = await userService.getUserById(userId);
    if (!current) throw new Error('User not found');
    return mapUser(await httpClient.patch<any>(`/users/${userId}`, { status: current.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE' }));
  },
  async createUser(user: CreateUser): Promise<User> { return mapUser(await httpClient.post<any>('/users', { ...user, assignedBranches: user.branchIds })); },
  async updateUser(userId: string, updates: Partial<User>): Promise<User> { return mapUser(await httpClient.patch<any>(`/users/${userId}`, { ...updates, assignedBranches: updates.branchIds })); },
};
