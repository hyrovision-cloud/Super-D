"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.INITIAL_ROLES = exports.ALL_SYSTEM_PERMISSIONS = void 0;
exports.seedAuthData = seedAuthData;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_model_1 = require("../models/User.model");
const Role_model_1 = require("../models/Role.model");
const Branch_model_1 = require("../models/Branch.model");
const logger_1 = require("../utils/logger");
exports.ALL_SYSTEM_PERMISSIONS = [
    'dashboard.view',
    'dashboard.owner.view',
    'organization.view',
    'patient.view',
    'patient.create',
    'patient.update',
    'patient.delete',
    'patient.discharge',
    'medical_record.view',
    'medical_record.create',
    'appointment.view',
    'appointment.create',
    'appointment.cancel',
    'appointment.update',
    'employee.view',
    'employee.create',
    'employee.update',
    'employee.delete',
    'attendance.view',
    'attendance.mark',
    'attendance.manage',
    'attendance.update',
    'attendance.delete',
    'leave.view',
    'leave.request',
    'leave.approve',
    'leave.reject',
    'complaint.view',
    'complaint.create',
    'complaint.resolve',
    'complaint.assign',
    'complaint.update',
    'complaint.close',
    'complaint.view_confidential',
    'grievance.view',
    'grievance.submit',
    'revenue.view',
    'revenue.create',
    'revenue.update',
    'expense.view',
    'expense.create',
    'expense.update',
    'expense.delete',
    'income.view',
    'advertisement.view',
    'advertisement.create',
    'advertisement.update',
    'marketing.view',
    'marketing.create',
    'marketing.update',
    'lead.view',
    'lead.create',
    'lead.update',
    'branch.view',
    'branch.manage',
    'user.view',
    'user.manage',
    'user.create',
    'user.update',
    'user.delete',
    'role.view',
    'role.manage',
    'role.create',
    'role.update',
    'role.assign',
    'report.view',
    'notification.view',
    'settings.view',
    'settings.update',
    'config.view',
    'config.create',
    'config.update',
    'config.delete',
];
exports.INITIAL_ROLES = [
    {
        name: 'Super Admin',
        description: 'Ultimate hospital platform governance across all branches',
        permissions: exports.ALL_SYSTEM_PERMISSIONS,
        isSystemRole: true,
    },
    {
        name: 'Hospital Owner',
        description: 'Hospital ownership, financial oversight, governance and multi-branch monitoring',
        permissions: exports.ALL_SYSTEM_PERMISSIONS,
        isSystemRole: true,
    },
    {
        name: 'Global Admin',
        description: 'Central administrative authority across all medical, staff, and branch operations',
        permissions: [
            'dashboard.view', 'organization.view', 'patient.view', 'patient.create', 'patient.update',
            'patient.discharge', 'medical_record.view', 'appointment.view', 'appointment.create',
            'appointment.update', 'appointment.cancel', 'employee.view', 'employee.create',
            'employee.update', 'attendance.view', 'attendance.manage', 'attendance.update',
            'leave.view', 'leave.approve', 'leave.reject', 'complaint.view', 'complaint.create',
            'complaint.assign', 'complaint.update', 'complaint.resolve', 'branch.view', 'branch.manage',
            'user.view', 'user.create', 'user.update', 'role.view', 'role.update', 'role.assign',
            'report.view', 'notification.view', 'settings.view', 'settings.update',
            'config.view', 'config.update',
        ],
        isSystemRole: true,
    },
    {
        name: 'Branch Manager',
        description: 'Single-branch management: clinical overview, workforce leave approvals, revenue tracking',
        permissions: [
            'patient.view',
            'patient.discharge',
            'appointment.view',
            'employee.view',
            'attendance.view',
            'leave.approve',
            'grievance.view',
            'revenue.view',
            'income.view',
        ],
        isSystemRole: true,
    },
    {
        name: 'Branch Doctor',
        description: 'Clinical practitioner: patient consultations, medical records, patient discharge summaries',
        permissions: [
            'patient.view',
            'patient.discharge',
            'medical_record.view',
            'medical_record.create',
            'appointment.view',
            'attendance.mark',
            'leave.request',
        ],
        isSystemRole: true,
    },
    {
        name: 'Doctor',
        description: 'General doctor profile for clinical operations and appointment management',
        permissions: [
            'patient.view',
            'patient.discharge',
            'medical_record.view',
            'medical_record.create',
            'appointment.view',
            'attendance.mark',
            'leave.request',
        ],
        isSystemRole: true,
    },
    {
        name: 'HR',
        description: 'Human resources: employee directory, cross-branch attendance, leave approval workflows',
        permissions: [
            'employee.view',
            'employee.create',
            'attendance.view',
            'attendance.manage',
            'leave.approve',
            'leave.request',
            'grievance.view',
        ],
        isSystemRole: true,
    },
    {
        name: 'HR Manager',
        description: 'Senior HR administrator overseeing enterprise employee policies and grievances',
        permissions: [
            'employee.view',
            'employee.create',
            'attendance.view',
            'attendance.manage',
            'leave.approve',
            'leave.request',
            'grievance.view',
        ],
        isSystemRole: true,
    },
    {
        name: 'Finance Manager',
        description: 'Financial administration: daily revenue collections, accounts, and income audit reports',
        permissions: [
            'revenue.view',
            'revenue.create',
            'income.view',
            'patient.discharge',
            'report.view',
        ],
        isSystemRole: true,
    },
    {
        name: 'Marketing Manager',
        description: 'Growth and outreach: campaign management, advertisement analytics, lead tracking',
        permissions: [
            'advertisement.view',
            'advertisement.create',
            'marketing.view',
            'report.view',
        ],
        isSystemRole: true,
    },
    {
        name: 'Complaints and Query Manager',
        description: 'Patient grievances, operational complaints, and satisfaction ticket resolution',
        permissions: [
            'complaint.view',
            'complaint.create',
            'complaint.resolve',
            'grievance.view',
        ],
        isSystemRole: true,
    },
    {
        name: 'Staff',
        description: 'Branch reception and accounts clerk: appointments, billings, advertisement tracking',
        permissions: [
            'appointment.view',
            'patient.view',
            'patient.discharge',
            'advertisement.view',
            'revenue.view',
            'revenue.create',
            'attendance.mark',
            'leave.request',
        ],
        isSystemRole: true,
    },
    {
        name: 'Receptionist',
        description: 'Front-desk patient check-in, appointments scheduling, and OPD assistance',
        permissions: [
            'patient.view',
            'appointment.view',
            'appointment.create',
            'patient.discharge',
        ],
        isSystemRole: true,
    },
    {
        name: 'Employee',
        description: 'Hospital staff member self-service: attendance check-in, leave/permission applications',
        permissions: [
            'attendance.mark',
            'leave.request',
            'grievance.submit',
        ],
        isSystemRole: true,
    },
];
function normalizedPermissions(roleName, permissions) {
    const result = new Set(permissions);
    result.add('dashboard.view');
    result.add('notification.view');
    result.add('settings.view');
    result.add('branch.view');
    if (result.has('leave.request') || result.has('leave.approve'))
        result.add('leave.view');
    if (result.has('attendance.manage')) {
        result.add('attendance.update');
        result.add('attendance.delete');
    }
    if (result.has('settings.view'))
        result.add('config.view');
    if (result.has('settings.update'))
        result.add('config.update');
    if (result.has('leave.approve'))
        result.add('leave.reject');
    if (result.has('user.manage')) {
        result.add('user.view');
        result.add('user.create');
        result.add('user.update');
    }
    if (result.has('role.manage')) {
        result.add('role.view');
        result.add('role.create');
        result.add('role.update');
    }
    if (result.has('revenue.view'))
        result.add('expense.view');
    if (result.has('revenue.create')) {
        result.add('revenue.update');
        result.add('expense.create');
        result.add('expense.update');
    }
    if (result.has('marketing.view'))
        result.add('lead.view');
    if (result.has('advertisement.create')) {
        result.add('advertisement.update');
        result.add('lead.create');
        result.add('lead.update');
    }
    if (result.has('complaint.resolve')) {
        result.add('complaint.assign');
        result.add('complaint.update');
        result.add('complaint.close');
    }
    if (roleName === 'Hospital Owner' || roleName === 'Super Admin')
        result.add('dashboard.owner.view');
    return [...result];
}
async function seedAuthData() {
    try {
        logger_1.logger.info('[Seed:Auth] Starting Auth & RBAC seed...');
        for (const roleDef of exports.INITIAL_ROLES) {
            const permissions = normalizedPermissions(roleDef.name, roleDef.permissions);
            await Role_model_1.RoleModel.findOneAndUpdate({ name: roleDef.name }, { $set: { ...roleDef, permissions } }, { upsert: true, new: true });
        }
        logger_1.logger.info(`[Seed:Auth] Verified ${exports.INITIAL_ROLES.length} system roles.`);
        const INITIAL_BRANCHES = [
            {
                branchId: 'branch-trichy',
                name: 'Trichy Main Hospital',
                code: 'TRY',
                city: 'Tiruchirappalli',
                address: '42, Thillai Nagar Main Road, Cantonment',
                phone: '+91 431 245 8890',
                email: 'trichy@superd.demo',
                bedCapacity: 120,
                departments: ['Cardiology', 'Orthopedics', 'General Medicine', 'Pediatrics', 'Emergency'],
                isActive: true,
            },
            {
                branchId: 'branch-chennai',
                name: 'Chennai Super Speciality',
                code: 'CHN',
                city: 'Chennai',
                address: '108, Velachery Main Road, Guindy',
                phone: '+91 44 4890 2200',
                email: 'chennai@superd.demo',
                bedCapacity: 250,
                departments: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Dermatology', 'Emergency'],
                isActive: true,
            },
            {
                branchId: 'branch-madurai',
                name: 'Madurai City Hospital',
                code: 'MDU',
                city: 'Madurai',
                address: '15, K.K. Nagar East 4th Street',
                phone: '+91 452 258 4430',
                email: 'madurai@superd.demo',
                bedCapacity: 180,
                departments: ['General Medicine', 'Orthopedics', 'Pediatrics', 'ENT', 'Emergency'],
                isActive: true,
            },
            {
                branchId: 'branch-pudukkottai',
                name: 'Pudukkottai Healthcare Center',
                code: 'PDK',
                city: 'Pudukkottai',
                address: '88, Alangudi Road, Rajagopalapuram',
                phone: '+91 4322 221 150',
                email: 'pudukkottai@superd.demo',
                bedCapacity: 80,
                departments: ['General Medicine', 'Pediatrics', 'Dermatology', 'Emergency'],
                isActive: true,
            },
        ];
        for (const branchDef of INITIAL_BRANCHES) {
            await Branch_model_1.BranchModel.findOneAndUpdate({ branchId: branchDef.branchId }, { $set: branchDef }, { upsert: true, new: true });
        }
        logger_1.logger.info(`[Seed:Auth] Verified all ${INITIAL_BRANCHES.length} canonical hospital branches.`);
        const defaultPasswordHash = await bcryptjs_1.default.hash('demo2026@superd', 10);
        const ALL_BRANCHES = [
            'branch-trichy',
            'branch-chennai',
            'branch-madurai',
            'branch-pudukkottai',
        ];
        const DEMO_USERS = [
            {
                name: 'Hospital Owner', email: 'owner@superd.demo', passwordHash: defaultPasswordHash,
                employeeId: 'EMP-000', role: 'Hospital Owner', roles: ['Hospital Owner'],
                primaryBranchId: 'branch-trichy', assignedBranches: ALL_BRANCHES,
                department: 'Executive Office', status: 'ACTIVE',
            },
            {
                name: 'Super Admin',
                email: 'superadmin@superd.demo',
                passwordHash: defaultPasswordHash,
                employeeId: 'EMP-001',
                role: 'Super Admin',
                roles: ['Super Admin'],
                primaryBranchId: 'branch-trichy',
                assignedBranches: ALL_BRANCHES,
                department: 'Hospital Administration',
                status: 'ACTIVE',
            },
            {
                name: 'Admin',
                email: 'admin@superd.demo',
                passwordHash: defaultPasswordHash,
                employeeId: 'EMP-002',
                role: 'Global Admin',
                roles: ['Global Admin'],
                primaryBranchId: 'branch-chennai',
                assignedBranches: ALL_BRANCHES,
                department: 'IT & Administration',
                status: 'ACTIVE',
            },
            {
                name: 'HR Manager',
                email: 'hr@superd.demo',
                passwordHash: defaultPasswordHash,
                employeeId: 'EMP-005',
                role: 'HR',
                roles: ['HR'],
                primaryBranchId: 'branch-chennai',
                assignedBranches: ALL_BRANCHES,
                department: 'Human Resources',
                status: 'ACTIVE',
            },
            {
                name: 'Finance Manager', email: 'finance@superd.demo', passwordHash: defaultPasswordHash,
                employeeId: 'EMP-006', role: 'Finance Manager', roles: ['Finance Manager'],
                primaryBranchId: 'branch-chennai', assignedBranches: ALL_BRANCHES,
                department: 'Finance', status: 'ACTIVE',
            },
            {
                name: 'Marketing Manager', email: 'marketing@superd.demo', passwordHash: defaultPasswordHash,
                employeeId: 'EMP-007', role: 'Marketing Manager', roles: ['Marketing Manager'],
                primaryBranchId: 'branch-chennai', assignedBranches: ALL_BRANCHES,
                department: 'Marketing', status: 'ACTIVE',
            },
            {
                name: 'Complaints Manager', email: 'complaints@superd.demo', passwordHash: defaultPasswordHash,
                employeeId: 'EMP-008', role: 'Complaints and Query Manager', roles: ['Complaints and Query Manager'],
                primaryBranchId: 'branch-madurai', assignedBranches: ['branch-madurai'],
                department: 'Patient Relations', status: 'ACTIVE',
            },
            {
                name: 'Dr. Anand Kumar',
                email: 'doctor.trichy@superd.demo',
                passwordHash: defaultPasswordHash,
                employeeId: 'EMP-021',
                role: 'Branch Doctor',
                roles: ['Branch Doctor', 'Doctor'],
                primaryBranchId: 'branch-trichy',
                assignedBranches: ['branch-trichy'],
                department: 'Orthopedics',
                status: 'ACTIVE',
            },
            {
                name: 'Branch Manager',
                email: 'manager.trichy@superd.demo',
                passwordHash: defaultPasswordHash,
                employeeId: 'EMP-010',
                role: 'Branch Manager',
                roles: ['Branch Manager'],
                primaryBranchId: 'branch-trichy',
                assignedBranches: ['branch-trichy'],
                department: 'Hospital Administration',
                status: 'ACTIVE',
            },
            {
                name: 'Staff Member',
                email: 'staff.trichy@superd.demo',
                passwordHash: defaultPasswordHash,
                employeeId: 'EMP-040',
                role: 'Staff',
                roles: ['Staff'],
                primaryBranchId: 'branch-trichy',
                assignedBranches: ['branch-trichy'],
                department: 'Front Desk / Accounts',
                status: 'ACTIVE',
            },
            {
                name: 'Suresh Babu',
                email: 'employee.trichy@superd.demo',
                passwordHash: defaultPasswordHash,
                employeeId: 'EMP-055',
                role: 'Employee',
                roles: ['Employee'],
                primaryBranchId: 'branch-trichy',
                assignedBranches: ['branch-trichy'],
                department: 'Nursing',
                status: 'ACTIVE',
            },
            {
                name: 'Inactive Test User',
                email: 'inactive@superd.demo',
                passwordHash: defaultPasswordHash,
                employeeId: 'EMP-998',
                role: 'Employee',
                roles: ['Employee'],
                primaryBranchId: 'branch-trichy',
                assignedBranches: ['branch-trichy'],
                department: 'General Services',
                status: 'INACTIVE',
            },
            {
                name: 'Suspended Test User',
                email: 'suspended@superd.demo',
                passwordHash: defaultPasswordHash,
                employeeId: 'EMP-999',
                role: 'Employee',
                roles: ['Employee'],
                primaryBranchId: 'branch-trichy',
                assignedBranches: ['branch-trichy'],
                department: 'General Services',
                status: 'SUSPENDED',
            },
        ];
        for (const userDef of DEMO_USERS) {
            await User_model_1.UserModel.findOneAndUpdate({ email: userDef.email }, { $set: userDef }, { upsert: true, new: true });
        }
        logger_1.logger.info(`[Seed:Auth] Successfully verified/seeded ${DEMO_USERS.length} demo and test users.`);
    }
    catch (err) {
        logger_1.logger.error(`[Seed:Auth] Seeding failed: ${err.message}`, err);
        throw err;
    }
}
