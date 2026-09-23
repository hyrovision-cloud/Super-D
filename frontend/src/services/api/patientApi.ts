import { httpClient } from './httpClient';
import { Patient, MedicalRecord } from '../../types';

export const patientApi = {
  async getPatients(filters?: { branchId?: string; status?: string; search?: string }): Promise<Patient[]> {
    const rows = await httpClient.get<any[]>('/patients', { ...filters, pageSize: 100 });
    return rows.map(mapPatient);
  },

  async getPatientById(patientId: string): Promise<Patient> {
    return mapPatient(await httpClient.get<any>(`/patients/${patientId}`));
  },

  async registerPatient(data: Partial<Patient>): Promise<Patient> {
    return mapPatient(await httpClient.post<any>('/patients', { ...data, gender: String(data.gender || '').toUpperCase() }));
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

function mapPatient(row: any): Patient {
  return { ...row, _id: String(row._id), patientNumber: row.uhid, gender: row.gender === 'MALE' ? 'Male' : row.gender === 'FEMALE' ? 'Female' : 'Other', branchName: row.branchName || '', medicalAlerts: row.medicalAlerts || [], registeredAt: row.createdAt } as Patient;
}
