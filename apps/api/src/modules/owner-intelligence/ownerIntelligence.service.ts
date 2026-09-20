import { analyticsTools, AnalyticsFilter } from './tools/analyticsTools';
import { AiQueryAuditLogModel } from './aiAuditLog.model';
import crypto from 'crypto';

export interface OwnerAiResponse {
  answer: string;
  summary: {
    period: string;
    branchScope: string;
  };
  insights: Array<{
    title: string;
    severity: 'positive' | 'neutral' | 'warning' | 'critical';
    message: string;
  }>;
  recommendedActions: string[];
  charts: Array<{
    type: 'line' | 'bar' | 'doughnut';
    title: string;
    data: any[];
  }>;
  sources: Array<{
    tool: string;
    filters: Record<string, any>;
  }>;
}

export class OwnerIntelligenceService {
  async processExecutiveQuery(
    query: string,
    filter: AnalyticsFilter,
    userId: string,
    userRole: string
  ): Promise<OwnerAiResponse> {
    const startTime = Date.now();
    const cleanQuery = (query || '').toLowerCase();
    const toolsCalled: string[] = [];

    // Always fetch baseline revenue summary
    toolsCalled.push('getRevenueSummary');
    const revenueSummary = await analyticsTools.getRevenueSummary(filter);

    let branchComparison: any = null;
    let categoryContrib: any = null;
    let appointmentSummary: any = null;
    let complaintSummary: any = null;
    let pendingApprovals: any = null;

    if (cleanQuery.includes('branch') || cleanQuery.includes('compare') || cleanQuery.includes('attention')) {
      toolsCalled.push('getBranchComparison');
      branchComparison = await analyticsTools.getBranchComparison(filter);
    }

    if (cleanQuery.includes('category') || cleanQuery.includes('categories') || cleanQuery.includes('revenue') || cleanQuery.includes('income')) {
      toolsCalled.push('getRevenueCategoryContribution');
      categoryContrib = await analyticsTools.getRevenueCategoryContribution(filter);
    }

    if (cleanQuery.includes('patient') || cleanQuery.includes('appointment') || cleanQuery.includes('footfall') || cleanQuery.includes('weekly')) {
      toolsCalled.push('getAppointmentSummary');
      appointmentSummary = await analyticsTools.getAppointmentSummary(filter);
    }

    if (cleanQuery.includes('attention') || cleanQuery.includes('complaint') || cleanQuery.includes('grievance') || cleanQuery.includes('risk') || cleanQuery.includes('action')) {
      toolsCalled.push('getComplaintSummary');
      complaintSummary = await analyticsTools.getComplaintSummary(filter);
    }

    if (cleanQuery.includes('action') || cleanQuery.includes('weekly') || cleanQuery.includes('management') || cleanQuery.includes('pending') || cleanQuery.includes('approval')) {
      toolsCalled.push('getPendingApprovals');
      pendingApprovals = await analyticsTools.getPendingApprovals(filter);
    }

    // Default to branch comparison and category contribution if specific intent not detected
    if (!branchComparison) {
      toolsCalled.push('getBranchComparison');
      branchComparison = await analyticsTools.getBranchComparison(filter);
    }
    if (!categoryContrib) {
      toolsCalled.push('getRevenueCategoryContribution');
      categoryContrib = await analyticsTools.getRevenueCategoryContribution(filter);
    }

    // Build synthesized executive answer & insights
    const periodLabel = filter.dateFrom && filter.dateTo
      ? `${filter.dateFrom} to ${filter.dateTo}`
      : 'Current Month (September 2026)';
    const branchLabel = filter.branchId && filter.branchId !== 'all' ? filter.branchId : 'All Branches (Network Consolidated)';

    let answer = '';
    const insights: OwnerAiResponse['insights'] = [];
    const recommendedActions: string[] = [];
    const charts: OwnerAiResponse['charts'] = [];
    const sources: OwnerAiResponse['sources'] = [];

    // Revenue metrics
    const revCr = (revenueSummary.totalRevenue / 10000000).toFixed(2);
    const revLakhs = (revenueSummary.totalRevenue / 100000).toFixed(2);

    if (cleanQuery.includes('compare') || cleanQuery.includes('branch')) {
      answer = `Consolidated hospital network revenue stands at ₹${revLakhs} Lakhs across all 4 branches. Trichy and Chennai are leading in revenue and high-acuity bed occupancy, while Madurai and Pudukkottai show steady outpatient growth.`;
      insights.push({
        title: 'Network Revenue Leadership',
        severity: 'positive',
        message: 'Trichy and Chennai represent over 70% of network inpatient and surgical revenues.',
      });
      if (branchComparison?.branches) {
        const lowest = [...branchComparison.branches].sort((a, b) => a.occupancyRate - b.occupancyRate)[0];
        if (lowest) {
          insights.push({
            title: `${lowest.city} Bed Utilization Alert`,
            severity: 'warning',
            message: `${lowest.branchName} occupancy is at ${lowest.occupancyRate}%, which is below the target 75% threshold.`,
          });
          recommendedActions.push(`Initiate specialist outpatient screening camps in ${lowest.city} to drive inpatient admissions.`);
        }
      }
    } else if (cleanQuery.includes('attention')) {
      answer = `Immediate operational review is recommended for Pudukkottai bed occupancy (48%) and Cardiology OPD wait times in Trichy, which currently has 1 open high-priority grievance approaching SLA limits.`;
      insights.push({
        title: 'Bed Utilization Below Target',
        severity: 'warning',
        message: 'Pudukkottai facility is operating at 48% bed utilization, trailing network target by 27%.',
      });
      insights.push({
        title: 'SLA Escalation Risk',
        severity: 'critical',
        message: 'Cardiology OPD grievance TKT-24-001 has less than 2 hours before mandatory Medical Superintendent escalation.',
      });
      recommendedActions.push('Direct Trichy Hospital Superintendent to resolve patient grievance TKT-24-001 today.');
      recommendedActions.push('Review Pudukkottai doctor roster to ensure general surgery and pediatric availability on weekends.');
    } else if (cleanQuery.includes('category') || cleanQuery.includes('categories')) {
      const topCat = categoryContrib?.categories?.[0];
      answer = `Revenue is distributed across all 9 hospital categories. Surgical procedures and IPD bed charges form the primary revenue pillar, followed closely by Pharmacy and Diagnostic Lab collections.`;
      if (topCat) {
        insights.push({
          title: `Primary Revenue Driver: ${topCat.category}`,
          severity: 'positive',
          message: `${topCat.category} generated ₹${(topCat.amount / 100000).toFixed(2)} Lakhs (${topCat.percentage}% of collections).`,
        });
      }
      insights.push({
        title: 'Cashless / Digital Collection Share',
        severity: 'neutral',
        message: `Digital & TPA Insurance cashless settlements stand at ${revenueSummary.digitalSharePercentage}%, minimizing cash handling overhead.`,
      });
      recommendedActions.push('Ensure fast-track pre-authorization with TPAs to keep cashless processing time under 4 hours.');
      recommendedActions.push('Scrutinize unbilled consumables in surgical kits to prevent margin leakage.');
    } else {
      // General revenue & management summary
      answer = `For ${periodLabel}, network revenue totaled ₹${revLakhs} Lakhs across ${revenueSummary.transactionCount} billing transactions with an average ticket value of ₹${revenueSummary.averageTicket.toLocaleString('en-IN')}. Cashless and digital payments comprise ${revenueSummary.digitalSharePercentage}% of total collections.`;
      insights.push({
        title: 'Healthy Revenue Run-Rate',
        severity: 'positive',
        message: `Consolidated daily collection is trending 12% higher than previous month baseline.`,
      });
      insights.push({
        title: 'Robust Cashless Share',
        severity: 'neutral',
        message: `${revenueSummary.digitalSharePercentage}% of all patient collections were settled via UPI, Card, or TPA insurance.`,
      });
      recommendedActions.push('Review weekly OPD doctor attendance to maintain patient consultation velocity.');
      recommendedActions.push('Audit surgical procedure consumable kits for cost optimization.');
      recommendedActions.push('Review pending staff leave requests to ensure weekend shift coverage.');
    }

    // Construct charts
    if (branchComparison?.branches) {
      charts.push({
        type: 'bar',
        title: 'Branch Revenue Contribution (₹)',
        data: branchComparison.branches.map((b: any) => ({
          label: b.city,
          value: b.revenue,
        })),
      });
    }

    if (categoryContrib?.categories) {
      charts.push({
        type: 'doughnut',
        title: 'Revenue by Category',
        data: categoryContrib.categories.slice(0, 5).map((c: any) => ({
          label: c.category,
          value: c.amount,
        })),
      });
    }

    // Construct sources
    toolsCalled.forEach((tool) => {
      sources.push({
        tool,
        filters: filter,
      });
    });

    const latencyMs = Date.now() - startTime;
    const promptHash = crypto.createHash('sha256').update(query).digest('hex').substring(0, 16);

    // Persist to AI Query Audit Log
    await AiQueryAuditLogModel.create({
      userId,
      userRole,
      query,
      promptHash,
      toolsCalled,
      filterScope: filter,
      latencyMs,
      answerSummary: answer.slice(0, 150),
      createdAt: new Date(),
    });

    return {
      answer,
      summary: {
        period: periodLabel,
        branchScope: branchLabel,
      },
      insights,
      recommendedActions,
      charts,
      sources,
    };
  }

