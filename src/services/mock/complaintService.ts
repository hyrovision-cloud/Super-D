import { ComplaintCase, ComplaintStatus, CaseNote } from '@/types';
import { mockStore, simulateDelay } from './mockStore';

export interface ComplaintFilters {
  branchId?: string;
  status?: ComplaintStatus | 'ALL';
  canViewConfidential?: boolean;
}

export const complaintService = {
  async getComplaints(filters: ComplaintFilters = {}): Promise<ComplaintCase[]> {
    let cases = [...mockStore.getState().complaints];

    if (filters.branchId && filters.branchId !== 'all') {
      cases = cases.filter((c) => c.branchId === filters.branchId);
    }

    if (filters.status && filters.status !== 'ALL') {
      cases = cases.filter((c) => c.status === filters.status);
    }

    if (!filters.canViewConfidential) {
      cases = cases.filter((c) => !c.isConfidential);
    }

    return simulateDelay(cases);
  },

  async assignComplaint(
    caseId: string,
    assignedToId: string,
    assignedToName: string
  ): Promise<ComplaintCase> {
    let updated: ComplaintCase | undefined;
    mockStore.setState((state) => {
      const complaints = state.complaints.map((c) => {
        if (c._id === caseId) {
          updated = {
            ...c,
            assignedToId,
            assignedToName,
            status: c.status === 'NEW' ? 'ASSIGNED' : c.status,
          };
          return updated;
        }
        return c;
      });
      return { ...state, complaints };
    });

    if (!updated) throw new Error('Complaint not found');
    return simulateDelay(updated);
  },

  async addNote(
    caseId: string,
    content: string,
    authorName: string,
    authorRole: string
  ): Promise<ComplaintCase> {
    let updated: ComplaintCase | undefined;
    const newNote: CaseNote = {
      _id: `cn-${Date.now()}`,
      caseId,
      content,
      authorName,
      authorRole,
      createdAt: new Date().toISOString(),
      isInternal: true,
    };

    mockStore.setState((state) => {
      const complaints = state.complaints.map((c) => {
        if (c._id === caseId) {
          updated = {
            ...c,
            internalNotes: [...(c.internalNotes || []), newNote],
          };
          return updated;
        }
        return c;
      });
      return { ...state, complaints };
    });

    if (!updated) throw new Error('Complaint not found');
    return simulateDelay(updated);
  },

  async resolveComplaint(
    caseId: string,
    resolutionSummary: string,
    resolvedBy: string
  ): Promise<ComplaintCase> {
    let updated: ComplaintCase | undefined;
    mockStore.setState((state) => {
      const complaints = state.complaints.map((c) => {
        if (c._id === caseId) {
          updated = {
            ...c,
            status: 'RESOLVED',
            resolutionSummary,
            resolvedBy,
            resolvedAt: new Date().toISOString(),
          };
          return updated;
        }
        return c;
      });
      return { ...state, complaints };
    });

    if (!updated) throw new Error('Complaint not found');
    return simulateDelay(updated);
  },

  async transitionStatus(caseId: string, status: ComplaintStatus): Promise<ComplaintCase> {
    let updated: ComplaintCase | undefined;
    mockStore.setState((state) => {
      const complaints = state.complaints.map((c) => {
        if (c._id === caseId) {
          updated = { ...c, status };
          return updated;
        }
        return c;
      });
      return { ...state, complaints };
    });

    if (!updated) throw new Error('Complaint not found');
    return simulateDelay(updated);
  },
};
