import { IncomeRecordModel } from '../../revenue/incomeRecord.model';
import { AppointmentModel } from '../../appointments/appointment.model';
import { ComplaintModel } from '../../complaints/complaint.model';
import { LeaveRequestModel } from '../../leave/leaveRequest.model';
import { BranchModel } from '../../branches/branch.model';

export interface AnalyticsFilter {
  branchId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const analyticsTools = {
  async getRevenueSummary(filter: AnalyticsFilter) {
    const match: Record<string, any> = { status: 'ACTIVE' };
    if (filter.branchId && filter.branchId !== 'all' && filter.branchId !== 'All Branches') {
      match.branchId = filter.branchId;
    }
    if (filter.dateFrom || filter.dateTo) {
      match.transactionDate = {};
      if (filter.dateFrom) match.transactionDate.$gte = new Date(filter.dateFrom);
      if (filter.dateTo) {
        const to = new Date(filter.dateTo);
        to.setHours(23, 59, 59, 999);
        match.transactionDate.$lte = to;
      }
    }

    const records = await IncomeRecordModel.find(match);
    const totalRevenue = records.reduce((sum, r) => sum + r.amount, 0);
    const transactionCount = records.length;
    const averageTicket = transactionCount > 0 ? Math.round(totalRevenue / transactionCount) : 0;

    const paymentModes: Record<string, number> = {};
    records.forEach((r) => {
      paymentModes[r.paymentMethod] = (paymentModes[r.paymentMethod] || 0) + r.amount;
    });

    const digitalShare =
      totalRevenue > 0
        ? Math.round(
            (((paymentModes['upi'] || 0) +
              (paymentModes['card'] || 0) +
              (paymentModes['insurance_tpa'] || 0)) /
              totalRevenue) *
              100
          )
        : 0;

    return {
      totalRevenue,
      transactionCount,
      averageTicket,
      digitalSharePercentage: digitalShare,
      paymentModesBreakdown: paymentModes,
      currency: 'INR',
      filterApplied: filter,
    };
  },

  async getRevenueTrend(filter: AnalyticsFilter & { interval?: 'day' | 'week' }) {
    const match: Record<string, any> = { status: 'ACTIVE' };
    if (filter.branchId && filter.branchId !== 'all') {
      match.branchId = filter.branchId;
    }

    const records = await IncomeRecordModel.find(match).sort({ transactionDate: 1 });
    const dailyMap: Record<string, number> = {};

    records.forEach((r) => {
      const day = new Date(r.transactionDate).toISOString().slice(0, 10);
      dailyMap[day] = (dailyMap[day] || 0) + r.amount;
    });

    const points = Object.entries(dailyMap).map(([date, amount]) => ({
      date,
      amount,
    }));

    return {
      trendPoints: points,
      dataPointsCount: points.length,
      filterApplied: filter,
    };
  },

  async getBranchComparison(filter: AnalyticsFilter) {
    const branches = await BranchModel.find({ status: 'ACTIVE' });
    const records = await IncomeRecordModel.find({ status: 'ACTIVE' });

    const branchRevenue: Record<string, number> = {};
    records.forEach((r) => {
      branchRevenue[r.branchId] = (branchRevenue[r.branchId] || 0) + r.amount;
    });

    const comparison = branches.map((b) => ({
      branchId: b.branchId,
      branchName: b.name,
      city: b.city,
      totalBeds: b.totalBeds,
      occupiedBeds: b.occupiedBeds,
      occupancyRate: b.totalBeds > 0 ? Math.round((b.occupiedBeds / b.totalBeds) * 100) : 0,
      revenue: branchRevenue[b.branchId] || 0,
    }));

    return {
      branches: comparison,
      networkTotalRevenue: Object.values(branchRevenue).reduce((a, b) => a + b, 0),
      filterApplied: filter,
    };
  },

  async getRevenueCategoryContribution(filter: AnalyticsFilter) {
    const match: Record<string, any> = { status: 'ACTIVE' };
    if (filter.branchId && filter.branchId !== 'all') {
      match.branchId = filter.branchId;
    }

    const records = await IncomeRecordModel.find(match);
    const total = records.reduce((acc, r) => acc + r.amount, 0);

    const categoriesMap: Record<string, number> = {};
    records.forEach((r) => {
      categoriesMap[r.category] = (categoriesMap[r.category] || 0) + r.amount;
    });

    const breakdown = Object.entries(categoriesMap).map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 1000) / 10 : 0,
    }));

    return {
      categories: breakdown.sort((a, b) => b.amount - a.amount),
      totalRevenue: total,
      filterApplied: filter,
    };
  },

  async getAppointmentSummary(filter: AnalyticsFilter) {
    const match: Record<string, any> = {};
    if (filter.branchId && filter.branchId !== 'all') {
      match.branchId = filter.branchId;
    }

    const appointments = await AppointmentModel.find(match);
    const total = appointments.length;
    const completed = appointments.filter((a) => a.status === 'COMPLETED').length;
    const cancelled = appointments.filter((a) => a.status === 'CANCELLED').length;
    const scheduled = appointments.filter((a) => a.status === 'SCHEDULED' || a.status === 'CONFIRMED').length;

    return {
      totalAppointments: total,
      completed,
      cancelled,
      scheduled,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      cancellationRate: total > 0 ? Math.round((cancelled / total) * 100) : 0,
      filterApplied: filter,
    };
  },

  async getComplaintSummary(filter: AnalyticsFilter) {
    const match: Record<string, any> = {};
    if (filter.branchId && filter.branchId !== 'all') {
      match.branchId = filter.branchId;
    }

    const complaints = await ComplaintModel.find(match);
    const total = complaints.length;
    const open = complaints.filter((c) => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length;
    const now = Date.now();
    const breached = complaints.filter(
      (c) => c.status !== 'RESOLVED' && c.status !== 'CLOSED' && now > new Date(c.slaTargetDate).getTime()
    ).length;

    return {
      totalGrievances: total,
      openTickets: open,
      breachedSlaTickets: breached,
      resolutionRate: total > 0 ? Math.round(((total - open) / total) * 100) : 0,
      filterApplied: filter,
    };
  },

  async getMarketingSummary(filter: AnalyticsFilter) {
    return {
      activeCampaigns: 4,
      totalSpend: 245000,
      totalLeads: 412,
      averageCpl: 594,
      conversionRate: 14.8,
      topChannel: 'Community Health Camps',
      filterApplied: filter,
    };
  },

  async getPendingApprovals(filter: AnalyticsFilter) {
    const match: Record<string, any> = { status: { $in: ['SUBMITTED', 'MANAGER_REVIEW'] } };
    if (filter.branchId && filter.branchId !== 'all') {
      match.branchId = filter.branchId;
    }

    const pendingLeaves = await LeaveRequestModel.find(match);
    return {
      pendingLeaveRequestsCount: pendingLeaves.length,
      leaveRequests: pendingLeaves.map((l) => ({
        requestId: l.requestId,
        employeeName: l.employeeName,
        days: l.daysCount,
        leaveType: l.leaveType,
        branchId: l.branchId,
      })),
      filterApplied: filter,
    };
  },
};
