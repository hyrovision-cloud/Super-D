import { RoleType } from '@/types';

export interface NavItemConfig {
  label: string;
  path: string;
  iconName: string;
  badgeKey?: 'pendingLeaves' | 'pendingGrievances' | 'pendingDischarges';
}

export interface NavSectionConfig {
  sectionTitle: string;
  items: NavItemConfig[];
}

export const ALL_NAV_ITEMS: Record<string, NavItemConfig & { group: string }> = {
  dashboard: { label: 'Dashboard', path: '/dashboard', iconName: 'Home', group: 'Overview' },
  patients: { label: 'Patient Directory', path: '/patients', iconName: 'Users', group: 'Hospital Operations' },
  appointments: { label: 'Appointments', path: '/appointments', iconName: 'Calendar', group: 'Hospital Operations' },
  discharge: { label: 'Patient Discharge', path: '/patient-discharge', iconName: 'LogOut', group: 'Hospital Operations', badgeKey: 'pendingDischarges' },
  employees: { label: 'Employee Directory', path: '/employees', iconName: 'UserCheck', group: 'Workforce' },
  attendance: { label: 'Attendance Management', path: '/attendance', iconName: 'CalendarCheck', group: 'Workforce' },
  leaveApproval: { label: 'Leave Approvals', path: '/leave-approval', iconName: 'CheckSquare', group: 'Workforce', badgeKey: 'pendingLeaves' },
  leaveRequest: { label: 'Leave & Permissions', path: '/leave-permission', iconName: 'Clock', group: 'Workforce' },
  grievances: { label: 'Employee Concerns', path: '/grievances', iconName: 'MessageSquareWarning', group: 'Support & Cases', badgeKey: 'pendingGrievances' },
  complaints: { label: 'Complaints Dashboard', path: '/complaints', iconName: 'ShieldAlert', group: 'Support & Cases' },
  advertisements: { label: 'Advertisements', path: '/advertisements', iconName: 'Megaphone', group: 'Growth & Marketing' },
  marketing: { label: 'Marketing Analytics', path: '/marketing', iconName: 'TrendingUp', group: 'Growth & Marketing' },
  revenueAccounts: { label: 'Revenue & Accounts', path: '/revenue-accounts', iconName: 'IndianRupee', group: 'Finance & Accounts' },
  incomeReports: { label: 'Income Reports', path: '/income-reports', iconName: 'BarChart3', group: 'Finance & Accounts' },
  financeDashboard: { label: 'Finance Analytics', path: '/finance', iconName: 'PieChart', group: 'Finance & Accounts' },
  branches: { label: 'Branch Management', path: '/branches', iconName: 'Building2', group: 'Administration' },
  users: { label: 'User Management', path: '/users', iconName: 'UserCog', group: 'Administration' },
  roles: { label: 'Roles & Permissions', path: '/roles', iconName: 'ShieldCheck', group: 'Administration' },
  reports: { label: 'Custom Reports', path: '/reports', iconName: 'FileText', group: 'Administration' },
};

