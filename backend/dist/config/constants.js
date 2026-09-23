"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRIORITY_LEVELS = exports.COMPLAINT_STATUSES = exports.LEAVE_STATUSES = exports.APPOINTMENT_STATUSES = exports.PAYMENT_METHODS = exports.REVENUE_CATEGORIES = exports.ROLES = exports.BRANCH_NAMES = exports.BRANCH_CODES = exports.BRANCH_IDS = void 0;
exports.BRANCH_IDS = [
    'branch-trichy',
    'branch-chennai',
    'branch-madurai',
    'branch-pudukkottai',
];
exports.BRANCH_CODES = {
    'branch-trichy': 'TRY',
    'branch-chennai': 'CHN',
    'branch-madurai': 'MDU',
    'branch-pudukkottai': 'PDK',
};
exports.BRANCH_NAMES = {
    'branch-trichy': 'Trichy Main Hospital',
    'branch-chennai': 'Chennai Super Speciality',
    'branch-madurai': 'Madurai City Hospital',
    'branch-pudukkottai': 'Pudukkottai Healthcare Center',
};
exports.ROLES = [
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
];
exports.REVENUE_CATEGORIES = [
    'OP Consultation',
    'Medical / Pharmacy',
    'Lab & Diagnostics',
    'Day Care',
    'Dressing & Procedures',
    'Surgical KIT & Consumables',
    'Other Collections (Inpatient)',
];
exports.PAYMENT_METHODS = ['Cash', 'UPI', 'Card', 'Net Banking', 'TPA Insurance'];
exports.APPOINTMENT_STATUSES = [
    'SCHEDULED',
    'CONFIRMED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
    'NO_SHOW',
];
exports.LEAVE_STATUSES = [
    'SUBMITTED',
    'MANAGER_REVIEW',
    'HR_REVIEW',
    'APPROVED',
    'REJECTED',
    'CANCELLED',
];
exports.COMPLAINT_STATUSES = [
    'NEW',
    'ASSIGNED',
    'INVESTIGATING',
    'ACTION_TAKEN',
    'RESOLVED',
    'CLOSED',
    'ESCALATED',
];
exports.PRIORITY_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
