import mongoose, { Document } from 'mongoose';
import { BranchId, LeaveStatus } from '../config/constants';
export interface ILeaveRequest extends Document {
    requestNumber: string;
    employeeId: string;
    employeeName: string;
    role: string;
    department: string;
    branchId: BranchId;
    leaveType: 'CASUAL' | 'SICK' | 'EARNED' | 'PERMISSION' | 'MATERNITY' | 'EMERGENCY';
    startDate: string;
    endDate: string;
    daysCount: number;
    reason: string;
    status: LeaveStatus;
    reviewStage: 'PENDING_MANAGER' | 'PENDING_HR' | 'APPROVED' | 'REJECTED';
    managerReview?: {
        reviewedBy: string;
        reviewedAt: Date;
        decision: 'APPROVED' | 'REJECTED';
        comments?: string;
    };
    hrReview?: {
        reviewedBy: string;
        reviewedAt: Date;
        decision: 'APPROVED' | 'REJECTED';
        comments?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
export declare const LeaveRequestModel: mongoose.Model<ILeaveRequest, {}, {}, {}, mongoose.Document<unknown, {}, ILeaveRequest, {}, {}> & ILeaveRequest & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
