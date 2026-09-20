export const BRANCH_IDS = {
  TRICHY: 'branch-trichy',
  CHENNAI: 'branch-chennai',
  MADURAI: 'branch-madurai',
  PUDUKKOTTAI: 'branch-pudukkottai',
} as const;

export const REVENUE_CATEGORIES = [
  'OP',
  'Medical',
  'Lab',
  'Day Care',
  'Dressing',
  'KIT',
  'Socks',
  'Slipper',
  'Other Collections',
] as const;

export type RevenueCategory = typeof REVENUE_CATEGORIES[number];

export const PAYMENT_METHODS = [
  'cash',
  'upi',
  'card',
  'bank_transfer',
  'insurance_tpa',
] as const;

export const ROLES = {
  HOSPITAL_OWNER: 'Hospital Owner',
  GLOBAL_ADMIN: 'Global Admin',
  BRANCH_MANAGER: 'Branch Manager',
  DOCTOR: 'Doctor',
  HR_MANAGER: 'HR Manager',
  FINANCE_MANAGER: 'Finance Manager',
  MARKETING_MANAGER: 'Marketing Manager',
  COMPLAINTS_MANAGER: 'Complaints and Query Manager',
  RECEPTIONIST: 'Receptionist',
} as const;

export const DATA_SCOPES = {
  ORGANIZATION: 'ORGANIZATION',
  SELECTED_BRANCHES: 'SELECTED_BRANCHES',
  OWN_BRANCH: 'OWN_BRANCH',
  DEPARTMENT: 'DEPARTMENT',
  ASSIGNED_RECORDS: 'ASSIGNED_RECORDS',
  OWN_RECORDS: 'OWN_RECORDS',
} as const;
