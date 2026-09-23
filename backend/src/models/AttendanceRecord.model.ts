import mongoose, { Schema, Document } from 'mongoose';
import { BranchId } from '../config/constants';

export interface IAttendanceRecord extends Document {
  employeeId: string;
  employeeNumber: string;
  employeeName: string;
  role: string;
  branchId: BranchId;
  date: string; // YYYY-MM-DD
  checkIn?: string; // HH:mm AM/PM
  checkOut?: string;
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'ON_LEAVE' | 'LATE' | 'WORK_FROM_HOME' | 'HOLIDAY';
  punchType?: 'BIOMETRIC' | 'MANUAL' | 'GEO_FENCE';
  verifiedBy?: string;
  notes?: string;
  isActive: boolean;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceRecordSchema = new Schema<IAttendanceRecord>(
  {
    employeeId: { type: String, required: true, index: true },
    employeeNumber: { type: String, required: true },
    employeeName: { type: String, required: true },
    role: { type: String, required: true },
    branchId: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true },
    checkIn: { type: String },
    checkOut: { type: String },
    status: {
      type: String,
      enum: ['PRESENT', 'ABSENT', 'HALF_DAY', 'ON_LEAVE', 'LATE', 'WORK_FROM_HOME', 'HOLIDAY'],
      default: 'PRESENT',
      index: true,
    },
    punchType: { type: String, enum: ['BIOMETRIC', 'MANUAL', 'GEO_FENCE'], default: 'BIOMETRIC' },
    verifiedBy: { type: String },
    notes: { type: String },
    isActive: { type: Boolean, default: true, index: true },
    archivedAt: { type: Date },
  },
  { timestamps: true }
);

AttendanceRecordSchema.index({ employeeId: 1, date: 1 }, { unique: true });

export const AttendanceRecordModel = mongoose.model<IAttendanceRecord>(
  'AttendanceRecord',
  AttendanceRecordSchema,
  'attendance_records'
);
