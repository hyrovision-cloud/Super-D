import mongoose, { Schema, Document } from 'mongoose';
import { BranchId } from '../config/constants';

export interface IPatient extends Document {
  uhid: string; // Unique Hospital Identification (e.g. UHID-TRY-2026-0042)
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone: string;
  email?: string;
  bloodGroup?: string;
  address?: string;
  branchId: BranchId;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  status: 'ACTIVE' | 'ADMITTED' | 'DISCHARGED' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema = new Schema<IPatient>(
  {
    uhid: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'], required: true },
    phone: { type: String, required: true, index: true },
    email: { type: String },
    bloodGroup: { type: String },
    address: { type: String },
    branchId: { type: String, required: true, index: true },
    emergencyContact: {
      name: { type: String },
      relationship: { type: String },
      phone: { type: String },
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ADMITTED', 'DISCHARGED', 'INACTIVE'],
      default: 'ACTIVE',
      index: true,
    },
  },
  { timestamps: true }
);

export const PatientModel = mongoose.model<IPatient>('Patient', PatientSchema, 'patients');
