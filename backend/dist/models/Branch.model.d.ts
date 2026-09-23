import mongoose, { Document } from 'mongoose';
import { BranchId } from '../config/constants';
export interface IBranch extends Document {
    branchId: BranchId;
    name: string;
    code: string;
    city: string;
    address: string;
    phone: string;
    email: string;
    bedCapacity: number;
    departments: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const BranchModel: mongoose.Model<IBranch, {}, {}, {}, mongoose.Document<unknown, {}, IBranch, {}, {}> & IBranch & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
