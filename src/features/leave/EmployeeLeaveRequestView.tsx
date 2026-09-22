import React, { useState, useEffect, useMemo } from 'react';
import {
  CalendarCheck,
  Clock,
  Send,
  AlertTriangle,
  FileText,
  User,
  Building2,
  Phone,
  CheckCircle2,
  XCircle,
  Eye,
  Upload,
  Calendar,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useBranch } from '@/app/providers/BranchProvider';
import { useToast } from '@/app/providers/ToastProvider';
import { mockStore } from '@/services/mock/mockStore';
import { SuperDLeaveRequest } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';

export const EmployeeLeaveRequestView: React.FC = () => {
  const { currentRole, currentUser } = useAuth();
  const { branches } = useBranch();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'apply' | 'history'>('apply');
  const [myRequests, setMyRequests] = useState<SuperDLeaveRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<SuperDLeaveRequest | null>(null);

  // Form states
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [fromDate, setFromDate] = useState('2026-09-24');
  const [toDate, setToDate] = useState('2026-09-25');
  const [contactNo, setContactNo] = useState('+91 98401 23456');
  const [replacementMember, setReplacementMember] = useState('Meena Priya');
  const [reason, setReason] = useState('');
  const [attachmentName, setAttachmentName] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      const all = mockStore.getState().superDLeaveRequests;
      // Filter for current user's leaves or matching role
      setMyRequests([...all]);
    };
    update();
    const unsub = mockStore.subscribe(update);
    return unsub;
  }, []);

  // Calculate duration in days
  const calculatedDays = useMemo(() => {
    if (leaveType === 'Permission') return 1;
    if (!fromDate || !toDate) return 1;
    const start = new Date(fromDate).getTime();
    const end = new Date(toDate).getTime();
    if (isNaN(start) || isNaN(end) || end < start) return 1;
    const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
  }, [fromDate, toDate, leaveType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error('Please provide a reason for your leave request');
      return;
    }

    const branchName = currentUser?.primaryBranchId
      ? branches.find((b) => b._id === currentUser.primaryBranchId)?.name || 'Trichy Main Hospital'
      : 'Trichy Main Hospital';

    mockStore.addLeaveRequest({
      employeeId: currentUser?.employeeId || 'EMP-018',
      employeeName: currentUser?.name || 'Staff Member',
      role: currentRole,
      department: 'Clinical Operations',
      branchId: currentUser?.primaryBranchId || 'branch-try',
      branchName: branchName,
      applicationDate: '21-09-2026',
      leaveType: leaveType,
      fromDate: fromDate,
      toDate: toDate,
      totalDays: calculatedDays,
      reason: reason,
      replacementMember: replacementMember,
      attachmentUrl: attachmentName || undefined,
      status: 'Pending',
      reviewStage: 'Submitted',
    });

    toast.success('Your leave application has been submitted successfully for supervisor review');
    setReason('');
    setAttachmentName(null);
    setActiveTab('history');
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leave & Permission Request</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Submit formal leave applications, short permission slips, and track authorization progress
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('apply')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl border transition ${
              activeTab === 'apply'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Apply for Leave / Permission
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl border transition ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            My Applications History ({myRequests.length})
          </button>
        </div>
      </div>

      {/* 2-Day Advance Notice Policy Banner */}
      <div className="p-4 bg-amber-50/80 border border-amber-200/90 rounded-2xl flex items-start gap-3.5 shadow-sm">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <div className="font-bold text-amber-950">Super D Hospital Leave & Attendance Policy</div>
          <p className="text-amber-900 leading-relaxed">
            All planned leave requests must be submitted <strong className="font-semibold text-amber-950">at least 2 working days in advance</strong> to allow adequate shift roster adjustments. Permission slips (up to 3 hours) must be submitted 24 hours prior. Medical emergencies must be supported with relevant discharge or doctor slips.
          </p>
        </div>
      </div>

      {activeTab === 'apply' ? (
        /* Apply Form Card */
        <Card className="p-6 bg-white border border-slate-200/80 rounded-2xl shadow-sm max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Employee Leave / Permission Application Form
            </h2>

            {/* Read-only identity info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 border border-slate-200/70 rounded-xl text-xs">
              <div>
                <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Date of Application</span>
                <div className="font-bold text-slate-800 mt-1 font-mono">21-09-2026</div>
              </div>
              <div>
                <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Applicant Name</span>
                <div className="font-bold text-slate-800 mt-1">{currentUser?.name || 'Authorized Staff'}</div>
              </div>
              <div>
                <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Role / Department</span>
                <div className="font-bold text-slate-800 mt-1">{currentRole} • Super D Hospital</div>
              </div>
            </div>

            {/* Request inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Request Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Casual Leave">Casual Leave (CL)</option>
                  <option value="Sick Leave">Sick Leave (SL)</option>
                  <option value="Earned Leave">Earned Leave (EL)</option>
                  <option value="Permission">Permission (Hourly Shift Offset)</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                  <option value="Maternity/Paternity">Maternity / Paternity Leave</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Emergency Contact Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contactNo}
                  onChange={(e) => setContactNo(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            {/* Dates and Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  From Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  To Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Total Duration</label>
                <div className="px-3 py-2 text-xs bg-blue-50 border border-blue-200 rounded-xl font-bold text-blue-700">
                  {calculatedDays} {leaveType === 'Permission' ? 'Hours' : calculatedDays === 1 ? 'Day' : 'Days'}
                </div>
              </div>
            </div>

            {/* Replacement member */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Replacement / Covering Colleague Name
              </label>
              <input
                type="text"
                placeholder="Name of team member covering your duty during absence..."
                value={replacementMember}
                onChange={(e) => setReplacementMember(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Reason */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Reason for Absence <span className="text-rose-500">*</span>
                </label>
                <span className={`text-[10px] ${reason.length > 200 ? 'text-rose-500 font-bold' : 'text-slate-400'}`}>
                  {reason.length} / 200 Characters
                </span>
              </div>
              <textarea
                rows={3}
                maxLength={200}
                required
                placeholder="Briefly state reason for leave (max 200 characters)..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Attachment mock */}
            <div className="p-4 border border-dashed border-slate-300 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <Upload className="w-5 h-5 text-slate-400" />
                <div className="text-xs">
                  <div className="font-semibold text-slate-800">
                    {attachmentName ? attachmentName : 'Upload Medical Certificate or Supporting Document'}
                  </div>
                  <div className="text-[11px] text-slate-400">PDF, JPG, PNG up to 5MB (Optional for casual leaves)</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const demoFileName = 'medical_clearance_slip_sep2026.pdf';
                  setAttachmentName(demoFileName);
                  toast.success(`Attached ${demoFileName}`);
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 shadow-sm"
              >
                Attach File
              </button>
            </div>

            <div className="flex justify-end pt-3">
              <Button type="submit" variant="primary" size="md" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-2">
                <Send className="w-4 h-4" />
                <span>Submit Leave Application</span>
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        /* History Table */
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Applied Date</th>
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Leave Type</th>
                  <th className="py-3.5 px-4">Duration & Dates</th>
                  <th className="py-3.5 px-4">Replacement</th>
                  <th className="py-3.5 px-4">Reason</th>
                  <th className="py-3.5 px-4 text-center">Status / Stage</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {myRequests.map((req) => (
                  <tr
                    key={req._id}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                    onClick={() => setSelectedRequest(req)}
                  >
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{req.applicationDate}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{req.employeeName}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {req.leaveType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-800">
                      <div className="font-bold">
                        {req.totalDays} {req.leaveType === 'Permission' ? 'Hours' : 'Days'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {req.fromDate} - {req.toDate}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{req.replacementMember || '—'}</td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-600" title={req.reason}>
                      {req.reason}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStageBadgeStyle(
                          req.reviewStage
                        )}`}
                      >
                        {req.reviewStage}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRequest(req);
                        }}
                        className="px-2 py-1 text-xs bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-200"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details modal */}
      {selectedRequest && (
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title={`Leave Application Details — ${selectedRequest.employeeName}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{selectedRequest.employeeName}</h4>
                <p className="text-slate-500 text-[11px]">
                  {selectedRequest.role} • {selectedRequest.branchName}
                </p>
              </div>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-bold border ${getStageBadgeStyle(
                  selectedRequest.reviewStage
                )}`}
              >
                {selectedRequest.reviewStage}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Type</span>
                <div className="font-bold text-slate-800 text-sm mt-0.5">{selectedRequest.leaveType}</div>
                <div className="text-slate-500 text-[11px]">Duration: {selectedRequest.totalDays} Days</div>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Dates</span>
                <div className="font-bold text-slate-800 text-sm mt-0.5 font-mono">
                  {selectedRequest.fromDate} to {selectedRequest.toDate}
                </div>
                <div className="text-slate-500 text-[11px]">Applied on {selectedRequest.applicationDate}</div>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Reason</span>
              <p className="mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed font-medium">
                {selectedRequest.reason}
              </p>
            </div>

            {selectedRequest.replacementMember && (
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Covering Colleague</span>
                <div className="mt-1 p-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800">
                  {selectedRequest.replacementMember}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedRequest(null)}
                className="border border-slate-200"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
