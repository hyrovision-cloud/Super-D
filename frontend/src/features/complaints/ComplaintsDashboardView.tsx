import React, { useState, useEffect } from 'react';
import {
  MessageSquareWarning,
  Plus,
  Search,
  Building2,
  Clock,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  Shield,
  Eye,
  Send,
} from 'lucide-react';
import { ComplaintCase, ComplaintStatus, ComplaintPriority } from '@/types';
import { complaintService } from '@/services/mock/complaintService';
import { useBranch } from '@/app/providers/BranchProvider';
import { useAuth } from '@/app/providers/AuthProvider';
import { useToast } from '@/app/providers/ToastProvider';
import { mockStore } from '@/services/mock/mockStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Drawer } from '@/components/ui/Drawer';
import { Modal } from '@/components/ui/Modal';
import { DataTable, Column } from '@/components/tables/DataTable';
import { MobileRecordCard } from '@/components/tables/MobileRecordCard';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { formatDateTime, formatDate } from '@/lib/utils';

export const ComplaintsDashboardView: React.FC = () => {
  const { selectedBranchId } = useBranch();
  const { currentUser, currentRole, hasPermission } = useAuth();
  const toast = useToast();

  const [cases, setCases] = useState<ComplaintCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Case Drawer
  const [activeCase, setActiveCase] = useState<ComplaintCase | null>(null);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [assigneeName, setAssigneeName] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  // Resolve Modal
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [resolutionSummary, setResolutionSummary] = useState('');

  const canViewConfidential = hasPermission('complaint.view_confidential');

  const fetchCases = () => {
    complaintService
      .getComplaints({
        branchId: selectedBranchId,
        status: statusFilter,
        canViewConfidential,
      })
      .then((data) => {
        setCases(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCases();
    const unsubscribe = mockStore.subscribe(() => {
      fetchCases();
    });
    return unsubscribe;
  }, [selectedBranchId, statusFilter, canViewConfidential]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCase || !newNoteContent.trim()) return;

    try {
      const updated = await complaintService.addNote(
        activeCase._id,
        newNoteContent.trim(),
        currentUser.name,
        currentRole
      );
      setActiveCase(updated);
      setNewNoteContent('');
      toast.success('Internal case note added');
    } catch {
      toast.error('Failed to add note');
    }
  };

  const handleAssignCase = async () => {
    if (!activeCase || !assigneeName.trim()) return;
    try {
      const updated = await complaintService.assignComplaint(
        activeCase._id,
        `usr-${Date.now()}`,
        assigneeName.trim()
      );
      setActiveCase(updated);
      setIsAssigning(false);
      toast.success(`Case assigned to ${assigneeName.trim()}`);
    } catch {
      toast.error('Failed to assign case');
    }
  };

  const handleConfirmResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCase || !resolutionSummary.trim()) {
      toast.error('Please enter resolution actions taken');
      return;
    }

    try {
      const updated = await complaintService.resolveComplaint(
        activeCase._id,
        resolutionSummary.trim(),
        currentUser.name
      );
      setActiveCase(updated);
      setIsResolveModalOpen(false);
      setResolutionSummary('');
      toast.success(`Case ${activeCase.ticketNumber} marked as Resolved!`);
    } catch {
      toast.error('Failed to resolve case');
    }
  };

  const getPriorityBadge = (priority: ComplaintPriority) => {
    switch (priority) {
      case 'CRITICAL':
        return <Badge variant="critical" size="sm">Critical</Badge>;
      case 'HIGH':
        return <Badge variant="warning" size="sm">High</Badge>;
      case 'MEDIUM':
        return <Badge variant="teal" size="sm">Medium</Badge>;
      case 'LOW':
        return <Badge variant="neutral" size="sm">Low</Badge>;
    }
  };

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'NEW':
        return <Badge variant="info" size="sm">New</Badge>;
      case 'ASSIGNED':
        return <Badge variant="teal" size="sm">Assigned</Badge>;
      case 'UNDER_REVIEW':
        return <Badge variant="warning" size="sm" dot>Under Review</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="navy" size="sm" dot>In Progress</Badge>;
      case 'RESOLVED':
        return <Badge variant="success" size="sm">Resolved</Badge>;
      case 'CLOSED':
        return <Badge variant="neutral" size="sm">Closed</Badge>;
      case 'ESCALATED':
        return <Badge variant="critical" size="sm" dot>Escalated</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  const filteredCases = cases.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.ticketNumber.toLowerCase().includes(q) ||
      c.subject.toLowerCase().includes(q) ||
      c.complainantName.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  });

  const overdueCount = cases.filter((c) => c.isOverdue).length;
  const resolvedCount = cases.filter(
    (c) => c.status === 'RESOLVED' || c.status === 'CLOSED'
  ).length;

  const columns: Column<ComplaintCase>[] = [
    {
      key: 'ticketNumber',
      header: 'Ticket ID',
      sortable: true,
      className: 'font-mono text-xs font-semibold text-brand-blue',
    },
    {
      key: 'subject',
      header: 'Subject & Description',
      sortable: true,
      render: (c) => (
        <div className="max-w-md">
          <div className="font-bold text-text-main text-xs flex items-center gap-1.5">
            {c.isConfidential && (
              <span className="p-0.5 rounded bg-red-100 text-red-700" title="Confidential">
                <Shield className="w-3 h-3" />
              </span>
            )}
            <span className="truncate">{c.subject}</span>
          </div>
          <div className="text-[11px] text-text-muted truncate mt-0.5">{c.description}</div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: (c) => (
        <span className="text-xs font-medium text-text-secondary">{c.category}</span>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      render: (c) => getPriorityBadge(c.priority),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (c) => getStatusBadge(c.status),
    },
    {
      key: 'sla',
      header: 'SLA Status',
      render: (c) =>
        c.isOverdue ? (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Overdue
          </span>
        ) : (
          <span className="text-[11px] text-emerald-600 font-medium">On Track</span>
        ),
    },
    {
      key: 'actions',
      header: 'Action',
      className: 'text-right',
      render: (c) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setActiveCase(c);
          }}
          leftIcon={<Eye className="w-3.5 h-3.5" />}
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight">
            Patient Grievance & Service Queries (Spec CQM-001–005)
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Track patient tickets, SLA response breaches, cross-department assignments, and resolution notes.
          </p>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-xs font-semibold text-text-secondary uppercase">Total Logged</span>
          <h3 className="text-2xl font-bold text-text-main mt-1">{cases.length}</h3>
          <span className="text-[11px] text-text-muted">All active cases</span>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold text-text-secondary uppercase">Resolved</span>
          <h3 className="text-2xl font-bold text-emerald-600 mt-1">{resolvedCount}</h3>
          <span className="text-[11px] text-text-muted">Closed successfully</span>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold text-text-secondary uppercase">Overdue SLA</span>
          <h3 className="text-2xl font-bold text-rose-600 mt-1">{overdueCount}</h3>
          <span className="text-[11px] text-rose-600 font-semibold">Immediate escalation</span>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold text-text-secondary uppercase">Resolution Rate</span>
          <h3 className="text-2xl font-bold text-brand-blue mt-1">
            {cases.length > 0 ? Math.round((resolvedCount / cases.length) * 100) : 0}%
          </h3>
          <span className="text-[11px] text-text-muted">Target: &gt;85%</span>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-3.5 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by ticket ID, subject, or complainant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-surface-border focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs text-text-secondary font-medium whitespace-nowrap">
            Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs border border-surface-border rounded-lg px-2.5 py-1.5 bg-white text-text-main focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
            <option value="ESCALATED">Escalated</option>
          </select>
        </div>
      </Card>

      {/* Responsive View */}
      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : (
        <>
          <div className="hidden md:block">
            <DataTable
              columns={columns}
              data={filteredCases}
              keyExtractor={(c) => c._id}
              pageSize={8}
              onRowClick={(c) => setActiveCase(c)}
              emptyTitle="No cases logged"
              emptyDescription="No complaints or service queries found."
            />
          </div>

          <div className="md:hidden space-y-3">
            {filteredCases.map((c) => (
              <MobileRecordCard
                key={c._id}
                title={c.subject}
                subtitle={`${c.ticketNumber} • ${c.category}`}
                badge={getStatusBadge(c.status)}
                fields={[
                  { label: 'Complainant', value: c.complainantName },
                  { label: 'Priority', value: c.priority },
                  { label: 'Branch', value: c.branchName },
                  {
                    label: 'SLA',
                    value: c.isOverdue ? '⚠️ Overdue' : 'On Track',
                  },
                ]}
                actions={
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setActiveCase(c)}
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                  >
                    View Ticket Details
                  </Button>
                }
              />
            ))}
          </div>
        </>
      )}

      {/* Case Details Slide-over Drawer (Spec CQM-003, CQM-005) */}
      <Drawer
        isOpen={!!activeCase}
        onClose={() => setActiveCase(null)}
        title={activeCase?.subject || 'Ticket Details'}
        subtitle={`Ticket: ${activeCase?.ticketNumber} • Branch: ${activeCase?.branchName}`}
        width="lg"
      >
        {activeCase && (
          <div className="space-y-5 text-xs">
            {/* Status & SLA Bar */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-text-secondary">Current Status:</span>
                {getStatusBadge(activeCase.status)}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-text-secondary">Priority:</span>
                {getPriorityBadge(activeCase.priority)}
              </div>
              <div>
                {activeCase.isOverdue ? (
                  <span className="px-2 py-1 rounded bg-red-100 text-red-700 font-bold">
                    ⚠️ SLA Breached
                  </span>
                ) : (
                  <span className="text-emerald-600 font-semibold">SLA On Track</span>
                )}
              </div>
            </div>

            {/* Complainant Details */}
            <div className="space-y-2 p-3 bg-white rounded-xl border border-surface-border">
              <div className="font-semibold text-text-main text-xs border-b border-gray-100 pb-1">
                Complainant & Case Background
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-text-muted block text-[11px]">Raised By:</span>
                  <span className="font-medium text-text-main">{activeCase.complainantName}</span>
                </div>
                <div>
                  <span className="text-text-muted block text-[11px]">Contact Phone:</span>
                  <span className="font-medium text-text-main">{activeCase.contactNumber}</span>
                </div>
                <div>
                  <span className="text-text-muted block text-[11px]">Source Channel:</span>
                  <span className="font-medium text-text-main">{activeCase.source}</span>
                </div>
                <div>
                  <span className="text-text-muted block text-[11px]">Logged At:</span>
                  <span className="font-medium text-text-main">{formatDateTime(activeCase.createdAt)}</span>
                </div>
              </div>
              <div className="pt-2">
                <span className="text-text-muted block text-[11px]">Description:</span>
                <p className="text-text-secondary leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-1">
                  {activeCase.description}
                </p>
              </div>
            </div>

            {/* Assignment & Resolution Controls */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-text-muted block">Assigned Responsible Staff</span>
                  <span className="font-bold text-text-main text-xs">
                    {activeCase.assignedToName || 'Unassigned'}
                  </span>
                </div>
                {activeCase.status !== 'RESOLVED' && activeCase.status !== 'CLOSED' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAssigning(!isAssigning)}
                  >
                    {isAssigning ? 'Cancel' : 'Reassign'}
                  </Button>
                )}
              </div>

              {isAssigning && (
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Staff name (e.g. Dr. Senthil Nathan)"
                    value={assigneeName}
                    onChange={(e) => setAssigneeName(e.target.value)}
                    className="flex-1 px-3 py-1.5 border rounded-lg border-surface-border text-xs bg-white"
                  />
                  <Button size="sm" onClick={handleAssignCase}>
                    Assign
                  </Button>
                </div>
              )}

              {activeCase.status !== 'RESOLVED' && activeCase.status !== 'CLOSED' && (
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => setIsResolveModalOpen(true)}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Mark Case as Resolved
                </Button>
              )}

              {activeCase.resolutionSummary && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-950">
                  <span className="font-bold block mb-1">Resolution Summary:</span>
                  <p className="leading-relaxed">{activeCase.resolutionSummary}</p>
                  <span className="text-[10px] text-green-800 block mt-1">
                    Resolved by {activeCase.resolvedBy} on {formatDateTime(activeCase.resolvedAt)}
                  </span>
                </div>
              )}
            </div>

            {/* Internal Case Notes (Spec CQM-005) */}
            <div className="space-y-3">
              <div className="font-semibold text-text-main text-xs flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-brand-blue" />
                <span>Internal Investigation Notes (Spec CQM-005)</span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {(!activeCase.internalNotes || activeCase.internalNotes.length === 0) ? (
                  <p className="text-[11px] text-text-muted italic">No internal notes added yet.</p>
                ) : (
                  activeCase.internalNotes.map((note) => (
                    <div key={note._id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-text-main">{note.authorName}</span>
                        <span className="text-text-muted">{formatDateTime(note.createdAt)}</span>
                      </div>
                      <p className="text-text-secondary leading-relaxed">{note.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add confidential internal case note..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="flex-1 px-3 py-1.5 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30"
                />
                <Button type="submit" size="sm" leftIcon={<Send className="w-3.5 h-3.5" />}>
                  Post
                </Button>
              </form>
            </div>
          </div>
        )}
      </Drawer>

      {/* Resolve Case Modal */}
      <Modal
        isOpen={isResolveModalOpen}
        onClose={() => setIsResolveModalOpen(false)}
        title="Resolve Ticket"
        description={`Record corrective action and resolution statement for ${activeCase?.ticketNumber}`}
        maxWidth="md"
      >
        <form onSubmit={handleConfirmResolve} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-medium text-text-main mb-1">
              Resolution Summary & Action Taken *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Detail biomedical repair, refund, doctor apology, or clinical counseling provided..."
              value={resolutionSummary}
              onChange={(e) => setResolutionSummary(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsResolveModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Confirm Resolution
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
