import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Official Super D & Spec.md Views
import { LoginView } from '@/features/auth/LoginView';
import { RoleDashboardView } from '@/features/dashboards/RoleDashboardView';
import { OwnerDashboardView } from '@/features/dashboards/OwnerDashboardView';
import { AdvertisementManagementView } from '@/features/advertisements/AdvertisementManagementView';
import { MarketingDashboardView } from '@/features/marketing/MarketingDashboardView';
import { IncomeReportsView } from '@/features/reports/IncomeReportsView';
import { ReportsView } from '@/features/reports/ReportsView';
import { RevenueAccountsView } from '@/features/finance/RevenueAccountsView';
import { FinanceDashboardView } from '@/features/finance/FinanceDashboardView';
import { AttendanceManagementView } from '@/features/attendance/AttendanceManagementView';
import { GrievancesView } from '@/features/grievances/GrievancesView';
import { ComplaintsDashboardView } from '@/features/complaints/ComplaintsDashboardView';
import { PatientDischargeSummaryView } from '@/features/patients/PatientDischargeSummaryView';
import { PatientListView } from '@/features/patients/PatientListView';
import { PatientProfileView } from '@/features/patients/PatientProfileView';
import { AppointmentView } from '@/features/appointments/AppointmentView';
import { EmployeeListView } from '@/features/employees/EmployeeListView';
import { LeaveApprovalView } from '@/features/leave/LeaveApprovalView';
import { EmployeeLeaveRequestView } from '@/features/leave/EmployeeLeaveRequestView';
import { BranchListView } from '@/features/branches/BranchListView';
import { UserListView } from '@/features/users/UserListView';
import { RolesPermissionView } from '@/features/roles/RolesPermissionView';
import { ProfileView } from '@/features/common/ProfileView';
import { SettingsView } from '@/features/common/SettingsView';
import { AccessDeniedView } from '@/features/common/AccessDeniedView';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginView />,
  },
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      // Overview
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <RoleDashboardView />
          </ProtectedRoute>
        ),
      },
      {
        path: 'owner-dashboard',
        element: (
          <ProtectedRoute>
            <OwnerDashboardView />
          </ProtectedRoute>
        ),
      },
      // Hospital Operations
      {
        path: 'patients',
        element: (
          <ProtectedRoute>
            <PatientListView />
          </ProtectedRoute>
        ),
      },
      {
        path: 'patients/:patientId',
        element: (
          <ProtectedRoute>
            <PatientProfileView />
          </ProtectedRoute>
        ),
      },
      {
        path: 'appointments',
        element: (
          <ProtectedRoute>
            <AppointmentView />
          </ProtectedRoute>
        ),
      },
      {
        path: 'patient-discharge',
        element: (
          <ProtectedRoute>
            <PatientDischargeSummaryView />
          </ProtectedRoute>
        ),
      },
      // Workforce
      {
        path: 'employees',
        element: (
          <ProtectedRoute>
            <EmployeeListView />
          </ProtectedRoute>
        ),
      },
      {
        path: 'attendance',
        element: (
          <ProtectedRoute>
            <AttendanceManagementView />
          </ProtectedRoute>
        ),
      },
      {
        path: 'leave-approval',
        element: (
          <ProtectedRoute>
            <LeaveApprovalView />
          </ProtectedRoute>
        ),
      },
      {
        path: 'leave-permission',
        element: (
          <ProtectedRoute>
            <EmployeeLeaveRequestView />
          </ProtectedRoute>
        ),
      },
      // Support & Cases
      {
        path: 'grievances',
        element: (
          <ProtectedRoute>
            <GrievancesView />
          </ProtectedRoute>
        ),
      },
      {
        path: 'complaints',
        element: (
          <ProtectedRoute>
            <ComplaintsDashboardView />
          </ProtectedRoute>
        ),
      },
      // Growth & Marketing
      {
        path: 'advertisements',
        element: (
          <ProtectedRoute>
            <AdvertisementManagementView />
          </ProtectedRoute>
        ),
      },
      {
        path: 'marketing',
        element: (
          <ProtectedRoute>
            <MarketingDashboardView />
          </ProtectedRoute>
        ),
      },
      // Finance & Accounts
      {
        path: 'revenue-accounts',
        element: (
          <ProtectedRoute>
            <RevenueAccountsView />
          </ProtectedRoute>
        ),
      },
      {
        path: 'income-reports',
        element: (
          <ProtectedRoute>
            <IncomeReportsView />
          </ProtectedRoute>
        ),
      },
      {
        path: 'finance',
        element: (
          <ProtectedRoute>
            <FinanceDashboardView />
          </ProtectedRoute>
        ),
      },
      // Administration
      {
        path: 'branches',
        element: (
          <ProtectedRoute>
            <BranchListView />
          </ProtectedRoute>
        ),
      },
      {
        path: 'users',
        element: (
          <ProtectedRoute>
            <UserListView />
          </ProtectedRoute>
        ),
      },
      {
        path: 'roles',
        element: (
          <ProtectedRoute>
            <RolesPermissionView />
          </ProtectedRoute>
        ),
      },
      {
        path: 'reports',
        element: (
          <ProtectedRoute>
            <ReportsView />
          </ProtectedRoute>
        ),
      },
      // Common / Settings / Profile
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfileView />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <SettingsView />
          </ProtectedRoute>
        ),
      },
      {
        path: 'access-denied',
        element: <AccessDeniedView />,
      },
      {
        path: 'unauthorized',
        element: <AccessDeniedView />,
      },
      // Fallback
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
]);
