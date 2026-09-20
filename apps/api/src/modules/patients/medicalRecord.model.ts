import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicalRecord extends Document {
  recordId: string;
  patientId: string;
  uhid: string;
  branchId: string;
  doctorId: string;
  doctorName: string;
  date: Date;
  type: 'OPD_NOTE' | 'IPD_ROUNDS' | 'PRESCRIPTION' | 'LAB_ORDER' | 'DISCHARGE_SUMMARY';
  diagnosis: string;
  clinicalNotes: string;
  vitals?: {
    bp?: string;
    pulse?: number;
    temp?: number;
    spO2?: number;
    weight?: number;
  };
  prescriptions?: Array<{
    medicine: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  labInvestigations?: Array<{
    testName: string;
    status: 'ORDERED' | 'SAMPLE_COLLECTED' | 'RESULT_READY';
    result?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const MedicalRecordSchema = new Schema<IMedicalRecord>(
  {
    recordId: { type: String, required: true, unique: true, index: true },
    patientId: { type: String, required: true, index: true },
    uhid: { type: String, required: true, index: true },
    branchId: { type: String, required: true, index: true },
    doctorId: { type: String, required: true },
    doctorName: { type: String, required: true },
    date: { type: Date, default: Date.now },
    type: {
      type: String,
      enum: ['OPD_NOTE', 'IPD_ROUNDS', 'PRESCRIPTION', 'LAB_ORDER', 'DISCHARGE_SUMMARY'],
      required: true,
    },
    diagnosis: { type: String, required: true },
    clinicalNotes: { type: String, required: true },
    vitals: {
      bp: String,
      pulse: Number,
      temp: Number,
      spO2: Number,
      weight: Number,
    },
    prescriptions: [
      {
        medicine: String,
        dosage: String,
        frequency: String,
        duration: String,
        instructions: String,
      },
    ],
    labInvestigations: [
      {
        testName: String,
        status: { type: String, enum: ['ORDERED', 'SAMPLE_COLLECTED', 'RESULT_READY'] },
        result: String,
      },
    ],
  },
  { timestamps: true }
);

export const MedicalRecordModel = mongoose.model<IMedicalRecord>(
  'MedicalRecord',
  MedicalRecordSchema,
  'medical_records'
);