export const ROLE_ROUTE_ACCESS: Record<string, string[]> = {
  'Super Admin': [
    '/dashboard',
    '/patients',
    '/appointments',
    '/patient-discharge',
    '/employees',
    '/attendance',
    '/leave-approval',
    '/leave-permission',
    '/grievances',
    '/complaints',
    '/advertisements',
    '/marketing',
    '/revenue-accounts',
    '/income-reports',
    '/finance',
    '/branches',
    '/users',
    '/roles',
    '/reports',
    '/profile',
    '/settings',
  ],
  'Hospital Owner': [
    '/dashboard',
    '/patients',
    '/appointments',
    '/patient-discharge',
    '/employees',
    '/attendance',
    '/leave-approval',
    '/grievances',
    '/complaints',
    '/advertisements',
    '/marketing',
    '/revenue-accounts',
    '/income-reports',
    '/finance',
    '/branches',
    '/users',
    '/roles',
    '/reports',
    '/profile',
    '/settings',
  ],
  'Admin': [
    '/dashboard',
    '/patients',
    '/appointments',
    '/patient-discharge',
    '/employees',
    '/attendance',
    '/leave-approval',
    '/grievances',
    '/complaints',
    '/branches',
    '/users',
    '/roles',
    '/profile',
    '/settings',
  ],
  'Global Admin': [
    '/dashboard',
    '/patients',
    '/appointments',
    '/patient-discharge',
    '/employees',
    '/attendance',
    '/leave-approval',
    '/grievances',
    '/complaints',
    '/branches',
    '/users',
    '/roles',
    '/profile',
    '/settings',
  ],
  'HR': [
    '/dashboard',
    '/employees',
    '/attendance',
    '/leave-approval',
    '/leave-permission',
    '/grievances',
    '/profile',
    '/settings',
  ],
  'HR Manager': [
    '/dashboard',
    '/employees',
    '/attendance',
    '/leave-approval',
    '/leave-permission',
    '/grievances',
    '/profile',
    '/settings',
  ],
  'Branch Doctor': [
    '/dashboard',
    '/patients',
    '/appointments',
    '/patient-discharge',
    '/attendance',
    '/leave-permission',
    '/profile',
    '/settings',
  ],
  'Doctor': [
    '/dashboard',
    '/patients',
    '/appointments',
    '/patient-discharge',
    '/attendance',
    '/leave-permission',
    '/profile',
    '/settings',
  ],
  'Branch Manager': [
    '/dashboard',
    '/patients',
    '/appointments',
    '/patient-discharge',
    '/employees',
    '/attendance',
    '/leave-approval',
    '/leave-permission',
    '/grievances',
    '/revenue-accounts',
    '/income-reports',
    '/profile',
    '/settings',
  ],
  'Staff': [
    '/dashboard',
    '/appointments',
    '/patient-discharge',
    '/advertisements',
    '/revenue-accounts',
    '/attendance',
    '/leave-permission',
    '/profile',
    '/settings',
  ],
  'Employee': [
    '/dashboard',
    '/leave-permission',
    '/attendance',
    '/grievances',
    '/profile',
    '/settings',
  ],
  'Finance Manager': [
    '/dashboard',
    '/revenue-accounts',
    '/income-reports',
    '/finance',
    '/patient-discharge',
    '/reports',
    '/profile',
    '/settings',
  ],
  'Marketing Manager': [
    '/dashboard',
    '/advertisements',
    '/marketing',
    '/reports',
    '/profile',
    '/settings',
  ],
  'Complaints and Query Manager': [
    '/dashboard',
    '/grievances',
    '/complaints',
    '/profile',
    '/settings',
  ],
  'Receptionist': [
    '/dashboard',
    '/patients',
    '/appointments',
    '/patient-discharge',
    '/profile',
    '/settings',
  ],
};

