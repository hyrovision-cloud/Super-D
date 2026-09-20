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

const STORAGE_KEY = 'aarogya_demo_store_v1';

interface DemoStoreState {
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
}

function getInitialState(): DemoStoreState {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized) {
      const parsed = JSON.parse(serialized);
      // Validate that crucial keys exist
      if (parsed.branches && parsed.patients && parsed.appointments) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load demo store from localStorage, using seed defaults', e);
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
