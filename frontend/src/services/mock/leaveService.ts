import { LeaveRequest } from '@/types';
import { mockStore, simulateDelay } from './mockStore';

export const leaveService = {
  async getLeaveRequests(branchId?: string): Promise<LeaveRequest[]> {
    let requests = [...mockStore.getState().leaveRequests];
    if (branchId && branchId !== 'all') {
      requests = requests.filter((r) => r.branchId === branchId);
    }
    return simulateDelay(requests);
  },

  async approveLeaveRequest(requestId: string, approverName: string): Promise<LeaveRequest> {
    let updated: LeaveRequest | undefined;
    mockStore.setState((state) => {
      const leaveRequests = state.leaveRequests.map((r) => {
        if (r._id === requestId) {
          // If in MANAGER_REVIEW, move to HR_REVIEW, or if HR_REVIEW/SUBMITTED move to APPROVED
          const nextStatus = r.status === 'MANAGER_REVIEW' ? 'HR_REVIEW' : 'APPROVED';
          updated = {
            ...r,
            status: nextStatus,
            decidedBy: approverName,
            decidedAt: new Date().toISOString(),
            decisionComment: 'Leave application approved.',
          };
          return updated;
        }
        return r;
      });
      return { ...state, leaveRequests };
    });

    if (!updated) throw new Error('Leave request not found');
    return simulateDelay(updated);
  },

  async rejectLeaveRequest(
    requestId: string,
    rejectionReason: string,
    rejectedBy: string
  ): Promise<LeaveRequest> {
    if (!rejectionReason || rejectionReason.trim().length === 0) {
      throw new Error('A mandatory rejection comment is required to reject a leave request.');
    }

    let updated: LeaveRequest | undefined;
    mockStore.setState((state) => {
      const leaveRequests = state.leaveRequests.map((r) => {
        if (r._id === requestId) {
          updated = {
            ...r,
            status: 'REJECTED',
            decisionComment: rejectionReason.trim(),
            decidedBy: rejectedBy,
            decidedAt: new Date().toISOString(),
          };
          return updated;
        }
        return r;
      });
      return { ...state, leaveRequests };
    });

    if (!updated) throw new Error('Leave request not found');
    return simulateDelay(updated);
  },

  async submitLeaveRequest(
    newRequest: Omit<LeaveRequest, '_id' | 'status' | 'submittedAt'>
  ): Promise<LeaveRequest> {
    const request: LeaveRequest = {
      ...newRequest,
      _id: `leave-${Date.now()}`,
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString(),
    };

    mockStore.setState((state) => ({
      ...state,
      leaveRequests: [request, ...state.leaveRequests],
    }));

    return simulateDelay(request);
  },
};
