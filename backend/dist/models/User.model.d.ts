import mongoose, { Document } from 'mongoose';
import { BranchId, RoleName } from '../config/constants';
export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    phone?: string;
    employeeId?: string;
    role: RoleName;
    roles: RoleName[];
    primaryBranchId: BranchId;
    assignedBranches: BranchId[];
    department?: string;
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DISABLED' | 'PENDING';
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const UserModel: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
