import { Request, Response, NextFunction } from 'express';
import { ownerIntelligenceService } from './ownerIntelligence.service';

export class OwnerIntelligenceController {
  async queryIntelligence(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { query, branchId, dateFrom, dateTo } = req.body;
      const userId = req.user?.userId || 'unknown_owner';
      const userRole = req.user?.roles?.[0] || 'Hospital Owner';

      const filter = {
        branchId: branchId || 'all',
        dateFrom,
        dateTo,
      };

      const result = await ownerIntelligenceService.processExecutiveQuery(
        query || 'Summarize this month revenue and branch performance.',
        filter,
        userId,
        userRole
      );

      res.json({
        data: result,
        meta: { requestId: req.id },
      });
    } catch (err) {
      next(err);
    }
  }

  async getExecutiveBrief(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const brief = await ownerIntelligenceService.getExecutiveBrief();
      res.json({ data: brief, meta: { requestId: req.id } });
    } catch (err) {
      next(err);
    }
  }

  async getQueryHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || 'unknown_owner';
      const history = await ownerIntelligenceService.getQueryHistory(userId);
      res.json({
        data: history,
        meta: { totalItems: history.length, requestId: req.id },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const ownerIntelligenceController = new OwnerIntelligenceController();
