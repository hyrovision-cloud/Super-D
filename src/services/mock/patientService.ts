import { Patient, MedicalRecord, Prescription, DischargeSummary, PatientStatus } from '@/types';
import { mockStore, simulateDelay } from './mockStore';

export interface PatientFilters {
  branchId?: string;
  status?: PatientStatus | 'ALL';
  searchQuery?: string;
}

export const patientService = {
  async getPatients(filters: PatientFilters = {}): Promise<Patient[]> {
    let patients = [...mockStore.getState().patients];

    if (filters.branchId && filters.branchId !== 'all') {
      patients = patients.filter((p) => p.branchId === filters.branchId);
    }

    if (filters.status && filters.status !== 'ALL') {
      patients = patients.filter((p) => p.status === filters.status);
    }

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase().trim();
      patients = patients.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.patientNumber.toLowerCase().includes(q) ||
          p.phone.includes(q)
      );
    }

    return simulateDelay(patients);
  },

  async getPatientById(patientId: string): Promise<Patient | undefined> {
    const patient = mockStore.getState().patients.find((p) => p._id === patientId);
    return simulateDelay(patient);
  },

  async getMedicalRecords(patientId: string): Promise<MedicalRecord[]> {
    const records = mockStore.getState().medicalRecords.filter((r) => r.patientId === patientId);
    return simulateDelay(records);
  },

  async getPrescriptions(patientId: string): Promise<Prescription[]> {
    const prescriptions = mockStore.getState().prescriptions.filter((p) => p.patientId === patientId);
    return simulateDelay(prescriptions);
  },

  async getDischargeSummary(patientId: string): Promise<DischargeSummary | undefined> {
    const summary = mockStore.getState().dischargeSummaries.find((d) => d.patientId === patientId);
    return simulateDelay(summary);
  },

  async registerPatient(
    patientData: Omit<Patient, '_id' | 'patientNumber' | 'registeredAt'>
  ): Promise<Patient> {
    const branch = mockStore.getState().branches.find((b) => b._id === patientData.branchId);
    const branchCode = branch ? branch.code.replace('BR-', '') : 'GEN';
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const patientNumber = `PAT-${branchCode}-${randNum}`;

    const newPatient: Patient = {
      ...patientData,
      _id: `pat-${Date.now()}`,
      patientNumber,
      registeredAt: new Date().toISOString(),
    };

    mockStore.setState((state) => ({
      ...state,
      patients: [newPatient, ...state.patients],
    }));

    return simulateDelay(newPatient);
  },

  async addMedicalRecord(newRecord: Omit<MedicalRecord, '_id'>): Promise<MedicalRecord> {
    const record: MedicalRecord = {
      ...newRecord,
      _id: `med-${Date.now()}`,
    };

    mockStore.setState((state) => ({
      ...state,
      medicalRecords: [record, ...state.medicalRecords],
    }));

    return simulateDelay(record);
  },

  async updatePatientStatus(patientId: string, status: PatientStatus): Promise<Patient> {
    let updated: Patient | undefined;
    mockStore.setState((state) => {
      const patients = state.patients.map((p) => {
        if (p._id === patientId) {
          updated = { ...p, status };
          return updated;
        }
        return p;
      });
      return { ...state, patients };
    });
    if (!updated) throw new Error('Patient not found');
    return simulateDelay(updated);
  },
};
