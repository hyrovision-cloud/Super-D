import { Request, Response, NextFunction } from 'express';
import { BranchModel } from '../models/Branch.model';
import { IncomeRecordModel } from '../models/IncomeRecord.model';
import { sendSuccess } from '../utils/response';
import { NotFoundError } from '../utils/AppError';

export class BranchController {
  async getAllBranches(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const branches = await BranchModel.find({ isActive: true, ...(req.scopeFilter || {}) });
      sendSuccess(res, branches, 'Branches retrieved successfully.', 200, { total: branches.length });
    } catch (err) {
      next(err);
    }
  }

  async getBranchById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const branch = await BranchModel.findOne({ $or: [{ branchId: req.params.id }, ...(req.params.id.match(/^[a-f\d]{24}$/i) ? [{ _id: req.params.id }] : [])], ...(req.scopeFilter || {}) });
      if (!branch) {
        throw new NotFoundError('Branch', req.params.id);
      }
      sendSuccess(res, branch, 'Branch retrieved successfully.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * Organization-Wide Branch Comparison Report
   * ZERO-REVENUE RULE:
   * Starts from Branch Master (all 4 configured active branches).
   * Performs LEFT JOIN against IncomeRecordModel.
   * If a branch has 0 revenue for a date range, it is still returned with revenue = 0.
   */
  async getBranchComparison(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      const dateFilter: any = { status: 'ACTIVE' };
      if (startDate || endDate) {
        dateFilter.transactionDate = {};
        if (startDate) dateFilter.transactionDate.$gte = new Date(startDate as string);
        if (endDate) dateFilter.transactionDate.$lte = new Date(endDate as string);
      }

      // 1. Always query all configured active branches from the master
      const activeBranches = await BranchModel.find({ isActive: true }).sort({ name: 1 });

      // 2. Aggregate income records by branchId
      const revenueAggregate = await IncomeRecordModel.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: '$branchId',
            totalRevenue: { $sum: '$amount' },
            transactionCount: { $sum: 1 },
          },
        },
      ]);

      const revenueMap = new Map<string, { totalRevenue: number; transactionCount: number }>();
      revenueAggregate.forEach((item) => {
        revenueMap.set(item._id, {
          totalRevenue: item.totalRevenue,
          transactionCount: item.transactionCount,
        });
      });

      // 3. Map over EVERY active branch master record (LEFT JOIN preservation)
      const branches = activeBranches.map((b) => {
        const stats = revenueMap.get(b.branchId) || { totalRevenue: 0, transactionCount: 0 };
        return {
          branchId: b.branchId,
          branchName: b.name,
          code: b.code,
          city: b.city,
          bedCapacity: b.bedCapacity,
          revenue: stats.totalRevenue,
          transactionCount: stats.transactionCount,
        };
      });

      sendSuccess(res, { branches }, 'Branch comparison retrieved successfully.', 200, {
        totalConfiguredBranches: activeBranches.length,
        returnedBranches: branches.length,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const branchController = new BranchController();
