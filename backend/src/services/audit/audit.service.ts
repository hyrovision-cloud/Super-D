import { Request, Response, NextFunction } from 'express';
import { AuditLogModel } from '../../models/AuditLog.model';
import { logger } from '../../utils/logger';

export class AuditService {
  async logEvent(params: {
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
  }): Promise<void> {
    try {
      await AuditLogModel.create({
        ...params,
        timestamp: new Date(),
      });
    } catch (err: any) {
      logger.error(`[AuditService] Failed to record audit log: ${err.message}`, err);
    }
  }
}

export const auditService = new AuditService();

export function auditMiddleware(moduleName: string, actionName: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const originalSend = res.send;

    res.send = function (body: any) {
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        auditService.logEvent({
          actorId: req.user.userId,
          actorName: req.user.name,
          actorRole: req.user.role,
          action: actionName,
          module: moduleName,
          branchId: (req.query.branchId as string) || req.body?.branchId || req.user.primaryBranchId,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          details: { method: req.method, path: req.path },
        });
      }
      return originalSend.call(this, body);
    };

    next();
  };
}
