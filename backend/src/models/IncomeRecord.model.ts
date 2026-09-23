import mongoose, { Schema, Document } from 'mongoose';
import { BranchId, RevenueCategory, PaymentMethod } from '../config/constants';

export interface IIncomeRecord extends Document {
  receiptNumber: string;
  transactionDate: Date;
  category: RevenueCategory;
  amount: number;
  paymentMethod: PaymentMethod;
  branchId: BranchId;
  patientId?: string;
  patientName?: string;
  uhid?: string;
  recordedBy: string;
  recordedByName: string;
  status: 'ACTIVE' | 'ADJUSTED' | 'CANCELLED';
  adjustmentReason?: string;
  adjustmentRefId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const IncomeRecordSchema = new Schema<IIncomeRecord>(
  {
    receiptNumber: { type: String, required: true, unique: true, index: true },
    transactionDate: { type: Date, default: Date.now, index: true },
    category: {
      type: String,
      enum: [
        'OP Consultation',
        'Medical / Pharmacy',
        'Lab & Diagnostics',
        'Day Care',
        'Dressing & Procedures',
        'Surgical KIT & Consumables',
        'Other Collections (Inpatient)',
      ],
      required: true,
      index: true,
    },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'UPI', 'Card', 'Net Banking', 'TPA Insurance'],
      required: true,
    },
    branchId: { type: String, required: true, index: true },
    patientId: { type: String, index: true },
    patientName: { type: String },
    uhid: { type: String, index: true },
    recordedBy: { type: String, required: true },
    recordedByName: { type: String, required: true },
    status: {
      type: String,
      enum: ['ACTIVE', 'ADJUSTED', 'CANCELLED'],
      default: 'ACTIVE',
      index: true,
    },
    adjustmentReason: { type: String },
    adjustmentRefId: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export const IncomeRecordModel = mongoose.model<IIncomeRecord>(
  'IncomeRecord',
  IncomeRecordSchema,
  'income_records'
);