export const ROLE_SIDEBAR_SECTIONS: Record<string, NavSectionConfig[]> = {
  'Super Admin': [
    {
      sectionTitle: 'Overview',
      items: [ALL_NAV_ITEMS.dashboard],
    },
    {
      sectionTitle: 'Hospital Operations',
      items: [ALL_NAV_ITEMS.patients, ALL_NAV_ITEMS.appointments, ALL_NAV_ITEMS.discharge],
    },
    {
      sectionTitle: 'Workforce',
      items: [ALL_NAV_ITEMS.employees, ALL_NAV_ITEMS.attendance, ALL_NAV_ITEMS.leaveApproval],
    },
    {
      sectionTitle: 'Support & Cases',
      items: [ALL_NAV_ITEMS.grievances, ALL_NAV_ITEMS.complaints],
    },
    {
      sectionTitle: 'Growth & Marketing',
      items: [ALL_NAV_ITEMS.advertisements, ALL_NAV_ITEMS.marketing],
    },
    {
      sectionTitle: 'Finance & Accounts',
      items: [ALL_NAV_ITEMS.revenueAccounts, ALL_NAV_ITEMS.incomeReports, ALL_NAV_ITEMS.financeDashboard],
    },
    {
      sectionTitle: 'Administration',
      items: [ALL_NAV_ITEMS.branches, ALL_NAV_ITEMS.users, ALL_NAV_ITEMS.roles, ALL_NAV_ITEMS.reports],
    },
  ],
  'Hospital Owner': [
    {
      sectionTitle: 'Overview',
      items: [ALL_NAV_ITEMS.dashboard],
    },
    {
      sectionTitle: 'Hospital Operations',
      items: [ALL_NAV_ITEMS.patients, ALL_NAV_ITEMS.appointments, ALL_NAV_ITEMS.discharge],
    },
    {
      sectionTitle: 'Workforce',
      items: [ALL_NAV_ITEMS.employees, ALL_NAV_ITEMS.attendance, ALL_NAV_ITEMS.leaveApproval],
    },
    {
      sectionTitle: 'Support & Cases',
      items: [ALL_NAV_ITEMS.grievances, ALL_NAV_ITEMS.complaints],
    },
    {
      sectionTitle: 'Growth & Marketing',
      items: [ALL_NAV_ITEMS.advertisements, ALL_NAV_ITEMS.marketing],
    },
    {
      sectionTitle: 'Finance & Accounts',
      items: [ALL_NAV_ITEMS.revenueAccounts, ALL_NAV_ITEMS.incomeReports, ALL_NAV_ITEMS.financeDashboard],
    },
    {
      sectionTitle: 'Administration',
      items: [ALL_NAV_ITEMS.branches, ALL_NAV_ITEMS.users, ALL_NAV_ITEMS.roles, ALL_NAV_ITEMS.reports],
    },
  ],
  'Admin': [
    {
      sectionTitle: 'Overview',
      items: [ALL_NAV_ITEMS.dashboard],
    },
    {
      sectionTitle: 'Hospital Operations',
      items: [ALL_NAV_ITEMS.patients, ALL_NAV_ITEMS.appointments, ALL_NAV_ITEMS.discharge],
    },
    {
      sectionTitle: 'Workforce',
      items: [ALL_NAV_ITEMS.attendance, ALL_NAV_ITEMS.employees, ALL_NAV_ITEMS.leaveApproval],
    },
    {
      sectionTitle: 'Support & Cases',
      items: [ALL_NAV_ITEMS.grievances, ALL_NAV_ITEMS.complaints],
    },
    {
      sectionTitle: 'Administration',
      items: [ALL_NAV_ITEMS.branches, ALL_NAV_ITEMS.users, ALL_NAV_ITEMS.roles],
    },
  ],
  'Global Admin': [
    {
      sectionTitle: 'Overview',
      items: [ALL_NAV_ITEMS.dashboard],
    },
    {
      sectionTitle: 'Hospital Operations',
      items: [ALL_NAV_ITEMS.patients, ALL_NAV_ITEMS.appointments, ALL_NAV_ITEMS.discharge],
    },
    {
      sectionTitle: 'Workforce',
      items: [ALL_NAV_ITEMS.attendance, ALL_NAV_ITEMS.employees, ALL_NAV_ITEMS.leaveApproval],
    },
    {
      sectionTitle: 'Support & Cases',
      items: [ALL_NAV_ITEMS.grievances, ALL_NAV_ITEMS.complaints],
    },
    {
      sectionTitle: 'Administration',
      items: [ALL_NAV_ITEMS.branches, ALL_NAV_ITEMS.users, ALL_NAV_ITEMS.roles],
    },
  ],
  'HR': [
    {
      sectionTitle: 'Overview',
      items: [ALL_NAV_ITEMS.dashboard],
    },
    {
      sectionTitle: 'Workforce',
      items: [ALL_NAV_ITEMS.attendance, ALL_NAV_ITEMS.employees, ALL_NAV_ITEMS.leaveApproval, ALL_NAV_ITEMS.leaveRequest],
    },
    {
      sectionTitle: 'Support & Cases',
      items: [ALL_NAV_ITEMS.grievances],
    },
  ],
  'HR Manager': [
    {
      sectionTitle: 'Overview',
      items: [ALL_NAV_ITEMS.dashboard],
    },
    {
      sectionTitle: 'Workforce',
      items: [ALL_NAV_ITEMS.attendance, ALL_NAV_ITEMS.employees, ALL_NAV_ITEMS.leaveApproval, ALL_NAV_ITEMS.leaveRequest],
    },
    {
      sectionTitle: 'Support & Cases',
      items: [ALL_NAV_ITEMS.grievances],
    },
  ],
  'Branch Doctor': [
    {
      sectionTitle: 'Overview',
      items: [ALL_NAV_ITEMS.dashboard],
    },
    {
      sectionTitle: 'Hospital Operations',
      items: [ALL_NAV_ITEMS.patients, ALL_NAV_ITEMS.appointments, ALL_NAV_ITEMS.discharge],
    },
    {
      sectionTitle: 'Workforce',
      items: [ALL_NAV_ITEMS.attendance, ALL_NAV_ITEMS.leaveRequest],
    },
  ],
  'Doctor': [
    {
      sectionTitle: 'Overview',
      items: [ALL_NAV_ITEMS.dashboard],
    },
    {
      sectionTitle: 'Hospital Operations',
      items: [ALL_NAV_ITEMS.patients, ALL_NAV_ITEMS.appointments, ALL_NAV_ITEMS.discharge],
    },
    {
      sectionTitle: 'Workforce',
      items: [ALL_NAV_ITEMS.attendance, ALL_NAV_ITEMS.leaveRequest],
    },
  ],
  'Branch Manager': [
    {
      sectionTitle: 'Overview',
      items: [ALL_NAV_ITEMS.dashboard],
    },
    {
      sectionTitle: 'Hospital Operations',
      items: [ALL_NAV_ITEMS.patients, ALL_NAV_ITEMS.appointments, ALL_NAV_ITEMS.discharge],
    },
    {
      sectionTitle: 'Workforce',
      items: [ALL_NAV_ITEMS.employees, ALL_NAV_ITEMS.attendance, ALL_NAV_ITEMS.leaveApproval],
    },
    {
      sectionTitle: 'Support & Cases',
      items: [ALL_NAV_ITEMS.grievances],
    },
    {
      sectionTitle: 'Finance & Accounts',
      items: [ALL_NAV_ITEMS.revenueAccounts, ALL_NAV_ITEMS.incomeReports],
    },
  ],
  'Staff': [
    {
      sectionTitle: 'Overview',
      items: [ALL_NAV_ITEMS.dashboard],
    },
    {
      sectionTitle: 'Hospital Operations',
      items: [ALL_NAV_ITEMS.appointments, ALL_NAV_ITEMS.discharge],
    },
    {
      sectionTitle: 'Growth & Marketing',
      items: [ALL_NAV_ITEMS.advertisements],
    },
    {
      sectionTitle: 'Finance & Accounts',
      items: [ALL_NAV_ITEMS.revenueAccounts],
    },
    {
      sectionTitle: 'Workforce',
      items: [ALL_NAV_ITEMS.attendance, ALL_NAV_ITEMS.leaveRequest],
    },
  ],
  'Employee': [
    {
      sectionTitle: 'Overview',
      items: [ALL_NAV_ITEMS.dashboard],
    },
    {
      sectionTitle: 'Workforce',
      items: [ALL_NAV_ITEMS.leaveRequest, ALL_NAV_ITEMS.attendance],
    },
    {
      sectionTitle: 'Support & Cases',
      items: [ALL_NAV_ITEMS.grievances],
    },
  ],
  'Finance Manager': [
    {
      sectionTitle: 'Overview',
      items: [ALL_NAV_ITEMS.dashboard],
    },
    {
      sectionTitle: 'Finance & Accounts',
      items: [ALL_NAV_ITEMS.revenueAccounts, ALL_NAV_ITEMS.incomeReports, ALL_NAV_ITEMS.financeDashboard],
    },
    {
      sectionTitle: 'Hospital Operations',
      items: [ALL_NAV_ITEMS.discharge],
    },
    {
      sectionTitle: 'Administration',
      items: [ALL_NAV_ITEMS.reports],
    },
  ],
  'Marketing Manager': [
    {
      sectionTitle: 'Overview',
      items: [ALL_NAV_ITEMS.dashboard],
    },
    {
      sectionTitle: 'Growth & Marketing',
      items: [ALL_NAV_ITEMS.advertisements, ALL_NAV_ITEMS.marketing],
    },
    {
      sectionTitle: 'Administration',
      items: [ALL_NAV_ITEMS.reports],
    },
  ],
  'Complaints and Query Manager': [
    {
      sectionTitle: 'Overview',
      items: [ALL_NAV_ITEMS.dashboard],
    },
    {
      sectionTitle: 'Support & Cases',
      items: [ALL_NAV_ITEMS.grievances, ALL_NAV_ITEMS.complaints],
    },
  ],
  'Receptionist': [
    {
      sectionTitle: 'Overview',
      items: [ALL_NAV_ITEMS.dashboard],
    },
    {
      sectionTitle: 'Hospital Operations',
      items: [ALL_NAV_ITEMS.patients, ALL_NAV_ITEMS.appointments, ALL_NAV_ITEMS.discharge],
    },
  ],
};

// Flattened fallback for backward compatibility
export const ROLE_SIDEBAR_ITEMS: Record<string, NavItemConfig[]> = Object.entries(ROLE_SIDEBAR_SECTIONS).reduce(
  (acc, [role, sections]) => {
    acc[role] = sections.flatMap((s) => s.items);
    return acc;
  },
  {} as Record<string, NavItemConfig[]>
);

export const BOTTOM_SIDEBAR_ITEMS: NavItemConfig[] = [
  { label: 'Profile', path: '/profile', iconName: 'User' },
  { label: 'Settings', path: '/settings', iconName: 'Settings' },
];

export function canRoleAccessRoute(role: RoleType | string, targetPath: string): boolean {
  const allowed = ROLE_ROUTE_ACCESS[role];
  if (!allowed) return true;
  return allowed.some((p) => targetPath === p || targetPath.startsWith(p + '/'));
}
