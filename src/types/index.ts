// Core Domain & UI Types for Hospital Management Platform

export type RoleType =
  | 'Hospital Owner'
  | 'Global Admin'
  | 'Branch Manager'
  | 'Doctor'
  | 'HR Manager'
  | 'Finance Manager'
  | 'Marketing Manager'
  | 'Complaints and Query Manager'
  | 'Receptionist';

export type DataScope =
  | 'ORGANIZATION'
  | 'SELECTED_BRANCHES'
  | 'OWN_BRANCH'
  | 'DEPARTMENT'
  | 'ASSIGNED_RECORDS'
  | 'OWN_RECORDS';

export interface Branch {
  _id: string;
  name: string;
  code: string; // e.g. BR-TRY, BR-CHN, BR-MDU, BR-PDK
  address: string;
  city: string;
  phone: string;
  email: string;
  managerId: string;
  managerName: string;
  status: 'ACTIVE' | 'MAINTENANCE';
  bedCapacity: number;
  consultationRooms: number;
  departments: string[];
}

export interface User {
  _id: string;
  name: string;
  email: string;
  employeeId: string;
  role: RoleType;
  branchIds: string[]; // branch _id list
  primaryBranchId: string;
  status: 'ACTIVE' | 'DISABLED' | 'LOCKED';
  avatarUrl: string;
  department: string;
  phone: string;
}

export interface SystemRole {
  _id: string;
  name: RoleType;
  description: string;
  isSystem: boolean;
  dataScope: DataScope;
  permissions: string[]; // e.g. 'patient.view', 'patient.create'
}

export type PatientStatus =
  | 'ACTIVE'
  | 'FOLLOW_UP'
  | 'ADMITTED'
  | 'DISCHARGED'
  | 'INACTIVE';

export interface Patient {
  _id: string;
  patientNumber: string; // e.g. PAT-TRY-1001
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  branchId: string;
  branchName: string;
  primaryDoctorId?: string;
  primaryDoctorName?: string;
  status: PatientStatus;
  medicalAlerts: string[];
  bloodGroup: string;
  registeredAt: string;
  lastVisitDate?: string;
}

export interface MedicalRecord {
  _id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  branchId: string;
  date: string;
  diagnosis: string;
  symptoms: string;
  treatmentPlan: string;
  notes: string;
  vitalSigns: {
    bloodPressure: string;
    pulseRate: number;
    temperature: string;
    spo2: string;
    weightKg: number;
  };
}

export interface Prescription {
  _id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
}

export interface DischargeSummary {
  _id: string;
  patientId: string;
  patientNumber: string;
  patientName: string;
  branchId: string;
  branchName: string;
  doctorId: string;
  doctorName: string;
  admissionDate: string;
  dischargeDate: string;
  finalDiagnosis: string;
  summary: string;
  conditionAtDischarge: 'Stable' | 'Satisfactory' | 'Needs Home Care' | 'Critical';
  followUpDate: string;
  instructions: string;
  issuedBy: string;
  issuedAt: string;
  version: number;
}

export interface DoctorProfile {
  _id: string;
  userId: string;
  name: string;
  specialization: string;
  department: string;
  branchIds: string[];
  qualification: string;
  experienceYears: number;
  contactPhone: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE';
  consultationFee: number;
  availableDays: string[];
  slotsPerDay: number;
}

export type AppointmentStatus =
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'IN_CONSULTATION'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export interface Appointment {
  _id: string;
  appointmentNumber: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  branchId: string;
  branchName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  dateTime: string; // ISO 8601
  visitType: 'OPD' | 'FOLLOW_UP' | 'EMERGENCY' | 'CONSULTATION';
  status: AppointmentStatus;
  reason: string;
  priority: 'NORMAL' | 'URGENT' | 'EMERGENCY';
  cancellationReason?: string;
  notes?: string;
}

export type EmployeeStatus =
  | 'ACTIVE'
  | 'ON_NOTICE'
  | 'SUSPENDED'
  | 'RESIGNED'
  | 'TERMINATED'
  | 'INACTIVE';

