import mongoose, { Schema, Document } from 'mongoose';
import { BranchId } from '../config/constants';

export interface IAdvertisement extends Document {
  campaignId: string;
  title: string;
  platform: 'Google Ads' | 'Meta Ads' | 'YouTube' | 'Instagram' | 'Other';
  status: 'Running' | 'Scheduled' | 'Completed' | 'Draft';
  branchId: BranchId;
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  leadsCount: number;
  startDate: string;
  endDate: string;
  adUrl?: string;
  responsiblePerson: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdvertisementSchema = new Schema<IAdvertisement>(
  {
    campaignId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    platform: {
      type: String,
      enum: ['Google Ads', 'Meta Ads', 'YouTube', 'Instagram', 'Other'],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['Running', 'Scheduled', 'Completed', 'Draft'],
      default: 'Draft',
      index: true,
    },
    branchId: { type: String, required: true, index: true },
    budget: { type: Number, required: true },
    spend: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    leadsCount: { type: Number, default: 0 },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    adUrl: { type: String },
    responsiblePerson: { type: String, required: true },
  },
  { timestamps: true }
);

export const AdvertisementModel = mongoose.model<IAdvertisement>(
  'Advertisement',
  AdvertisementSchema,
  'advertisements'
);
