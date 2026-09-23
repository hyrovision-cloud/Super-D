import { NextFunction, Request, Response } from 'express';
import { SystemSettingsModel } from '../models/SystemSettings.model';
import { ValidationError } from '../utils/AppError';
import { sendSuccess } from '../utils/response';
import { recordAudit } from '../services/audit/auditLogger';

const ALLOWED_STATUS_CODES = new Set(['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE', 'WORK_FROM_HOME', 'HOLIDAY']);
const defaults = () => SystemSettingsModel.findOneAndUpdate({ key: 'application' }, { $setOnInsert: { key: 'application' } }, { new: true, upsert: true, setDefaultsOnInsert: true });

export const configController = {
  async getApplication(_req: Request, res: Response, next: NextFunction) {
    try { sendSuccess(res, await defaults(), 'Application configuration retrieved.'); } catch (error) { next(error); }
  },
  async updateApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await defaults();
      const allowed = ['emailAlerts', 'smsAlerts', 'soundAlerts', 'currency', 'dateFormat', 'attendanceStatuses'];
      const incoming = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
      if (Object.keys(incoming).length === 0) throw new ValidationError('No supported configuration fields were provided.');
      if (incoming.currency && incoming.currency !== 'INR') throw new ValidationError('Only INR is supported for this hospital deployment.');
      if (incoming.attendanceStatuses) {
        if (!Array.isArray(incoming.attendanceStatuses) || incoming.attendanceStatuses.some((entry: any) => !ALLOWED_STATUS_CODES.has(entry.code) || typeof entry.label !== 'string' || typeof entry.enabled !== 'boolean')) throw new ValidationError('Attendance status configuration is invalid.');
        if (new Set(incoming.attendanceStatuses.map((entry: any) => entry.code)).size !== incoming.attendanceStatuses.length) throw new ValidationError('Attendance status codes must be unique.');
      }
      Object.assign(settings, incoming);
      await settings.save();
      await recordAudit(req, 'CONFIG_UPDATED', 'configuration', String(settings._id), undefined, { fields: Object.keys(incoming) });
      sendSuccess(res, settings, 'Application configuration updated.');
    } catch (error) { next(error); }
  },
};
