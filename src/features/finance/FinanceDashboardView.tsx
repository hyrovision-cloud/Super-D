import React, { useState, useEffect } from 'react';
import {
  IndianRupee,
  Plus,
  Search,
  Building2,
  Calendar,
  CreditCard,
  Wallet,
  ArrowUpRight,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  FileDown,
} from 'lucide-react';
import { IncomeRecord, RevenueCategory, PaymentMethod } from '@/types';
import { financeService, RevenueSummary } from '@/services/mock/financeService';
import { useBranch } from '@/app/providers/BranchProvider';
import { useAuth } from '@/app/providers/AuthProvider';
import { useToast } from '@/app/providers/ToastProvider';
import { mockStore } from '@/services/mock/mockStore';
import { KPICard } from '@/components/ui/KPICard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DataTable, Column } from '@/components/tables/DataTable';
import { MobileRecordCard } from '@/components/tables/MobileRecordCard';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { formatINR, formatDateTime } from '@/lib/utils';

const CATEGORIES: RevenueCategory[] = [
  'OP',
  'Medical',
  'Lab',
  'Day Care',
  'Dressing',
  'KIT',
  'Socks',
  'Slipper',
  'Other Collections',
];

const PAYMENT_METHODS: PaymentMethod[] = ['Cash', 'UPI', 'Card', 'Bank Transfer'];

