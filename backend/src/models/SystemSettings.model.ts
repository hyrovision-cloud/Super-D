import mongoose, { Schema, Document } from 'mongoose';

export interface ISystemSettings extends Document {
  key: 'application';
  emailAlerts: boolean;
  smsAlerts: boolean;
  soundAlerts: boolean;
  currency: 'INR';
  dateFormat: 'DD-MM-YYYY' | 'DD.MM.YYYY' | 'YYYY-MM-DD';
  attendanceStatuses: Array<{ code: string; label: string; enabled: boolean }>;
}

const AttendanceStatusSchema = new Schema({ code: { type: String, required: true }, label: { type: String, required: true }, enabled: { type: Boolean, required: true } }, { _id: false });
const SystemSettingsSchema = new Schema<ISystemSettings>({
  key: { type: String, enum: ['application'], default: 'application', unique: true },
  emailAlerts: { type: Boolean, default: true }, smsAlerts: { type: Boolean, default: true }, soundAlerts: { type: Boolean, default: false },
  currency: { type: String, enum: ['INR'], default: 'INR' },
  dateFormat: { type: String, enum: ['DD-MM-YYYY', 'DD.MM.YYYY', 'YYYY-MM-DD'], default: 'DD-MM-YYYY' },
  attendanceStatuses: { type: [AttendanceStatusSchema], default: () => [
    { code: 'PRESENT', label: 'Present', enabled: true }, { code: 'ABSENT', label: 'Absent', enabled: true }, { code: 'LATE', label: 'Late', enabled: true },
    { code: 'HALF_DAY', label: 'Half Day', enabled: true }, { code: 'ON_LEAVE', label: 'On Leave', enabled: true }, { code: 'WORK_FROM_HOME', label: 'Work From Home', enabled: true }, { code: 'HOLIDAY', label: 'Holiday', enabled: true },
  ] },
}, { timestamps: true });

export const SystemSettingsModel = mongoose.model<ISystemSettings>('SystemSettings', SystemSettingsSchema, 'system_settings');
