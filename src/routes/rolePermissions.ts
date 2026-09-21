import { RoleType } from '@/types';

export interface NavItemConfig {
  label: string;
  path: string;
  iconName: string;
  badgeKey?: 'pendingLeaves' | 'pendingGrievances' | 'pendingDischarges';
}

export const ROLE_ROUTE_ACCESS: Record<string, string[]> = {
  'Super Admin': [
    '/dashboard',
    '/advertisements',
    '/income-reports',
    '/patient-discharge',
    '/profile',
    '/settings',
  ],
  'Admin': [
    '/dashboard',
    '/attendance',
    '/grievances',
    '/profile',
    '/settings',
  ],
  'HR': [
    '/dashboard',
    '/attendance',
    '/leave-permission',
    '/profile',
    '/settings',
  ],
  'Branch Doctor': [
    '/dashboard',
    '/attendance',
    '/patient-discharge',
    '/leave-permission',
    '/profile',
    '/settings',
  ],
  'Branch Manager': [
    '/dashboard',
    '/attendance',
    '/leave-permission',
    '/profile',
    '/settings',
  ],
  'Staff': [
    '/dashboard',
    '/advertisements',
    '/revenue-accounts',
    '/patient-discharge',
    '/profile',
    '/settings',
  ],
  'Employee': [
    '/dashboard',
    '/leave-permission',
    '/profile',
    '/settings',
  ],
  // Legacy aliases for backward compatibility
  'Hospital Owner': ['/dashboard', '/advertisements', '/income-reports', '/patient-discharge', '/profile', '/settings'],
  'Global Admin': ['/dashboard', '/attendance', '/grievances', '/profile', '/settings'],
  'Doctor': ['/dashboard', '/attendance', '/patient-discharge', '/profile', '/settings'],
  'HR Manager': ['/dashboard', '/attendance', '/profile', '/settings'],
  'Finance Manager': ['/dashboard', '/revenue-accounts', '/profile', '/settings'],
  'Marketing Manager': ['/dashboard', '/advertisements', '/profile', '/settings'],
  'Complaints and Query Manager': ['/dashboard', '/grievances', '/profile', '/settings'],
  'Receptionist': ['/dashboard', '/patient-discharge', '/profile', '/settings'],
};

export const ROLE_SIDEBAR_ITEMS: Record<string, NavItemConfig[]> = {
  'Super Admin': [
    { label: 'Dashboard', path: '/dashboard', iconName: 'Home' },
    { label: 'Advertisement Management', path: '/advertisements', iconName: 'Megaphone' },
    { label: 'Income Reports', path: '/income-reports', iconName: 'BarChart3' },
    { label: 'Patient Discharge Summary', path: '/patient-discharge', iconName: 'LogOut' },
  ],
  'Admin': [
    { label: 'Dashboard', path: '/dashboard', iconName: 'Home' },
    { label: 'Attendance Management', path: '/attendance', iconName: 'CalendarCheck' },
    { label: 'Grievances (Employee Concerns)', path: '/grievances', iconName: 'MessageSquareWarning' },
  ],
  'HR': [
    { label: 'Dashboard', path: '/dashboard', iconName: 'Home' },
    { label: 'Attendance Management', path: '/attendance', iconName: 'CalendarCheck' },
  ],
  'Branch Doctor': [
    { label: 'Dashboard', path: '/dashboard', iconName: 'Home' },
    { label: 'Attendance Management', path: '/attendance', iconName: 'CalendarCheck' },
    { label: 'Patient Discharge Summary', path: '/patient-discharge', iconName: 'LogOut' },
  ],
  'Branch Manager': [
    { label: 'Dashboard', path: '/dashboard', iconName: 'Home' },
    { label: 'Attendance Management', path: '/attendance', iconName: 'CalendarCheck' },
  ],
  'Staff': [
    { label: 'Dashboard', path: '/dashboard', iconName: 'Home' },
    { label: 'Advertisement Management', path: '/advertisements', iconName: 'Megaphone' },
    { label: 'Revenue & Accounts', path: '/revenue-accounts', iconName: 'IndianRupee' },
    { label: 'Patient Discharge Management', path: '/patient-discharge', iconName: 'LogOut' },
  ],
  'Employee': [
    { label: 'Dashboard', path: '/dashboard', iconName: 'Home' },
    { label: 'Leave & Permission Request', path: '/leave-permission', iconName: 'CalendarCheck' },
  ],
};

export const BOTTOM_SIDEBAR_ITEMS: NavItemConfig[] = [
  { label: 'Profile', path: '/profile', iconName: 'User' },
  { label: 'Settings', path: '/settings', iconName: 'Settings' },
];

export function canRoleAccessRoute(role: RoleType | string, targetPath: string): boolean {
  const allowed = ROLE_ROUTE_ACCESS[role];
  if (!allowed) return true;
  // Exact match or prefix match for sub-routes
  return allowed.some((p) => targetPath === p || targetPath.startsWith(p + '/'));
}
