import mongoose, { Schema, Document } from 'mongoose';

export interface IComplaint extends Document {
  ticketId: string;
  subject: string;
  category: 'Billing & Insurance' | 'Doctor Consultation' | 'Nursing Care' | 'Hospital Cleanliness' | 'Pharmacy & Medication' | 'Wait Time & Queue' | 'Other';
  source: 'Patient' | 'Attendant' | 'Employee' | 'Public Website' | 'Helpdesk';
  branchId: string;
  department?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'NEW' | 'ASSIGNED' | 'UNDER_REVIEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  slaHours: number;
  slaTargetDate: Date;
  isBreached: boolean;
  assignedToUserId?: string;
  assignedToName?: string;
  complainantName: string;
  complainantPhone: string;
  description: string;
  notes?: Array<{ author: string; text: string; date: Date; isInternal: boolean }>;
  resolutionSummary?: string;
  resolvedBy?: string;
  resolvedAt?: Date;
  isConfidential: boolean;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintSchema = new Schema<IComplaint>(
  {
    ticketId: { type: String, required: true, unique: true, index: true },
    subject: { type: String, required: true },
    category: {
      type: String,
      enum: [
        'Billing & Insurance',
        'Doctor Consultation',
        'Nursing Care',
        'Hospital Cleanliness',
        'Pharmacy & Medication',
        'Wait Time & Queue',
        'Other',
      ],
      required: true,
      index: true,
    },
    source: {
      type: String,
      enum: ['Patient', 'Attendant', 'Employee', 'Public Website', 'Helpdesk'],
      required: true,
    },
    branchId: { type: String, required: true, index: true },
    department: { type: String },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
      index: true,
    },
    status: {
      type: String,
      enum: ['NEW', 'ASSIGNED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
      default: 'NEW',
      index: true,
    },
    slaHours: { type: Number, default: 24 },
    slaTargetDate: { type: Date, required: true, index: true },
    isBreached: { type: Boolean, default: false, index: true },
    assignedToUserId: { type: String, index: true },
    assignedToName: { type: String },
    complainantName: { type: String, required: true },
    complainantPhone: { type: String, required: true },
    description: { type: String, required: true },
    notes: [
      {
        author: String,
        text: String,
        date: { type: Date, default: Date.now },
        isInternal: { type: Boolean, default: false },
      },
    ],
    resolutionSummary: { type: String },
    resolvedBy: { type: String },
    resolvedAt: { type: Date },
    isConfidential: { type: Boolean, default: false, index: true },
    organizationId: { type: String, default: 'org-aarogya' },
  },
  { timestamps: true }
);

export const ComplaintModel = mongoose.model<IComplaint>(
  'Complaint',
  ComplaintSchema,
  'complaints'
);
