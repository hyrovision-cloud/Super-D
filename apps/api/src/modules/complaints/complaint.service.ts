import mongoose from 'mongoose';
import { ComplaintModel, IComplaint } from './complaint.model';
import { NotFoundError, ValidationError } from '../../common/errors/AppError';
import { eventBus } from '../../common/events/eventBus';

export class ComplaintService {
  async getAllComplaints(
    filter: Record<string, any> = {},
    canViewConfidential = false
  ): Promise<IComplaint[]> {
    const complaints = await ComplaintModel.find(filter).sort({ createdAt: -1 });

    const now = Date.now();
    return complaints.map((c) => {
      const isBreached =
        now > new Date(c.slaTargetDate).getTime() &&
        c.status !== 'RESOLVED' &&
        c.status !== 'CLOSED';

      c.isBreached = isBreached;

      if (c.isConfidential && !canViewConfidential) {
        c.description = '[CONFIDENTIAL GRIEVANCE - SENSITIVE PERSONNEL/PATIENT DETAILS RESTRICTED]';
        c.complainantPhone = '*****';
      }

      return c;
    });
  }

  async getComplaintById(ticketId: string, canViewConfidential = false): Promise<IComplaint> {
    const isObjectId = mongoose.Types.ObjectId.isValid(ticketId);
    const query = isObjectId ? { $or: [{ ticketId }, { _id: ticketId }] } : { ticketId };
    const complaint = await ComplaintModel.findOne(query);

    if (!complaint) {
      throw new NotFoundError('Complaint', ticketId);
    }

    if (complaint.isConfidential && !canViewConfidential) {
      complaint.description = '[CONFIDENTIAL GRIEVANCE - SENSITIVE PERSONNEL/PATIENT DETAILS RESTRICTED]';
      complaint.complainantPhone = '*****';
    }

    return complaint;
  }

  async createComplaint(data: Partial<IComplaint>): Promise<IComplaint> {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const ticketId = `TKT-26-${randomSuffix}`;

    const priorityHours: Record<string, number> = {
      CRITICAL: 4,
      HIGH: 12,
      MEDIUM: 24,
      LOW: 48,
    };

    const slaHours = priorityHours[data.priority || 'MEDIUM'] || 24;
    const slaTargetDate = new Date(Date.now() + slaHours * 60 * 60 * 1000);

    const complaint = await ComplaintModel.create({
      ...data,
      ticketId,
      slaHours,
      slaTargetDate,
      status: 'NEW',
    });

    if (data.priority === 'CRITICAL') {
      await eventBus.dispatchNotification({
        recipientUserId: 'owner@aarogya.com',
        title: 'CRITICAL Patient Grievance Logged',
        message: `Urgent ticket ${complaint.ticketId} logged: ${complaint.subject} (SLA: 4 hours).`,
        type: 'COMPLAINT',
        priority: 'CRITICAL',
        module: 'COMPLAINTS',
        recordId: complaint.ticketId,
        branchId: complaint.branchId,
      });
    }

    return complaint;
  }

  async assignComplaint(
    ticketId: string,
    assignedToUserId: string,
    assignedToName: string
  ): Promise<IComplaint> {
    const complaint = await this.getComplaintById(ticketId, true);
    complaint.assignedToUserId = assignedToUserId;
    complaint.assignedToName = assignedToName;
    complaint.status = 'ASSIGNED';
    await complaint.save();

    await eventBus.dispatchNotification({
      recipientUserId: assignedToUserId,
      title: 'Complaint Assigned to You',
      message: `You have been assigned ticket ${complaint.ticketId}: ${complaint.subject}.`,
      type: 'COMPLAINT',
      priority: complaint.priority,
      module: 'COMPLAINTS',
      recordId: complaint.ticketId,
      branchId: complaint.branchId,
    });

    return complaint;
  }

  async resolveComplaint(
    ticketId: string,
    resolutionSummary: string,
    resolvedByName: string
  ): Promise<IComplaint> {
    if (!resolutionSummary || resolutionSummary.trim().length < 5) {
      throw new ValidationError('A detailed resolution summary is required to resolve a grievance.');
    }

    const complaint = await this.getComplaintById(ticketId, true);
    complaint.status = 'RESOLVED';
    complaint.resolutionSummary = resolutionSummary.trim();
    complaint.resolvedBy = resolvedByName;
    complaint.resolvedAt = new Date();
    await complaint.save();

    await eventBus.dispatchNotification({
      recipientUserId: 'admin.trichy@aarogya.com',
      title: 'Complaint Resolved',
      message: `Ticket ${complaint.ticketId} resolved by ${resolvedByName}. Action: ${resolutionSummary.slice(0, 80)}...`,
      type: 'COMPLAINT',
      priority: 'LOW',
      module: 'COMPLAINTS',
      recordId: complaint.ticketId,
      branchId: complaint.branchId,
    });

    return complaint;
  }
}

export const complaintService = new ComplaintService();
