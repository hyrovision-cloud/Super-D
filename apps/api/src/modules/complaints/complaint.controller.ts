import { Request, Response, NextFunction } from 'express';
import { complaintService } from './complaint.service';

export class ComplaintController {
  async getAllComplaints(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filter: Record<string, any> = { ...req.scopeFilter };
      if (req.query.status && req.query.status !== 'all') {
        filter.status = req.query.status;
      }
      if (req.query.priority && req.query.priority !== 'all') {
        filter.priority = req.query.priority;
      }

      const canViewConfidential = req.user?.permissions?.includes('complaint.view_confidential') || false;
      const complaints = await complaintService.getAllComplaints(filter, canViewConfidential);

      res.json({
        data: complaints,
        meta: { totalItems: complaints.length, requestId: req.id },
      });
    } catch (err) {
      next(err);
    }
  }

  async getComplaintById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const canViewConfidential = req.user?.permissions?.includes('complaint.view_confidential') || false;
      const complaint = await complaintService.getComplaintById(req.params.complaintId, canViewConfidential);
      res.json({ data: complaint, meta: { requestId: req.id } });
    } catch (err) {
      next(err);
    }
  }

  async createComplaint(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const complaint = await complaintService.createComplaint(req.body);
      res.status(201).json({ data: complaint, meta: { requestId: req.id } });
    } catch (err) {
      next(err);
    }
  }

  async assignComplaint(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { assignedToUserId, assignedToName } = req.body;
      const complaint = await complaintService.assignComplaint(
        req.params.complaintId,
        assignedToUserId,
        assignedToName
      );
      res.json({ data: complaint, meta: { requestId: req.id } });
    } catch (err) {
      next(err);
    }
  }

  async resolveComplaint(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { resolutionSummary } = req.body;
      const resolvedByName = req.user?.name || 'Quality Team';
      const complaint = await complaintService.resolveComplaint(
        req.params.complaintId,
        resolutionSummary,
        resolvedByName
      );
      res.json({ data: complaint, meta: { requestId: req.id } });
    } catch (err) {
      next(err);
    }
  }
}

export const complaintController = new ComplaintController();
