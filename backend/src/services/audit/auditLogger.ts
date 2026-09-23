import { Request } from 'express';
import { AuditLogModel } from '../../models/AuditLog.model';

/** Records security-relevant mutations without copying request bodies or secrets. */
export async function recordAudit(req: Request, action: string, module: string, recordId?: string, branchId?: string, details?: Record<string, unknown>): Promise<void> {
  const user = req.user;
  if (!user) return;
  await AuditLogModel.create({
    actorId: user.userId,
    actorName: user.name,
    actorRole: user.roles[0] || 'Unknown',
    action,
    module,
    recordId,
    branchId,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
    details,
  });
}
