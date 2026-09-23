import mongoose, { Document, Schema } from 'mongoose';
import { BranchId } from '../config/constants';

export interface IExpense extends Document {
  expenseNumber: string;
  branchId: BranchId;
  category: string;
  description: string;
  amount: number;
  expenseDate: Date;
  paymentStatus: 'PENDING' | 'PAID' | 'CANCELLED';
  paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Net Banking';
  recordedByName: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>({
  expenseNumber: { type: String, required: true, unique: true, index: true },
  branchId: { type: String, required: true, index: true },
  category: { type: String, required: true, index: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  expenseDate: { type: Date, required: true, index: true },
  paymentStatus: { type: String, enum: ['PENDING', 'PAID', 'CANCELLED'], default: 'PAID', index: true },
  paymentMethod: { type: String, enum: ['Cash', 'UPI', 'Card', 'Net Banking'], required: true },
  recordedByName: { type: String, required: true },
}, { timestamps: true });

export const ExpenseModel = mongoose.model<IExpense>('Expense', ExpenseSchema, 'expenses');
