import { Request, Response, NextFunction } from 'express';
import { branchService } from './branch.service';

export class BranchController {
  async getAllBranches(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const branches = await branchService.getAllBranches(req.scopeFilter || {});
      res.json({
        data: branches,
        meta: {
          totalItems: branches.length,
          requestId: req.id,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async getBranchById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const branch = await branchService.getBranchById(req.params.branchId);
      res.json({
        data: branch,
        meta: {
          requestId: req.id,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async createBranch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newBranch = await branchService.createBranch(req.body);
      res.status(201).json({
        data: newBranch,
        meta: {
          requestId: req.id,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async updateBranch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await branchService.updateBranch(req.params.branchId, req.body);
      res.json({
        data: updated,
        meta: {
          requestId: req.id,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const branchController = new BranchController();
