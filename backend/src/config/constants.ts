/**
 * Production System Constants
 * Multi-Branch Hospital Management & Administration Platform
 */

export const BRANCH_IDS = [
  'branch-trichy',
  'branch-chennai',
  'branch-madurai',
  'branch-pudukkottai',
] as const;

export type BranchId = (typeof BRANCH_IDS)[number];

export const BRANCH_CODES: Record<BranchId, string> = {
  'branch-trichy': 'TRY',
  'branch-chennai': 'CHN',
  'branch-madurai': 'MDU',
  'branch-pudukkottai': 'PDK',
};

export const BRANCH_NAMES: Record<BranchId, string> = {
  'branch-trichy': 'Trichy Main Hospital',
  'branch-chennai': 'Chennai Super Speciality',
  'branch-madurai': 'Madurai City Hospital',
  'branch-pudukkottai': 'Pudukkottai Healthcare Center',
};

export const ROLES = [
  'Hospital Owner',
  'Super Admin',
  'Global Admin',
  'Branch Manager',
  'Doctor',
  'Branch Doctor',
  'HR',
  'HR Manager',
  'Finance Manager',
  'Marketing Manager',
  'Complaints and Query Manager',
  'Staff',
  'Receptionist',
  'Employee',
] as const;

export type RoleName = (typeof ROLES)[number];

export const REVENUE_CATEGORIES = [
  'OP Consultation',
  'Medical / Pharmacy',
  'Lab & Diagnostics',
  'Day Care',
  'Dressing & Procedures',
  'Surgical KIT & Consumables',
  'Other Collections (Inpatient)',
] as const;

export type RevenueCategory = (typeof REVENUE_CATEGORIES)[number];

export const PAYMENT_METHODS = ['Cash', 'UPI', 'Card', 'Net Banking', 'TPA Insurance'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const APPOINTMENT_STATUSES = [
  'SCHEDULED',
  'CONFIRMED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW',
] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export const LEAVE_STATUSES = [
  'SUBMITTED',
  'MANAGER_REVIEW',
  'HR_REVIEW',
  'APPROVED',
  'REJECTED',
  'CANCELLED',
] as const;
export type LeaveStatus = (typeof LEAVE_STATUSES)[number];

export const COMPLAINT_STATUSES = [
  'NEW',
  'ASSIGNED',
  'INVESTIGATING',
  'ACTION_TAKEN',
  'RESOLVED',
  'CLOSED',
  'ESCALATED',
] as const;
export type ComplaintStatus = (typeof COMPLAINT_STATUSES)[number];

export const PRIORITY_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
export type PriorityLevel = (typeof PRIORITY_LEVELS)[number];
