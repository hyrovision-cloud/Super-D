import { IBranch } from '../modules/branches/branch.model';
import { IRole } from '../modules/roles/role.model';
import { PERMISSION_CATALOG } from '../modules/roles/role.controller';

export const SEED_BRANCHES: Partial<IBranch>[] = [
  {
    branchId: 'branch-trichy',
    name: 'Aarogya Super Speciality Hospital (Flagship)',
    code: 'TRY',
    city: 'Trichy',
    address: '12-A, Thillai Nagar Main Road, Tiruchirappalli, Tamil Nadu 620018',
    phone: '+91 431 274 0100',
    email: 'info.trichy@aarogya.com',
    emergencyContact: '+91 431 274 0999',
    managerName: 'Dr. R. Sundaram, MD',
    totalBeds: 250,
    occupiedBeds: 215,
    activeDepartments: ['Cardiology', 'Neurology', 'Orthopaedics', 'General Medicine', 'Emergency', 'Pediatrics'],
    status: 'ACTIVE',
  },
  {
    branchId: 'branch-chennai',
    name: 'Aarogya Speciality Center (OMR)',
    code: 'CHN',
    city: 'Chennai',
    address: 'Plot 45, Rajiv Gandhi Salai (OMR), Perungudi, Chennai 600096',
    phone: '+91 44 4890 2200',
    email: 'info.chennai@aarogya.com',
    emergencyContact: '+91 44 4890 2999',
    managerName: 'Dr. K. Annamalai, MS, MCh',
    totalBeds: 350,
    occupiedBeds: 310,
    activeDepartments: ['Cardiology', 'Oncology', 'Organ Transplant', 'Critical Care', 'Radiology'],
    status: 'ACTIVE',
  },
  {
    branchId: 'branch-madurai',
    name: 'Aarogya Multi-Speciality Clinic',
    code: 'MDU',
    city: 'Madurai',
    address: '88, Alagar Kovil Road, K.K. Nagar, Madurai 625020',
    phone: '+91 452 258 4400',
    email: 'info.madurai@aarogya.com',
    emergencyContact: '+91 452 258 4999',
    managerName: 'Dr. M. Senthil Kumar, MD',
    totalBeds: 180,
    occupiedBeds: 142,
    activeDepartments: ['Orthopaedics', 'Gastroenterology', 'General Surgery', 'ENT', 'Dermatology'],
    status: 'ACTIVE',
  },
  {
    branchId: 'branch-pudukkottai',
    name: 'Aarogya Rural & Outreach Center',
    code: 'PDK',
    city: 'Pudukkottai',
    address: '5, Anna Salai, Near New Bus Stand, Pudukkottai 622001',
    phone: '+91 4322 222 100',
    email: 'info.pudukkottai@aarogya.com',
    emergencyContact: '+91 4322 222 999',
    managerName: 'Dr. V. Radha, MBBS, DGO',
    totalBeds: 75,
    occupiedBeds: 36,
    activeDepartments: ['General Medicine', 'Obstetrics & Gynaecology', 'Pediatrics', 'Day Care'],
    status: 'ACTIVE',
  },
];

export const SEED_ROLES: Partial<IRole>[] = [
  {
    roleId: 'role-owner',
    name: 'Hospital Owner',
    description: 'Executive leadership with organization-wide visibility and final governance authority',
    permissions: PERMISSION_CATALOG.map((p) => p.key),
    defaultScope: 'ORGANIZATION',
    isSystem: true,
    userCount: 1,
  },
  {
    roleId: 'role-global-admin',
    name: 'Global Admin',
    description: 'Technical IT & platform administration, security management and audit review',
    permissions: PERMISSION_CATALOG.filter((p) => p.key !== 'owner.ai.view').map((p) => p.key),
    defaultScope: 'ORGANIZATION',
    isSystem: true,
    userCount: 1,
  },
  {
    roleId: 'role-branch-manager',
    name: 'Branch Manager',
    description: 'Operational lead for a specific hospital branch facility',
    permissions: [
      'patient.view', 'patient.create', 'patient.update',
      'appointment.view', 'appointment.create', 'appointment.reschedule',
      'employee.view', 'attendance.view', 'leave.view', 'leave.review', 'leave.final_approve',
      'complaint.view', 'complaint.assign', 'complaint.resolve',
      'revenue.view', 'report.view', 'branch.view'
    ],
    defaultScope: 'OWN_BRANCH',
    isSystem: true,
    userCount: 1,
  },
  {
    roleId: 'role-doctor',
    name: 'Doctor',
    description: 'Physician / Consultant managing clinical care, consultations and discharges',
    permissions: [
      'appointment.view', 'patient.view', 'medical_record.view', 'medical_record.create',
      'leave.view', 'leave.submit'
    ],
    defaultScope: 'ASSIGNED_RECORDS',
    isSystem: true,
    userCount: 1,
  },
  {
    roleId: 'role-hr-manager',
    name: 'HR Manager',
    description: 'Workforce governance, attendance records, leaves and staff directory',
    permissions: [
      'employee.view', 'employee.create', 'employee.update',
      'attendance.view', 'attendance.record', 'attendance.correct',
      'leave.view', 'leave.review', 'leave.final_approve',
      'report.view'
    ],
    defaultScope: 'OWN_BRANCH',
    isSystem: true,
    userCount: 1,
  },
  {
    roleId: 'role-finance-manager',
    name: 'Finance Manager',
    description: 'Accounts, cashier collections, 9-category revenue ledger and adjustments',
    permissions: [
      'revenue.view', 'revenue.create', 'revenue.correct', 'revenue.export',
      'report.view'
    ],
    defaultScope: 'OWN_BRANCH',
    isSystem: true,
    userCount: 1,
  },
  {
    roleId: 'role-marketing-manager',
    name: 'Marketing Manager',
    description: 'Campaign tracking, patient outreach, health camps, and lead attribution',
    permissions: [
      'marketing.view', 'marketing.manage', 'lead.manage', 'report.view'
    ],
    defaultScope: 'ORGANIZATION',
    isSystem: true,
    userCount: 1,
  },
  {
    roleId: 'role-complaints-manager',
    name: 'Complaints and Query Manager',
    description: 'Patient grievance redressal, quality management and SLA tracking',
    permissions: [
      'complaint.view', 'complaint.create', 'complaint.assign', 'complaint.resolve',
      'complaint.view_confidential', 'report.view'
    ],
    defaultScope: 'OWN_BRANCH',
    isSystem: true,
    userCount: 1,
  },
  {
    roleId: 'role-receptionist',
    name: 'Receptionist',
    description: 'Front-desk operations, patient registrations, queue and appointment booking',
    permissions: [
      'patient.view', 'patient.create', 'appointment.view', 'appointment.create', 'appointment.reschedule'
    ],
    defaultScope: 'OWN_BRANCH',
    isSystem: true,
    userCount: 1,
  },
];
