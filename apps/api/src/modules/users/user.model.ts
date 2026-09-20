import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  userId: string;
  name: string;
  email: string;
  passwordHash: string;
  roles: string[];
  assignedBranches: string[];
  primaryBranchId?: string;
  department?: string;
  phone?: string;
  employeeId?: string;
  status: 'ACTIVE' | 'DISABLED' | 'LOCKED' | 'PENDING_ACTIVATION';
  lastLoginAt?: Date;
  activeSessionTokens?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    roles: [{ type: String, required: true }],
    assignedBranches: [{ type: String, required: true }],
    primaryBranchId: { type: String },
    department: { type: String },
    phone: { type: String },
    employeeId: { type: String },
    status: {
      type: String,
      enum: ['ACTIVE', 'DISABLED', 'LOCKED', 'PENDING_ACTIVATION'],
      default: 'ACTIVE',
      index: true,
    },
    lastLoginAt: { type: Date },
    activeSessionTokens: [{ type: String }],
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>('User', UserSchema, 'users');
