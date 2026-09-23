import mongoose, { Schema, Document } from 'mongoose';
import { BranchId } from '../config/constants';

export interface ILead extends Document {
  leadNumber: string;
  name: string;
  phone: string;
  email?: string;
  source: 'Google Ads' | 'Meta Ads' | 'Website' | 'Walk-in' | 'Referral';
  campaignId?: string;
  branchId: BranchId;
  interestedSpecialty: string;
  status: 'NEW' | 'CONTACTED' | 'APPOINTMENT_BOOKED' | 'CONVERTED' | 'LOST';
  assignedTo?: string;
  assignedToName?: string;
  notes?: string;
  convertedPatientId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    leadNumber: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    phone: { type: String, required: true, index: true },
    email: { type: String },
    source: {
      type: String,
      enum: ['Google Ads', 'Meta Ads', 'Website', 'Walk-in', 'Referral'],
      required: true,
      index: true,
    },
    campaignId: { type: String, index: true },
    branchId: { type: String, required: true, index: true },
    interestedSpecialty: { type: String, required: true },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'APPOINTMENT_BOOKED', 'CONVERTED', 'LOST'],
      default: 'NEW',
      index: true,
    },
    assignedTo: { type: String },
    assignedToName: { type: String },
    notes: { type: String },
    convertedPatientId: { type: String },
  },
  { timestamps: true }
);

export const LeadModel = mongoose.model<ILead>('Lead', LeadSchema, 'leads');
