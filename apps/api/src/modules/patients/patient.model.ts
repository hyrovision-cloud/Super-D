import mongoose, { Schema, Document } from 'mongoose';

export interface IPatient extends Document {
  uhid: string;
  patientId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email?: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  branchId: string;
  category: 'OPD' | 'IPD' | 'Emergency' | 'DayCare';
  status: 'ACTIVE' | 'FOLLOW_UP' | 'ADMITTED' | 'DISCHARGED' | 'INACTIVE';
  bloodGroup?: string;
  allergies?: string[];
  assignedDoctorId?: string;
  assignedDoctorName?: string;
  admissionDate?: Date;
  dischargeDate?: Date;
  bedNumber?: string;
  ward?: string;
  medicalAlerts?: string[];
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema = new Schema<IPatient>(
  {
    uhid: { type: String, required: true, unique: true, index: true },
    patientId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    phone: { type: String, required: true, index: true },
    email: { type: String },
    address: { type: String, required: true },
    emergencyContact: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      relationship: { type: String, required: true },
    },
    branchId: { type: String, required: true, index: true },
    category: {
      type: String,
      enum: ['OPD', 'IPD', 'Emergency', 'DayCare'],
      default: 'OPD',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'FOLLOW_UP', 'ADMITTED', 'DISCHARGED', 'INACTIVE'],
      default: 'ACTIVE',
      index: true,
    },
    bloodGroup: { type: String },
    allergies: [{ type: String }],
    assignedDoctorId: { type: String },
    assignedDoctorName: { type: String },
    admissionDate: { type: Date },
    dischargeDate: { type: Date },
    bedNumber: { type: String },
    ward: { type: String },
    medicalAlerts: [{ type: String }],
    organizationId: { type: String, default: 'org-aarogya' },
  },
  { timestamps: true }
);

export const PatientModel = mongoose.model<IPatient>('Patient', PatientSchema, 'patients');
