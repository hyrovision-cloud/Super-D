import mongoose, { Document } from 'mongoose';
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
export declare const IncomeRecordModel: mongoose.Model<IIncomeRecord, {}, {}, {}, mongoose.Document<unknown, {}, IIncomeRecord, {}, {}> & IIncomeRecord & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
