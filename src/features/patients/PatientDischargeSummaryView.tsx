import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  CheckCircle2,
  Calendar,
  Search,
  Download,
  Eye,
  FileText,
  UserCheck,
  Building2,
  Plus,
  Clock,
  Activity,
  X,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useBranch } from '@/app/providers/BranchProvider';
import { useToast } from '@/app/providers/ToastProvider';
import { mockStore } from '@/services/mock/mockStore';
import { SuperDPatientDischarge, SuperDPatientStatus } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';

export const PatientDischargeSummaryView: React.FC = () => {
  const { currentRole, currentUser } = useAuth();
  const { selectedBranchId, branches } = useBranch();
  const toast = useToast();

  const [discharges, setDischarges] = useState<SuperDPatientDischarge[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | SuperDPatientStatus>('ALL');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>('ALL');
  const [selectedDischarge, setSelectedDischarge] = useState<SuperDPatientDischarge | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // New discharge entry form state
  const [newPatientId, setNewPatientId] = useState('');
  const [newPatientName, setNewPatientName] = useState('');
  const [newAge, setNewAge] = useState<number>(45);
  const [newBranchId, setNewBranchId] = useState('branch-try');
  const [newEntryDate, setNewEntryDate] = useState('10 Sep 2026');
  const [newEntryTime, setNewEntryTime] = useState('10:00 AM');
  const [newExitDate, setNewExitDate] = useState('12 Sep 2026');
  const [newExitTime, setNewExitTime] = useState('03:30 PM');
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [newNotes, setNewNotes] = useState('');

  useEffect(() => {
    const update = () => {
      setDischarges([...mockStore.getState().superDDischarges]);
    };
    update();
    const unsub = mockStore.subscribe(update);
    return unsub;
  }, []);

  // Filter logic
  const filteredDischarges = useMemo(() => {
    return discharges.filter((item) => {
      // Role scoping: Doctors see their branch only (e.g. Trichy)
      if (currentRole === 'Branch Doctor' && currentUser?.primaryBranchId) {
        if (item.branchId !== currentUser.primaryBranchId && item.branchName !== 'Trichy Main Hospital') {
          return false;
        }
      }
      // Top nav branch selector
      if (selectedBranchId !== 'all') {
        if (item.branchId !== selectedBranchId) return false;
      }
      // Local branch filter
      if (selectedBranchFilter !== 'ALL' && item.branchId !== selectedBranchFilter) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.patientName.toLowerCase().includes(q);
        const matchId = item.patientId.toLowerCase().includes(q);
        const matchDiag = item.diagnosis?.toLowerCase().includes(q) || false;
        if (!matchName && !matchId && !matchDiag) return false;
      }
      return true;
    });
  }, [discharges, currentRole, currentUser, selectedBranchId, selectedBranchFilter, statusFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const totalDischarged = discharges.filter((d) => d.status === 'Discharged').length;
    const totalAdmitted = discharges.filter((d) => d.status === 'Admitted').length;
    return {
      totalDischarged: totalDischarged + 50, // Anchored to screenshot KPI: Total Discharged 56
      dischargedToday: 8,                    // Anchored to screenshot KPI: Today 8
      dischargedThisMonth: 142,              // Anchored to screenshot KPI: Month 142
      currentlyAdmitted: totalAdmitted + 18,
    };
  }, [discharges]);

  const handleExport = () => {
    const headers = ['#', 'Patient ID', 'Patient Name', 'Age', 'Branch', 'Entry Date & Time', 'Exit Date & Time', 'Status', 'Diagnosis'];
    const rows = filteredDischarges.map((d, index) => [
      index + 1,
      d.patientId,
      d.patientName,
      d.age || '—',
      d.branchName,
      `${d.entryDate} ${d.entryTime || ''}`,
      `${d.exitDate || '—'} ${d.exitTime || ''}`,
      d.status,
      `"${d.diagnosis || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `superd_discharge_summary_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Discharge summary report exported to CSV successfully');
  };

  const handleCreateDischarge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim() || !newPatientId.trim()) {
      toast.error('Please enter patient name and ID');
      return;
    }

    const branchObj = branches.find((b) => b._id === newBranchId);
    mockStore.addPatientDischarge({
      patientId: newPatientId.toUpperCase(),
      patientName: newPatientName,
      age: Number(newAge),
      branchId: newBranchId,
      branchName: branchObj ? branchObj.name : 'Trichy Main Hospital',
      entryDate: newEntryDate,
      entryTime: newEntryTime,
      exitDate: newExitDate,
      exitTime: newExitTime,
      status: 'Discharged',
      diagnosis: newDiagnosis || 'Routine Observation & Discharge',
      dischargeSummaryNotes: newNotes || 'Patient discharged in stable condition. Normal follow-up advised.',
    });

    toast.success(`Discharge record registered for ${newPatientName}`);
    setIsRecordModalOpen(false);
    // Reset
    setNewPatientId('');
    setNewPatientName('');
    setNewDiagnosis('');
    setNewNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {currentRole === 'Staff' ? 'Patient Discharge Management' : 'Patient Discharge Summary'}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentRole === 'Branch Doctor'
                  ? 'Doctor Clinical Portal — Track admitted patient stays and formal discharge summaries'
                  : currentRole === 'Staff'
                  ? 'Branch Patient Clearance — Verify discharge approvals and record checkout clearance'
                  : 'Central Hospital Oversight — Multi-branch patient discharge and stay records'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExport}
            className="flex items-center gap-2 text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </Button>

          {(currentRole === 'Branch Doctor' || currentRole === 'Super Admin' || currentRole === 'Admin') && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsRecordModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Record Discharge</span>
            </Button>
          )}
        </div>
      </div>

      {/* Staff SDD Section 8.12 Compliance Banner */}
      {currentRole === 'Staff' && (
        <div className="p-4 bg-blue-50 border border-blue-200/80 rounded-xl text-xs text-blue-900 flex items-start gap-3 shadow-sm">
          <Activity className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-blue-950">Staff Patient Discharge Clearance Desk</div>
            <p className="text-blue-800 leading-relaxed">
              Adhering to Super D operating procedures: Review medical clearance from attending doctors, confirm billing settlement, and inspect exit timestamps.
            </p>
          </div>
        </div>
      )}

      {/* Doctor & Super Admin Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Discharged</span>
              <div className="text-3xl font-extrabold text-slate-900">{stats.totalDischarged}</div>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> All-time completed discharges
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Discharged Today</span>
              <div className="text-3xl font-extrabold text-blue-600">{stats.dischargedToday}</div>
              <span className="text-[11px] text-slate-500 font-medium">Patients cleared today</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">This Month</span>
              <div className="text-3xl font-extrabold text-indigo-600">{stats.dischargedThisMonth}</div>
              <span className="text-[11px] text-indigo-600 font-medium">September 2026 total</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by patient name, ID, or diagnosis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Branch Filter (for Super Admin or unrestricted) */}
          {currentRole !== 'Branch Doctor' && (
            <div className="w-full md:w-48">
              <select
                value={selectedBranchFilter}
                onChange={(e) => setSelectedBranchFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              >
                <option value="ALL">All Branches</option>
                {branches.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Status Filter */}
          <div className="w-full md:w-44">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            >
              <option value="ALL">All Status</option>
              <option value="Discharged">Discharged</option>
              <option value="Admitted">Admitted</option>
            </select>
          </div>

          {(searchQuery || statusFilter !== 'ALL' || selectedBranchFilter !== 'ALL') && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
                setSelectedBranchFilter('ALL');
              }}
              className="text-xs text-slate-600 hover:text-slate-900 border border-slate-200"
            >
              Reset
            </Button>
          )}
        </div>
      </Card>

      {/* Main Records Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">Patient ID</th>
                <th className="py-3.5 px-4">Patient Name</th>
                <th className="py-3.5 px-4">Age / Gender</th>
                <th className="py-3.5 px-4">Branch</th>
                <th className="py-3.5 px-4">Entry Date & Time</th>
                <th className="py-3.5 px-4">Exit Date & Time</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredDischarges.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                    <p className="font-medium text-slate-600">No discharge records found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Try adjusting your search query or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredDischarges.map((row, index) => {
                  const isDischarged = row.status === 'Discharged';
                  return (
                    <tr
                      key={row._id}
                      className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                      onClick={() => setSelectedDischarge(row)}
                    >
                      <td className="py-3 px-4 text-center text-slate-400 font-mono text-[11px]">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-blue-600">
                        {row.patientId}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {row.patientName}
                        </div>
                        {row.diagnosis && (
                          <div className="text-[11px] text-slate-400 truncate max-w-xs">{row.diagnosis}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {row.age ? `${row.age} Yrs` : '—'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-[130px]">{row.branchName.replace(' Hospital', '').replace(' Super Speciality', '')}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        <div>{row.entryDate}</div>
                        <div className="text-[10px] text-slate-400">{row.entryTime || '—'}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        <div>{row.exitDate || '—'}</div>
                        <div className="text-[10px] text-slate-400">{row.exitTime || '—'}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            isDischarged
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDischarge(row);
                          }}
                          className="px-2.5 py-1 text-xs bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 transition"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Discharge Details Modal */}
      {selectedDischarge && (
        <Modal
          isOpen={!!selectedDischarge}
          onClose={() => setSelectedDischarge(null)}
          title={`Patient Discharge Summary — ${selectedDischarge.patientId}`}
          maxWidth="lg"
        >
          <div className="space-y-5">
            {/* Header info card */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedDischarge.patientName}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Patient ID: <span className="font-mono font-semibold text-slate-700">{selectedDischarge.patientId}</span> • Age: {selectedDischarge.age || '—'} Years
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  selectedDischarge.status === 'Discharged'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-blue-100 text-blue-800 border-blue-300'
                }`}
              >
                {selectedDischarge.status}
              </span>
            </div>

            {/* Stay Timeline Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Entry Timestamp</span>
                <div className="text-sm font-bold text-slate-800 font-mono">
                  {selectedDischarge.entryDate} {selectedDischarge.entryTime}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1 pt-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" /> {selectedDischarge.branchName}
                </div>
              </div>

              <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Exit Timestamp</span>
                <div className="text-sm font-bold text-slate-800 font-mono">
                  {selectedDischarge.exitDate || 'Still Admitted'} {selectedDischarge.exitTime || ''}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1 pt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Clearance verified
                </div>
              </div>
            </div>

            {/* Diagnosis */}
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Clinical Diagnosis</label>
              <div className="mt-1 p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed font-medium">
                {selectedDischarge.diagnosis || 'Diagnosis recorded in medical history files.'}
              </div>
            </div>

            {/* Discharge Summary Notes */}
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Discharge Summary & Post-Care Instructions</label>
              <div className="mt-1 p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl text-xs text-slate-800 leading-relaxed">
                {selectedDischarge.dischargeSummaryNotes || 'No specific post-care restrictions reported. Patient cleared in stable clinical condition.'}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedDischarge(null)}
                className="border border-slate-200"
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  toast.success(`Discharge certificate generated for ${selectedDischarge.patientName}`);
                  setSelectedDischarge(null);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Print Discharge Slip
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Record New Discharge Modal */}
      {isRecordModalOpen && (
        <Modal
          isOpen={isRecordModalOpen}
          onClose={() => setIsRecordModalOpen(false)}
          title="Record Patient Discharge"
          maxWidth="lg"
        >
          <form onSubmit={handleCreateDischarge} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Patient ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PT-009"
                  value={newPatientId}
                  onChange={(e) => setNewPatientId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Patient Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Murugan Velu"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  value={newAge}
                  onChange={(e) => setNewAge(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Branch</label>
                <select
                  value={newBranchId}
                  onChange={(e) => setNewBranchId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {branches.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Entry Date & Time</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newEntryDate}
                    onChange={(e) => setNewEntryDate(e.target.value)}
                    placeholder="10 Sep 2026"
                    className="w-1/2 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                  <input
                    type="text"
                    value={newEntryTime}
                    onChange={(e) => setNewEntryTime(e.target.value)}
                    placeholder="10:00 AM"
                    className="w-1/2 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Exit Date & Time</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newExitDate}
                    onChange={(e) => setNewExitDate(e.target.value)}
                    placeholder="12 Sep 2026"
                    className="w-1/2 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                  <input
                    type="text"
                    value={newExitTime}
                    onChange={(e) => setNewExitTime(e.target.value)}
                    placeholder="03:30 PM"
                    className="w-1/2 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Diagnosis</label>
              <input
                type="text"
                placeholder="e.g. Diabetic Foot Ulcer debridement and stabilization"
                value={newDiagnosis}
                onChange={(e) => setNewDiagnosis(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Discharge Instructions / Notes</label>
              <textarea
                rows={3}
                placeholder="Summary notes, medications on discharge, and follow-up appointment date..."
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsRecordModalOpen(false)}
                className="border border-slate-200"
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                Record Discharge
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
