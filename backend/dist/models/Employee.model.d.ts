import mongoose, { Document } from 'mongoose';
import { BranchId } from '../config/constants';
export interface IEmployee extends Document {
    employeeNumber: string;
    name: string;
    role: string;
    department: string;
    branchId: BranchId;
    phone: string;
    email: string;
    status: 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';
    joinDate: string;
    userId?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const EmployeeModel: mongoose.Model<IEmployee, {}, {}, {}, mongoose.Document<unknown, {}, IEmployee, {}, {}> & IEmployee & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
