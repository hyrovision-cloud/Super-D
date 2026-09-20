import mongoose, { Schema, Document } from 'mongoose';

export interface IRole extends Document {
  roleId: string;
  name: string;
  description: string;
  permissions: string[];
  defaultScope: 'ORGANIZATION' | 'SELECTED_BRANCHES' | 'OWN_BRANCH' | 'DEPARTMENT' | 'ASSIGNED_RECORDS' | 'OWN_RECORDS';
  isSystem: boolean;
  userCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema<IRole>(
  {
    roleId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    permissions: [{ type: String }],
    defaultScope: {
      type: String,
      enum: ['ORGANIZATION', 'SELECTED_BRANCHES', 'OWN_BRANCH', 'DEPARTMENT', 'ASSIGNED_RECORDS', 'OWN_RECORDS'],
      default: 'OWN_BRANCH',
    },
    isSystem: { type: Boolean, default: false },
    userCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const RoleModel = mongoose.model<IRole>('Role', RoleSchema, 'roles');
