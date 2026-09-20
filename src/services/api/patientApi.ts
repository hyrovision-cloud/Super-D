import { httpClient } from './httpClient';
import { Patient, MedicalRecord } from '../../types';

export const patientApi = {
  async getPatients(filters?: { branchId?: string; status?: string; search?: string }): Promise<Patient[]> {
    return httpClient.get<Patient[]>('/patients', filters);
  },

  async getPatientById(patientId: string): Promise<Patient> {
    return httpClient.get<Patient>(`/patients/${patientId}`);
  },

  async registerPatient(data: Partial<Patient>): Promise<Patient> {
    return httpClient.post<Patient>('/patients', data);
  },

  async updatePatient(patientId: string, data: Partial<Patient>): Promise<Patient> {
    return httpClient.patch<Patient>(`/patients/${patientId}`, data);
  },

  async getMedicalRecords(patientId: string): Promise<MedicalRecord[]> {
    return httpClient.get<MedicalRecord[]>(`/patients/${patientId}/medical-records`);
  },

  async addMedicalRecord(patientId: string, data: Partial<MedicalRecord>): Promise<MedicalRecord> {
    return httpClient.post<MedicalRecord>(`/patients/${patientId}/medical-records`, data);
  },
};
