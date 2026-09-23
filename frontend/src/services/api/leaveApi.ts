import { httpClient } from './httpClient';
import { LeaveRequest } from '../../types';

export const leaveApi = {
  async getLeaveRequests(filters?: { branchId?: string; status?: string }): Promise<LeaveRequest[]> {
    return httpClient.get<LeaveRequest[]>('/leave-requests', filters);
  },

  async submitLeaveRequest(data: Partial<LeaveRequest>): Promise<LeaveRequest> {
    return httpClient.post<LeaveRequest>('/leave-requests', data);
  },

  async recordDecision(requestId: string, decision: 'APPROVED' | 'REJECTED', comment: string): Promise<LeaveRequest> {
    return httpClient.post<LeaveRequest>(`/leave-requests/${requestId}/decision`, { decision, comment });
  },
};
