import { User } from '@/types';
import { mockStore, simulateDelay } from './mockStore';

export const userService = {
  async getAllUsers(): Promise<User[]> {
    const users = mockStore.getState().users;
    return simulateDelay(users);
  },

  async getUserById(userId: string): Promise<User | undefined> {
    const user = mockStore.getState().users.find((u) => u._id === userId);
    return simulateDelay(user);
  },

  async toggleUserStatus(userId: string): Promise<User> {
    let updated: User | undefined;
    mockStore.setState((state) => {
      const users = state.users.map((u) => {
        if (u._id === userId) {
          const nextStatus = u.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
          updated = { ...u, status: nextStatus };
          return updated;
        }
        return u;
      });
      return { ...state, users };
    });
    if (!updated) throw new Error('User not found');
    return simulateDelay(updated);
  },

  async createUser(newUser: Omit<User, '_id'>): Promise<User> {
    const user: User = {
      ...newUser,
      _id: `usr-${Date.now()}`,
    };
    mockStore.setState((state) => ({
      ...state,
      users: [...state.users, user],
    }));
    return simulateDelay(user);
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    let updated: User | undefined;
    mockStore.setState((state) => {
      const users = state.users.map((u) => {
        if (u._id === userId) {
          updated = { ...u, ...updates };
          return updated;
        }
        return u;
      });
      return { ...state, users };
    });
    if (!updated) throw new Error('User not found');
    return simulateDelay(updated);
  },
};
