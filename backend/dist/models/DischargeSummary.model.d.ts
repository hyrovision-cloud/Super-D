import mongoose, { Document } from 'mongoose';
import { BranchId } from '../config/constants';
export interface IDischargeSummary extends Document {
    dischargeNumber: string;
    patientId: string;
    uhid: string;
    patientName: string;
    age: number;
    gender: string;
    branchId: BranchId;
    admissionDate: string;
    admissionTime: string;
    dischargeDate: string;
    dischargeTime: string;
    primaryConsultantId: string;
    primaryConsultantName: string;
    department: string;
    finalDiagnosis: string;
    clinicalSummary: string;
    treatmentGiven: string;
    dischargeCondition: 'STABLE' | 'IMPROVED' | 'CRITICAL' | 'AGAINST_MEDICAL_ADVICE';
    dischargeMedications: Array<{
        medicineName: string;
        dosage: string;
        frequency: string;
        duration: string;
        instructions?: string;
    }>;
    followUpAdvice?: string;
    status: 'DRAFT' | 'PENDING_APPROVAL' | 'FINALIZED';
    approvedBy?: string;
    approvedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const DischargeSummaryModel: mongoose.Model<IDischargeSummary, {}, {}, {}, mongoose.Document<unknown, {}, IDischargeSummary, {}, {}> & IDischargeSummary & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
