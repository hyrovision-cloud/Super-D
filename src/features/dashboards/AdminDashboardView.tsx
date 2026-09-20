import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  UserCheck,
  UserX,
  Building2,
  KeyRound,
  Activity,
  Database,
  History,
  ArrowUpRight,
  Plus,
  Server,
  Lock,
} from 'lucide-react';
import { dashboardService, AdminDashboardMetrics } from '@/services/mock/dashboardService';
import { KPICard } from '@/components/ui/KPICard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDateTime } from '@/lib/utils';
import { mockStore } from '@/services/mock/mockStore';

export const AdminDashboardView: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    dashboardService.getAdminMetrics().then((data) => {
      if (isMounted) {
        setMetrics(data);
        setLoading(false);
      }
    });

    const unsubscribe = mockStore.subscribe(() => {
      dashboardService.getAdminMetrics().then((data) => {
        if (isMounted) setMetrics(data);
      });
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  if (loading || !metrics) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight">
              Global Admin Command Center
            </h1>
            <Badge variant="teal" size="sm">
              System Admin
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Technical governance, multi-branch configuration, RBAC policy enforcement, and audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => navigate('/users')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add User
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/roles')}
            leftIcon={<KeyRound className="w-4 h-4" />}
          >
            Permission Matrix
          </Button>
        </div>
      </div>

      {/* Row 1: System Admin KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Active System Users"
          value={metrics.activeUsers}
          icon={<UserCheck className="w-5 h-5" />}
          subtitle="Provisioned across 4 branches"
          accentColor="blue"
        />
        <KPICard
          title="Disabled Accounts"
          value={metrics.disabledUsers}
          icon={<UserX className="w-5 h-5" />}
          subtitle="Revoked or suspended access"
          accentColor={metrics.disabledUsers > 0 ? 'amber' : 'green'}
        />
        <KPICard
          title="Configured Branches"
          value={metrics.totalBranches}
          icon={<Building2 className="w-5 h-5" />}
          subtitle="100% operational status"
          accentColor="teal"
        />
        <KPICard
          title="System Security Roles"
          value={metrics.systemRolesCount}
          icon={<ShieldCheck className="w-5 h-5" />}
          subtitle="Strict data-scope RBAC enforced"
          accentColor="navy"
        />
      </div>

      {/* Row 2: System Health and Architecture Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-brand-blue" />
              <div>
                <CardTitle>Platform Health & Environment (Spec Sec 18)</CardTitle>
                <p className="text-xs text-text-secondary mt-0.5">
                  Runtime topology and data layer status
                </p>
              </div>
            </div>
            <Badge variant="success" size="sm" dot>
              Healthy
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-text-secondary">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>REST API Service</span>
              </div>
              <span className="font-semibold text-text-main">
                {metrics.systemHealth.apiStatus}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-text-secondary">
                <Database className="w-4 h-4 text-brand-blue" />
                <span>Data Store Layer</span>
              </div>
              <span className="font-semibold text-text-main">
                {metrics.systemHealth.databaseUptime}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-text-secondary">
                <Lock className="w-4 h-4 text-indigo-600" />
                <span>Audit Trail Integrity</span>
              </div>
              <span className="font-semibold text-text-main">
                {metrics.systemHealth.auditIntegrity}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-text-secondary">
                <History className="w-4 h-4 text-amber-600" />
                <span>Data Snapshot Backup</span>
              </div>
              <span className="font-semibold text-text-main">
                {metrics.systemHealth.lastBackup}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Live Audit Log Stream (Spec Sec 9.16) */}
        <Card className="lg:col-span-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-brand-teal" />
              <div>
                <CardTitle>Recent Audit Stream (Spec AUD-002)</CardTitle>
                <p className="text-xs text-text-secondary mt-0.5">
                  Append-only immutable record of administrative actions
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-surface-border text-xs">
              {metrics.recentAuditLogs.map((log) => (
                <div
                  key={log._id}
                  className="p-3.5 hover:bg-slate-50/80 transition-colors flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-text-main">{log.actorName}</span>
                      <Badge variant="neutral" size="sm">
                        {log.module}
                      </Badge>
                    </div>
                    <div className="font-mono text-[11px] text-brand-blue mt-0.5">
                      {log.action}
                    </div>
                    <div className="text-text-muted text-[11px] mt-0.5">{log.branchName}</div>
                  </div>
                  <span className="text-[11px] text-text-secondary whitespace-nowrap">
                    {formatDateTime(log.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Governance Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          hoverEffect
          className="p-4 cursor-pointer"
          onClick={() => navigate('/branches')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-50 text-brand-teal">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-text-main">Branch Network</h4>
                <p className="text-xs text-text-secondary">Trichy, Chennai, Madurai, PDK</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-text-muted" />
          </div>
        </Card>

        <Card
          hoverEffect
          className="p-4 cursor-pointer"
          onClick={() => navigate('/users')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-brand-blue">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-text-main">User Accounts</h4>
                <p className="text-xs text-text-secondary">Provision, roles & session revoke</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-text-muted" />
          </div>
        </Card>

        <Card
          hoverEffect
          className="p-4 cursor-pointer"
          onClick={() => navigate('/roles')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-navy-50 text-navy">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-text-main">Permission Matrix</h4>
                <p className="text-xs text-text-secondary">Configure data-scope & access</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-text-muted" />
          </div>
        </Card>
      </div>
    </div>
  );
};
