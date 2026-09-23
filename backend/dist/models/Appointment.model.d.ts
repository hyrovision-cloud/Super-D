import mongoose, { Document } from 'mongoose';
import { BranchId, AppointmentStatus } from '../config/constants';
export interface IAppointment extends Document {
    appointmentNumber: string;
    patientId: string;
    patientName: string;
    uhid: string;
    doctorId: string;
    doctorName: string;
    department: string;
    branchId: BranchId;
    date: string;
    timeSlot: string;
    type: 'OP' | 'FOLLOW_UP' | 'EMERGENCY' | 'CONSULTATION';
    status: AppointmentStatus;
    tokenNumber: number;
    reason?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const AppointmentModel: mongoose.Model<IAppointment, {}, {}, {}, mongoose.Document<unknown, {}, IAppointment, {}, {}> & IAppointment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
