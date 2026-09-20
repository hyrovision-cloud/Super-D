import { Request, Response, NextFunction } from 'express';
import { revenueService } from './revenue.service';

export class RevenueController {
  async getAllIncomeRecords(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filter: Record<string, any> = { ...req.scopeFilter };
      if (req.query.category && req.query.category !== 'all') {
        filter.category = req.query.category;
      }
      if (req.query.paymentMethod && req.query.paymentMethod !== 'all') {
        filter.paymentMethod = req.query.paymentMethod;
      }
      const dateFrom = req.query.dateFrom as string;
      const dateTo = req.query.dateTo as string;

      const records = await revenueService.getAllIncomeRecords(filter, dateFrom, dateTo);
      res.json({
        data: records,
        meta: { totalItems: records.length, requestId: req.id },
      });
    } catch (err) {
      next(err);
    }
  }

  async getIncomeRecordById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const record = await revenueService.getIncomeRecordById(req.params.incomeId);
      res.json({ data: record, meta: { requestId: req.id } });
    } catch (err) {
      next(err);
    }
  }

  async recordIncome(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const record = await revenueService.recordIncome({
        ...req.body,
        recordedBy: req.user?.userId || req.body.recordedBy,
        recordedByName: req.user?.name || req.body.recordedByName,
      });
      res.status(201).json({ data: record, meta: { requestId: req.id } });
    } catch (err) {
      next(err);
    }
  }

  async recordAdjustment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { reason, adjustmentAmount } = req.body;
      const actorName = req.user?.name || 'Finance Team';
      const adjustment = await revenueService.recordAdjustment(
        req.params.incomeId,
        reason,
        adjustmentAmount,
        actorName
      );
      res.status(201).json({ data: adjustment, meta: { requestId: req.id } });
    } catch (err) {
      next(err);
    }
  }
}

export const revenueController = new RevenueController();
