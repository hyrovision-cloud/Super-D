import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  timestamp: Date;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  module: string;
  recordId?: string;
  branchId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    timestamp: { type: Date, default: Date.now, index: true },
    actorId: { type: String, required: true, index: true },
    actorName: { type: String, required: true },
    actorRole: { type: String, required: true },
    action: { type: String, required: true, index: true },
    module: { type: String, required: true, index: true },
    recordId: { type: String },
    branchId: { type: String, index: true },
    ipAddress: { type: String },
    userAgent: { type: String },
    details: { type: Schema.Types.Mixed },
  },
  { timestamps: false }
);

export const AuditLogModel = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema, 'audit_logs');
