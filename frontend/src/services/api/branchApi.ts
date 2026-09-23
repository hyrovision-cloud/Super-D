import { httpClient } from './httpClient';
import { Branch } from '../../types';

export const branchApi = {
  async getBranches(): Promise<Branch[]> {
    const branches = await httpClient.get<any[]>('/branches');
    return branches.map((branch) => ({ ...branch, _id: branch.branchId, status: branch.isActive ? 'ACTIVE' : 'MAINTENANCE', managerId: branch.managerId || '', managerName: branch.managerName || '', consultationRooms: branch.consultationRooms || 0 }));
  },

  async getBranchById(branchId: string): Promise<Branch> {
    const branch = await httpClient.get<any>(`/branches/${branchId}`);
    return { ...branch, _id: branch.branchId, status: branch.isActive ? 'ACTIVE' : 'MAINTENANCE' } as Branch;
  },
};
