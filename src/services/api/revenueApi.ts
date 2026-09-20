import { httpClient } from './httpClient';
import { IncomeRecord } from '../../types';

export const revenueApi = {
  async getIncomeRecords(filters?: { branchId?: string; category?: string; paymentMethod?: string; dateFrom?: string; dateTo?: string }): Promise<IncomeRecord[]> {
    return httpClient.get<IncomeRecord[]>('/income-records', filters);
  },

  async recordIncome(data: Partial<IncomeRecord>): Promise<IncomeRecord> {
    return httpClient.post<IncomeRecord>('/income-records', data);
  },

  async recordAdjustment(incomeId: string, reason: string, adjustmentAmount: number): Promise<IncomeRecord> {
    return httpClient.post<IncomeRecord>(`/income-records/${incomeId}/adjustments`, { reason, adjustmentAmount });
  },
};
