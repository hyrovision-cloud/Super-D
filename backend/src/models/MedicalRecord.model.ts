import mongoose, { Schema, Document } from 'mongoose';
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

const MedicalRecordSchema = new Schema<IMedicalRecord>(
  {
    recordNumber: { type: String, required: true, unique: true, index: true },
    patientId: { type: String, required: true, index: true },
    uhid: { type: String, required: true, index: true },
    branchId: { type: String, required: true, index: true },
    doctorId: { type: String, required: true, index: true },
    doctorName: { type: String, required: true },
    date: { type: Date, default: Date.now, index: true },
    diagnosis: { type: String, required: true },
    clinicalNotes: { type: String, default: '' },
    prescriptions: [
      {
        medicineName: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String, required: true },
      },
    ],
    vitals: {
      bp: { type: String },
      pulse: { type: Number },
      temperature: { type: Number },
      spo2: { type: Number },
    },
    attachments: [{ type: String }],
  },
  { timestamps: true }
);

export const MedicalRecordModel = mongoose.model<IMedicalRecord>(
  'MedicalRecord',
  MedicalRecordSchema,
  'medical_records'
);
