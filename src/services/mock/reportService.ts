import { mockStore, simulateDelay } from './mockStore';
import { formatINR } from '@/lib/utils';

export type ReportType = 'REVENUE' | 'PATIENTS' | 'WORKFORCE' | 'COMPLAINTS';

export interface ReportFilter {
  reportType: ReportType;
  branchId?: string;
  startDate?: string;
  endDate?: string;
}

export interface GeneratedReport {
  title: string;
  generatedAt: string;
  branchName: string;
  summaryMetrics: { label: string; value: string }[];
  headers: string[];
  rows: (string | number)[][];
}

export const reportService = {
  async generateReport(filters: ReportFilter): Promise<GeneratedReport> {
    const state = mockStore.getState();
    const branch =
      filters.branchId && filters.branchId !== 'all'
        ? state.branches.find((b) => b._id === filters.branchId)
        : null;
    const branchName = branch ? branch.name : 'All Hospital Branches (Consolidated)';

    if (filters.reportType === 'REVENUE') {
      const records = state.incomeRecords.filter((r) => {
        if (filters.branchId && filters.branchId !== 'all') {
          return r.branchId === filters.branchId && r.status === 'ACTIVE';
        }
        return r.status === 'ACTIVE';
      });

      const totalRevenue = records.reduce((sum, r) => sum + r.amount, 0);

      const rows = records.map((r) => [
        r.receiptNumber,
        r.branchName,
        r.category,
        formatINR(r.amount),
        r.paymentMethod,
        r.patientName || 'N/A',
        r.status,
      ]);

      return simulateDelay({
        title: 'Hospital Revenue & Collections Scoped Audit Report',
        generatedAt: new Date().toISOString(),
        branchName,
        summaryMetrics: [
          { label: 'Total Scoped Revenue', value: formatINR(totalRevenue) },
          { label: 'Total Transactions', value: String(records.length) },
          { label: 'Average Transaction', value: formatINR(records.length > 0 ? Math.round(totalRevenue / records.length) : 0) },
        ],
        headers: ['Receipt No', 'Branch', 'Category', 'Amount', 'Payment Method', 'Patient', 'Status'],
        rows,
      });
    }

    if (filters.reportType === 'PATIENTS') {
      const patients = state.patients.filter((p) => {
        if (filters.branchId && filters.branchId !== 'all') {
          return p.branchId === filters.branchId;
        }
        return true;
      });

      const rows = patients.map((p) => [
        p.patientNumber,
        p.name,
        `${p.age} / ${p.gender}`,
        p.branchName,
        p.phone,
        p.bloodGroup,
        p.status,
      ]);

      return simulateDelay({
        title: 'Patient Registry & Clinical Demographic Audit Report',
        generatedAt: new Date().toISOString(),
        branchName,
        summaryMetrics: [
          { label: 'Total Registered Patients', value: String(patients.length) },
          { label: 'Active Status', value: String(patients.filter((p) => p.status === 'ACTIVE').length) },
          { label: 'Currently Admitted', value: String(patients.filter((p) => p.status === 'ADMITTED').length) },
        ],
        headers: ['Patient ID', 'Name', 'Age / Gender', 'Branch', 'Phone', 'Blood Group', 'Status'],
        rows,
      });
    }

    if (filters.reportType === 'WORKFORCE') {
      const employees = state.employees.filter((e) => {
        if (filters.branchId && filters.branchId !== 'all') {
          return e.branchId === filters.branchId;
        }
        return true;
      });

      const rows = employees.map((e) => [
        e.employeeNumber,
        e.name,
        e.role,
        e.department,
        e.branchName,
        e.currentAttendance,
        e.status,
      ]);

      return simulateDelay({
        title: 'Hospital Workforce Staffing & Attendance Summary',
        generatedAt: new Date().toISOString(),
        branchName,
        summaryMetrics: [
          { label: 'Total Staff Count', value: String(employees.length) },
          { label: 'Present Today', value: String(employees.filter((e) => e.currentAttendance === 'PRESENT').length) },
          { label: 'On Approved Leave', value: String(employees.filter((e) => e.currentAttendance === 'ON_LEAVE').length) },
        ],
        headers: ['Staff ID', 'Name', 'Designation', 'Department', 'Branch', 'Today Attendance', 'Status'],
        rows,
      });
    }

    // Default: COMPLAINTS
    const complaints = state.complaints.filter((c) => {
      if (filters.branchId && filters.branchId !== 'all') {
        return c.branchId === filters.branchId;
      }
      return true;
    });

    const rows = complaints.map((c) => [
      c.ticketNumber,
      c.subject,
      c.category,
      c.branchName,
      c.priority,
      c.status,
      c.isOverdue ? 'YES (Breached)' : 'NO (On Track)',
    ]);

    return simulateDelay({
      title: 'Patient Grievance & Service Query SLA Compliance Report',
      generatedAt: new Date().toISOString(),
      branchName,
      summaryMetrics: [
        { label: 'Total Cases Logged', value: String(complaints.length) },
        { label: 'Resolved / Closed', value: String(complaints.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length) },
        { label: 'Overdue SLA Breaches', value: String(complaints.filter((c) => c.isOverdue).length) },
      ],
      headers: ['Ticket ID', 'Subject', 'Category', 'Branch', 'Priority', 'Status', 'SLA Breached?'],
      rows,
    });
  },

  async simulateExport(format: 'PDF' | 'CSV', _reportTitle: string): Promise<{ success: boolean; filename: string }> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      success: true,
      filename: `SuperD_${format}_Export_${Date.now()}.${format.toLowerCase()}`,
    };
  },
};
