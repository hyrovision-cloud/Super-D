import mongoose, { Schema, Document } from 'mongoose';
import { BranchId, LeaveStatus } from '../config/constants';

export interface ILeaveRequest extends Document {
  requestNumber: string;
  employeeId: string;
  employeeName: string;
  role: string;
  department: string;
  branchId: BranchId;
  leaveType: 'CASUAL' | 'SICK' | 'EARNED' | 'PERMISSION' | 'MATERNITY' | 'EMERGENCY';
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: LeaveStatus;
  reviewStage: 'PENDING_MANAGER' | 'PENDING_HR' | 'APPROVED' | 'REJECTED';
  managerReview?: {
    reviewedBy: string;
    reviewedAt: Date;
    decision: 'APPROVED' | 'REJECTED';
    comments?: string;
  };
  hrReview?: {
    reviewedBy: string;
    reviewedAt: Date;
    decision: 'APPROVED' | 'REJECTED';
    comments?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const LeaveRequestSchema = new Schema<ILeaveRequest>(
  {
    requestNumber: { type: String, required: true, unique: true, index: true },
    employeeId: { type: String, required: true, index: true },
    employeeName: { type: String, required: true },
    role: { type: String, required: true },
    department: { type: String, required: true },
    branchId: { type: String, required: true, index: true },
    leaveType: {
      type: String,
      enum: ['CASUAL', 'SICK', 'EARNED', 'PERMISSION', 'MATERNITY', 'EMERGENCY'],
      required: true,
    },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    daysCount: { type: Number, required: true, min: 0.5 },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ['SUBMITTED', 'MANAGER_REVIEW', 'HR_REVIEW', 'APPROVED', 'REJECTED', 'CANCELLED'],
      default: 'SUBMITTED',
      index: true,
    },
    reviewStage: {
      type: String,
      enum: ['PENDING_MANAGER', 'PENDING_HR', 'APPROVED', 'REJECTED'],
      default: 'PENDING_MANAGER',
      index: true,
    },
    managerReview: {
      reviewedBy: { type: String },
      reviewedAt: { type: Date },
      decision: { type: String, enum: ['APPROVED', 'REJECTED'] },
      comments: { type: String },
    },
    hrReview: {
      reviewedBy: { type: String },
      reviewedAt: { type: Date },
      decision: { type: String, enum: ['APPROVED', 'REJECTED'] },
      comments: { type: String },
    },
  },
  { timestamps: true }
);

export const LeaveRequestModel = mongoose.model<ILeaveRequest>(
  'LeaveRequest',
  LeaveRequestSchema,
  'leave_requests'
);
