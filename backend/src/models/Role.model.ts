import mongoose, { Schema, Document } from 'mongoose';
import { RoleName } from '../config/constants';

export interface IRole extends Document {
  name: RoleName;
  description: string;
  permissions: string[];
  isSystemRole: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    permissions: [{ type: String, required: true }],
    isSystemRole: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const RoleModel = mongoose.model<IRole>('Role', RoleSchema, 'roles');
