import {
  Branch,
  User,
  SystemRole,
  Patient,
  MedicalRecord,
  Prescription,
  DischargeSummary,
  DoctorProfile,
  Appointment,
  Employee,
  AttendanceRecord,
  LeaveRequest,
  ComplaintCase,
  Campaign,
  DigitalContent,
  Lead,
  IncomeRecord,
  Notification,
  AuditLog,
  SuperDAdvertisement,
  SuperDTransaction,
  SuperDLeaveRequest,
  SuperDGrievance,
  SuperDPatientDischarge,
} from '@/types';
import {
  SEED_BRANCHES,
  SEED_USERS,
  SEED_ROLES,
  SEED_DOCTORS,
  SEED_PATIENTS,
  SEED_MEDICAL_RECORDS,
  SEED_PRESCRIPTIONS,
  SEED_DISCHARGE_SUMMARIES,
  SEED_APPOINTMENTS,
  SEED_EMPLOYEES,
  SEED_ATTENDANCE,
  SEED_LEAVE_REQUESTS,
  SEED_COMPLAINTS,
  SEED_CAMPAIGNS,
  SEED_DIGITAL_CONTENT,
  SEED_LEADS,
  SEED_INCOME_RECORDS,
  SEED_NOTIFICATIONS,
  SEED_AUDIT_LOGS,
} from '@/data/seed';
import {
  SUPERD_ADVERTISEMENTS,
  SUPERD_TRANSACTIONS,
  SUPERD_LEAVE_REQUESTS,
  SUPERD_GRIEVANCES,
  SUPERD_PATIENT_DISCHARGES,
} from '@/data/seed/superDSeed';

const STORAGE_KEY = 'superd_demo_store_v2';

export interface DemoStoreState {
  branches: Branch[];
  users: User[];
  roles: SystemRole[];
  doctors: DoctorProfile[];
  patients: Patient[];
  medicalRecords: MedicalRecord[];
  prescriptions: Prescription[];
  dischargeSummaries: DischargeSummary[];
  appointments: Appointment[];
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  complaints: ComplaintCase[];
  campaigns: Campaign[];
  digitalContent: DigitalContent[];
  leads: Lead[];
  incomeRecords: IncomeRecord[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  // Super D official collections
  superDAds: SuperDAdvertisement[];
  superDTransactions: SuperDTransaction[];
  superDLeaveRequests: SuperDLeaveRequest[];
  superDGrievances: SuperDGrievance[];
  superDDischarges: SuperDPatientDischarge[];
}

function getInitialState(): DemoStoreState {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized) {
      const parsed = JSON.parse(serialized);
      if (parsed.branches && parsed.superDAds && parsed.superDTransactions) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load Super D demo store from localStorage, using seed defaults', e);
  }

  return {
    branches: [...SEED_BRANCHES],
    users: [...SEED_USERS],
    roles: [...SEED_ROLES],
    doctors: [...SEED_DOCTORS],
    patients: [...SEED_PATIENTS],
    medicalRecords: [...SEED_MEDICAL_RECORDS],
    prescriptions: [...SEED_PRESCRIPTIONS],
    dischargeSummaries: [...SEED_DISCHARGE_SUMMARIES],
    appointments: [...SEED_APPOINTMENTS],
    employees: [...SEED_EMPLOYEES],
    attendance: [...SEED_ATTENDANCE],
    leaveRequests: [...SEED_LEAVE_REQUESTS],
    complaints: [...SEED_COMPLAINTS],
    campaigns: [...SEED_CAMPAIGNS],
    digitalContent: [...SEED_DIGITAL_CONTENT],
    leads: [...SEED_LEADS],
    incomeRecords: [...SEED_INCOME_RECORDS],
    notifications: [...SEED_NOTIFICATIONS],
    auditLogs: [...SEED_AUDIT_LOGS],
    // Super D domain state
    superDAds: [...SUPERD_ADVERTISEMENTS],
    superDTransactions: [...SUPERD_TRANSACTIONS],
    superDLeaveRequests: [...SUPERD_LEAVE_REQUESTS],
    superDGrievances: [...SUPERD_GRIEVANCES],
    superDDischarges: [...SUPERD_PATIENT_DISCHARGES],
  };
}

