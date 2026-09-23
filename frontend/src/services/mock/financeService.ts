import { IncomeRecord, RevenueCategory, PaymentMethod } from '@/types';
import { httpClient } from '@/services/api/httpClient';

export interface FinanceFilters { branchId?: string; category?: RevenueCategory | 'ALL'; paymentMethod?: PaymentMethod | 'ALL'; startDate?: string; endDate?: string; }
export interface RevenueSummary { totalRevenue: number; byCategory: Record<RevenueCategory, number>; byPaymentMethod: Record<PaymentMethod, number>; byBranch: Record<string, { branchName: string; amount: number }>; }

const categoryFromApi: Record<string, RevenueCategory> = { 'OP Consultation': 'OP', 'Medical / Pharmacy': 'Medical', 'Lab & Diagnostics': 'Lab', 'Day Care': 'Day Care', 'Dressing & Procedures': 'Dressing', 'Surgical KIT & Consumables': 'KIT', 'Other Collections (Inpatient)': 'Other Collections' };
const categoryToApi = Object.fromEntries(Object.entries(categoryFromApi).map(([api, ui]) => [ui, api]));
const mapRecord = (row: any): IncomeRecord => ({ ...row, _id: String(row._id), dateTime: row.transactionDate, category: categoryFromApi[row.category] || row.category, paymentMethod: row.paymentMethod === 'Net Banking' ? 'Bank Transfer' : row.paymentMethod, recordedByName: row.recordedByName || '', branchName: row.branchName || '' });

export const financeService = {
  async getIncomeRecords(filters: FinanceFilters = {}): Promise<IncomeRecord[]> {
    const rows = await httpClient.get<any[]>('/revenue', { branchId: filters.branchId, category: filters.category && filters.category !== 'ALL' ? categoryToApi[filters.category] : undefined, paymentMethod: filters.paymentMethod === 'Bank Transfer' ? 'Net Banking' : filters.paymentMethod === 'ALL' ? undefined : filters.paymentMethod, from: filters.startDate, to: filters.endDate, limit: 100 });
    return rows.map(mapRecord);
  },
  async getRevenueSummary(branchId?: string): Promise<RevenueSummary> {
    const summary = await httpClient.get<any>('/dashboard/finance/summary', { branchId });
    const byCategory = { OP: 0, Medical: 0, Lab: 0, 'Day Care': 0, Dressing: 0, KIT: 0, Socks: 0, Slipper: 0, 'Other Collections': 0 } as Record<RevenueCategory, number>;
    Object.entries(summary.byCategory || {}).forEach(([key, value]) => { byCategory[categoryFromApi[key] || key as RevenueCategory] = Number(value); });
    const byPaymentMethod = { Cash: 0, UPI: 0, Card: 0, 'Bank Transfer': 0 } as Record<PaymentMethod, number>;
    Object.entries(summary.byPaymentMethod || {}).forEach(([key, value]) => { byPaymentMethod[key === 'Net Banking' ? 'Bank Transfer' : key as PaymentMethod] = Number(value); });
    return { totalRevenue: summary.totalRevenue, byCategory, byPaymentMethod, byBranch: Object.fromEntries((summary.branches || []).map((b: any) => [b.branchId, { branchName: b.branchName, amount: b.revenue }])) };
  },
  async recordIncome(record: Omit<IncomeRecord, '_id' | 'receiptNumber'>): Promise<IncomeRecord> {
    const suffix = `${Date.now()}`;
    const row = await httpClient.post<any>('/revenue', { ...record, receiptNumber: `REC-${suffix}`, transactionDate: record.dateTime, category: categoryToApi[record.category] || record.category, paymentMethod: record.paymentMethod === 'Bank Transfer' ? 'Net Banking' : record.paymentMethod, recordedBy: record.recordedByName });
    return mapRecord(row);
  },
  async adjustIncomeRecord(id: string, reason: string): Promise<IncomeRecord> { return mapRecord(await httpClient.patch<any>(`/revenue/${id}`, { status: 'ADJUSTED', adjustmentReason: reason })); },
};
