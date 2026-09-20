import { IncomeRecord, RevenueCategory, PaymentMethod } from '@/types';
import { mockStore, simulateDelay } from './mockStore';

export interface FinanceFilters {
  branchId?: string;
  category?: RevenueCategory | 'ALL';
  paymentMethod?: PaymentMethod | 'ALL';
  startDate?: string;
  endDate?: string;
}

export interface RevenueSummary {
  totalRevenue: number;
  byCategory: Record<RevenueCategory, number>;
  byPaymentMethod: Record<PaymentMethod, number>;
  byBranch: Record<string, { branchName: string; amount: number }>;
}

export const financeService = {
  async getIncomeRecords(filters: FinanceFilters = {}): Promise<IncomeRecord[]> {
    let records = [...mockStore.getState().incomeRecords];

    if (filters.branchId && filters.branchId !== 'all') {
      records = records.filter((r) => r.branchId === filters.branchId);
    }

    if (filters.category && filters.category !== 'ALL') {
      records = records.filter((r) => r.category === filters.category);
    }

    if (filters.paymentMethod && filters.paymentMethod !== 'ALL') {
      records = records.filter((r) => r.paymentMethod === filters.paymentMethod);
    }

    return simulateDelay(records);
  },

  async getRevenueSummary(branchId?: string): Promise<RevenueSummary> {
    let records = [...mockStore.getState().incomeRecords].filter((r) => r.status === 'ACTIVE');

    if (branchId && branchId !== 'all') {
      records = records.filter((r) => r.branchId === branchId);
    }

    const byCategory: Record<RevenueCategory, number> = {
      OP: 0,
      Medical: 0,
      Lab: 0,
      'Day Care': 0,
      Dressing: 0,
      KIT: 0,
      Socks: 0,
      Slipper: 0,
      'Other Collections': 0,
    };

    const byPaymentMethod: Record<PaymentMethod, number> = {
      Cash: 0,
      UPI: 0,
      Card: 0,
      'Bank Transfer': 0,
    };

    const byBranch: Record<string, { branchName: string; amount: number }> = {};

    let totalRevenue = 0;

    for (const rec of records) {
      totalRevenue += rec.amount;

      if (byCategory[rec.category] !== undefined) {
        byCategory[rec.category] += rec.amount;
      }

      if (byPaymentMethod[rec.paymentMethod] !== undefined) {
        byPaymentMethod[rec.paymentMethod] += rec.amount;
      }

      if (!byBranch[rec.branchId]) {
        byBranch[rec.branchId] = { branchName: rec.branchName, amount: 0 };
      }
      byBranch[rec.branchId].amount += rec.amount;
    }

    return simulateDelay({
      totalRevenue,
      byCategory,
      byPaymentMethod,
      byBranch,
    });
  },

  async recordIncome(newRecord: Omit<IncomeRecord, '_id' | 'receiptNumber'>): Promise<IncomeRecord> {
    const branch = mockStore.getState().branches.find((b) => b._id === newRecord.branchId);
    const branchCode = branch ? branch.code.replace('BR-', '') : 'GEN';
    const randNum = Math.floor(100 + Math.random() * 900);
    const receiptNumber = `RCP-${branchCode}-24-${randNum}`;

    const record: IncomeRecord = {
      ...newRecord,
      _id: `inc-${Date.now()}`,
      receiptNumber,
    };

    mockStore.setState((state) => ({
      ...state,
      incomeRecords: [record, ...state.incomeRecords],
    }));

    return simulateDelay(record);
  },

  async adjustIncomeRecord(receiptId: string, reason: string): Promise<IncomeRecord> {
    let updated: IncomeRecord | undefined;
    mockStore.setState((state) => {
      const incomeRecords = state.incomeRecords.map((r) => {
        if (r._id === receiptId) {
          updated = {
            ...r,
            status: 'ADJUSTED' as const,
            notes: `${r.notes || ''} [Adjusted: ${reason}]`,
          };
          return updated;
        }
        return r;
      });
      return { ...state, incomeRecords };
    });

    if (!updated) throw new Error('Income record not found');
    return simulateDelay(updated);
  },
};
