import mongoose, { Schema, Document } from 'mongoose';

export interface ILeaveRequest extends Document {
  requestId: string;
  employeeId: string;
  employeeName: string;
  department: string;
  branchId: string;
  leaveType: 'Casual Leave' | 'Sick Leave' | 'Earned Leave' | 'Maternity Leave' | 'On-Duty Permission';
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: 'SUBMITTED' | 'MANAGER_REVIEW' | 'HR_REVIEW' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  currentStage: string;
  replacementEmployeeName?: string;
  decisionComment?: string;
  rejectionReason?: string;
  decidedBy?: string;
  decidedAt?: Date;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeaveRequestSchema = new Schema<ILeaveRequest>(
  {
    requestId: { type: String, required: true, unique: true, index: true },
    employeeId: { type: String, required: true, index: true },
    employeeName: { type: String, required: true },
    department: { type: String, required: true },
    branchId: { type: String, required: true, index: true },
    leaveType: {
      type: String,
      enum: ['Casual Leave', 'Sick Leave', 'Earned Leave', 'Maternity Leave', 'On-Duty Permission'],
      required: true,
    },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    daysCount: { type: Number, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ['SUBMITTED', 'MANAGER_REVIEW', 'HR_REVIEW', 'APPROVED', 'REJECTED', 'CANCELLED'],
      default: 'SUBMITTED',
      index: true,
    },
    currentStage: { type: String, default: 'Manager Review' },
    replacementEmployeeName: { type: String },
    decisionComment: { type: String },
    rejectionReason: { type: String },
    decidedBy: { type: String },
    decidedAt: { type: Date },
    organizationId: { type: String, default: 'org-aarogya' },
  },
  { timestamps: true }
);

export const LeaveRequestModel = mongoose.model<ILeaveRequest>(
  'LeaveRequest',
  LeaveRequestSchema,
  'leave_requests'
);
