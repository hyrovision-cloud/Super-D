import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IndianRupee,
  Users,
  Calendar,
  UserCheck,
  Clock,
  MessageSquareWarning,
  Megaphone,
  Building2,
  ArrowUpRight,
  TrendingUp,
  Activity,
  BedDouble,
  Sparkles,
} from 'lucide-react';
import { useBranch } from '@/app/providers/BranchProvider';
import { dashboardService, OwnerDashboardMetrics } from '@/services/mock/dashboardService';
import { KPICard } from '@/components/ui/KPICard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { CategoryDistributionChart } from '@/components/charts/CategoryDistributionChart';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatINR } from '@/lib/utils';
import { mockStore } from '@/services/mock/mockStore';
import { HospitalIntelligenceDrawer } from './HospitalIntelligenceDrawer';

export const OwnerDashboardView: React.FC = () => {
  const { selectedBranchId, selectedBranch } = useBranch();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState<OwnerDashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'quarter'>('month');
  const [isIntelligenceOpen, setIsIntelligenceOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    dashboardService
      .getOwnerMetrics(selectedBranchId)
      .then((data) => {
        if (isMounted) {
          setMetrics(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setLoading(false);
      });

    // Subscribe to store mutations so new patients/appointments/complaints reflect immediately
    const unsubscribe = mockStore.subscribe(() => {
      dashboardService.getOwnerMetrics(selectedBranchId).then((data) => {
        if (isMounted) setMetrics(data);
      });
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [selectedBranchId]);

  if (loading || !metrics) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-9 w-40" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // Monthly comparative chart data
  const revenueChartData = [
    { name: 'Jun', Trichy: 112000, Chennai: 185000, Madurai: 82000, Pudukkottai: 34000 },
    { name: 'Jul', Trichy: 128000, Chennai: 198000, Madurai: 88000, Pudukkottai: 38000 },
    { name: 'Aug', Trichy: 139000, Chennai: 206000, Madurai: 90500, Pudukkottai: 39500 },
    { name: 'Sep (Cur)', Trichy: 148750, Chennai: 215400, Madurai: 92300, Pudukkottai: 41800 },
  ];

  // Category distribution for donut chart
  const categoryData = [
    { name: 'Other Collections (Inpatient)', value: 263000 },
    { name: 'Medical / Pharmacy', value: 128400 },
    { name: 'Day Care', value: 65950 },
    { name: 'Lab & Diagnostics', value: 25950 },
    { name: 'OP Consultation', value: 4550 },
    { name: 'Surgical KIT & Consumables', value: 5900 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header with title and period filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight">
              Hospital Owner Command Center
            </h1>
            <Badge variant="navy" size="sm">
              {selectedBranch ? selectedBranch.name : 'All 4 Branches'}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Real-time executive oversight across revenue, clinical footfall, workforce, and service SLA.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {/* Ask Hospital Intelligence Action */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsIntelligenceOpen(true)}
            className="gap-1.5 shadow-sm bg-linear-to-r from-navy-800 to-clinical-700 hover:from-navy-900 hover:to-clinical-800 font-medium text-xs px-3 py-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Ask Hospital Intelligence
          </Button>

          {/* Period Selector Pills */}
          <div className="inline-flex rounded-lg border border-surface-border bg-white p-1 shadow-2xs text-xs">
            {(['today', 'week', 'month', 'quarter'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-md font-medium capitalize transition-colors ${
                  period === p
                    ? 'bg-brand-blue text-white shadow-xs'
                    : 'text-text-secondary hover:text-text-main'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 1: High Level Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Scoped Revenue"
          value={formatINR(metrics.totalRevenue)}
          icon={<IndianRupee className="w-5 h-5" />}
          change={{ value: '+14.2% vs last month', isPositive: true }}
          subtitle="Reconciled collections"
          accentColor="blue"
        />
        <KPICard
          title="Registered Patients"
          value={metrics.totalPatients}
          icon={<Users className="w-5 h-5" />}
          change={{ value: `+${metrics.newPatientsThisMonth} new`, isPositive: true }}
          subtitle="Active clinical registry"
          accentColor="teal"
        />
        <KPICard
          title="Appointments & Flow"
          value={`${metrics.totalAppointments}`}
          icon={<Calendar className="w-5 h-5" />}
          subtitle={`${metrics.completedAppointments} Completed (${metrics.completionRate}%)`}
          accentColor="navy"
        />
        <KPICard
          title="Pending Approvals"
          value={metrics.pendingApprovals}
          icon={<Clock className="w-5 h-5" />}
          subtitle="Awaiting HR/Manager review"
          accentColor={metrics.pendingApprovals > 0 ? 'amber' : 'green'}
        />
      </div>

      {/* Row 2: Secondary Operations & Quality KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Active Doctors"
          value={metrics.totalDoctors}
          icon={<Activity className="w-5 h-5" />}
          subtitle="Across 6 core specialties"
          accentColor="teal"
        />
        <KPICard
          title="Staff Present Today"
          value={`${metrics.presentToday} / ${metrics.totalEmployees}`}
          icon={<UserCheck className="w-5 h-5" />}
          subtitle={`${Math.round((metrics.presentToday / (metrics.totalEmployees || 1)) * 100)}% daily attendance`}
          accentColor="green"
        />
        <KPICard
          title="Active Grievances"
          value={metrics.activeComplaints}
          icon={<MessageSquareWarning className="w-5 h-5" />}
          subtitle={
            metrics.overdueComplaints > 0
              ? `⚠️ ${metrics.overdueComplaints} Overdue SLA Breaches`
              : 'All cases within SLA'
          }
          accentColor={metrics.overdueComplaints > 0 ? 'red' : 'green'}
        />
        <KPICard
          title="Marketing Lead CPL"
          value={`₹${metrics.costPerLead}`}
          icon={<Megaphone className="w-5 h-5" />}
          subtitle={`${metrics.marketingLeads} Leads from Meta & Google`}
          accentColor="blue"
        />
      </div>

      {/* Row 3: Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-7">
          <CardHeader>
            <div>
              <CardTitle>Branch Revenue Trends</CardTitle>
              <p className="text-xs text-text-secondary mt-0.5">
                Monthly revenue collections breakdown across all branches (in INR)
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/finance')}
              rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
            >
              Ledger
            </Button>
          </CardHeader>
          <CardContent>
            <RevenueChart data={revenueChartData} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader>
            <div>
              <CardTitle>Collections by Category</CardTitle>
              <p className="text-xs text-text-secondary mt-0.5">
                Distribution across 9 configured billing heads
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <CategoryDistributionChart data={categoryData} />
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Multi-Branch Comparative Table (Spec OWN-002) */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-teal" />
            <div>
              <CardTitle>Multi-Branch Comparative Performance (Spec OWN-002)</CardTitle>
              <p className="text-xs text-text-secondary mt-0.5">
                Cross-branch operational, clinical, and financial alignment
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/branches')}
            rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
          >
            Manage Branches
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-surface-border text-xs uppercase font-semibold text-text-secondary">
                <tr>
                  <th className="py-3 px-4">Branch</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Bed Capacity</th>
                  <th className="py-3 px-4">Doctors</th>
                  <th className="py-3 px-4">Patients</th>
                  <th className="py-3 px-4">Appointments</th>
                  <th className="py-3 px-4">Active Cases</th>
                  <th className="py-3 px-4 text-right">Revenue (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border text-xs">
                {metrics.branchComparison.map((b) => (
                  <tr key={b.branchId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-text-main flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-400" />
                      {b.branchName}
                    </td>
                    <td className="py-3 px-4 font-mono text-text-secondary">{b.code}</td>
                    <td className="py-3 px-4 text-text-secondary">
                      <span className="inline-flex items-center gap-1">
                        <BedDouble className="w-3.5 h-3.5 text-text-muted" />
                        {b.bedCapacity} Beds
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text-secondary">{b.doctors}</td>
                    <td className="py-3 px-4 text-text-secondary">{b.patients}</td>
                    <td className="py-3 px-4 text-text-secondary">{b.appointments}</td>
                    <td className="py-3 px-4">
                      {b.activeComplaints > 0 ? (
                        <Badge variant="warning" size="sm" dot>
                          {b.activeComplaints} Open
                        </Badge>
                      ) : (
                        <Badge variant="success" size="sm">
                          0
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-text-main">
                      {formatINR(b.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50/80 font-bold border-t border-surface-border text-xs">
                <tr>
                  <td className="py-3 px-4 text-text-main" colSpan={2}>
                    Organization Total
                  </td>
                  <td className="py-3 px-4 text-text-main">
                    {metrics.branchComparison.reduce((s, b) => s + b.bedCapacity, 0)} Beds
                  </td>
                  <td className="py-3 px-4 text-text-main">{metrics.totalDoctors}</td>
                  <td className="py-3 px-4 text-text-main">{metrics.totalPatients}</td>
                  <td className="py-3 px-4 text-text-main">{metrics.totalAppointments}</td>
                  <td className="py-3 px-4 text-text-main">{metrics.activeComplaints}</td>
                  <td className="py-3 px-4 text-right text-brand-blue text-sm">
                    {formatINR(metrics.totalRevenue)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Hospital Intelligence Command Drawer */}
      <HospitalIntelligenceDrawer
        isOpen={isIntelligenceOpen}
        onClose={() => setIsIntelligenceOpen(false)}
      />
    </div>
  );
};
