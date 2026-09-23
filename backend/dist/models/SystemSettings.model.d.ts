import mongoose, { Document } from 'mongoose';
export interface ISystemSettings extends Document {
    key: 'application';
    emailAlerts: boolean;
    smsAlerts: boolean;
    soundAlerts: boolean;
    currency: 'INR';
    dateFormat: 'DD-MM-YYYY' | 'DD.MM.YYYY' | 'YYYY-MM-DD';
    attendanceStatuses: Array<{
        code: string;
        label: string;
        enabled: boolean;
    }>;
}
export declare const SystemSettingsModel: mongoose.Model<ISystemSettings, {}, {}, {}, mongoose.Document<unknown, {}, ISystemSettings, {}, {}> & ISystemSettings & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
