import { Request, Response, NextFunction } from 'express';
import { PatientModel, IPatient } from '../models/Patient.model';
import { MedicalRecordModel } from '../models/MedicalRecord.model';
import { sendSuccess } from '../utils/response';
import { NotFoundError, ForbiddenError } from '../utils/AppError';
import { BRANCH_CODES, BranchId } from '../config/constants';
import { BranchModel } from '../models/Branch.model';

function escapeRegex(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export class PatientController {
  async getAllPatients(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
      const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize as string, 10) || 20));
      const skip = (page - 1) * pageSize;

      const filter: Record<string, any> = { ...req.scopeFilter };
      if (req.query.status && req.query.status !== 'all') {
        filter.status = req.query.status;
      }

      const search = req.query.search as string;
      if (search && search.trim()) {
        const safeSearch = escapeRegex(search.trim());
        const searchRegex = new RegExp(safeSearch, 'i');
        filter.$or = [
          { name: searchRegex },
          { phone: searchRegex },
          { uhid: searchRegex },
        ];
      }

      const [patients, total] = await Promise.all([
        PatientModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize),
        PatientModel.countDocuments(filter),
      ]);

      const branchMap = new Map((await BranchModel.find({ isActive: true }).select('branchId name').lean()).map((b) => [b.branchId, b.name]));
      const response = patients.map((patient) => ({ ...patient.toObject(), branchName: branchMap.get(patient.branchId) || '' }));

      sendSuccess(res, response, 'Patients retrieved successfully.', 200, {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      });
    } catch (err) {
      next(err);
    }
  }

  async updatePatient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const patient = await PatientModel.findOne({ $or: [{ uhid: req.params.patientId }, ...(req.params.patientId.match(/^[a-f\d]{24}$/i) ? [{ _id: req.params.patientId }] : [])] });
      if (!patient) throw new NotFoundError('Patient', req.params.patientId);
      const allowed = req.scopeFilter?.branchId;
      if (allowed && !(allowed.$in ? allowed.$in.includes(patient.branchId) : allowed === patient.branchId)) throw new ForbiddenError('Patient is outside your authorized branch scope.');
      Object.assign(patient, req.body);
      await patient.save();
      sendSuccess(res, patient, 'Patient updated successfully.');
    } catch (err) { next(err); }
  }

  async addMedicalRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const patient = await PatientModel.findOne({ $or: [{ uhid: req.params.patientId }, ...(req.params.patientId.match(/^[a-f\d]{24}$/i) ? [{ _id: req.params.patientId }] : [])] });
      if (!patient) throw new NotFoundError('Patient', req.params.patientId);
      const allowed = req.scopeFilter?.branchId;
      if (allowed && !(allowed.$in ? allowed.$in.includes(patient.branchId) : allowed === patient.branchId)) throw new ForbiddenError('Patient is outside your authorized branch scope.');
      const count = await MedicalRecordModel.countDocuments({ patientId: patient.uhid });
      const record = await MedicalRecordModel.create({ ...req.body, recordNumber: `MR-${patient.uhid}-${String(count + 1).padStart(3, '0')}`, patientId: patient.uhid, uhid: patient.uhid, branchId: patient.branchId, clinicalNotes: req.body.clinicalNotes || req.body.notes || '', prescriptions: req.body.prescriptions || [] });
      sendSuccess(res, record, 'Medical record created.', 201);
    } catch (err) { next(err); }
  }

  async deletePatient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const patient = await PatientModel.findOne({ $or: [{ uhid: req.params.patientId }, ...(req.params.patientId.match(/^[a-f\d]{24}$/i) ? [{ _id: req.params.patientId }] : [])] });
      if (!patient) throw new NotFoundError('Patient', req.params.patientId);
      const allowed = req.scopeFilter?.branchId;
      if (allowed && !(allowed.$in ? allowed.$in.includes(patient.branchId) : allowed === patient.branchId)) throw new ForbiddenError('Patient is outside your authorized branch scope.');
      patient.status = 'INACTIVE';
      await patient.save();
      sendSuccess(res, { id: patient._id, status: patient.status }, 'Patient deactivated.');
    } catch (err) { next(err); }
  }

  async getPatientById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { patientId } = req.params;
      const patient = await PatientModel.findOne({
        $or: [{ uhid: patientId }, { _id: patientId }],
      });

      if (!patient) {
        throw new NotFoundError('Patient', patientId);
      }

      // Enforce Object-Level Authorization (BOLA Prevention)
      if (req.scopeFilter?.branchId) {
        const allowedBranch = req.scopeFilter.branchId;
        const isAllowed = typeof allowedBranch === 'object' && allowedBranch.$in
          ? allowedBranch.$in.includes(patient.branchId)
          : allowedBranch === patient.branchId;

        if (!isAllowed) {
          throw new ForbiddenError(`Access denied. Patient belongs to a branch outside your authorization scope.`);
        }
      }

      sendSuccess(res, patient, 'Patient details retrieved.');
    } catch (err) {
      next(err);
    }
  }

  async registerPatient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body;
      const branchId = data.branchId as BranchId;
      const branchCode = BRANCH_CODES[branchId] || 'TRY';
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const uhid = `UHID-${branchCode}-${new Date().getFullYear()}-${randomSuffix}`;

      const patient = await PatientModel.create({
        ...data,
        uhid,
        status: data.status || 'ACTIVE',
      });

      sendSuccess(res, patient, 'Patient registered successfully.', 201);
    } catch (err) {
      next(err);
    }
  }

  async getMedicalRecords(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { patientId } = req.params;
      const records = await MedicalRecordModel.find({
        $or: [{ patientId }, { uhid: patientId }],
      }).sort({ date: -1 });

      sendSuccess(res, records, 'Medical records retrieved.', 200, { total: records.length });
    } catch (err) {
      next(err);
    }
  }
}

export const patientController = new PatientController();