class MockStore {
  private state: DemoStoreState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = getInitialState();
  }

  public getState(): DemoStoreState {
    return this.state;
  }

  public setState(updater: (prev: DemoStoreState) => DemoStoreState): void {
    this.state = updater(this.state);
    this.persist();
    this.notify();
  }

  // Super D CRUD Actions
  public addAdvertisement(ad: Omit<SuperDAdvertisement, '_id'>): SuperDAdvertisement {
    const newAd: SuperDAdvertisement = {
      ...ad,
      _id: `ad-${Date.now()}`,
    };
    this.setState((prev) => ({
      ...prev,
      superDAds: [newAd, ...prev.superDAds],
    }));
    return newAd;
  }

  public updateAdvertisement(id: string, updates: Partial<SuperDAdvertisement>): void {
    this.setState((prev) => ({
      ...prev,
      superDAds: prev.superDAds.map((a) => (a._id === id ? { ...a, ...updates } : a)),
    }));
  }

  public deleteAdvertisement(id: string): void {
    this.setState((prev) => ({
      ...prev,
      superDAds: prev.superDAds.filter((a) => a._id !== id),
    }));
  }

  public addTransaction(tx: Omit<SuperDTransaction, '_id'>): SuperDTransaction {
    const newTx: SuperDTransaction = {
      ...tx,
      _id: `tx-${Date.now()}`,
    };
    this.setState((prev) => ({
      ...prev,
      superDTransactions: [newTx, ...prev.superDTransactions],
    }));
    return newTx;
  }

  public updateTransaction(id: string, updates: Partial<SuperDTransaction>): void {
    this.setState((prev) => ({
      ...prev,
      superDTransactions: prev.superDTransactions.map((t) => (t._id === id ? { ...t, ...updates } : t)),
    }));
  }

  public deleteTransaction(id: string): void {
    this.setState((prev) => ({
      ...prev,
      superDTransactions: prev.superDTransactions.filter((t) => t._id !== id),
    }));
  }

  public addLeaveRequest(req: Omit<SuperDLeaveRequest, '_id'>): SuperDLeaveRequest {
    const newReq: SuperDLeaveRequest = {
      ...req,
      _id: `lr-${Date.now()}`,
    };
    this.setState((prev) => ({
      ...prev,
      superDLeaveRequests: [newReq, ...prev.superDLeaveRequests],
    }));
    return newReq;
  }

  public updateLeaveReview(
    id: string,
    reviewStage: SuperDLeaveRequest['reviewStage'],
    status: SuperDLeaveRequest['status']
  ): void {
    this.setState((prev) => ({
      ...prev,
      superDLeaveRequests: prev.superDLeaveRequests.map((l) =>
        l._id === id ? { ...l, reviewStage, status } : l
      ),
    }));
  }

  public addGrievance(grv: Omit<SuperDGrievance, '_id'>): SuperDGrievance {
    const newGrv: SuperDGrievance = {
      ...grv,
      _id: `grv-${Date.now()}`,
    };
    this.setState((prev) => ({
      ...prev,
      superDGrievances: [newGrv, ...prev.superDGrievances],
    }));
    return newGrv;
  }

  public updateGrievanceStatus(
    id: string,
    status: SuperDGrievance['status'],
    resolution?: string
  ): void {
    this.setState((prev) => ({
      ...prev,
      superDGrievances: prev.superDGrievances.map((g) =>
        g._id === id ? { ...g, status, resolution: resolution ?? g.resolution } : g
      ),
    }));
  }

  public addPatientDischarge(pd: Omit<SuperDPatientDischarge, '_id'>): SuperDPatientDischarge {
    const newPd: SuperDPatientDischarge = {
      ...pd,
      _id: `pd-${Date.now()}`,
    };
    this.setState((prev) => ({
      ...prev,
      superDDischarges: [newPd, ...prev.superDDischarges],
    }));
    return newPd;
  }

  public resetToDefaults(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Could not clear localStorage', e);
    }

    this.state = {
      branches: JSON.parse(JSON.stringify(SEED_BRANCHES)),
      users: JSON.parse(JSON.stringify(SEED_USERS)),
      roles: JSON.parse(JSON.stringify(SEED_ROLES)),
      doctors: JSON.parse(JSON.stringify(SEED_DOCTORS)),
      patients: JSON.parse(JSON.stringify(SEED_PATIENTS)),
      medicalRecords: JSON.parse(JSON.stringify(SEED_MEDICAL_RECORDS)),
      prescriptions: JSON.parse(JSON.stringify(SEED_PRESCRIPTIONS)),
      dischargeSummaries: JSON.parse(JSON.stringify(SEED_DISCHARGE_SUMMARIES)),
      appointments: JSON.parse(JSON.stringify(SEED_APPOINTMENTS)),
      employees: JSON.parse(JSON.stringify(SEED_EMPLOYEES)),
      attendance: JSON.parse(JSON.stringify(SEED_ATTENDANCE)),
      leaveRequests: JSON.parse(JSON.stringify(SEED_LEAVE_REQUESTS)),
      complaints: JSON.parse(JSON.stringify(SEED_COMPLAINTS)),
      campaigns: JSON.parse(JSON.stringify(SEED_CAMPAIGNS)),
      digitalContent: JSON.parse(JSON.stringify(SEED_DIGITAL_CONTENT)),
      leads: JSON.parse(JSON.stringify(SEED_LEADS)),
      incomeRecords: JSON.parse(JSON.stringify(SEED_INCOME_RECORDS)),
      notifications: JSON.parse(JSON.stringify(SEED_NOTIFICATIONS)),
      auditLogs: JSON.parse(JSON.stringify(SEED_AUDIT_LOGS)),
      superDAds: JSON.parse(JSON.stringify(SUPERD_ADVERTISEMENTS)),
      superDTransactions: JSON.parse(JSON.stringify(SUPERD_TRANSACTIONS)),
      superDLeaveRequests: JSON.parse(JSON.stringify(SUPERD_LEAVE_REQUESTS)),
      superDGrievances: JSON.parse(JSON.stringify(SUPERD_GRIEVANCES)),
      superDDischarges: JSON.parse(JSON.stringify(SUPERD_PATIENT_DISCHARGES)),
    };
    this.persist();
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  private persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Failed to persist demo store to localStorage', e);
    }
  }
}

export const mockStore = new MockStore();

export function simulateDelay<T>(data: T, delayMs: number = 180): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), delayMs));
}
