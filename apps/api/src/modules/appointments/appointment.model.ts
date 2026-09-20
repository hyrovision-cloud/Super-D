import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  department: string;
  branchId: string;
  date: string; // YYYY-MM-DD
  slotTime: string; // HH:mm
  type: 'General Checkup' | 'Follow-up' | 'Emergency Consultation' | 'Specialist Review';
  status: 'SCHEDULED' | 'CONFIRMED' | 'CHECKED_IN' | 'IN_CONSULTATION' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  reason: string;
  notes?: string;
  rescheduleReason?: string;
  cancelReason?: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    appointmentId: { type: String, required: true, unique: true, index: true },
    patientId: { type: String, required: true, index: true },
    patientName: { type: String, required: true },
    patientPhone: { type: String, required: true },
    doctorId: { type: String, required: true, index: true },
    doctorName: { type: String, required: true },
    department: { type: String, required: true },
    branchId: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true },
    slotTime: { type: String, required: true },
    type: {
      type: String,
      enum: ['General Checkup', 'Follow-up', 'Emergency Consultation', 'Specialist Review'],
      default: 'General Checkup',
    },
    status: {
      type: String,
      enum: ['SCHEDULED', 'CONFIRMED', 'CHECKED_IN', 'IN_CONSULTATION', 'COMPLETED', 'CANCELLED', 'NO_SHOW'],
      default: 'SCHEDULED',
      index: true,
    },
    reason: { type: String, required: true },
    notes: { type: String },
    rescheduleReason: { type: String },
    cancelReason: { type: String },
    organizationId: { type: String, default: 'org-aarogya' },
  },
  { timestamps: true }
);

// Index to prevent double booking of the same doctor at the same slot
AppointmentSchema.index({ doctorId: 1, date: 1, slotTime: 1, status: 1 });

export const AppointmentModel = mongoose.model<IAppointment>(
  'Appointment',
  AppointmentSchema,
  'appointments'
);
