import { Request, Response, NextFunction } from 'express';
import { patientService } from './patient.service';

export class PatientController {
  async getAllPatients(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filter: Record<string, any> = { ...req.scopeFilter };
      if (req.query.status && req.query.status !== 'all') {
        filter.status = req.query.status;
      }
      if (req.query.category && req.query.category !== 'all') {
        filter.category = req.query.category;
      }
      const search = req.query.search as string;

      const patients = await patientService.getAllPatients(filter, search);
      res.json({
        data: patients,
        meta: { totalItems: patients.length, requestId: req.id },
      });
    } catch (err) {
      next(err);
    }
  }

  async getPatientById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const patient = await patientService.getPatientById(req.params.patientId);
      res.json({ data: patient, meta: { requestId: req.id } });
    } catch (err) {
      next(err);
    }
  }

  async registerPatient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const patient = await patientService.registerPatient(req.body);
      res.status(201).json({ data: patient, meta: { requestId: req.id } });
    } catch (err) {
      next(err);
    }
  }

  async updatePatient(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const patient = await patientService.updatePatient(req.params.patientId, req.body);
      res.json({ data: patient, meta: { requestId: req.id } });
    } catch (err) {
      next(err);
    }
  }

  async getMedicalRecords(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const records = await patientService.getMedicalRecords(req.params.patientId);
      res.json({
        data: records,
        meta: { totalItems: records.length, requestId: req.id },
      });
    } catch (err) {
      next(err);
    }
  }

  async addMedicalRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const record = await patientService.addMedicalRecord({
        ...req.body,
        patientId: req.params.patientId,
        doctorId: req.user?.userId || req.body.doctorId,
        doctorName: req.user?.name || req.body.doctorName,
      });
      res.status(201).json({ data: record, meta: { requestId: req.id } });
    } catch (err) {
      next(err);
    }
  }
}

export const patientController = new PatientController();
