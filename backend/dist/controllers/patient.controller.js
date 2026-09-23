"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientController = exports.PatientController = void 0;
const Patient_model_1 = require("../models/Patient.model");
const MedicalRecord_model_1 = require("../models/MedicalRecord.model");
const response_1 = require("../utils/response");
const AppError_1 = require("../utils/AppError");
const constants_1 = require("../config/constants");
const Branch_model_1 = require("../models/Branch.model");
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
class PatientController {
    async getAllPatients(req, res, next) {
        try {
            const page = Math.max(1, parseInt(req.query.page, 10) || 1);
            const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize, 10) || 20));
            const skip = (page - 1) * pageSize;
            const filter = { ...req.scopeFilter };
            if (req.query.status && req.query.status !== 'all') {
                filter.status = req.query.status;
            }
            const search = req.query.search;
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
                Patient_model_1.PatientModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize),
                Patient_model_1.PatientModel.countDocuments(filter),
            ]);
            const branchMap = new Map((await Branch_model_1.BranchModel.find({ isActive: true }).select('branchId name').lean()).map((b) => [b.branchId, b.name]));
            const response = patients.map((patient) => ({ ...patient.toObject(), branchName: branchMap.get(patient.branchId) || '' }));
            (0, response_1.sendSuccess)(res, response, 'Patients retrieved successfully.', 200, {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            });
        }
        catch (err) {
            next(err);
        }
    }
    async updatePatient(req, res, next) {
        try {
            const patient = await Patient_model_1.PatientModel.findOne({ $or: [{ uhid: req.params.patientId }, ...(req.params.patientId.match(/^[a-f\d]{24}$/i) ? [{ _id: req.params.patientId }] : [])] });
            if (!patient)
                throw new AppError_1.NotFoundError('Patient', req.params.patientId);
            const allowed = req.scopeFilter?.branchId;
            if (allowed && !(allowed.$in ? allowed.$in.includes(patient.branchId) : allowed === patient.branchId))
                throw new AppError_1.ForbiddenError('Patient is outside your authorized branch scope.');
            Object.assign(patient, req.body);
            await patient.save();
            (0, response_1.sendSuccess)(res, patient, 'Patient updated successfully.');
        }
        catch (err) {
            next(err);
        }
    }
    async addMedicalRecord(req, res, next) {
        try {
            const patient = await Patient_model_1.PatientModel.findOne({ $or: [{ uhid: req.params.patientId }, ...(req.params.patientId.match(/^[a-f\d]{24}$/i) ? [{ _id: req.params.patientId }] : [])] });
            if (!patient)
                throw new AppError_1.NotFoundError('Patient', req.params.patientId);
            const allowed = req.scopeFilter?.branchId;
            if (allowed && !(allowed.$in ? allowed.$in.includes(patient.branchId) : allowed === patient.branchId))
                throw new AppError_1.ForbiddenError('Patient is outside your authorized branch scope.');
            const count = await MedicalRecord_model_1.MedicalRecordModel.countDocuments({ patientId: patient.uhid });
            const record = await MedicalRecord_model_1.MedicalRecordModel.create({ ...req.body, recordNumber: `MR-${patient.uhid}-${String(count + 1).padStart(3, '0')}`, patientId: patient.uhid, uhid: patient.uhid, branchId: patient.branchId, clinicalNotes: req.body.clinicalNotes || req.body.notes || '', prescriptions: req.body.prescriptions || [] });
            (0, response_1.sendSuccess)(res, record, 'Medical record created.', 201);
        }
        catch (err) {
            next(err);
        }
    }
    async deletePatient(req, res, next) {
        try {
            const patient = await Patient_model_1.PatientModel.findOne({ $or: [{ uhid: req.params.patientId }, ...(req.params.patientId.match(/^[a-f\d]{24}$/i) ? [{ _id: req.params.patientId }] : [])] });
            if (!patient)
                throw new AppError_1.NotFoundError('Patient', req.params.patientId);
            const allowed = req.scopeFilter?.branchId;
            if (allowed && !(allowed.$in ? allowed.$in.includes(patient.branchId) : allowed === patient.branchId))
                throw new AppError_1.ForbiddenError('Patient is outside your authorized branch scope.');
            patient.status = 'INACTIVE';
            await patient.save();
            (0, response_1.sendSuccess)(res, { id: patient._id, status: patient.status }, 'Patient deactivated.');
        }
        catch (err) {
            next(err);
        }
    }
    async getPatientById(req, res, next) {
        try {
            const { patientId } = req.params;
            const patient = await Patient_model_1.PatientModel.findOne({
                $or: [{ uhid: patientId }, { _id: patientId }],
            });
            if (!patient) {
                throw new AppError_1.NotFoundError('Patient', patientId);
            }
            if (req.scopeFilter?.branchId) {
                const allowedBranch = req.scopeFilter.branchId;
                const isAllowed = typeof allowedBranch === 'object' && allowedBranch.$in
                    ? allowedBranch.$in.includes(patient.branchId)
                    : allowedBranch === patient.branchId;
                if (!isAllowed) {
                    throw new AppError_1.ForbiddenError(`Access denied. Patient belongs to a branch outside your authorization scope.`);
                }
            }
            (0, response_1.sendSuccess)(res, patient, 'Patient details retrieved.');
        }
        catch (err) {
            next(err);
        }
    }
    async registerPatient(req, res, next) {
        try {
            const data = req.body;
            const branchId = data.branchId;
            const branchCode = constants_1.BRANCH_CODES[branchId] || 'TRY';
            const randomSuffix = Math.floor(1000 + Math.random() * 9000);
            const uhid = `UHID-${branchCode}-${new Date().getFullYear()}-${randomSuffix}`;
            const patient = await Patient_model_1.PatientModel.create({
                ...data,
                uhid,
                status: data.status || 'ACTIVE',
            });
            (0, response_1.sendSuccess)(res, patient, 'Patient registered successfully.', 201);
        }
        catch (err) {
            next(err);
        }
    }
    async getMedicalRecords(req, res, next) {
        try {
            const { patientId } = req.params;
            const records = await MedicalRecord_model_1.MedicalRecordModel.find({
                $or: [{ patientId }, { uhid: patientId }],
            }).sort({ date: -1 });
            (0, response_1.sendSuccess)(res, records, 'Medical records retrieved.', 200, { total: records.length });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.PatientController = PatientController;
exports.patientController = new PatientController();
