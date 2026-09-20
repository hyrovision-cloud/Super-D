import { Request, Response, NextFunction } from 'express';
import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  timestamp: Date;
  actorUserId?: string;
  actorEmail?: string;
  actorRoles?: string[];
  action: string;
  module: string;
  recordType?: string;
  recordId?: string;
  branchId?: string;
  organizationId?: string;
  previousValue?: any;
  newValue?: any;
  requestId: string;
  ipAddress?: string;
  status: 'SUCCESS' | 'FAILURE';
  reason?: string;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    timestamp: { type: Date, default: Date.now, index: true },
    actorUserId: { type: String, index: true },
    actorEmail: { type: String },
    actorRoles: [{ type: String }],
    action: { type: String, required: true, index: true },
    module: { type: String, required: true, index: true },
    recordType: { type: String },
    recordId: { type: String, index: true },
    branchId: { type: String, index: true },
    organizationId: { type: String, default: 'org-aarogya' },
    previousValue: { type: Schema.Types.Mixed },
    newValue: { type: Schema.Types.Mixed },
    requestId: { type: String, required: true },
    ipAddress: { type: String },
    status: { type: String, enum: ['SUCCESS', 'FAILURE'], default: 'SUCCESS' },
    reason: { type: String },
  },
  { timestamps: false }
);

export const AuditLogModel = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema, 'audit_logs');

export async function recordAuditLog(entry: Partial<IAuditLog>): Promise<void> {
  try {
    await AuditLogModel.create({
      ...entry,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error('[AuditLog] Failed to persist audit record:', err);
  }
}

export function auditMiddleware(moduleName: string, actionName?: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Only audit mutating methods automatically
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      return next();
    }

    const originalJson = res.json.bind(res);
    res.json = function (body: any) {
      const statusCode = res.statusCode;
      const isSuccess = statusCode >= 200 && statusCode < 400;
      const action = actionName || `${req.method}_${req.baseUrl.split('/').pop() || 'RESOURCE'}`;

      // Redact passwords and sensitive keys
      const sanitizedBody = { ...req.body };
      delete sanitizedBody.password;
      delete sanitizedBody.token;
      delete sanitizedBody.refreshToken;

      recordAuditLog({
        actorUserId: req.user?.userId || 'anonymous',
        actorEmail: req.user?.email,
        actorRoles: req.user?.roles,
        action,
        module: moduleName,
        recordId: req.params.id || body?.data?.id || body?.data?._id,
        branchId: req.body?.branchId || (req.query?.branchId as string) || req.user?.primaryBranchId,
        requestId: req.id,
        ipAddress: req.ip || req.socket.remoteAddress,
        status: isSuccess ? 'SUCCESS' : 'FAILURE',
        newValue: isSuccess ? sanitizedBody : undefined,
        reason: isSuccess ? undefined : body?.error?.message,
      }).catch(() => {});

      return originalJson(body);
    };

    next();
  };
}
