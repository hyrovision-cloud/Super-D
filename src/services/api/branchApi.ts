import { httpClient } from './httpClient';
import { Branch } from '../../types';

export const branchApi = {
  async getBranches(): Promise<Branch[]> {
    return httpClient.get<Branch[]>('/branches');
  },

  async getBranchById(branchId: string): Promise<Branch> {
    return httpClient.get<Branch>(`/branches/${branchId}`);
  },
};
