import { Request, Response, NextFunction } from 'express';
import { leaveService } from './leave.service';

export class LeaveController {
  async getAllLeaveRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filter: Record<string, any> = { ...req.scopeFilter };
      if (req.query.status && req.query.status !== 'all') {
        filter.status = req.query.status;
      }

      const requests = await leaveService.getAllLeaveRequests(filter);
      res.json({
        data: requests,
        meta: { totalItems: requests.length, requestId: req.id },
      });
    } catch (err) {
      next(err);
    }
  }

  async getLeaveRequestById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const leaveReq = await leaveService.getLeaveRequestById(req.params.requestId);
      res.json({ data: leaveReq, meta: { requestId: req.id } });
    } catch (err) {
      next(err);
    }
  }

  async submitLeaveRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const leaveReq = await leaveService.submitLeaveRequest({
        ...req.body,
        employeeId: req.user?.userId || req.body.employeeId,
        employeeName: req.user?.name || req.body.employeeName,
      });
      res.status(201).json({ data: leaveReq, meta: { requestId: req.id } });
    } catch (err) {
      next(err);
    }
  }

  async recordDecision(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { decision, comment } = req.body;
      const actorName = req.user?.name || 'Administrator';
      const leaveReq = await leaveService.recordDecision(
        req.params.requestId,
        decision,
        comment,
        actorName
      );
      res.json({ data: leaveReq, meta: { requestId: req.id } });
    } catch (err) {
      next(err);
    }
  }
}

export const leaveController = new LeaveController();
