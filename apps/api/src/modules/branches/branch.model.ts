import mongoose, { Schema, Document } from 'mongoose';

export interface IBranch extends Document {
  branchId: string;
  name: string;
  code: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  emergencyContact: string;
  managerName: string;
  totalBeds: number;
  occupiedBeds: number;
  activeDepartments: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

const BranchSchema = new Schema<IBranch>(
  {
    branchId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    emergencyContact: { type: String, required: true },
    managerName: { type: String, required: true },
    totalBeds: { type: Number, required: true, default: 0 },
    occupiedBeds: { type: Number, required: true, default: 0 },
    activeDepartments: [{ type: String }],
    status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'MAINTENANCE'], default: 'ACTIVE' },
    organizationId: { type: String, default: 'org-aarogya' },
  },
  { timestamps: true }
);

export const BranchModel = mongoose.model<IBranch>('Branch', BranchSchema, 'branches');
