import mongoose, { Schema, Document } from 'mongoose';
import { BranchId } from '../config/constants';

export interface IBranch extends Document {
  branchId: BranchId;
  name: string;
  code: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  bedCapacity: number;
  departments: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BranchSchema = new Schema<IBranch>(
  {
    branchId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    code: { type: String, required: true, uppercase: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    bedCapacity: { type: Number, default: 50 },
    departments: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const BranchModel = mongoose.model<IBranch>('Branch', BranchSchema, 'branches');
