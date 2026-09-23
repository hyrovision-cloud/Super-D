import mongoose, { Document } from 'mongoose';
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
export declare const AdvertisementModel: mongoose.Model<IAdvertisement, {}, {}, {}, mongoose.Document<unknown, {}, IAdvertisement, {}, {}> & IAdvertisement & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
