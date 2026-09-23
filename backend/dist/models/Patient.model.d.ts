import mongoose, { Document } from 'mongoose';
import { BranchId } from '../config/constants';
export interface IPatient extends Document {
    uhid: string;
    name: string;
    age: number;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    phone: string;
    email?: string;
    bloodGroup?: string;
    address?: string;
    branchId: BranchId;
    emergencyContact?: {
        name: string;
        relationship: string;
        phone: string;
    };
    status: 'ACTIVE' | 'ADMITTED' | 'DISCHARGED' | 'INACTIVE';
    createdAt: Date;
    updatedAt: Date;
}
export declare const PatientModel: mongoose.Model<IPatient, {}, {}, {}, mongoose.Document<unknown, {}, IPatient, {}, {}> & IPatient & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
