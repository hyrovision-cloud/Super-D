import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { LoginView } from '@/features/auth/LoginView';
import { OwnerDashboardView } from '@/features/dashboards/OwnerDashboardView';
import { AdminDashboardView } from '@/features/dashboards/AdminDashboardView';
import { BranchListView } from '@/features/branches/BranchListView';
import { UserListView } from '@/features/users/UserListView';
import { RolesPermissionView } from '@/features/roles/RolesPermissionView';
import { PatientListView } from '@/features/patients/PatientListView';
import { PatientProfileView } from '@/features/patients/PatientProfileView';
import { AppointmentView } from '@/features/appointments/AppointmentView';
import { EmployeeListView } from '@/features/employees/EmployeeListView';
import { LeaveApprovalView } from '@/features/leave/LeaveApprovalView';
import { ComplaintsDashboardView } from '@/features/complaints/ComplaintsDashboardView';
import { MarketingDashboardView } from '@/features/marketing/MarketingDashboardView';
import { FinanceDashboardView } from '@/features/finance/FinanceDashboardView';
import { ReportsView } from '@/features/reports/ReportsView';

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
        element: <Navigate to="/dashboards/owner" replace />,
      },
      {
        path: 'dashboards/owner',
        element: <OwnerDashboardView />,
      },
      {
        path: 'dashboards/admin',
        element: <AdminDashboardView />,
      },
      {
        path: 'branches',
        element: <BranchListView />,
      },
      {
        path: 'users',
        element: <UserListView />,
      },
      {
        path: 'roles',
        element: <RolesPermissionView />,
      },
      {
        path: 'patients',
        element: <PatientListView />,
      },
      {
        path: 'patients/:patientId',
        element: <PatientProfileView />,
      },
      {
        path: 'appointments',
        element: <AppointmentView />,
      },
      {
        path: 'employees',
        element: <EmployeeListView />,
      },
      {
        path: 'leave',
        element: <LeaveApprovalView />,
      },
      {
        path: 'complaints',
        element: <ComplaintsDashboardView />,
      },
      {
        path: 'marketing',
        element: <MarketingDashboardView />,
      },
      {
        path: 'finance',
        element: <FinanceDashboardView />,
      },
      {
        path: 'reports',
        element: <ReportsView />,
      },
      {
        path: '*',
        element: <Navigate to="/dashboards/owner" replace />,
      },
    ],
  },
]);
