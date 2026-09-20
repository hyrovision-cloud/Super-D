import { EventEmitter } from 'events';
import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  recipientUserId: string;
  title: string;
  message: string;
  type: 'APPOINTMENT' | 'LEAVE' | 'COMPLAINT' | 'REVENUE' | 'SYSTEM' | 'OWNER_ALERT';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  module: string;
  recordId?: string;
  branchId?: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipientUserId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['APPOINTMENT', 'LEAVE', 'COMPLAINT', 'REVENUE', 'SYSTEM', 'OWNER_ALERT'],
      required: true,
      index: true,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    module: { type: String, required: true },
    recordId: { type: String },
    branchId: { type: String, index: true },
    isRead: { type: Boolean, default: false, index: true },
    readAt: { type: Date },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

export const NotificationModel = mongoose.model<INotification>(
  'Notification',
  NotificationSchema,
  'notifications'
);

class HospitalEventBus extends EventEmitter {
  async dispatchNotification(payload: {
    recipientUserId: string;
    title: string;
    message: string;
    type: INotification['type'];
    priority?: INotification['priority'];
    module: string;
    recordId?: string;
    branchId?: string;
  }): Promise<void> {
    try {
      await NotificationModel.create({
        ...payload,
        priority: payload.priority || 'MEDIUM',
        isRead: false,
        createdAt: new Date(),
      });
      console.log(`[EventBus] Notification created for user '${payload.recipientUserId}': ${payload.title}`);
    } catch (err) {
      console.error('[EventBus] Failed to store notification:', err);
    }
  }
}

export const eventBus = new HospitalEventBus();
