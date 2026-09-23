import mongoose, { Schema, Document } from 'mongoose';
import { BranchId } from '../config/constants';

export interface IEmployee extends Document {
  employeeNumber: string;
  name: string;
  role: string;
  department: string;
  branchId: BranchId;
  phone: string;
  email: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';
  joinDate: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema = new Schema<IEmployee>(
  {
    employeeNumber: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    role: { type: String, required: true },
    department: { type: String, required: true, index: true },
    branchId: { type: String, required: true, index: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, enum: ['ACTIVE', 'ON_LEAVE', 'TERMINATED'], default: 'ACTIVE' },
    joinDate: { type: String, required: true },
    userId: { type: String },
  },
  { timestamps: true }
);

export const EmployeeModel = mongoose.model<IEmployee>('Employee', EmployeeSchema, 'employees');
