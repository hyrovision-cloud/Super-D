import mongoose from 'mongoose';
import { PatientModel, IPatient } from './patient.model';
import { MedicalRecordModel, IMedicalRecord } from './medicalRecord.model';
import { NotFoundError, ConflictError } from '../../common/errors/AppError';

export class PatientService {
  async getAllPatients(filter: Record<string, any> = {}, search?: string): Promise<IPatient[]> {
    const query: Record<string, any> = { ...filter };

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { phone: searchRegex },
        { uhid: searchRegex },
        { patientId: searchRegex },
      ];
    }

    return PatientModel.find(query).sort({ createdAt: -1 });
  }

  async getPatientById(patientId: string): Promise<IPatient> {
    const isObjectId = mongoose.Types.ObjectId.isValid(patientId);
    const orList: any[] = [{ patientId }, { uhid: patientId }];
    if (isObjectId) orList.push({ _id: patientId });

    const patient = await PatientModel.findOne({ $or: orList });

    if (!patient) {
      throw new NotFoundError('Patient', patientId);
    }
    return patient;
  }

  async registerPatient(data: Partial<IPatient>): Promise<IPatient> {
    const branchCodeMap: Record<string, string> = {
      'branch-trichy': 'TRY',
      'branch-chennai': 'CHN',
      'branch-madurai': 'MDU',
      'branch-pudukkottai': 'PDK',
    };

    const branchCode = branchCodeMap[data.branchId || ''] || 'TRY';
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const uhid = `UHID-${branchCode}-${randomSuffix}`;
    const patientId = `PAT-${branchCode}-${randomSuffix}`;

    return PatientModel.create({
      ...data,
      uhid,
      patientId,
      status: data.status || 'ACTIVE',
    });
  }

  async updatePatient(patientId: string, data: Partial<IPatient>): Promise<IPatient> {
    const patient = await PatientModel.findOneAndUpdate(
      { $or: [{ patientId }, { uhid: patientId }, { _id: patientId }] },
      { $set: data },
      { new: true }
    );

    if (!patient) {
      throw new NotFoundError('Patient', patientId);
    }
    return patient;
  }

  async getMedicalRecords(patientId: string): Promise<IMedicalRecord[]> {
    return MedicalRecordModel.find({
      $or: [{ patientId }, { uhid: patientId }],
    }).sort({ date: -1 });
  }

  async addMedicalRecord(data: Partial<IMedicalRecord>): Promise<IMedicalRecord> {
    const recordId = `REC-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    return MedicalRecordModel.create({
      ...data,
      recordId,
      date: data.date || new Date(),
    });
  }
}

export const patientService = new PatientService();