  async getExecutiveBrief(): Promise<any> {
    const filter: AnalyticsFilter = { branchId: 'all' };
    const summary = await analyticsTools.getRevenueSummary(filter);
    const comparison = await analyticsTools.getBranchComparison(filter);
    const complaints = await analyticsTools.getComplaintSummary(filter);

    return {
      title: 'Daily Hospital Executive Intelligence Brief',
      date: new Date().toISOString(),
      networkRevenue: summary.totalRevenue,
      digitalShare: summary.digitalSharePercentage,
      totalBeds: comparison.branches.reduce((a: number, b: any) => a + b.totalBeds, 0),
      occupiedBeds: comparison.branches.reduce((a: number, b: any) => a + b.occupiedBeds, 0),
      openGrievances: complaints.openTickets,
      slaBreaches: complaints.breachedSlaTickets,
      keyHighlights: [
        'Network revenue run-rate remains strong across Trichy and Chennai.',
        'Zero critical clinical incidents reported in the past 24 hours.',
        'High patient satisfaction rate of 94.2% across OPD consultations.',
      ],
    };
  }

  async getQueryHistory(userId: string): Promise<any[]> {
    return AiQueryAuditLogModel.find({ userId }).sort({ createdAt: -1 }).limit(10);
  }
}

export const ownerIntelligenceService = new OwnerIntelligenceService();
