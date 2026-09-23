"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.operationsController = void 0;
exports.list = list;
exports.create = create;
exports.update = update;
const Appointment_model_1 = require("../models/Appointment.model");
const AttendanceRecord_model_1 = require("../models/AttendanceRecord.model");
const Branch_model_1 = require("../models/Branch.model");
const Complaint_model_1 = require("../models/Complaint.model");
const Employee_model_1 = require("../models/Employee.model");
const Expense_model_1 = require("../models/Expense.model");
const IncomeRecord_model_1 = require("../models/IncomeRecord.model");
const LeaveRequest_model_1 = require("../models/LeaveRequest.model");
const Advertisement_model_1 = require("../models/Advertisement.model");
const Lead_model_1 = require("../models/Lead.model");
const Notification_model_1 = require("../models/Notification.model");
const Patient_model_1 = require("../models/Patient.model");
const response_1 = require("../utils/response");
const AppError_1 = require("../utils/AppError");
const AppError_2 = require("../utils/AppError");
const auditLogger_1 = require("../services/audit/auditLogger");
const escapeRegex = (value) => value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
function parseDateOnly(value, field) {
    const raw = String(value || '');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(raw))
        throw new AppError_2.ValidationError(`${field} must use YYYY-MM-DD.`);
    const date = new Date(`${raw}T00:00:00.000Z`);
    if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== raw)
        throw new AppError_2.ValidationError(`${field} is not a valid calendar date.`);
    return raw;
}
function scopeAllowsBranch(scope, branchId) {
    if (!scope?.branchId)
        return true;
    return scope.branchId?.$in ? scope.branchId.$in.includes(branchId) : scope.branchId === branchId;
}
function list(model, searchable = [], sort = { createdAt: -1 }) {
    return async (req, res, next) => {
        try {
            const page = Math.max(1, Number(req.query.page) || 1);
            const limit = Math.min(100, Math.max(1, Number(req.query.limit || req.query.pageSize) || 20));
            const filter = { ...(req.scopeFilter || {}) };
            for (const key of ['status', 'department', 'category', 'paymentMethod', 'date', 'employeeId', 'doctorId', 'patientId']) {
                if (req.query[key] && req.query[key] !== 'all')
                    filter[key] = req.query[key];
            }
            if (req.query.from || req.query.to) {
                const from = req.query.from ? parseDateOnly(req.query.from, 'from') : undefined;
                const to = req.query.to ? parseDateOnly(req.query.to, 'to') : undefined;
                if (from && to && from > to)
                    throw new AppError_2.ValidationError('from must be on or before to.');
                const dateField = model.modelName === 'AttendanceRecord' ? 'date' : model.modelName === 'IncomeRecord' ? 'transactionDate' : model.modelName === 'Expense' ? 'expenseDate' : 'createdAt';
                filter[dateField] = {};
                if (dateField === 'date') {
                    if (from)
                        filter[dateField].$gte = from;
                    if (to)
                        filter[dateField].$lte = to;
                }
                else {
                    if (from)
                        filter[dateField].$gte = new Date(`${from}T00:00:00.000Z`);
                    if (to)
                        filter[dateField].$lt = new Date(`${to}T00:00:00.000Z`).setUTCDate(new Date(`${to}T00:00:00.000Z`).getUTCDate() + 1);
                }
            }
            if (req.query.search && searchable.length) {
                const regex = new RegExp(escapeRegex(String(req.query.search).trim()), 'i');
                const searchClause = searchable.map((field) => ({ [field]: regex }));
                if (filter.$or)
                    filter.$and = [{ $or: filter.$or }, { $or: searchClause }];
                else
                    filter.$or = searchClause;
            }
            const [data, total] = await Promise.all([
                model.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
                model.countDocuments(filter),
            ]);
            (0, response_1.sendSuccess)(res, data, `${model.modelName} records retrieved.`, 200, { page, limit, total, totalPages: Math.ceil(total / limit) });
        }
        catch (error) {
            next(error);
        }
    };
}
function create(model) {
    return async (req, res, next) => {
        try {
            const branchId = req.body.branchId || req.user?.primaryBranchId;
            if (branchId && !scopeAllowsBranch(req.scopeFilter, branchId))
                throw new AppError_1.ForbiddenError('Branch is outside your authorized scope.');
            const record = await model.create({ ...req.body, ...(branchId && { branchId }) });
            (0, response_1.sendSuccess)(res, record, `${model.modelName} created.`, 201);
        }
        catch (error) {
            next(error);
        }
    };
}
function update(model) {
    return async (req, res, next) => {
        try {
            const current = await model.findById(req.params.id);
            if (!current)
                throw new AppError_1.NotFoundError(model.modelName, req.params.id);
            if (current.branchId && !scopeAllowsBranch(req.scopeFilter, current.branchId))
                throw new AppError_1.ForbiddenError('Record is outside your authorized scope.');
            delete req.body.branchId;
            Object.assign(current, req.body);
            await current.save();
            (0, response_1.sendSuccess)(res, current, `${model.modelName} updated.`);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.operationsController = {
    appointments: list(Appointment_model_1.AppointmentModel, ['appointmentNumber', 'patientName', 'doctorName', 'uhid']),
    createAppointment: create(Appointment_model_1.AppointmentModel), updateAppointment: update(Appointment_model_1.AppointmentModel),
    employees: list(Employee_model_1.EmployeeModel, ['employeeNumber', 'name', 'email', 'phone']),
    doctors: list(Employee_model_1.EmployeeModel, ['employeeNumber', 'name', 'department']),
    createEmployee: create(Employee_model_1.EmployeeModel), updateEmployee: update(Employee_model_1.EmployeeModel),
    attendance: list(AttendanceRecord_model_1.AttendanceRecordModel, ['employeeNumber', 'employeeName']), createAttendance: create(AttendanceRecord_model_1.AttendanceRecordModel),
    leave: list(LeaveRequest_model_1.LeaveRequestModel, ['requestNumber', 'employeeName', 'department']), createLeave: create(LeaveRequest_model_1.LeaveRequestModel), updateLeave: update(LeaveRequest_model_1.LeaveRequestModel),
    complaints: list(Complaint_model_1.ComplaintModel, ['ticketNumber', 'title', 'patientName']), createComplaint: create(Complaint_model_1.ComplaintModel), updateComplaint: update(Complaint_model_1.ComplaintModel),
    revenue: list(IncomeRecord_model_1.IncomeRecordModel, ['receiptNumber', 'patientName', 'uhid']), createRevenue: create(IncomeRecord_model_1.IncomeRecordModel), updateRevenue: update(IncomeRecord_model_1.IncomeRecordModel),
    expenses: list(Expense_model_1.ExpenseModel, ['expenseNumber', 'description', 'category']), createExpense: create(Expense_model_1.ExpenseModel), updateExpense: update(Expense_model_1.ExpenseModel),
    advertisements: list(Advertisement_model_1.AdvertisementModel, ['campaignId', 'title', 'responsiblePerson']), createAdvertisement: create(Advertisement_model_1.AdvertisementModel), updateAdvertisement: update(Advertisement_model_1.AdvertisementModel),
    leads: list(Lead_model_1.LeadModel, ['leadNumber', 'name', 'phone', 'email']), createLead: create(Lead_model_1.LeadModel), updateLead: update(Lead_model_1.LeadModel),
    async updateAttendance(req, res, next) {
        try {
            const record = await AttendanceRecord_model_1.AttendanceRecordModel.findById(req.params.id);
            if (!record)
                throw new AppError_1.NotFoundError('Attendance record', req.params.id);
            if (!scopeAllowsBranch(req.scopeFilter, record.branchId))
                throw new AppError_1.ForbiddenError('Record is outside your authorized scope.');
            const allowed = ['status', 'checkIn', 'checkOut', 'punchType', 'notes'];
            const changes = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
            if (Object.keys(changes).length === 0)
                throw new AppError_2.ValidationError('No editable attendance fields were provided.');
            Object.assign(record, changes, { verifiedBy: req.user?.name });
            await record.save();
            await (0, auditLogger_1.recordAudit)(req, 'ATTENDANCE_UPDATED', 'attendance', String(record._id), record.branchId, { fields: Object.keys(changes) });
            (0, response_1.sendSuccess)(res, record, 'Attendance updated successfully.');
        }
        catch (error) {
            next(error);
        }
    },
    async archiveAttendance(req, res, next) {
        try {
            const record = await AttendanceRecord_model_1.AttendanceRecordModel.findById(req.params.id);
            if (!record)
                throw new AppError_1.NotFoundError('Attendance record', req.params.id);
            if (!scopeAllowsBranch(req.scopeFilter, record.branchId))
                throw new AppError_1.ForbiddenError('Record is outside your authorized scope.');
            record.isActive = false;
            record.archivedAt = new Date();
            await record.save();
            await (0, auditLogger_1.recordAudit)(req, 'ATTENDANCE_ARCHIVED', 'attendance', String(record._id), record.branchId);
            (0, response_1.sendSuccess)(res, record, 'Attendance archived successfully.');
        }
        catch (error) {
            next(error);
        }
    },
    async notifications(req, res, next) {
        try {
            (0, response_1.sendSuccess)(res, await Notification_model_1.NotificationModel.find({ userId: req.user.userId }).sort({ createdAt: -1 }).lean());
        }
        catch (e) {
            next(e);
        }
    },
    async markNotificationRead(req, res, next) {
        try {
            const item = await Notification_model_1.NotificationModel.findOneAndUpdate({ _id: req.params.id, userId: req.user.userId }, { read: true }, { new: true });
            if (!item)
                throw new AppError_1.NotFoundError('Notification', req.params.id);
            (0, response_1.sendSuccess)(res, item);
        }
        catch (e) {
            next(e);
        }
    },
    async markAllNotificationsRead(req, res, next) {
        try {
            const result = await Notification_model_1.NotificationModel.updateMany({ userId: req.user.userId, read: false }, { read: true });
            (0, response_1.sendSuccess)(res, { modifiedCount: result.modifiedCount });
        }
        catch (e) {
            next(e);
        }
    },
    async financeSummary(req, res, next) {
        try {
            const match = { ...(req.scopeFilter || {}) };
            const [revenue, expenses, byCategory, byPaymentMethod, branches] = await Promise.all([
                IncomeRecord_model_1.IncomeRecordModel.aggregate([{ $match: { ...match, status: 'ACTIVE' } }, { $group: { _id: '$branchId', total: { $sum: '$amount' }, count: { $sum: 1 } } }]),
                Expense_model_1.ExpenseModel.aggregate([{ $match: { ...match, paymentStatus: 'PAID' } }, { $group: { _id: '$branchId', total: { $sum: '$amount' }, count: { $sum: 1 } } }]),
                IncomeRecord_model_1.IncomeRecordModel.aggregate([{ $match: { ...match, status: 'ACTIVE' } }, { $group: { _id: '$category', total: { $sum: '$amount' } } }]),
                IncomeRecord_model_1.IncomeRecordModel.aggregate([{ $match: { ...match, status: 'ACTIVE' } }, { $group: { _id: '$paymentMethod', total: { $sum: '$amount' } } }]),
                Branch_model_1.BranchModel.find({ isActive: true }).sort({ name: 1 }).lean(),
            ]);
            const r = new Map(revenue.map((x) => [x._id, x]));
            const e = new Map(expenses.map((x) => [x._id, x]));
            const allowed = branches.filter((b) => scopeAllowsBranch(req.scopeFilter, b.branchId));
            const branchTotals = allowed.map((b) => ({ branchId: b.branchId, branchName: b.name, revenue: r.get(b.branchId)?.total || 0, expenses: e.get(b.branchId)?.total || 0, net: (r.get(b.branchId)?.total || 0) - (e.get(b.branchId)?.total || 0) }));
            (0, response_1.sendSuccess)(res, { totalRevenue: branchTotals.reduce((s, x) => s + x.revenue, 0), totalExpenses: branchTotals.reduce((s, x) => s + x.expenses, 0), netAmount: branchTotals.reduce((s, x) => s + x.net, 0), branches: branchTotals, byCategory: Object.fromEntries(byCategory.map((x) => [x._id, x.total])), byPaymentMethod: Object.fromEntries(byPaymentMethod.map((x) => [x._id, x.total])) });
        }
        catch (error) {
            next(error);
        }
    },
    async ownerSummary(req, res, next) {
        try {
            const scope = req.scopeFilter || {};
            const [patients, appointments, employees, complaints] = await Promise.all([
                Patient_model_1.PatientModel.countDocuments(scope), Appointment_model_1.AppointmentModel.countDocuments(scope), Employee_model_1.EmployeeModel.countDocuments(scope), Complaint_model_1.ComplaintModel.countDocuments(scope),
            ]);
            (0, response_1.sendSuccess)(res, { patients, appointments, employees, complaints });
        }
        catch (error) {
            next(error);
        }
    },
};
