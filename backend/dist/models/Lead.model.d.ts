import mongoose, { Document } from 'mongoose';
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
export declare const LeadModel: mongoose.Model<ILead, {}, {}, {}, mongoose.Document<unknown, {}, ILead, {}, {}> & ILead & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
