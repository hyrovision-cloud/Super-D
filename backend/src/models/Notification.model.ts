import mongoose, { Document, Schema } from 'mongoose';

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

const NotificationSchema = new Schema<INotification>({
  notificationKey: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  branchId: { type: String, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['INFO', 'SUCCESS', 'WARNING', 'CRITICAL'], default: 'INFO' },
  read: { type: Boolean, default: false, index: true },
  link: String,
}, { timestamps: true });

export const NotificationModel = mongoose.model<INotification>('Notification', NotificationSchema, 'notifications');
