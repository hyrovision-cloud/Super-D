import mongoose, { Document } from 'mongoose';
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
export declare const ExpenseModel: mongoose.Model<IExpense, {}, {}, {}, mongoose.Document<unknown, {}, IExpense, {}, {}> & IExpense & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
