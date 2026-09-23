import mongoose, { Schema, Document } from 'mongoose';
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

const DischargeSummarySchema = new Schema<IDischargeSummary>(
  {
    dischargeNumber: { type: String, required: true, unique: true, index: true },
    patientId: { type: String, required: true, index: true },
    uhid: { type: String, required: true, index: true },
    patientName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    branchId: { type: String, required: true, index: true },
    admissionDate: { type: String, required: true },
    admissionTime: { type: String, required: true },
    dischargeDate: { type: String, required: true, index: true },
    dischargeTime: { type: String, required: true },
    primaryConsultantId: { type: String, required: true, index: true },
    primaryConsultantName: { type: String, required: true },
    department: { type: String, required: true },
    finalDiagnosis: { type: String, required: true },
    clinicalSummary: { type: String, required: true },
    treatmentGiven: { type: String, required: true },
    dischargeCondition: {
      type: String,
      enum: ['STABLE', 'IMPROVED', 'CRITICAL', 'AGAINST_MEDICAL_ADVICE'],
      default: 'STABLE',
    },
    dischargeMedications: [
      {
        medicineName: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String, required: true },
        instructions: { type: String },
      },
    ],
    followUpAdvice: { type: String },
    status: {
      type: String,
      enum: ['DRAFT', 'PENDING_APPROVAL', 'FINALIZED'],
      default: 'DRAFT',
      index: true,
    },
    approvedBy: { type: String },
    approvedAt: { type: Date },
  },
  { timestamps: true }
);

export const DischargeSummaryModel = mongoose.model<IDischargeSummary>(
  'DischargeSummary',
  DischargeSummarySchema,
  'discharge_summaries'
);