export type AttendanceStatus =
  | 'PRESENT'
  | 'ABSENT'
  | 'LATE'
  | 'HALF_DAY'
  | 'ON_LEAVE'
  | 'PERMISSION'
  | 'HOLIDAY';

export interface Employee {
  _id: string;
  employeeNumber: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  branchId: string;
  branchName: string;
  joiningDate: string;
  status: EmployeeStatus;
  reportingManagerName: string;
  currentAttendance: AttendanceStatus;
}

export interface AttendanceRecord {
  _id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  branchId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
  notes?: string;
}

export type LeaveStatus =
  | 'SUBMITTED'
  | 'MANAGER_REVIEW'
  | 'HR_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED';

export interface LeaveRequest {
  _id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  department: string;
  branchId: string;
  branchName: string;
  leaveType: 'CASUAL' | 'SICK' | 'EARNED' | 'PERMISSION';
  startDate: string;
  endDate: string;
  durationDays: number;
  reason: string;
  status: LeaveStatus;
  currentApproverRole: string;
  decisionComment?: string;
  decidedBy?: string;
  decidedAt?: string;
  submittedAt: string;
}

export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ComplaintStatus =
  | 'NEW'
  | 'ASSIGNED'
  | 'UNDER_REVIEW'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_RESPONSE'
  | 'RESOLVED'
  | 'CLOSED'
  | 'ESCALATED';

export interface ComplaintCase {
  _id: string;
  ticketNumber: string;
  caseType: 'COMPLAINT' | 'QUERY';
  subject: string;
  description: string;
  source: 'PATIENT' | 'EMPLOYEE' | 'GENERAL_ENQUIRY' | 'INTERNAL_STAFF';
  category: 'CLINICAL' | 'ADMINISTRATIVE' | 'BILLING' | 'FACILITY' | 'NURSING' | 'OTHER';
  branchId: string;
  branchName: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  isConfidential: boolean;
  complainantName: string;
  contactNumber: string;
  assignedToId?: string;
  assignedToName?: string;
  slaDueAt: string;
  isOverdue: boolean;
  createdAt: string;
  resolutionSummary?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  internalNotes?: CaseNote[];
}

export interface CaseNote {
  _id: string;
  caseId: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: string;
  isInternal: boolean;
}

export interface Campaign {
  _id: string;
  name: string;
  platform: 'Google Ads' | 'Facebook' | 'Instagram' | 'YouTube';
  branchId: string;
  branchName: string;
  budget: number;
  spend: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  targetAudience: string;
  impressions: number;
  clicks: number;
  leadsCount: number;
  enquiriesCount: number;
  conversionRate: number; // percentage
  costPerLead: number; // spend / leads
}

export interface DigitalContent {
  _id: string;
  title: string;
  platform: 'Instagram' | 'Facebook' | 'YouTube';
  contentType: 'Reel' | 'Video' | 'Post' | 'Short';
  branchId: string;
  branchName: string;
  publishDate: string;
  reach: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  url: string;
}

export interface Lead {
  _id: string;
  name: string;
  phone: string;
  email: string;
  branchId: string;
  branchName: string;
  campaignId: string;
  campaignName: string;
  platform: string;
  interest: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
  cost?: number;
  createdAt: string;
}

export type RevenueCategory =
  | 'OP'
  | 'Medical'
  | 'Lab'
  | 'Day Care'
  | 'Dressing'
  | 'KIT'
  | 'Socks'
  | 'Slipper'
  | 'Other Collections';

export type PaymentMethod = 'Cash' | 'UPI' | 'Card' | 'Bank Transfer';

export interface IncomeRecord {
  _id: string;
  receiptNumber: string;
  branchId: string;
  branchName: string;
  dateTime: string;
  category: RevenueCategory;
  amount: number;
  paymentMethod: PaymentMethod;
  patientId?: string;
  patientName?: string;
  recordedByName: string;
  status: 'ACTIVE' | 'ADJUSTED' | 'CANCELLED';
  notes?: string;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AuditLog {
  _id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  module: string;
  recordId: string;
  branchName: string;
  details: string;
}

export interface ApiResponse<T> {
  data: T;
  meta: {
    requestId: string;
    timestamp: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    requestId: string;
  };
}
