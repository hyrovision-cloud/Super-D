import mongoose, { Document } from 'mongoose';
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
export declare const AuditLogModel: mongoose.Model<IAuditLog, {}, {}, {}, mongoose.Document<unknown, {}, IAuditLog, {}, {}> & IAuditLog & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
