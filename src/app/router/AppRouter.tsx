import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Official Super D Views
import { LoginView } from '@/features/auth/LoginView';
import { RoleDashboardView } from '@/features/dashboards/RoleDashboardView';
import { AdvertisementManagementView } from '@/features/advertisements/AdvertisementManagementView';
import { IncomeReportsView } from '@/features/reports/IncomeReportsView';
import { RevenueAccountsView } from '@/features/finance/RevenueAccountsView';
import { AttendanceManagementView } from '@/features/attendance/AttendanceManagementView';
import { GrievancesView } from '@/features/grievances/GrievancesView';
import { PatientDischargeSummaryView } from '@/features/patients/PatientDischargeSummaryView';
import { EmployeeLeaveRequestView } from '@/features/leave/EmployeeLeaveRequestView';
import { ProfileView } from '@/features/common/ProfileView';
import { SettingsView } from '@/features/common/SettingsView';
import { AccessDeniedView } from '@/features/common/AccessDeniedView';

// Backward compatible legacy views
import { BranchListView } from '@/features/branches/BranchListView';
import { UserListView } from '@/features/users/UserListView';
import { RolesPermissionView } from '@/features/roles/RolesPermissionView';
import { PatientListView } from '@/features/patients/PatientListView';
import { PatientProfileView } from '@/features/patients/PatientProfileView';
import { AppointmentView } from '@/features/appointments/AppointmentView';
import { EmployeeListView } from '@/features/employees/EmployeeListView';

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
      // Official Super D Role Routes
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <RoleDashboardView />
          </ProtectedRoute>
        ),
      },
      {
        path: 'advertisements',
        element: (
          <ProtectedRoute>
            <AdvertisementManagementView />
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
        path: 'revenue-accounts',
        element: (
          <ProtectedRoute>
            <RevenueAccountsView />
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
        path: 'grievances',
        element: (
          <ProtectedRoute>
            <GrievancesView />
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
      {
        path: 'leave-permission',
        element: (
          <ProtectedRoute>
            <EmployeeLeaveRequestView />
          </ProtectedRoute>
        ),
      },
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

      // Legacy fallback sub-routes redirecting or accessible
      {
        path: 'dashboards/owner',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboards/admin',
        element: <Navigate to="/dashboard" replace />,
      },
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
        path: 'employees',
        element: (
          <ProtectedRoute>
            <EmployeeListView />
          </ProtectedRoute>
        ),
      },

      // Fallback
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
]);
