import mongoose, { Document } from 'mongoose';
import { BranchId } from '../config/constants';
export interface IAttendanceRecord extends Document {
    employeeId: string;
    employeeNumber: string;
    employeeName: string;
    role: string;
    branchId: BranchId;
    date: string;
    checkIn?: string;
    checkOut?: string;
    status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'ON_LEAVE' | 'LATE' | 'WORK_FROM_HOME' | 'HOLIDAY';
    punchType?: 'BIOMETRIC' | 'MANUAL' | 'GEO_FENCE';
    verifiedBy?: string;
    notes?: string;
    isActive: boolean;
    archivedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const AttendanceRecordModel: mongoose.Model<IAttendanceRecord, {}, {}, {}, mongoose.Document<unknown, {}, IAttendanceRecord, {}, {}> & IAttendanceRecord & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
