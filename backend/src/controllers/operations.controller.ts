import { NextFunction, Request, Response } from 'express';
import { FilterQuery, Model } from 'mongoose';
import { AppointmentModel } from '../models/Appointment.model';
import { AttendanceRecordModel } from '../models/AttendanceRecord.model';
import { BranchModel } from '../models/Branch.model';
import { ComplaintModel } from '../models/Complaint.model';
import { EmployeeModel } from '../models/Employee.model';
import { ExpenseModel } from '../models/Expense.model';
import { IncomeRecordModel } from '../models/IncomeRecord.model';
import { LeaveRequestModel } from '../models/LeaveRequest.model';
import { AdvertisementModel } from '../models/Advertisement.model';
import { LeadModel } from '../models/Lead.model';
import { NotificationModel } from '../models/Notification.model';
import { PatientModel } from '../models/Patient.model';
import { sendSuccess } from '../utils/response';
import { ForbiddenError, NotFoundError } from '../utils/AppError';
import { ValidationError } from '../utils/AppError';
import { recordAudit } from '../services/audit/auditLogger';

const escapeRegex = (value: string) => value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

function parseDateOnly(value: unknown, field: 'from' | 'to'): string {
  const raw = String(value || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) throw new ValidationError(`${field} must use YYYY-MM-DD.`);
  const date = new Date(`${raw}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== raw) throw new ValidationError(`${field} is not a valid calendar date.`);
  return raw;
}

function scopeAllowsBranch(scope: Record<string, any> | undefined, branchId: string): boolean {
  if (!scope?.branchId) return true;
  return scope.branchId?.$in ? scope.branchId.$in.includes(branchId) : scope.branchId === branchId;
}

export function list(model: Model<any>, searchable: string[] = [], sort: Record<string, 1 | -1> = { createdAt: -1 }) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(100, Math.max(1, Number(req.query.limit || req.query.pageSize) || 20));
      const filter: FilterQuery<any> = { ...(req.scopeFilter || {}) };
      for (const key of ['status', 'department', 'category', 'paymentMethod', 'date', 'employeeId', 'doctorId', 'patientId']) {
        if (req.query[key] && req.query[key] !== 'all') filter[key] = req.query[key];
      }
      if (req.query.from || req.query.to) {
        const from = req.query.from ? parseDateOnly(req.query.from, 'from') : undefined;
        const to = req.query.to ? parseDateOnly(req.query.to, 'to') : undefined;
        if (from && to && from > to) throw new ValidationError('from must be on or before to.');
        const dateField = model.modelName === 'AttendanceRecord' ? 'date' : model.modelName === 'IncomeRecord' ? 'transactionDate' : model.modelName === 'Expense' ? 'expenseDate' : 'createdAt';
        filter[dateField] = {};
        if (dateField === 'date') {
          if (from) filter[dateField].$gte = from;
          if (to) filter[dateField].$lte = to;
        } else {
          if (from) filter[dateField].$gte = new Date(`${from}T00:00:00.000Z`);
          if (to) filter[dateField].$lt = new Date(`${to}T00:00:00.000Z`).setUTCDate(new Date(`${to}T00:00:00.000Z`).getUTCDate() + 1);
        }
      }
      if (req.query.search && searchable.length) {
        const regex = new RegExp(escapeRegex(String(req.query.search).trim()), 'i');
        const searchClause = searchable.map((field) => ({ [field]: regex }));
        if (filter.$or) filter.$and = [{ $or: filter.$or }, { $or: searchClause }];
        else filter.$or = searchClause;
      }
      const [data, total] = await Promise.all([
        model.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
        model.countDocuments(filter),
      ]);
      sendSuccess(res, data, `${model.modelName} records retrieved.`, 200, { page, limit, total, totalPages: Math.ceil(total / limit) });
    } catch (error) { next(error); }
  };
}

export function create(model: Model<any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const branchId = req.body.branchId || req.user?.primaryBranchId;
      if (branchId && !scopeAllowsBranch(req.scopeFilter, branchId)) throw new ForbiddenError('Branch is outside your authorized scope.');
      const record = await model.create({ ...req.body, ...(branchId && { branchId }) });
      sendSuccess(res, record, `${model.modelName} created.`, 201);
    } catch (error) { next(error); }
  };
}

export function update(model: Model<any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const current = await model.findById(req.params.id);
      if (!current) throw new NotFoundError(model.modelName, req.params.id);
      if (current.branchId && !scopeAllowsBranch(req.scopeFilter, current.branchId)) throw new ForbiddenError('Record is outside your authorized scope.');
      delete req.body.branchId;
      Object.assign(current, req.body);
      await current.save();
      sendSuccess(res, current, `${model.modelName} updated.`);
    } catch (error) { next(error); }
  };
}

export const operationsController = {
  appointments: list(AppointmentModel, ['appointmentNumber', 'patientName', 'doctorName', 'uhid']),
  createAppointment: create(AppointmentModel), updateAppointment: update(AppointmentModel),
  employees: list(EmployeeModel, ['employeeNumber', 'name', 'email', 'phone']),
  doctors: list(EmployeeModel, ['employeeNumber', 'name', 'department']),
  createEmployee: create(EmployeeModel), updateEmployee: update(EmployeeModel),
  attendance: list(AttendanceRecordModel, ['employeeNumber', 'employeeName']), createAttendance: create(AttendanceRecordModel),
  leave: list(LeaveRequestModel, ['requestNumber', 'employeeName', 'department']), createLeave: create(LeaveRequestModel), updateLeave: update(LeaveRequestModel),
  complaints: list(ComplaintModel, ['ticketNumber', 'title', 'patientName']), createComplaint: create(ComplaintModel), updateComplaint: update(ComplaintModel),
  revenue: list(IncomeRecordModel, ['receiptNumber', 'patientName', 'uhid']), createRevenue: create(IncomeRecordModel), updateRevenue: update(IncomeRecordModel),
  expenses: list(ExpenseModel, ['expenseNumber', 'description', 'category']), createExpense: create(ExpenseModel), updateExpense: update(ExpenseModel),
  advertisements: list(AdvertisementModel, ['campaignId', 'title', 'responsiblePerson']), createAdvertisement: create(AdvertisementModel), updateAdvertisement: update(AdvertisementModel),
  leads: list(LeadModel, ['leadNumber', 'name', 'phone', 'email']), createLead: create(LeadModel), updateLead: update(LeadModel),

  async updateAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await AttendanceRecordModel.findById(req.params.id);
      if (!record) throw new NotFoundError('Attendance record', req.params.id);
      if (!scopeAllowsBranch(req.scopeFilter, record.branchId)) throw new ForbiddenError('Record is outside your authorized scope.');
      const allowed = ['status', 'checkIn', 'checkOut', 'punchType', 'notes'];
      const changes = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
      if (Object.keys(changes).length === 0) throw new ValidationError('No editable attendance fields were provided.');
      Object.assign(record, changes, { verifiedBy: req.user?.name });
      await record.save();
      await recordAudit(req, 'ATTENDANCE_UPDATED', 'attendance', String(record._id), record.branchId, { fields: Object.keys(changes) });
      sendSuccess(res, record, 'Attendance updated successfully.');
    } catch (error) { next(error); }
  },

  async archiveAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await AttendanceRecordModel.findById(req.params.id);
      if (!record) throw new NotFoundError('Attendance record', req.params.id);
      if (!scopeAllowsBranch(req.scopeFilter, record.branchId)) throw new ForbiddenError('Record is outside your authorized scope.');
      record.isActive = false;
      record.archivedAt = new Date();
      await record.save();
      await recordAudit(req, 'ATTENDANCE_ARCHIVED', 'attendance', String(record._id), record.branchId);
      sendSuccess(res, record, 'Attendance archived successfully.');
    } catch (error) { next(error); }
  },

  async notifications(req: Request, res: Response, next: NextFunction) {
    try { sendSuccess(res, await NotificationModel.find({ userId: req.user!.userId }).sort({ createdAt: -1 }).lean()); } catch (e) { next(e); }
  },
  async markNotificationRead(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await NotificationModel.findOneAndUpdate({ _id: req.params.id, userId: req.user!.userId }, { read: true }, { new: true });
      if (!item) throw new NotFoundError('Notification', req.params.id);
      sendSuccess(res, item);
    } catch (e) { next(e); }
  },
  async markAllNotificationsRead(req: Request, res: Response, next: NextFunction) {
    try { const result = await NotificationModel.updateMany({ userId: req.user!.userId, read: false }, { read: true }); sendSuccess(res, { modifiedCount: result.modifiedCount }); } catch (e) { next(e); }
  },

  async financeSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const match = { ...(req.scopeFilter || {}) };
      const [revenue, expenses, byCategory, byPaymentMethod, branches] = await Promise.all([
        IncomeRecordModel.aggregate([{ $match: { ...match, status: 'ACTIVE' } }, { $group: { _id: '$branchId', total: { $sum: '$amount' }, count: { $sum: 1 } } }]),
        ExpenseModel.aggregate([{ $match: { ...match, paymentStatus: 'PAID' } }, { $group: { _id: '$branchId', total: { $sum: '$amount' }, count: { $sum: 1 } } }]),
        IncomeRecordModel.aggregate([{ $match: { ...match, status: 'ACTIVE' } }, { $group: { _id: '$category', total: { $sum: '$amount' } } }]),
        IncomeRecordModel.aggregate([{ $match: { ...match, status: 'ACTIVE' } }, { $group: { _id: '$paymentMethod', total: { $sum: '$amount' } } }]),
        BranchModel.find({ isActive: true }).sort({ name: 1 }).lean(),
      ]);
      const r = new Map(revenue.map((x) => [x._id, x]));
      const e = new Map(expenses.map((x) => [x._id, x]));
      const allowed = branches.filter((b) => scopeAllowsBranch(req.scopeFilter, b.branchId));
      const branchTotals = allowed.map((b) => ({ branchId: b.branchId, branchName: b.name, revenue: r.get(b.branchId)?.total || 0, expenses: e.get(b.branchId)?.total || 0, net: (r.get(b.branchId)?.total || 0) - (e.get(b.branchId)?.total || 0) }));
      sendSuccess(res, { totalRevenue: branchTotals.reduce((s, x) => s + x.revenue, 0), totalExpenses: branchTotals.reduce((s, x) => s + x.expenses, 0), netAmount: branchTotals.reduce((s, x) => s + x.net, 0), branches: branchTotals, byCategory: Object.fromEntries(byCategory.map((x) => [x._id, x.total])), byPaymentMethod: Object.fromEntries(byPaymentMethod.map((x) => [x._id, x.total])) });
    } catch (error) { next(error); }
  },

  async ownerSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const scope = req.scopeFilter || {};
      const [patients, appointments, employees, complaints] = await Promise.all([
        PatientModel.countDocuments(scope), AppointmentModel.countDocuments(scope), EmployeeModel.countDocuments(scope), ComplaintModel.countDocuments(scope),
      ]);
      sendSuccess(res, { patients, appointments, employees, complaints });
    } catch (error) { next(error); }
  },
};
