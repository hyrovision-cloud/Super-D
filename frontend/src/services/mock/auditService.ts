import { AuditLog } from '@/types';
import { mockStore, simulateDelay } from './mockStore';

export const auditService = {
  async getAuditLogs(): Promise<AuditLog[]> {
    const logs = mockStore.getState().auditLogs;
    return simulateDelay(logs);
  },

  async logEvent(
    action: string,
    module: string,
    recordId: string,
    branchName: string,
    details: string,
    actorName: string,
    actorRole: string
  ): Promise<AuditLog> {
    const newLog: AuditLog = {
      _id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName,
      actorRole,
      action,
      module,
      recordId,
      branchName,
      details,
    };

    mockStore.setState((state) => ({
      ...state,
      auditLogs: [newLog, ...state.auditLogs],
    }));

    return simulateDelay(newLog);
  },
};
