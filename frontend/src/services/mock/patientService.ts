import { Patient, MedicalRecord, Prescription, DischargeSummary, PatientStatus } from '@/types';
import { patientApi } from '@/services/api/patientApi';

export interface PatientFilters { branchId?: string; status?: PatientStatus | 'ALL'; searchQuery?: string; }

// Compatibility facade while views are moved module-by-module. All data is API-backed.
export const patientService = {
  getPatients(filters: PatientFilters = {}): Promise<Patient[]> {
    return patientApi.getPatients({ branchId: filters.branchId, status: filters.status === 'ALL' ? undefined : filters.status, search: filters.searchQuery });
  },
  async getPatientById(patientId: string): Promise<Patient | undefined> {
    try { return await patientApi.getPatientById(patientId); } catch { return undefined; }
  },
  getMedicalRecords(patientId: string): Promise<MedicalRecord[]> { return patientApi.getMedicalRecords(patientId); },
  async getPrescriptions(_patientId: string): Promise<Prescription[]> { return []; },
  async getDischargeSummary(_patientId: string): Promise<DischargeSummary | undefined> { return undefined; },
  registerPatient(data: Omit<Patient, '_id' | 'patientNumber' | 'registeredAt'>): Promise<Patient> { return patientApi.registerPatient(data); },
  addMedicalRecord(record: Omit<MedicalRecord, '_id'>): Promise<MedicalRecord> { return patientApi.addMedicalRecord(record.patientId, record); },
  updatePatientStatus(patientId: string, status: PatientStatus): Promise<Patient> { return patientApi.updatePatient(patientId, { status }); },
};
