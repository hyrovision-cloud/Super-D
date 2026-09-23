import React, { useState, useEffect } from 'react';
import {
  Clock,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building2,
  User,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import { LeaveRequest, LeaveStatus } from '@/types';
import { leaveService } from '@/services/mock/leaveService';
import { useBranch } from '@/app/providers/BranchProvider';
import { useAuth } from '@/app/providers/AuthProvider';
import { useToast } from '@/app/providers/ToastProvider';
import { mockStore } from '@/services/mock/mockStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { DataTable, Column } from '@/components/tables/DataTable';
import { MobileRecordCard } from '@/components/tables/MobileRecordCard';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { formatDate } from '@/lib/utils';

export const LeaveApprovalView: React.FC = () => {
  const { selectedBranchId, branches } = useBranch();
  const { currentUser, currentRole } = useAuth();
  const toast = useToast();

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<LeaveStatus | 'ALL'>('ALL');

  // Rejection modal
  const [rejectionTarget, setRejectionTarget] = useState<LeaveRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState('');

  // Submit Leave modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<'CASUAL' | 'SICK' | 'EARNED' | 'PERMISSION'>('CASUAL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [durationDays, setDurationDays] = useState('1');
  const [reason, setReason] = useState('');
  const [branchId, setBranchId] = useState(selectedBranchId !== 'all' ? selectedBranchId : 'branch-try');

  const fetchLeaves = () => {
    leaveService.getLeaveRequests(selectedBranchId).then((data) => {
      setLeaveRequests(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchLeaves();
    const unsubscribe = mockStore.subscribe(() => {
      fetchLeaves();
    });
    return unsubscribe;
  }, [selectedBranchId]);

  const handleApprove = async (request: LeaveRequest) => {
    try {
      await leaveService.approveLeaveRequest(request._id, `${currentUser.name} (${currentRole})`);
      toast.success(`Leave request for ${request.employeeName} approved!`);
    } catch {
      toast.error('Failed to approve request');
    }
  };

  const handleConfirmRejection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      setRejectionError('A mandatory rejection comment is required by hospital leave policy.');
      return;
    }

    if (!rejectionTarget) return;

    try {
      await leaveService.rejectLeaveRequest(
        rejectionTarget._id,
        rejectionReason.trim(),
        `${currentUser.name} (${currentRole})`
      );

      toast.warning(`Leave request for ${rejectionTarget.employeeName} rejected.`);
      setRejectionTarget(null);
      setRejectionReason('');
      setRejectionError('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to reject request');
    }
  };

  const handleSubmitLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim()) {
      toast.error('Please enter start date, end date, and leave reason');
      return;
    }

    const br = branches.find((b) => b._id === branchId);

    try {
      await leaveService.submitLeaveRequest({
        employeeId: currentUser.employeeId,
        employeeName: currentUser.name,
        role: currentUser.role,
        department: currentUser.department,
        branchId,
        branchName: br?.name || 'Trichy Main Hospital',
        leaveType,
        startDate,
        endDate,
        durationDays: Number(durationDays) || 1,
        reason: reason.trim(),
        currentApproverRole: 'Branch Manager',
      });

      toast.success('Leave application submitted for managerial review!');
      setIsSubmitModalOpen(false);
      setReason('');
    } catch {
      toast.error('Failed to submit leave request');
    }
  };

  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case 'SUBMITTED':
        return <Badge variant="info" size="sm">Submitted</Badge>;
      case 'MANAGER_REVIEW':
        return <Badge variant="warning" size="sm" dot>Manager Review</Badge>;
      case 'HR_REVIEW':
        return <Badge variant="navy" size="sm" dot>HR Review</Badge>;
      case 'APPROVED':
        return <Badge variant="success" size="sm">Approved</Badge>;
      case 'REJECTED':
        return <Badge variant="critical" size="sm">Rejected</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  const filteredRequests =
    statusFilter === 'ALL'
      ? leaveRequests
      : leaveRequests.filter((r) => r.status === statusFilter);

  const pendingCount = leaveRequests.filter(
    (r) => r.status === 'SUBMITTED' || r.status === 'MANAGER_REVIEW' || r.status === 'HR_REVIEW'
  ).length;

  const columns: Column<LeaveRequest>[] = [
    {
      key: 'employeeName',
      header: 'Employee & Role',
      sortable: true,
      render: (r) => (
        <div>
          <div className="font-bold text-text-main text-xs">{r.employeeName}</div>
          <div className="text-[11px] text-text-muted">
            {r.role} • {r.department}
          </div>
        </div>
      ),
    },
    {
      key: 'leaveType',
      header: 'Leave Type',
      sortable: true,
      render: (r) => (
        <Badge variant="teal" size="sm">
          {r.leaveType}
        </Badge>
      ),
    },
    {
      key: 'dates',
      header: 'Duration & Dates',
      render: (r) => (
        <div className="text-xs">
          <div className="font-semibold text-text-main">
            {r.durationDays} Day{r.durationDays > 1 ? 's' : ''}
          </div>
          <div className="text-[11px] text-text-muted">
            {formatDate(r.startDate)} to {formatDate(r.endDate)}
          </div>
        </div>
      ),
    },
    {
      key: 'branchName',
      header: 'Hospital Branch',
      render: (r) => (
        <div className="flex items-center gap-1 text-xs text-text-secondary">
          <Building2 className="w-3.5 h-3.5 text-text-muted shrink-0" />
          <span>{r.branchName}</span>
        </div>
      ),
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (r) => (
        <div className="max-w-xs text-xs text-text-secondary truncate" title={r.reason}>
          {r.reason}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Review Stage',
      sortable: true,
      render: (r) => getStatusBadge(r.status),
    },
    {
      key: 'actions',
      header: 'Approval Action',
      className: 'text-right',
      render: (r) => {
        const canDecide =
          r.status === 'SUBMITTED' ||
          r.status === 'MANAGER_REVIEW' ||
          r.status === 'HR_REVIEW';

        if (!canDecide) {
          return (
            <span className="text-[11px] text-text-muted">
              {r.status === 'APPROVED' ? 'Finalized' : 'Closed'}
            </span>
          );
        }

        return (
          <div className="flex items-center justify-end gap-1.5">
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleApprove(r)}
            >
              Approve
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-status-critical hover:bg-red-50"
              onClick={() => {
                setRejectionTarget(r);
                setRejectionReason('');
                setRejectionError('');
              }}
            >
              Reject
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight">
              Leave & Permission Approvals (Spec LEA-001–003)
            </h1>
            {pendingCount > 0 && (
              <Badge variant="warning" size="sm" dot>
                {pendingCount} Pending Review
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Multi-stage workflow with mandatory reason enforcement on rejection decisions.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsSubmitModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Submit Leave Request
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs text-text-secondary font-medium whitespace-nowrap">
            Workflow Stage:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs border border-surface-border rounded-lg px-2.5 py-1.5 bg-white text-text-main focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          >
            <option value="ALL">All Stages ({leaveRequests.length})</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="MANAGER_REVIEW">Manager Review</option>
            <option value="HR_REVIEW">HR Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div className="text-xs text-text-muted">
          Showing {filteredRequests.length} requests
        </div>
      </Card>

      {/* Table & Mobile Card Stack */}
      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : (
        <>
          <div className="hidden md:block">
            <DataTable
              columns={columns}
              data={filteredRequests}
              keyExtractor={(r) => r._id}
              pageSize={8}
              emptyTitle="No leave requests found"
              emptyDescription="No leave applications match the selected workflow filter."
            />
          </div>

          <div className="md:hidden space-y-3">
            {filteredRequests.map((req) => {
              const canDecide =
                req.status === 'SUBMITTED' ||
                req.status === 'MANAGER_REVIEW' ||
                req.status === 'HR_REVIEW';

              return (
                <MobileRecordCard
                  key={req._id}
                  title={req.employeeName}
                  subtitle={`${req.role} • ${req.branchName}`}
                  badge={getStatusBadge(req.status)}
                  fields={[
                    { label: 'Leave Type', value: req.leaveType },
                    { label: 'Duration', value: `${req.durationDays} Days` },
                    { label: 'From - To', value: `${formatDate(req.startDate)} - ${formatDate(req.endDate)}` },
                    { label: 'Reason', value: req.reason },
                  ]}
                  actions={
                    canDecide ? (
                      <div className="flex items-center gap-2 w-full">
                        <Button
                          variant="primary"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleApprove(req)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-red-600"
                          onClick={() => {
                            setRejectionTarget(req);
                            setRejectionReason('');
                            setRejectionError('');
                          }}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <div className="text-[11px] text-text-muted italic">
                        {req.decisionComment ? `Decision Note: "${req.decisionComment}"` : 'Decided'}
                      </div>
                    )
                  }
                />
              );
            })}
          </div>
        </>
      )}

      {/* Mandatory Rejection Comment Modal (Spec LEA-003) */}
      <Modal
        isOpen={!!rejectionTarget}
        onClose={() => setRejectionTarget(null)}
        title="Reject Leave Request (Spec LEA-003)"
        description={`A mandatory explanatory comment is required to reject ${rejectionTarget?.employeeName}'s application`}
        maxWidth="md"
      >
        <form onSubmit={handleConfirmRejection} className="space-y-3.5 text-xs">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 leading-relaxed">
            <strong>Hospital Workforce Policy Rule:</strong> Rejection comments are recorded
            in the permanent audit log and communicated to the applying staff member.
          </div>

          <div>
            <label className="block font-medium text-text-main mb-1">
              Mandatory Rejection Reason *
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Critical staff shortage on requested dates / Cross-coverage unavailable for emergency shifts"
              value={rejectionReason}
              onChange={(e) => {
                setRejectionReason(e.target.value);
                if (rejectionError) setRejectionError('');
              }}
              className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-status-critical/30 focus:border-status-critical focus:outline-none"
            />
            {rejectionError && (
              <p className="text-status-critical text-[11px] mt-1 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {rejectionError}
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRejectionTarget(null)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="danger" size="sm">
              Confirm Rejection
            </Button>
          </div>
        </form>
      </Modal>

      {/* Submit Leave Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Apply for Leave / Permission"
        description="Submit request to branch manager and HR approval queue"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmitLeave} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-text-main mb-1">Leave Type</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs bg-white focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              >
                <option value="CASUAL">Casual Leave (CL)</option>
                <option value="SICK">Sick / Medical Leave (SL)</option>
                <option value="EARNED">Earned Privilege Leave (EL)</option>
                <option value="PERMISSION">Duty Permission (2-3 Hours)</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-text-main mb-1">Duration (Days)</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-text-main mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-text-main mb-1">End Date *</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-text-main mb-1">Reason for Absence *</label>
            <textarea
              rows={2}
              required
              placeholder="Provide clinical or personal justification..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsSubmitModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
