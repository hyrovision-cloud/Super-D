import mongoose, { Document } from 'mongoose';
export interface INotification extends Document {
    notificationKey: string;
    userId: string;
    branchId?: string;
    title: string;
    message: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL';
    read: boolean;
    link?: string;
}
export declare const NotificationModel: mongoose.Model<INotification, {}, {}, {}, mongoose.Document<unknown, {}, INotification, {}, {}> & INotification & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
