export interface NavItemConfig {
  label: string;
  path: string;
  iconName: string;
  group?: string;
  permission?: string;
  anyOf?: string[];
  authenticatedOnly?: boolean;
  badgeKey?: 'pendingLeaves' | 'pendingGrievances' | 'pendingDischarges';
}

export interface NavSectionConfig { sectionTitle: string; items: NavItemConfig[]; }
export interface RouteAccessConfig { permission?: string; anyOf?: string[]; authenticatedOnly?: boolean; }

export const ALL_NAV_ITEMS: Record<string, NavItemConfig> = {
  dashboard: { label: 'Dashboard', path: '/dashboard', iconName: 'Home', group: 'Overview', permission: 'dashboard.view' },
  ownerDashboard: { label: 'Owner Command Center', path: '/owner-dashboard', iconName: 'Crown', group: 'Overview', permission: 'dashboard.owner.view' },
  patients: { label: 'Patient Directory', path: '/patients', iconName: 'Users', group: 'Hospital Operations', permission: 'patient.view' },
  appointments: { label: 'Appointments', path: '/appointments', iconName: 'Calendar', group: 'Hospital Operations', permission: 'appointment.view' },
  discharge: { label: 'Patient Discharge', path: '/patient-discharge', iconName: 'LogOut', group: 'Hospital Operations', permission: 'patient.discharge', badgeKey: 'pendingDischarges' },
  employees: { label: 'Employee Directory', path: '/employees', iconName: 'UserCheck', group: 'Workforce', permission: 'employee.view' },
  attendance: { label: 'Attendance Management', path: '/attendance', iconName: 'CalendarCheck', group: 'Workforce', anyOf: ['attendance.view', 'attendance.mark'] },
  leaveApproval: { label: 'Leave Approvals', path: '/leave-approval', iconName: 'CheckSquare', group: 'Workforce', permission: 'leave.approve', badgeKey: 'pendingLeaves' },
  leaveRequest: { label: 'Leave & Permissions', path: '/leave-permission', iconName: 'Clock', group: 'Workforce', permission: 'leave.view' },
  grievances: { label: 'Employee Concerns', path: '/grievances', iconName: 'MessageSquareWarning', group: 'Support & Cases', anyOf: ['grievance.view', 'grievance.submit'], badgeKey: 'pendingGrievances' },
  complaints: { label: 'Complaints Dashboard', path: '/complaints', iconName: 'ShieldAlert', group: 'Support & Cases', permission: 'complaint.view' },
  advertisements: { label: 'Advertisements', path: '/advertisements', iconName: 'Megaphone', group: 'Growth & Marketing', permission: 'advertisement.view' },
  marketing: { label: 'Marketing Analytics', path: '/marketing', iconName: 'TrendingUp', group: 'Growth & Marketing', permission: 'marketing.view' },
  revenueAccounts: { label: 'Revenue & Accounts', path: '/revenue-accounts', iconName: 'IndianRupee', group: 'Finance & Accounts', permission: 'revenue.view' },
  incomeReports: { label: 'Income Reports', path: '/income-reports', iconName: 'BarChart3', group: 'Finance & Accounts', permission: 'income.view' },
  financeDashboard: { label: 'Finance Analytics', path: '/finance', iconName: 'PieChart', group: 'Finance & Accounts', anyOf: ['revenue.view', 'expense.view'] },
  branches: { label: 'Branch Management', path: '/branches', iconName: 'Building2', group: 'Administration', permission: 'branch.manage' },
  users: { label: 'User Management', path: '/users', iconName: 'UserCog', group: 'Administration', permission: 'user.view' },
  roles: { label: 'Roles & Permissions', path: '/roles', iconName: 'ShieldCheck', group: 'Administration', permission: 'role.view' },
  reports: { label: 'Custom Reports', path: '/reports', iconName: 'FileText', group: 'Administration', permission: 'report.view' },
};

export const ROUTE_ACCESS: Record<string, RouteAccessConfig> = {
  '/dashboard': { permission: 'dashboard.view' },
  '/owner-dashboard': { permission: 'dashboard.owner.view' },
  '/patients': { permission: 'patient.view' },
  '/appointments': { permission: 'appointment.view' },
  '/patient-discharge': { permission: 'patient.discharge' },
  '/employees': { permission: 'employee.view' },
  '/attendance': { anyOf: ['attendance.view', 'attendance.mark'] },
  '/leave-approval': { permission: 'leave.approve' },
  '/leave-permission': { permission: 'leave.view' },
  '/grievances': { anyOf: ['grievance.view', 'grievance.submit'] },
  '/complaints': { permission: 'complaint.view' },
  '/advertisements': { permission: 'advertisement.view' },
  '/marketing': { permission: 'marketing.view' },
  '/revenue-accounts': { permission: 'revenue.view' },
  '/income-reports': { permission: 'income.view' },
  '/finance': { anyOf: ['revenue.view', 'expense.view'] },
  '/branches': { permission: 'branch.manage' },
  '/users': { permission: 'user.view' },
  '/roles': { permission: 'role.view' },
  '/reports': { permission: 'report.view' },
  '/profile': { authenticatedOnly: true },
  '/settings': { permission: 'settings.view' },
};

export function hasAccess(config: RouteAccessConfig | NavItemConfig, permissions: string[]): boolean {
  if (config.authenticatedOnly) return true;
  if (config.permission) return permissions.includes(config.permission);
  if (config.anyOf) return config.anyOf.some((permission) => permissions.includes(permission));
  return false;
}

export function getRouteAccess(path: string): RouteAccessConfig | undefined {
  const key = Object.keys(ROUTE_ACCESS).sort((a, b) => b.length - a.length).find((candidate) => path === candidate || path.startsWith(`${candidate}/`));
  return key ? ROUTE_ACCESS[key] : undefined;
}

export function canAccessRoute(permissions: string[], path: string): boolean {
  const config = getRouteAccess(path);
  return config ? hasAccess(config, permissions) : false;
}

export function getAuthorizedSections(permissions: string[]): NavSectionConfig[] {
  const groups = new Map<string, NavItemConfig[]>();
  Object.values(ALL_NAV_ITEMS).filter((item) => hasAccess(item, permissions)).forEach((item) => {
    const group = item.group || 'Overview';
    groups.set(group, [...(groups.get(group) || []), item]);
  });
  return [...groups.entries()].map(([sectionTitle, items]) => ({ sectionTitle, items }));
}

export function getAuthorizedItems(permissions: string[]): NavItemConfig[] {
  return Object.values(ALL_NAV_ITEMS).filter((item) => hasAccess(item, permissions));
}

export const BOTTOM_SIDEBAR_ITEMS: NavItemConfig[] = [
  { label: 'Profile', path: '/profile', iconName: 'User', authenticatedOnly: true },
  { label: 'Settings', path: '/settings', iconName: 'Settings', permission: 'settings.view' },
];
