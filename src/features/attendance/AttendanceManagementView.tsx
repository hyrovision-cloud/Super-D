import React, { useState, useEffect, useMemo } from 'react';
import {
  CalendarCheck,
  Check,
  X,
  Eye,
  Search,
  Download,
  Filter,
  Building2,
  Clock,
  UserCheck,
  Calendar,
  AlertCircle,
  FileText,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useBranch } from '@/app/providers/BranchProvider';
import { useToast } from '@/app/providers/ToastProvider';
import { mockStore } from '@/services/mock/mockStore';
import { SuperDLeaveRequest, SuperDReviewStage } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';

export const AttendanceManagementView: React.FC = () => {
  const { currentRole, currentUser } = useAuth();
  const { selectedBranchId, branches } = useBranch();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'leave' | 'permissions' | 'attendance'>('leave');
  const [leaveRequests, setLeaveRequests] = useState<SuperDLeaveRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState<string>('ALL');
  const [leaveTypeFilter, setLeaveTypeFilter] = useState<string>('ALL');
  const [reviewStageFilter, setReviewStageFilter] = useState<string>('ALL');
  const [fromDateFilter, setFromDateFilter] = useState<string>('');
  const [toDateFilter, setToDateFilter] = useState<string>('');

  // Modals
  const [selectedRequest, setSelectedRequest] = useState<SuperDLeaveRequest | null>(null);
  const [rejectTarget, setRejectTarget] = useState<SuperDLeaveRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Daily attendance mock records for the Attendance tab
  const [attendanceRecords] = useState([
    { id: 'att-1', empId: 'EMP-012', name: 'R. Ganesan', role: 'Chief Biochemist', branch: 'Trichy Main Hospital', checkIn: '08:55 AM', checkOut: '05:05 PM', status: 'Present' },
    { id: 'att-2', empId: 'EMP-021', name: 'Dr. Anand Kumar', role: 'Consultant Orthopedic Surgeon', branch: 'Trichy Main Hospital', checkIn: '09:12 AM', checkOut: '06:00 PM', status: 'Present' },
    { id: 'att-3', empId: 'EMP-040', name: 'Divya Bharathi', role: 'Senior Receptionist', branch: 'Trichy Main Hospital', checkIn: '09:00 AM', checkOut: '02:00 PM', status: 'Half Day / Permission' },
    { id: 'att-4', empId: 'EMP-033', name: 'Karthik Selvam', role: 'Staff Nurse', branch: 'Chennai Super Speciality', checkIn: '—', checkOut: '—', status: 'On Leave' },
    { id: 'att-5', empId: 'EMP-014', name: 'Meena Priya', role: 'Lab Assistant', branch: 'Madurai City Hospital', checkIn: '08:45 AM', checkOut: '05:15 PM', status: 'Present' },
    { id: 'att-6', empId: 'EMP-055', name: 'Suresh Babu', role: 'Admin Executive', branch: 'Pudukkottai Healthcare Center', checkIn: '09:40 AM', checkOut: '05:40 PM', status: 'Late' },
  ]);

  useEffect(() => {
    const update = () => {
      setLeaveRequests([...mockStore.getState().superDLeaveRequests]);
    };
    update();
    const unsub = mockStore.subscribe(update);
    return unsub;
  }, []);

  // Filtered lists
  const filteredRequests = useMemo(() => {
    return leaveRequests.filter((item) => {
      // Tab segregation
      if (activeTab === 'leave' && item.leaveType === 'Permission') return false;
      if (activeTab === 'permissions' && item.leaveType !== 'Permission') return false;

      // Role scoping: Branch Doctor / Branch Manager scoped to branch if assigned
      if ((currentRole === 'Branch Doctor' || currentRole === 'Branch Manager') && currentUser?.primaryBranchId) {
        if (item.branchId !== currentUser.primaryBranchId && item.branchName !== 'Trichy Main Hospital') {
          return false;
        }
      }

      // Top nav branch selector
      if (selectedBranchId !== 'all' && item.branchId !== selectedBranchId) {
        return false;
      }

      // Local Branch filter
      if (branchFilter !== 'ALL' && item.branchId !== branchFilter) {
        return false;
      }

      // Leave type filter
      if (leaveTypeFilter !== 'ALL' && item.leaveType !== leaveTypeFilter) {
        return false;
      }

      // Review stage filter
      if (reviewStageFilter !== 'ALL' && item.reviewStage !== reviewStageFilter) {
        return false;
      }

      // Date range filtering (simple string comparison if filled)
      if (fromDateFilter && item.fromDate < fromDateFilter) {
        return false;
      }
      if (toDateFilter && item.toDate > toDateFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.employeeName.toLowerCase().includes(q);
        const matchId = item.employeeId.toLowerCase().includes(q);
        const matchRole = item.role.toLowerCase().includes(q);
        const matchReason = item.reason.toLowerCase().includes(q);
        if (!matchName && !matchId && !matchRole && !matchReason) return false;
      }

      return true;
    });
  }, [
    leaveRequests,
    activeTab,
    currentRole,
    currentUser,
    selectedBranchId,
    branchFilter,
    leaveTypeFilter,
    reviewStageFilter,
    fromDateFilter,
    toDateFilter,
    searchQuery,
  ]);

  // Tab counts
  const leaveCount = useMemo(
    () => leaveRequests.filter((r) => r.leaveType !== 'Permission' && r.status === 'Pending').length,
    [leaveRequests]
  );
  const permCount = useMemo(
    () => leaveRequests.filter((r) => r.leaveType === 'Permission' && r.status === 'Pending').length,
    [leaveRequests]
  );

  const handleApprove = (req: SuperDLeaveRequest) => {
    let nextStage: SuperDReviewStage = 'Approved';
    if (currentRole === 'Branch Doctor') {
      nextStage = 'HR Review';
    } else if (currentRole === 'Branch Manager') {
      nextStage = 'HR Review';
    } else if (currentRole === 'HR' || currentRole === 'Admin') {
      nextStage = 'Approved';
    }

    const nextStatus = nextStage === 'Approved' ? 'Approved' : 'Pending';
    mockStore.updateLeaveReview(req._id, nextStage, nextStatus);
    toast.success(`Request for ${req.employeeName} approved (${nextStage})`);
  };

  const handleRejectConfirm = () => {
    if (!rejectTarget) return;
    mockStore.updateLeaveReview(rejectTarget._id, 'Rejected', 'Rejected');
    toast.error(`Request for ${rejectTarget.employeeName} has been rejected`);
    setRejectTarget(null);
    setRejectReason('');
  };

  const handleExport = () => {
    const headers = ['Employee ID', 'Employee Name', 'Role', 'Branch', 'Leave Type', 'From Date', 'To Date', 'Total Days', 'Reason', 'Stage', 'Status'];
    const rows = filteredRequests.map((r) => [
      r.employeeId,
      r.employeeName,
      `"${r.role}"`,
      r.branchName,
      r.leaveType,
      r.fromDate,
      r.toDate,
      r.totalDays,
      `"${r.reason.replace(/"/g, '""')}"`,
      r.reviewStage,
      r.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `superd_attendance_requests_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported attendance & leave records to CSV');
  };

  const resetFilters = () => {
    setSearchQuery('');
    setBranchFilter('ALL');
    setLeaveTypeFilter('ALL');
    setReviewStageFilter('ALL');
    setFromDateFilter('');
    setToDateFilter('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Attendance Management</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review staff leave submissions, permission requests, and monitor daily punch logs
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleExport}
          className="flex items-center gap-2 text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export Data</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-0">
        <button
          onClick={() => setActiveTab('leave')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'leave'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Leave Requests</span>
          <span
            className={`px-2 py-0.5 text-xs rounded-full font-bold ${
              activeTab === 'leave' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {leaveCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('permissions')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'permissions'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Permissions</span>
          <span
            className={`px-2 py-0.5 text-xs rounded-full font-bold ${
              activeTab === 'permissions' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {permCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'attendance'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Daily Attendance Log</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600 font-bold">
            {attendanceRecords.length}
          </span>
        </button>
      </div>

      {activeTab !== 'attendance' ? (
        <>
          {/* Filter Card */}
          <Card className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              {/* Branch */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Hospital Branch
                </label>
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

              {/* Leave Type */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Leave Type
                </label>
                <select
                  value={leaveTypeFilter}
                  onChange={(e) => setLeaveTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                >
                  <option value="ALL">All Leave Types</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Earned Leave">Earned Leave</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                  <option value="Permission">Permission</option>
                </select>
              </div>

              {/* From Date */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDateFilter}
                  onChange={(e) => setFromDateFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              {/* To Date */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={toDateFilter}
                  onChange={(e) => setToDateFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              {/* Review Stage */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Review Stage
                </label>
                <select
                  value={reviewStageFilter}
                  onChange={(e) => setReviewStageFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                >
                  <option value="ALL">All Stages</option>
                  <option value="Submitted">Submitted</option>
                  <option value="HR Review">HR Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Search and Reset */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by employee name, employee ID, role, or reason..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800"
                />
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={resetFilters}
                className="text-xs text-slate-600 hover:text-slate-900 border border-slate-200 w-full sm:w-auto"
              >
                Reset Filters
              </Button>
            </div>
          </Card>

          {/* Table */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Employee & Role</th>
                    <th className="py-3.5 px-4">Leave Type</th>
                    <th className="py-3.5 px-4">Duration & Dates</th>
                    <th className="py-3.5 px-4">Hospital Branch</th>
                    <th className="py-3.5 px-4">Reason</th>
                    <th className="py-3.5 px-4 text-center">Review Stage</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <CalendarCheck className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                        <p className="font-medium text-slate-600">No leave or permission requests found</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Try resetting your active filters.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req) => {
                      const isApproved = req.status === 'Approved';
                      const isRejected = req.status === 'Rejected';
                      const isPending = req.status === 'Pending';

                      const getLeaveBadgeStyle = (type: string) => {
                        switch (type) {
                          case 'Sick Leave':
                            return 'bg-rose-50 text-rose-700 border-rose-200';
                          case 'Casual Leave':
                            return 'bg-blue-50 text-blue-700 border-blue-200';
                          case 'Earned Leave':
                            return 'bg-amber-50 text-amber-700 border-amber-200';
                          case 'Permission':
                            return 'bg-purple-50 text-purple-700 border-purple-200';
                          default:
                            return 'bg-slate-50 text-slate-700 border-slate-200';
                        }
                      };

                      const getStageBadgeStyle = (stage: string) => {
                        switch (stage) {
                          case 'Approved':
                            return 'bg-emerald-50 text-emerald-700 border-emerald-200';
                          case 'Rejected':
                            return 'bg-rose-50 text-rose-700 border-rose-200';
                          case 'HR Review':
                            return 'bg-amber-50 text-amber-700 border-amber-200';
                          case 'Submitted':
                          default:
                            return 'bg-indigo-50 text-indigo-700 border-indigo-200';
                        }
                      };

                      return (
                        <tr
                          key={req._id}
                          className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                          onClick={() => setSelectedRequest(req)}
                        >
                          {/* Multi-line Employee & Role */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                                {req.employeeName.charAt(0)}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                  {req.employeeName}
                                </div>
                                <div className="text-[11px] text-slate-500 leading-tight">
                                  {req.role} {req.department}
                                </div>
                                <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                                  ID: {req.employeeId}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Leave Type */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getLeaveBadgeStyle(
                                req.leaveType
                              )}`}
                            >
                              {req.leaveType}
                            </span>
                          </td>

                          {/* Duration & Dates */}
                          <td className="py-3.5 px-4 font-mono text-slate-700">
                            <div className="font-bold text-slate-900">
                              {req.totalDays} {req.leaveType === 'Permission' ? 'Hours' : req.totalDays === 1 ? 'Day' : 'Days'}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {req.fromDate} to {req.toDate}
                            </div>
                          </td>

                          {/* Branch */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                              <Building2 className="w-3.5 h-3.5 text-slate-400" />
                              <span className="truncate max-w-[130px]">{req.branchName.replace(' Hospital', '').replace(' Super Speciality', '')}</span>
                            </div>
                          </td>

                          {/* Reason */}
                          <td className="py-3.5 px-4 max-w-xs">
                            <p className="text-slate-600 truncate text-[11px]" title={req.reason}>
                              {req.reason}
                            </p>
                            {req.replacementMember && (
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                Replacement: <span className="font-medium text-slate-600">{req.replacementMember}</span>
                              </div>
                            )}
                          </td>

                          {/* Review Stage */}
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStageBadgeStyle(
                                req.reviewStage
                              )}`}
                            >
                              {req.reviewStage}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                              {isPending && (
                                <>
                                  <button
                                    onClick={() => handleApprove(req)}
                                    title="Approve Request"
                                    className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg transition"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setRejectTarget(req)}
                                    title="Reject Request"
                                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg transition"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setSelectedRequest(req)}
                                className="px-2 py-1 text-xs bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-200"
                              >
                                <Eye className="w-3.5 h-3.5 mr-1 text-slate-400" />
                                View
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Daily Attendance Log View */
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Today's Branch Biometric Punch & Shift Attendance</h3>
              <p className="text-xs text-slate-500">Live attendance status synced with hospital biometric sensors</p>
            </div>
            <span className="text-xs font-mono font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-lg border border-blue-200">
              Shift: Day (09:00 AM - 05:00 PM)
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Role & Designation</th>
                  <th className="py-3.5 px-4">Branch</th>
                  <th className="py-3.5 px-4">Punch In</th>
                  <th className="py-3.5 px-4">Punch Out</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {attendanceRecords.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div>{att.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{att.empId}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{att.role}</td>
                    <td className="py-3 px-4 text-slate-600">{att.branch}</td>
                    <td className="py-3 px-4 font-mono text-slate-800">{att.checkIn}</td>
                    <td className="py-3 px-4 font-mono text-slate-800">{att.checkOut}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                          att.status === 'Present'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : att.status === 'Late'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : att.status === 'On Leave'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-purple-50 text-purple-700 border-purple-200'
                        }`}
                      >
                        {att.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedRequest && (
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title={`Leave Application — ${selectedRequest.employeeName}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-slate-900">{selectedRequest.employeeName}</h4>
                <p className="text-xs text-slate-500">
                  {selectedRequest.role} • {selectedRequest.department} ({selectedRequest.employeeId})
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  selectedRequest.status === 'Approved'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : selectedRequest.status === 'Rejected'
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}
              >
                {selectedRequest.status} ({selectedRequest.reviewStage})
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Leave Type</span>
                <div className="text-sm font-bold text-slate-800">{selectedRequest.leaveType}</div>
                <div className="text-slate-500">Duration: {selectedRequest.totalDays} Days</div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Dates Requested</span>
                <div className="text-sm font-bold text-slate-800 font-mono">
                  {selectedRequest.fromDate} to {selectedRequest.toDate}
                </div>
                <div className="text-slate-500">Applied on: {selectedRequest.applicationDate}</div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Reason for Absence</label>
              <div className="mt-1 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed font-medium">
                {selectedRequest.reason}
              </div>
            </div>

            {selectedRequest.replacementMember && (
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Covering / Replacement Staff</label>
                <div className="mt-1 p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  {selectedRequest.replacementMember}
                </div>
              </div>
            )}

            {selectedRequest.attachmentUrl && (
              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-blue-900 font-medium">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Attached Certificate: {selectedRequest.attachmentUrl}</span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toast.info('Previewing medical certificate attachment...')}
                  className="text-xs bg-white"
                >
                  View Attachment
                </Button>
              </div>
            )}

            <div className="pt-3 flex items-center justify-end gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedRequest(null)}
                className="border border-slate-200"
              >
                Close
              </Button>
              {selectedRequest.status === 'Pending' && (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setRejectTarget(selectedRequest);
                      setSelectedRequest(null);
                    }}
                    className="border border-rose-200 text-rose-600 hover:bg-rose-50"
                  >
                    Reject
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      handleApprove(selectedRequest);
                      setSelectedRequest(null);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Approve Application
                  </Button>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Reject Reason Modal */}
      {rejectTarget && (
        <Modal
          isOpen={!!rejectTarget}
          onClose={() => setRejectTarget(null)}
          title={`Reject Application — ${rejectTarget.employeeName}`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              Please state the reason for rejecting {rejectTarget.employeeName}'s {rejectTarget.leaveType} request:
            </p>
            <textarea
              rows={3}
              placeholder="e.g. Inadequate shift coverage or urgent hospital audit scheduled..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setRejectTarget(null)}
                className="border border-slate-200"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleRejectConfirm}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
