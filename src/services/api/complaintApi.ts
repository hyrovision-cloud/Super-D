import { httpClient } from './httpClient';
import { ComplaintCase } from '../../types';

export const complaintApi = {
  async getComplaints(filters?: { branchId?: string; status?: string; priority?: string }): Promise<ComplaintCase[]> {
    return httpClient.get<ComplaintCase[]>('/complaints', filters);
  },

  async getComplaintById(complaintId: string): Promise<ComplaintCase> {
    return httpClient.get<ComplaintCase>(`/complaints/${complaintId}`);
  },

  async createComplaint(data: Partial<ComplaintCase>): Promise<ComplaintCase> {
    return httpClient.post<ComplaintCase>('/complaints', data);
  },

  async assignComplaint(complaintId: string, assignedToUserId: string, assignedToName: string): Promise<ComplaintCase> {
    return httpClient.post<ComplaintCase>(`/complaints/${complaintId}/assign`, { assignedToUserId, assignedToName });
  },

  async resolveComplaint(complaintId: string, resolutionSummary: string): Promise<ComplaintCase> {
    return httpClient.post<ComplaintCase>(`/complaints/${complaintId}/resolve`, { resolutionSummary });
  },
};
