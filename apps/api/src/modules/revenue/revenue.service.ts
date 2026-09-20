import mongoose from 'mongoose';
import { IncomeRecordModel, IIncomeRecord } from './incomeRecord.model';
import { NotFoundError, ValidationError } from '../../common/errors/AppError';
import { REVENUE_CATEGORIES, RevenueCategory } from '../../config/constants';
import { eventBus } from '../../common/events/eventBus';

export class RevenueService {
  async getAllIncomeRecords(
    filter: Record<string, any> = {},
    dateFrom?: string,
    dateTo?: string
  ): Promise<IIncomeRecord[]> {
    const query: Record<string, any> = { ...filter };

    if (dateFrom || dateTo) {
      query.transactionDate = {};
      if (dateFrom) query.transactionDate.$gte = new Date(dateFrom);
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        query.transactionDate.$lte = to;
      }
    }

    return IncomeRecordModel.find(query).sort({ transactionDate: -1 });
  }

  async getIncomeRecordById(incomeId: string): Promise<IIncomeRecord> {
    const isObjectId = mongoose.Types.ObjectId.isValid(incomeId);
    const query = isObjectId ? { $or: [{ receiptNumber: incomeId }, { _id: incomeId }] } : { receiptNumber: incomeId };
    const record = await IncomeRecordModel.findOne(query);
    if (!record) {
      throw new NotFoundError('IncomeRecord', incomeId);
    }
    return record;
  }

  async recordIncome(data: Partial<IIncomeRecord>): Promise<IIncomeRecord> {
    if (!data.amount || data.amount <= 0) {
      throw new ValidationError('Income amount must be a positive number.');
    }

    if (!REVENUE_CATEGORIES.includes(data.category as RevenueCategory)) {
      throw new ValidationError(
        `Invalid revenue category '${data.category}'. Must be one of: ${REVENUE_CATEGORIES.join(', ')}`
      );
    }

    const branchCodeMap: Record<string, string> = {
      'branch-trichy': 'TRY',
      'branch-chennai': 'CHN',
      'branch-madurai': 'MDU',
      'branch-pudukkottai': 'PDK',
    };
    const code = branchCodeMap[data.branchId || ''] || 'GEN';
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const receiptNumber = `RCP-${code}-26-${randomSuffix}`;

    return IncomeRecordModel.create({
      ...data,
      receiptNumber,
      transactionDate: data.transactionDate || new Date(),
      status: 'ACTIVE',
    });
  }

  async recordAdjustment(
    incomeId: string,
    reason: string,
    adjustmentAmount: number,
    actorName: string
  ): Promise<IIncomeRecord> {
    if (!reason || reason.trim().length < 5) {
      throw new ValidationError('A detailed reason is required for financial adjustment or reversal.');
    }

    const original = await this.getIncomeRecordById(incomeId);
    original.status = 'ADJUSTED';
    original.adjustmentReason = reason;
    await original.save();

    // Create adjustment entry with negative or adjusted amount
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const adjustmentReceiptNumber = `ADJ-${original.receiptNumber.split('-').slice(1, 3).join('-')}-${randomSuffix}`;

    const adjustmentEntry = await IncomeRecordModel.create({
      receiptNumber: adjustmentReceiptNumber,
      transactionDate: new Date(),
      category: original.category,
      amount: -Math.abs(adjustmentAmount || original.amount),
      paymentMethod: original.paymentMethod,
      branchId: original.branchId,
      patientId: original.patientId,
      patientName: original.patientName,
      uhid: original.uhid,
      recordedBy: actorName,
      recordedByName: actorName,
      status: 'ADJUSTED',
      adjustmentRefId: original.receiptNumber,
      notes: `Reversal/Adjustment against receipt ${original.receiptNumber}. Reason: ${reason}`,
    });

    // Notify finance head & owner
    await eventBus.dispatchNotification({
      recipientUserId: 'owner@aarogya.com',
      title: 'Financial Adjustment / Reversal Posted',
      message: `Receipt ${original.receiptNumber} was adjusted by ${actorName}. Amount: ₹${adjustmentAmount}. Reason: ${reason}`,
      type: 'REVENUE',
      priority: 'HIGH',
      module: 'REVENUE',
      recordId: adjustmentEntry.receiptNumber,
      branchId: original.branchId,
    });

    return adjustmentEntry;
  }
}

export const revenueService = new RevenueService();
