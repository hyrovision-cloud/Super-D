import mongoose, { Schema, Document } from 'mongoose';
import { REVENUE_CATEGORIES, PAYMENT_METHODS, RevenueCategory } from '../../config/constants';

export interface IIncomeRecord extends Document {
  receiptNumber: string;
  transactionDate: Date;
  category: RevenueCategory;
  amount: number;
  paymentMethod: typeof PAYMENT_METHODS[number];
  branchId: string;
  patientId?: string;
  patientName: string;
  uhid?: string;
  recordedBy: string;
  recordedByName: string;
  status: 'ACTIVE' | 'ADJUSTED' | 'REVERSED';
  notes?: string;
  adjustmentRefId?: string;
  adjustmentReason?: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

const IncomeRecordSchema = new Schema<IIncomeRecord>(
  {
    receiptNumber: { type: String, required: true, unique: true, index: true },
    transactionDate: { type: Date, default: Date.now, index: true },
    category: {
      type: String,
      enum: REVENUE_CATEGORIES,
      required: true,
      index: true,
    },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      required: true,
      index: true,
    },
    branchId: { type: String, required: true, index: true },
    patientId: { type: String, index: true },
    patientName: { type: String, required: true },
    uhid: { type: String },
    recordedBy: { type: String, required: true },
    recordedByName: { type: String, required: true },
    status: {
      type: String,
      enum: ['ACTIVE', 'ADJUSTED', 'REVERSED'],
      default: 'ACTIVE',
      index: true,
    },
    notes: { type: String },
    adjustmentRefId: { type: String },
    adjustmentReason: { type: String },
    organizationId: { type: String, default: 'org-aarogya' },
  },
  { timestamps: true }
);

export const IncomeRecordModel = mongoose.model<IIncomeRecord>(
  'IncomeRecord',
  IncomeRecordSchema,
  'income_records'
);
