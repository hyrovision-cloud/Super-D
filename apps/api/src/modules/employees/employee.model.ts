import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
  employeeId: string;
  employeeNumber: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  branchId: string;
  designation: string;
  shift: 'Morning (07:00 - 15:00)' | 'Evening (15:00 - 23:00)' | 'Night (23:00 - 07:00)' | 'General (09:00 - 17:00)';
  status: 'ACTIVE' | 'ON_LEAVE' | 'ON_NOTICE' | 'SUSPENDED' | 'RESIGNED';
  joiningDate: string;
  qualification: string;
  replacementEmployeeId?: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema = new Schema<IEmployee>(
  {
    employeeId: { type: String, required: true, unique: true, index: true },
    employeeNumber: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    role: { type: String, required: true, index: true },
    department: { type: String, required: true, index: true },
    branchId: { type: String, required: true, index: true },
    designation: { type: String, required: true },
    shift: {
      type: String,
      enum: [
        'Morning (07:00 - 15:00)',
        'Evening (15:00 - 23:00)',
        'Night (23:00 - 07:00)',
        'General (09:00 - 17:00)',
      ],
      default: 'General (09:00 - 17:00)',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ON_LEAVE', 'ON_NOTICE', 'SUSPENDED', 'RESIGNED'],
      default: 'ACTIVE',
      index: true,
    },
    joiningDate: { type: String, required: true },
    qualification: { type: String, required: true },
    replacementEmployeeId: { type: String },
    organizationId: { type: String, default: 'org-aarogya' },
  },
  { timestamps: true }
);

export const EmployeeModel = mongoose.model<IEmployee>('Employee', EmployeeSchema, 'employees');
