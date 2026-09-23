import { Branch } from '@/types';
import { mockStore, simulateDelay } from './mockStore';

export const branchService = {
  async getAllBranches(): Promise<Branch[]> {
    const branches = mockStore.getState().branches;
    return simulateDelay(branches);
  },

  async getBranchById(branchId: string): Promise<Branch | undefined> {
    const branch = mockStore.getState().branches.find((b) => b._id === branchId);
    return simulateDelay(branch);
  },

  async updateBranch(branchId: string, updates: Partial<Branch>): Promise<Branch> {
    let updated: Branch | undefined;
    mockStore.setState((state) => {
      const branches = state.branches.map((b) => {
        if (b._id === branchId) {
          updated = { ...b, ...updates };
          return updated;
        }
        return b;
      });
      return { ...state, branches };
    });
    if (!updated) throw new Error('Branch not found');
    return simulateDelay(updated);
  },

  async addBranch(newBranch: Omit<Branch, '_id'>): Promise<Branch> {
    const branch: Branch = {
      ...newBranch,
      _id: `branch-${Date.now()}`,
    };
    mockStore.setState((state) => ({
      ...state,
      branches: [...state.branches, branch],
    }));
    return simulateDelay(branch);
  },
};
