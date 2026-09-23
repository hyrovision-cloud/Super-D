import mongoose, { Schema, Document } from 'mongoose';
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

const AppointmentSchema = new Schema<IAppointment>(
  {
    appointmentNumber: { type: String, required: true, unique: true, index: true },
    patientId: { type: String, required: true, index: true },
    patientName: { type: String, required: true },
    uhid: { type: String, required: true, index: true },
    doctorId: { type: String, required: true, index: true },
    doctorName: { type: String, required: true },
    department: { type: String, required: true },
    branchId: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true },
    timeSlot: { type: String, required: true },
    type: { type: String, enum: ['OP', 'FOLLOW_UP', 'EMERGENCY', 'CONSULTATION'], default: 'OP' },
    status: {
      type: String,
      enum: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'],
      default: 'SCHEDULED',
      index: true,
    },
    tokenNumber: { type: Number, required: true },
    reason: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export const AppointmentModel = mongoose.model<IAppointment>(
  'Appointment',
  AppointmentSchema,
  'appointments'
);
