import mongoose, { Schema, Document } from 'mongoose';
import { BranchId, ComplaintStatus, PriorityLevel } from '../config/constants';

export interface IComplaintNote {
  noteId: string;
  authorName: string;
  authorRole: string;
  content: string;
  timestamp: Date;
  isInternal: boolean;
}

export interface IComplaint extends Document {
  ticketNumber: string;
  title: string;
  description: string;
  category: 'MEDICAL_CARE' | 'STAFF_BEHAVIOR' | 'FACILITY' | 'BILLING' | 'WAIT_TIME' | 'CLEANLINESS';
  priority: PriorityLevel;
  status: ComplaintStatus;
  branchId: BranchId;
  patientId?: string;
  patientName?: string;
  uhid?: string;
  assignedTo?: string;
  assignedToName?: string;
  notes: IComplaintNote[];
  slaHours: number;
  slaDeadline: Date;
  isOverdue: boolean;
  resolution?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintSchema = new Schema<IComplaint>(
  {
    ticketNumber: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['MEDICAL_CARE', 'STAFF_BEHAVIOR', 'FACILITY', 'BILLING', 'WAIT_TIME', 'CLEANLINESS'],
      required: true,
      index: true,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
      index: true,
    },
    status: {
      type: String,
      enum: ['NEW', 'ASSIGNED', 'INVESTIGATING', 'ACTION_TAKEN', 'RESOLVED', 'CLOSED', 'ESCALATED'],
      default: 'NEW',
      index: true,
    },
    branchId: { type: String, required: true, index: true },
    patientId: { type: String },
    patientName: { type: String },
    uhid: { type: String },
    assignedTo: { type: String },
    assignedToName: { type: String },
    notes: [
      {
        noteId: { type: String, required: true },
        authorName: { type: String, required: true },
        authorRole: { type: String, required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        isInternal: { type: Boolean, default: true },
      },
    ],
    slaHours: { type: Number, default: 24 },
    slaDeadline: { type: Date, required: true, index: true },
    isOverdue: { type: Boolean, default: false, index: true },
    resolution: { type: String },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

export const ComplaintModel = mongoose.model<IComplaint>('Complaint', ComplaintSchema, 'complaints');
