import React, { useState, useEffect } from 'react';
import {
  FileBarChart,
  FileDown,
  Printer,
  Calendar,
  Building2,
  Filter,
  CheckCircle2,
  Loader2,
  Table,
} from 'lucide-react';
import { reportService, ReportType, GeneratedReport } from '@/services/mock/reportService';
import { useBranch } from '@/app/providers/BranchProvider';
import { useToast } from '@/app/providers/ToastProvider';
import { mockStore } from '@/services/mock/mockStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { formatDateTime } from '@/lib/utils';

export const ReportsView: React.FC = () => {
  const { selectedBranchId, branches } = useBranch();
  const toast = useToast();

  const [reportType, setReportType] = useState<ReportType>('REVENUE');
  const [branchId, setBranchId] = useState(selectedBranchId !== 'all' ? selectedBranchId : 'all');
  const [reportData, setReportData] = useState<GeneratedReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [exportingFormat, setExportingFormat] = useState<'PDF' | 'CSV' | null>(null);

  const fetchReport = () => {
    setLoading(true);
    reportService
      .generateReport({
        reportType,
        branchId,
      })
      .then((data) => {
        setReportData(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReport();
    const unsubscribe = mockStore.subscribe(() => {
      fetchReport();
    });
    return unsubscribe;
  }, [reportType, branchId]);

  const handleExport = async (format: 'PDF' | 'CSV') => {
    setExportingFormat(format);
    try {
      const result = await reportService.simulateExport(format, reportData?.title || 'Report');
      toast.success(`${format} document "${result.filename}" exported successfully!`);
    } catch {
      toast.error('Export failed');
    } finally {
      setExportingFormat(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight">
            Reports & Operational Analytics (Spec REP-001–004)
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Scoped report builder with export simulation and cross-branch data reconciliation.
          </p>
        </div>

        {reportData && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              isLoading={exportingFormat === 'CSV'}
              onClick={() => handleExport('CSV')}
              leftIcon={<FileDown className="w-3.5 h-3.5" />}
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={exportingFormat === 'PDF'}
              onClick={() => handleExport('PDF')}
              leftIcon={<FileDown className="w-3.5 h-3.5" />}
            >
              Export PDF
            </Button>
          </div>
        )}
      </div>

      {/* Report Generator Controls */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-medium text-text-main mb-1">
              Select Report Domain *
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs bg-white font-medium text-text-main focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
            >
              <option value="REVENUE">Revenue & Daily Collections Audit</option>
              <option value="PATIENTS">Patient Registry & Clinical Admissions</option>
              <option value="WORKFORCE">Staff Attendance & Shift Rosters</option>
              <option value="COMPLAINTS">Patient Grievance & SLA Breaches</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-text-main mb-1">
              Branch Scope *
            </label>
            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs bg-white font-medium text-text-main focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
            >
              <option value="all">All Branches (Consolidated)</option>
              {branches.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name} ({b.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-text-main mb-1">
              Reporting Period
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs bg-white font-medium text-text-main focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
            >
              <option>Current Fiscal Month (September 2024)</option>
              <option>Year-to-Date 2024</option>
              <option>Last Quarter (Q2 2024)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Report Preview */}
      {loading || !reportData ? (
        <TableSkeleton rows={8} cols={6} />
      ) : (
        <div className="space-y-4">
          {/* Summary Banner */}
          <Card className="p-5 bg-gradient-to-r from-slate-50 via-white to-slate-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3 mb-4">
              <div>
                <span className="font-mono text-[10px] font-bold text-brand-blue uppercase tracking-wider">
                  Audit Verified Report
                </span>
                <h3 className="text-base font-bold text-text-main mt-0.5">
                  {reportData.title}
                </h3>
                <p className="text-xs text-text-secondary">
                  Scope: <strong className="text-text-main">{reportData.branchName}</strong> • Generated:{' '}
                  {formatDateTime(reportData.generatedAt)}
                </p>
              </div>

              <Badge variant="teal" size="sm" dot>
                Reconciled Dataset
              </Badge>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {reportData.summaryMetrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded-xl border border-surface-border flex flex-col justify-between"
                >
                  <span className="text-text-muted text-[11px] block">{m.label}</span>
                  <span className="text-lg font-bold text-text-main mt-1">{m.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Data Table */}
          <Card>
            <CardHeader className="py-3 px-4 bg-slate-50/70">
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-text-muted" />
                <span className="font-semibold text-xs text-text-main">
                  Live Scoped Preview ({reportData.rows.length} records)
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-surface-border uppercase font-semibold text-text-secondary text-[11px]">
                    <tr>
                      {reportData.headers.map((h, i) => (
                        <th key={i} className="py-3 px-4 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {reportData.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                        {row.map((val, cIdx) => (
                          <td key={cIdx} className="py-3 px-4 text-text-main">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
