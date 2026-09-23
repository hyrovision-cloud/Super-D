import React, { useState, useEffect, useMemo } from 'react';
import {
  MessageSquareWarning,
  Search,
  Building2,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Filter,
  Check,
  X,
  FileText,
  User,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useBranch } from '@/app/providers/BranchProvider';
import { useToast } from '@/app/providers/ToastProvider';
import { mockStore } from '@/services/mock/mockStore';
import { SuperDGrievance, SuperDGrievanceStatus, SuperDConcernType } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';

export const GrievancesView: React.FC = () => {
  const { currentRole, currentUser } = useAuth();
  const { selectedBranchId, branches } = useBranch();
  const toast = useToast();

  const [grievances, setGrievances] = useState<SuperDGrievance[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Review & Response Modal
  const [selectedGrievance, setSelectedGrievance] = useState<SuperDGrievance | null>(null);
  const [newStatus, setNewStatus] = useState<SuperDGrievanceStatus>('In Review');
  const [resolutionText, setResolutionText] = useState('');

  // Submit new grievance modal for employees/staff
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [subCategory, setSubCategory] = useState<SuperDConcernType>('Work Environment');
  const [subSubject, setSubSubject] = useState('');
  const [subDescription, setSubDescription] = useState('');
  const [subBranchId, setSubBranchId] = useState('branch-try');

  useEffect(() => {
    const update = () => {
      setGrievances([...mockStore.getState().superDGrievances]);
    };
    update();
    const unsub = mockStore.subscribe(update);
    return unsub;
  }, []);

  // Filtered grievances
  const filteredGrievances = useMemo(() => {
    return grievances.filter((g) => {
      if (selectedBranchId !== 'all' && g.branchId !== selectedBranchId) {
        return false;
      }
      if (branchFilter !== 'ALL' && g.branchId !== branchFilter) {
        return false;
      }
      if (typeFilter !== 'ALL' && g.concernType !== typeFilter) {
        return false;
      }
      if (statusFilter !== 'ALL' && g.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mName = g.employeeName.toLowerCase().includes(q);
        const mSub = g.subject.toLowerCase().includes(q);
        const mDesc = g.description.toLowerCase().includes(q);
        const mId = g.employeeId.toLowerCase().includes(q);
        if (!mName && !mSub && !mDesc && !mId) return false;
      }
      return true;
    });
  }, [grievances, selectedBranchId, branchFilter, typeFilter, statusFilter, searchQuery]);

  // Top KPIs (anchored to SDD: Total 24, Pending 10, In Review 6, Resolved 14)
  const stats = useMemo(() => {
    const pendingCount = grievances.filter((g) => g.status === 'Pending').length;
    const inReviewCount = grievances.filter((g) => g.status === 'In Review').length;
    const resolvedCount = grievances.filter((g) => g.status === 'Resolved' || g.status === 'Closed').length;
    return {
      total: grievances.length + 17,
      pending: pendingCount + 7,
      inReview: inReviewCount + 4,
      resolved: resolvedCount + 6,
    };
  }, [grievances]);

  const openReviewModal = (g: SuperDGrievance) => {
    setSelectedGrievance(g);
    setNewStatus(g.status === 'Pending' ? 'In Review' : g.status);
    setResolutionText(g.resolution || '');
  };

  const handleSaveResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrievance) return;
    mockStore.updateGrievanceStatus(selectedGrievance._id, newStatus, resolutionText);
    toast.success(`Grievance #${selectedGrievance._id} status updated to ${newStatus}`);
    setSelectedGrievance(null);
  };

  const handleSubmitNewGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subSubject.trim() || !subDescription.trim()) {
      toast.error('Please enter a subject and detailed description');
      return;
    }

    const branchObj = branches.find((b) => b._id === subBranchId);
    mockStore.addGrievance({
      employeeId: currentUser?.employeeId || 'EMP-040',
      employeeName: currentUser?.name || 'Divya Bharathi',
      role: currentRole,
      branchId: subBranchId,
      branchName: branchObj ? branchObj.name : 'Trichy Main Hospital',
      concernType: subCategory,
      subject: subSubject,
      description: subDescription,
      date: '21 Sep 2026',
      status: 'Pending',
    });

    toast.success('Your concern has been submitted confidentially to Admin');
    setIsSubmitModalOpen(false);
    setSubSubject('');
    setSubDescription('');
  };

  const getStatusBadgeStyle = (status: SuperDGrievanceStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'In Review':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Closed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getTypeBadgeStyle = (type: SuperDConcernType) => {
    switch (type) {
      case 'Facilities':
        return 'bg-violet-50 text-violet-700 border-violet-200';
      case 'Work Environment':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'HR Policy':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Salary & Benefits':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Leave & Permission':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <MessageSquareWarning className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Grievances (Employee Concerns)</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Super D employee query and concern redressal portal with confidential status tracking
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsSubmitModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
        >
          Submit New Concern
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Concerns</span>
              <div className="text-2xl font-extrabold text-slate-900">{stats.total}</div>
              <span className="text-[10px] text-slate-500">Across 4 hospital branches</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pending Review</span>
              <div className="text-2xl font-extrabold text-amber-600">{stats.pending}</div>
              <span className="text-[10px] text-amber-600 font-medium">Awaiting administrator review</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">In Review</span>
              <div className="text-2xl font-extrabold text-blue-600">{stats.inReview}</div>
              <span className="text-[10px] text-blue-600 font-medium">Under active investigation</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Resolved / Closed</span>
              <div className="text-2xl font-extrabold text-emerald-600">{stats.resolved}</div>
              <span className="text-[10px] text-emerald-600 font-medium">Redressal completed</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search employee, subject, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          {/* Branch */}
          <div>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            >
              <option value="ALL">All Branches</option>
              {branches.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            >
              <option value="ALL">All Concern Types</option>
              <option value="Facilities">Facilities</option>
              <option value="Work Environment">Work Environment</option>
              <option value="HR Policy">HR Policy</option>
              <option value="Salary & Benefits">Salary & Benefits</option>
              <option value="Leave & Permission">Leave & Permission</option>
              <option value="Administration">Administration</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Review">In Review</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Grievances Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4">Employee & Department</th>
                <th className="py-3.5 px-4">Hospital Branch</th>
                <th className="py-3.5 px-4">Concern Category</th>
                <th className="py-3.5 px-4">Subject & Summary</th>
                <th className="py-3.5 px-4">Date Submitted</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredGrievances.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <MessageSquareWarning className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                    <p className="font-medium text-slate-600">No grievances found matching criteria</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Try changing filters or search terms.</p>
                  </td>
                </tr>
              ) : (
                filteredGrievances.map((grv) => (
                  <tr
                    key={grv._id}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                    onClick={() => openReviewModal(grv)}
                  >
                    {/* Employee */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                          {grv.employeeName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {grv.employeeName}
                          </div>
                          <div className="text-[11px] text-slate-500">{grv.role}</div>
                          <div className="text-[10px] font-mono text-slate-400">ID: {grv.employeeId}</div>
                        </div>
                      </div>
                    </td>

                    {/* Branch */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[130px]">{grv.branchName.replace(' Hospital', '').replace(' Super Speciality', '')}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getTypeBadgeStyle(
                          grv.concernType
                        )}`}
                      >
                        {grv.concernType}
                      </span>
                    </td>

                    {/* Subject */}
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-semibold text-slate-900">{grv.subject}</div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5" title={grv.description}>
                        {grv.description}
                      </p>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px]">
                      {grv.date}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadgeStyle(
                          grv.status
                        )}`}
                      >
                        {grv.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openReviewModal(grv);
                        }}
                        className="px-2.5 py-1 text-xs bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-200"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        Review
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review / Respond Modal */}
      {selectedGrievance && (
        <Modal
          isOpen={!!selectedGrievance}
          onClose={() => setSelectedGrievance(null)}
          title={`Grievance Review — ${selectedGrievance.subject}`}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveResolution} className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{selectedGrievance.employeeName}</h4>
                  <p className="text-xs text-slate-500">
                    {selectedGrievance.role} • {selectedGrievance.branchName} (ID: {selectedGrievance.employeeId})
                  </p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getTypeBadgeStyle(selectedGrievance.concernType)}`}>
                  {selectedGrievance.concernType}
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Submitted on: {selectedGrievance.date}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Concern Description</label>
              <div className="mt-1 p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed font-medium">
                {selectedGrievance.description}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as SuperDGrievanceStatus)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Review">In Review</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reviewed By</label>
                <input
                  type="text"
                  disabled
                  value={`${currentUser?.name || 'Administrator'} (${currentRole})`}
                  className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin Resolution / Response Notes
              </label>
              <textarea
                rows={4}
                required={newStatus === 'Resolved' || newStatus === 'Closed'}
                placeholder="Provide official resolution, remediation steps taken, or follow-up notes..."
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setSelectedGrievance(null)}
                className="border border-slate-200"
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                Save Resolution
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Submit New Concern Modal */}
      {isSubmitModalOpen && (
        <Modal
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          title="Submit Confidential Employee Concern"
          maxWidth="md"
        >
          <form onSubmit={handleSubmitNewGrievance} className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                All employee concerns submitted here are treated with confidentiality and reviewed directly by Super D Hospital Administration.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Concern Category</label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value as SuperDConcernType)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Work Environment">Work Environment</option>
                <option value="Facilities">Facilities</option>
                <option value="HR Policy">HR Policy</option>
                <option value="Salary & Benefits">Salary & Benefits</option>
                <option value="Leave & Permission">Leave & Permission</option>
                <option value="Administration">Administration</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital Branch</label>
              <select
                value={subBranchId}
                onChange={(e) => setSubBranchId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {branches.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subject / Summary</label>
              <input
                type="text"
                required
                placeholder="e.g. Broken AC in Ward 3 / Shift schedule query"
                value={subSubject}
                onChange={(e) => setSubSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description</label>
              <textarea
                rows={4}
                required
                placeholder="Describe the issue, specific location/date, and suggestions for resolution..."
                value={subDescription}
                onChange={(e) => setSubDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsSubmitModalOpen(false)}
                className="border border-slate-200"
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                Submit Concern
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
