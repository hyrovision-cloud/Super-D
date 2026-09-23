"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configController = void 0;
const SystemSettings_model_1 = require("../models/SystemSettings.model");
const AppError_1 = require("../utils/AppError");
const response_1 = require("../utils/response");
const auditLogger_1 = require("../services/audit/auditLogger");
const ALLOWED_STATUS_CODES = new Set(['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE', 'WORK_FROM_HOME', 'HOLIDAY']);
const defaults = () => SystemSettings_model_1.SystemSettingsModel.findOneAndUpdate({ key: 'application' }, { $setOnInsert: { key: 'application' } }, { new: true, upsert: true, setDefaultsOnInsert: true });
exports.configController = {
    async getApplication(_req, res, next) {
        try {
            (0, response_1.sendSuccess)(res, await defaults(), 'Application configuration retrieved.');
        }
        catch (error) {
            next(error);
        }
    },
    async updateApplication(req, res, next) {
        try {
            const settings = await defaults();
            const allowed = ['emailAlerts', 'smsAlerts', 'soundAlerts', 'currency', 'dateFormat', 'attendanceStatuses'];
            const incoming = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
            if (Object.keys(incoming).length === 0)
                throw new AppError_1.ValidationError('No supported configuration fields were provided.');
            if (incoming.currency && incoming.currency !== 'INR')
                throw new AppError_1.ValidationError('Only INR is supported for this hospital deployment.');
            if (incoming.attendanceStatuses) {
                if (!Array.isArray(incoming.attendanceStatuses) || incoming.attendanceStatuses.some((entry) => !ALLOWED_STATUS_CODES.has(entry.code) || typeof entry.label !== 'string' || typeof entry.enabled !== 'boolean'))
                    throw new AppError_1.ValidationError('Attendance status configuration is invalid.');
                if (new Set(incoming.attendanceStatuses.map((entry) => entry.code)).size !== incoming.attendanceStatuses.length)
                    throw new AppError_1.ValidationError('Attendance status codes must be unique.');
            }
            Object.assign(settings, incoming);
            await settings.save();
            await (0, auditLogger_1.recordAudit)(req, 'CONFIG_UPDATED', 'configuration', String(settings._id), undefined, { fields: Object.keys(incoming) });
            (0, response_1.sendSuccess)(res, settings, 'Application configuration updated.');
        }
        catch (error) {
            next(error);
        }
    },
};
