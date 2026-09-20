import { Request, Response, NextFunction } from 'express';
import { AuditLogModel } from '../../common/audit/audit.service';

export class AuditController {
  async getAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filter: Record<string, any> = {};
      if (req.query.module && req.query.module !== 'all') {
        filter.module = req.query.module;
      }
      if (req.query.action && req.query.action !== 'all') {
        filter.action = req.query.action;
      }

      const logs = await AuditLogModel.find(filter).sort({ timestamp: -1 }).limit(100);

      res.json({
        data: logs,
        meta: { totalItems: logs.length, requestId: req.id },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const auditController = new AuditController();
