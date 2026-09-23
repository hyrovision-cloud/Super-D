import mongoose, { Schema, Document } from 'mongoose';
import { BranchId, RoleName } from '../config/constants';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  employeeId?: string;
  role: RoleName;
  roles: RoleName[];
  primaryBranchId: BranchId;
  assignedBranches: BranchId[];
  department?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DISABLED' | 'PENDING';
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    phone: { type: String },
    employeeId: { type: String, index: true },
    role: { type: String, required: true },
    roles: [{ type: String }],
    primaryBranchId: { type: String, required: true, index: true },
    assignedBranches: [{ type: String }],
    department: { type: String },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'DISABLED', 'PENDING'],
      default: 'ACTIVE',
      index: true,
    },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>('User', UserSchema, 'users');
