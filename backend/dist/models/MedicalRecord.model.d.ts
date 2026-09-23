import mongoose, { Document } from 'mongoose';
import { BranchId } from '../config/constants';
export interface IMedicalRecord extends Document {
    recordNumber: string;
    patientId: string;
    uhid: string;
    branchId: BranchId;
    doctorId: string;
    doctorName: string;
    date: Date;
    diagnosis: string;
    clinicalNotes: string;
    prescriptions: Array<{
        medicineName: string;
        dosage: string;
        frequency: string;
        duration: string;
    }>;
    vitals?: {
        bp?: string;
        pulse?: number;
        temperature?: number;
        spo2?: number;
    };
    attachments?: string[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const MedicalRecordModel: mongoose.Model<IMedicalRecord, {}, {}, {}, mongoose.Document<unknown, {}, IMedicalRecord, {}, {}> & IMedicalRecord & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
