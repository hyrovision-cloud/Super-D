import mongoose, { Document } from 'mongoose';
import { BranchId, ComplaintStatus, PriorityLevel } from '../config/constants';
export interface IComplaintNote {
    noteId: string;
    authorName: string;
    authorRole: string;
    content: string;
    timestamp: Date;
    isInternal: boolean;
}
export interface IComplaint extends Document {
    ticketNumber: string;
    title: string;
    description: string;
    category: 'MEDICAL_CARE' | 'STAFF_BEHAVIOR' | 'FACILITY' | 'BILLING' | 'WAIT_TIME' | 'CLEANLINESS';
    priority: PriorityLevel;
    status: ComplaintStatus;
    branchId: BranchId;
    patientId?: string;
    patientName?: string;
    uhid?: string;
    assignedTo?: string;
    assignedToName?: string;
    notes: IComplaintNote[];
    slaHours: number;
    slaDeadline: Date;
    isOverdue: boolean;
    resolution?: string;
    resolvedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ComplaintModel: mongoose.Model<IComplaint, {}, {}, {}, mongoose.Document<unknown, {}, IComplaint, {}, {}> & IComplaint & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
