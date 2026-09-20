import { mockStore, simulateDelay } from './mockStore';

export interface OwnerDashboardMetrics {
  totalRevenue: number;
  totalPatients: number;
  newPatientsThisMonth: number;
  totalAppointments: number;
  completedAppointments: number;
  completionRate: number;
  totalDoctors: number;
  totalEmployees: number;
  presentToday: number;
  pendingApprovals: number;
  activeComplaints: number;
  overdueComplaints: number;
  complaintResolutionRate: number;
  marketingSpend: number;
  marketingLeads: number;
  costPerLead: number;
  branchComparison: {
    branchId: string;
    branchName: string;
    code: string;
    revenue: number;
    patients: number;
    appointments: number;
    doctors: number;
    activeComplaints: number;
    bedCapacity: number;
  }[];
}

export interface AdminDashboardMetrics {
  activeUsers: number;
  disabledUsers: number;
  totalBranches: number;
  systemRolesCount: number;
  recentAuditLogs: {
    _id: string;
    timestamp: string;
    actorName: string;
    action: string;
    module: string;
    branchName: string;
  }[];
  systemHealth: {
    apiStatus: string;
    databaseUptime: string;
    auditIntegrity: string;
    backupStatus: string;
    lastBackup: string;
  };
}

export const dashboardService = {
  async getOwnerMetrics(branchId?: string): Promise<OwnerDashboardMetrics> {
    const state = mockStore.getState();

    // Filter patients
    const patients =
      branchId && branchId !== 'all'
        ? state.patients.filter((p) => p.branchId === branchId)
        : state.patients;

    // Filter appointments
    const appointments =
      branchId && branchId !== 'all'
        ? state.appointments.filter((a) => a.branchId === branchId)
        : state.appointments;

    const completedAppointments = appointments.filter((a) => a.status === 'COMPLETED').length;
    const completionRate =
      appointments.length > 0
        ? Math.round((completedAppointments / appointments.length) * 100)
        : 0;

    // Filter income
    const incomeRecords =
      branchId && branchId !== 'all'
        ? state.incomeRecords.filter((r) => r.branchId === branchId && r.status === 'ACTIVE')
        : state.incomeRecords.filter((r) => r.status === 'ACTIVE');

    const totalRevenue = incomeRecords.reduce((sum, r) => sum + r.amount, 0);

    // Filter doctors
    const doctors =
      branchId && branchId !== 'all'
        ? state.doctors.filter((d) => d.branchIds.includes(branchId))
        : state.doctors;

    // Filter employees
    const employees =
      branchId && branchId !== 'all'
        ? state.employees.filter((e) => e.branchId === branchId)
        : state.employees;

    const presentToday = employees.filter((e) => e.currentAttendance === 'PRESENT').length;

    // Filter leave requests
    const leaveRequests =
      branchId && branchId !== 'all'
        ? state.leaveRequests.filter((l) => l.branchId === branchId)
        : state.leaveRequests;

    const pendingApprovals = leaveRequests.filter(
      (l) => l.status === 'SUBMITTED' || l.status === 'MANAGER_REVIEW' || l.status === 'HR_REVIEW'
    ).length;

    // Filter complaints
    const complaints =
      branchId && branchId !== 'all'
        ? state.complaints.filter((c) => c.branchId === branchId)
        : state.complaints;

    const activeComplaints = complaints.filter(
      (c) => c.status !== 'RESOLVED' && c.status !== 'CLOSED'
    ).length;
    const overdueComplaints = complaints.filter((c) => c.isOverdue).length;
    const resolvedCount = complaints.filter(
      (c) => c.status === 'RESOLVED' || c.status === 'CLOSED'
    ).length;
    const complaintResolutionRate =
      complaints.length > 0 ? Math.round((resolvedCount / complaints.length) * 100) : 0;

    // Filter marketing
    const campaigns =
      branchId && branchId !== 'all'
        ? state.campaigns.filter((c) => c.branchId === branchId)
        : state.campaigns;

    const marketingSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
    const marketingLeads = campaigns.reduce((sum, c) => sum + c.leadsCount, 0);
    const costPerLead = marketingLeads > 0 ? Math.round(marketingSpend / marketingLeads) : 0;

    // Branch comparison table
    const branchComparison = state.branches.map((b) => {
      const bRevenue = state.incomeRecords
        .filter((r) => r.branchId === b._id && r.status === 'ACTIVE')
        .reduce((sum, r) => sum + r.amount, 0);

      const bPatients = state.patients.filter((p) => p.branchId === b._id).length;
      const bAppointments = state.appointments.filter((a) => a.branchId === b._id).length;
      const bDoctors = state.doctors.filter((d) => d.branchIds.includes(b._id)).length;
      const bActiveComplaints = state.complaints.filter(
        (c) => c.branchId === b._id && c.status !== 'RESOLVED' && c.status !== 'CLOSED'
      ).length;

      return {
        branchId: b._id,
        branchName: b.name,
        code: b.code,
        revenue: bRevenue,
        patients: bPatients,
        appointments: bAppointments,
        doctors: bDoctors,
        activeComplaints: bActiveComplaints,
        bedCapacity: b.bedCapacity,
      };
    });

    return simulateDelay({
      totalRevenue,
      totalPatients: patients.length,
      newPatientsThisMonth: Math.max(1, Math.round(patients.length * 0.45)),
      totalAppointments: appointments.length,
      completedAppointments,
      completionRate,
      totalDoctors: doctors.length,
      totalEmployees: employees.length,
      presentToday,
      pendingApprovals,
      activeComplaints,
      overdueComplaints,
      complaintResolutionRate,
      marketingSpend,
      marketingLeads,
      costPerLead,
      branchComparison,
    });
  },

  async getAdminMetrics(): Promise<AdminDashboardMetrics> {
    const state = mockStore.getState();
    const activeUsers = state.users.filter((u) => u.status === 'ACTIVE').length;
    const disabledUsers = state.users.filter((u) => u.status === 'DISABLED').length;

    const recentAuditLogs = state.auditLogs.slice(0, 5).map((l) => ({
      _id: l._id,
      timestamp: l.timestamp,
      actorName: l.actorName,
      action: l.action,
      module: l.module,
      branchName: l.branchName,
    }));

    return simulateDelay({
      activeUsers,
      disabledUsers,
      totalBranches: state.branches.length,
      systemRolesCount: state.roles.length,
      recentAuditLogs,
      systemHealth: {
        apiStatus: 'Operational (Mock V1 Boundary)',
        databaseUptime: '99.98% (Local In-Memory)',
        auditIntegrity: '100% Verified Append-Only',
        backupStatus: 'Scheduled Daily',
        lastBackup: 'Today at 02:00 AM IST',
      },
    });
  },
};