export const FinanceDashboardView: React.FC = () => {
  const { selectedBranchId, selectedBranch, branches } = useBranch();
  const { currentUser } = useAuth();
  const toast = useToast();

  const [records, setRecords] = useState<IncomeRecord[]>([]);
  const [summary, setSummary] = useState<RevenueSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<RevenueCategory | 'ALL'>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<PaymentMethod | 'ALL'>('ALL');

  // Record Income Modal
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [branchId, setBranchId] = useState(selectedBranchId !== 'all' ? selectedBranchId : 'branch-try');
  const [category, setCategory] = useState<RevenueCategory>('OP');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [patientName, setPatientName] = useState('');
  const [notes, setNotes] = useState('');

  // Adjustment Modal
  const [adjustTarget, setAdjustTarget] = useState<IncomeRecord | null>(null);
  const [adjustReason, setAdjustReason] = useState('');

  const fetchFinanceData = () => {
    Promise.all([
      financeService.getIncomeRecords({
        branchId: selectedBranchId,
        category: categoryFilter,
        paymentMethod: paymentFilter,
      }),
      financeService.getRevenueSummary(selectedBranchId),
    ]).then(([recs, sum]) => {
      setRecords(recs);
      setSummary(sum);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchFinanceData();
    const unsubscribe = mockStore.subscribe(() => {
      fetchFinanceData();
    });
    return unsubscribe;
  }, [selectedBranchId, categoryFilter, paymentFilter]);

  const handleCreateIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      toast.error('Please enter a valid positive revenue amount');
      return;
    }

    const b = branches.find((item) => item._id === branchId);

    try {
      const rec = await financeService.recordIncome({
        branchId,
        branchName: b?.name || 'Trichy Main Hospital',
        dateTime: new Date().toISOString(),
        category,
        amount: Number(amount),
        paymentMethod,
        patientName: patientName || undefined,
        recordedByName: currentUser.name,
        status: 'ACTIVE',
        notes: notes || 'Direct billing collection',
      });

      toast.success(`Receipt ${rec.receiptNumber} generated for ${formatINR(rec.amount)}!`);
      setIsRecordModalOpen(false);
      setAmount('');
      setPatientName('');
      setNotes('');
    } catch {
      toast.error('Failed to record income');
    }
  };

  const handleConfirmAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustTarget || !adjustReason.trim()) {
      toast.error('Please provide an adjustment reason');
      return;
    }

    try {
      await financeService.adjustIncomeRecord(adjustTarget._id, adjustReason.trim());
      toast.warning(`Receipt ${adjustTarget.receiptNumber} marked as adjusted.`);
      setAdjustTarget(null);
      setAdjustReason('');
    } catch {
      toast.error('Failed to adjust record');
    }
  };

  if (loading || !summary) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const columns: Column<IncomeRecord>[] = [
    {
      key: 'receiptNumber',
      header: 'Receipt No',
      sortable: true,
      className: 'font-mono text-xs font-semibold text-brand-blue',
    },
    {
      key: 'dateTime',
      header: 'Date & Time',
      sortable: true,
      render: (r) => (
        <span className="text-xs text-text-secondary">{formatDateTime(r.dateTime)}</span>
      ),
    },
    {
      key: 'branchName',
      header: 'Branch',
      render: (r) => (
        <div className="flex items-center gap-1 text-xs text-text-secondary">
          <Building2 className="w-3.5 h-3.5 text-text-muted shrink-0" />
          <span>{r.branchName}</span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Billing Category',
      sortable: true,
      render: (r) => (
        <Badge variant="navy" size="sm">
          {r.category}
        </Badge>
      ),
    },
    {
      key: 'paymentMethod',
      header: 'Payment Method',
      sortable: true,
      render: (r) => (
        <span className="text-xs font-medium text-text-secondary flex items-center gap-1">
          <CreditCard className="w-3.5 h-3.5 text-text-muted" />
          {r.paymentMethod}
        </span>
      ),
    },
    {
      key: 'patientName',
      header: 'Patient / Reference',
      render: (r) => (
        <span className="text-xs font-medium text-text-main">
          {r.patientName || <span className="text-text-muted italic">General OPD</span>}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      className: 'text-right font-bold text-text-main text-xs',
      render: (r) => formatINR(r.amount),
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <Badge variant={r.status === 'ACTIVE' ? 'success' : 'warning'} size="sm" dot>
          {r.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Audit Action',
      className: 'text-right',
      render: (r) =>
        r.status === 'ACTIVE' ? (
          <button
            onClick={() => setAdjustTarget(r)}
            className="text-xs text-text-secondary hover:text-amber-600 font-medium px-2 py-1 hover:bg-amber-50 rounded transition-colors"
          >
            Adjust
          </button>
        ) : (
          <span className="text-[11px] text-text-muted">Adjusted</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight">
              Finance & Revenue Operations (Spec FIN-001–005)
            </h1>
            <Badge variant="navy" size="sm">
              {selectedBranch ? selectedBranch.name : 'Consolidated 4 Branches'}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Strict reconciled daily collections ledger across all 9 configured hospital billing categories.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsRecordModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Record New Income
        </Button>
      </div>

      {/* Row 1: High Level Finance KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Scoped Revenue"
          value={formatINR(summary.totalRevenue)}
          icon={<IndianRupee className="w-5 h-5" />}
          subtitle="Sum of all verified receipts"
          accentColor="blue"
        />
        <KPICard
          title="UPI & Digital Pay"
          value={formatINR(summary.byPaymentMethod['UPI'] + summary.byPaymentMethod['Card'])}
          icon={<CreditCard className="w-5 h-5" />}
          subtitle={`${Math.round(
            ((summary.byPaymentMethod['UPI'] + summary.byPaymentMethod['Card']) /
              (summary.totalRevenue || 1)) *
              100
          )}% cashless share`}
          accentColor="teal"
        />
        <KPICard
          title="Cash Collections"
          value={formatINR(summary.byPaymentMethod['Cash'])}
          icon={<Wallet className="w-5 h-5" />}
          subtitle="Front desk till collection"
          accentColor="navy"
        />
        <KPICard
          title="NEFT / Bank Transfers"
          value={formatINR(summary.byPaymentMethod['Bank Transfer'])}
          icon={<Building2 className="w-5 h-5" />}
          subtitle="TPA / Inpatient settlement"
          accentColor="amber"
        />
      </div>

      {/* Row 2: 9 Configured Revenue Categories Breakdown (Spec FIN-001) */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle className="text-base">
              Revenue Breakdown by 9 Mandatory Categories (Spec FIN-001)
            </CardTitle>
            <p className="text-xs text-text-secondary mt-0.5">
              Mathematically reconciled sums across each category
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3 text-center">
            {CATEGORIES.map((cat) => {
              const amount = summary.byCategory[cat] || 0;
              const pct =
                summary.totalRevenue > 0
                  ? Math.round((amount / summary.totalRevenue) * 100)
                  : 0;

              return (
                <div
                  key={cat}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between"
                >
                  <span className="text-[11px] font-semibold text-text-secondary truncate block mb-1">
                    {cat}
                  </span>
                  <div className="font-bold text-xs text-text-main my-1">
                    {formatINR(amount)}
                  </div>
                  <span className="text-[10px] text-text-muted block">
                    {pct}% of total
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filter and Search Bar */}
      <Card className="p-3.5 flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs text-text-secondary font-medium whitespace-nowrap">
            Category:
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="text-xs border border-surface-border rounded-lg px-2.5 py-1.5 bg-white text-text-main focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          >
            <option value="ALL">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs text-text-secondary font-medium whitespace-nowrap">
            Payment Mode:
          </label>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value as any)}
            className="text-xs border border-surface-border rounded-lg px-2.5 py-1.5 bg-white text-text-main focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          >
            <option value="ALL">All Payment Methods</option>
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-text-muted ml-auto">
          Showing {records.length} transactions
        </div>
      </Card>

      {/* Row 3: Income Transactions Ledger */}
      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : (
        <>
          <div className="hidden md:block">
            <DataTable
              columns={columns}
              data={records}
              keyExtractor={(r) => r._id}
              pageSize={8}
              emptyTitle="No revenue records found"
              emptyDescription="No income entries match the active category or payment filters."
            />
          </div>

          <div className="md:hidden space-y-3">
            {records.map((rec) => (
              <MobileRecordCard
                key={rec._id}
                title={formatINR(rec.amount)}
                subtitle={`${rec.receiptNumber} • ${rec.category}`}
                badge={
                  <Badge variant={rec.status === 'ACTIVE' ? 'success' : 'warning'} size="sm" dot>
                    {rec.status}
                  </Badge>
                }
                fields={[
                  { label: 'Payment Method', value: rec.paymentMethod },
                  { label: 'Branch', value: rec.branchName },
                  { label: 'Patient', value: rec.patientName || 'General OPD' },
                  { label: 'Time', value: formatDateTime(rec.dateTime) },
                ]}
                actions={
                  rec.status === 'ACTIVE' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setAdjustTarget(rec)}
                    >
                      Record Adjustment
                    </Button>
                  )
                }
              />
            ))}
          </div>
        </>
      )}

      {/* Record Income Modal */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="Record Daily Income (Spec FIN-002)"
        description="Issue formal receipt under authorized revenue head"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateIncome} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-text-main mb-1">Select Branch *</label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs bg-white focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              >
                {branches.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name} ({b.city})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium text-text-main mb-1">Billing Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as RevenueCategory)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs bg-white focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-text-main mb-1">Amount (INR ₹) *</label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 1500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none font-bold"
              />
            </div>
            <div>
              <label className="block font-medium text-text-main mb-1">Payment Method *</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs bg-white focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-text-main mb-1">Patient Name / Bill Reference</label>
            <input
              type="text"
              placeholder="e.g. V. Sundaramurthy / Walk-in pharmacy"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-text-main mb-1">Notes / Diagnostic Service</label>
            <input
              type="text"
              placeholder="e.g. Comprehensive cardiac enzyme test"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsRecordModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Generate Receipt
            </Button>
          </div>
        </form>
      </Modal>

      {/* Adjust Income Modal */}
      <Modal
        isOpen={!!adjustTarget}
        onClose={() => setAdjustTarget(null)}
        title="Financial Adjustment / Reversal"
        description={`Audit trail correction for Receipt ${adjustTarget?.receiptNumber}`}
        maxWidth="md"
      >
        <form onSubmit={handleConfirmAdjustment} className="space-y-3.5 text-xs">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 leading-relaxed">
            Financial adjustments require an authorized justification note. Records are never
            hard-deleted.
          </div>

          <div>
            <label className="block font-medium text-text-main mb-1">
              Mandatory Adjustment Reason *
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Billing correction due to doctor fee waiver / Duplicate UPI entry reversal"
              value={adjustReason}
              onChange={(e) => setAdjustReason(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-amber-500/30 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAdjustTarget(null)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="secondary" size="sm">
              Save Adjustment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
