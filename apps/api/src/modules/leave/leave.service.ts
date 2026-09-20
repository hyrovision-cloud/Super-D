import mongoose from 'mongoose';
import { LeaveRequestModel, ILeaveRequest } from './leaveRequest.model';
import { NotFoundError, ValidationError } from '../../common/errors/AppError';
import { eventBus } from '../../common/events/eventBus';

export class LeaveService {
  async getAllLeaveRequests(filter: Record<string, any> = {}): Promise<ILeaveRequest[]> {
    return LeaveRequestModel.find(filter).sort({ createdAt: -1 });
  }

  async getLeaveRequestById(requestId: string): Promise<ILeaveRequest> {
    const isObjectId = mongoose.Types.ObjectId.isValid(requestId);
    const query = isObjectId ? { $or: [{ requestId }, { _id: requestId }] } : { requestId };
    const req = await LeaveRequestModel.findOne(query);
    if (!req) {
      throw new NotFoundError('LeaveRequest', requestId);
    }
    return req;
  }

  async submitLeaveRequest(data: Partial<ILeaveRequest>): Promise<ILeaveRequest> {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const requestId = `LR-${randomSuffix}`;

    const newReq = await LeaveRequestModel.create({
      ...data,
      requestId,
      status: 'SUBMITTED',
      currentStage: 'Manager Review',
    });

    // Notify branch admin & HR
    await eventBus.dispatchNotification({
      recipientUserId: 'admin.trichy@aarogya.com',
      title: 'New Leave Request Submitted',
      message: `${newReq.employeeName} (${newReq.department}) requested ${newReq.daysCount} days of ${newReq.leaveType}.`,
      type: 'LEAVE',
      priority: 'MEDIUM',
      module: 'LEAVE',
      recordId: newReq.requestId,
      branchId: newReq.branchId,
    });

    return newReq;
  }

  async recordDecision(
    requestId: string,
    decision: 'APPROVED' | 'REJECTED',
    comment: string,
    actorName: string
  ): Promise<ILeaveRequest> {
    const req = await this.getLeaveRequestById(requestId);

    // Enforce mandatory comment for rejection (LEA-003)
    if (decision === 'REJECTED') {
      if (!comment || comment.trim().length < 3) {
        throw new ValidationError('Rejection justification is mandatory when rejecting a leave request.');
      }
      req.status = 'REJECTED';
      req.rejectionReason = comment.trim();
      req.decisionComment = comment.trim();
      req.currentStage = 'Rejected';
    } else {
      req.status = 'APPROVED';
      req.decisionComment = comment ? comment.trim() : 'Approved';
      req.currentStage = 'Approved';
    }

    req.decidedBy = actorName;
    req.decidedAt = new Date();
    await req.save();

    // Dispatch notification to employee
    await eventBus.dispatchNotification({
      recipientUserId: req.employeeId,
      title: `Leave Request ${decision === 'APPROVED' ? 'Approved' : 'Rejected'}`,
      message: `Your ${req.leaveType} (${req.startDate} to ${req.endDate}) was ${decision.toLowerCase()} by ${actorName}.${decision === 'REJECTED' ? ` Reason: ${req.rejectionReason}` : ''}`,
      type: 'LEAVE',
      priority: decision === 'REJECTED' ? 'HIGH' : 'MEDIUM',
      module: 'LEAVE',
      recordId: req.requestId,
      branchId: req.branchId,
    });

    return req;
  }
}

export const leaveService = new LeaveService();
