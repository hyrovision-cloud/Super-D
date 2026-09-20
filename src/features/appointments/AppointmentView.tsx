import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Search,
  Building2,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Stethoscope,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Appointment, AppointmentStatus, DoctorProfile } from '@/types';
import { appointmentService } from '@/services/mock/appointmentService';
import { patientService } from '@/services/mock/patientService';
import { useBranch } from '@/app/providers/BranchProvider';
import { useToast } from '@/app/providers/ToastProvider';
import { mockStore } from '@/services/mock/mockStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { DataTable, Column } from '@/components/tables/DataTable';
import { MobileRecordCard } from '@/components/tables/MobileRecordCard';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { formatDateTime, formatDate, formatTime } from '@/lib/utils';

export const AppointmentView: React.FC = () => {
  const { selectedBranchId, branches } = useBranch();
  const toast = useToast();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'ALL'>('ALL');
  const [doctorFilter, setDoctorFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'day'>('list');

  // Booking Modal
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [branchId, setBranchId] = useState(selectedBranchId !== 'all' ? selectedBranchId : 'branch-try');
  const [dateTime, setDateTime] = useState('');
  const [reason, setReason] = useState('');
  const [priority, setPriority] = useState<'NORMAL' | 'URGENT' | 'EMERGENCY'>('NORMAL');
  const [visitType, setVisitType] = useState<'OPD' | 'FOLLOW_UP' | 'CONSULTATION' | 'EMERGENCY'>('OPD');

  // Cancel Modal
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const fetchAppointments = () => {
    Promise.all([
      appointmentService.getAppointments({
        branchId: selectedBranchId,
        doctorId: doctorFilter,
        status: statusFilter,
      }),
      appointmentService.getDoctors(selectedBranchId),
    ]).then(([appts, docs]) => {
      setAppointments(appts);
      setDoctors(docs);
      if (docs.length > 0 && !doctorId) {
        setDoctorId(docs[0]._id);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchAppointments();
    const unsubscribe = mockStore.subscribe(() => {
      fetchAppointments();
    });
    return unsubscribe;
  }, [selectedBranchId, statusFilter, doctorFilter]);

  const handleStatusTransition = async (appointmentId: string, nextStatus: AppointmentStatus) => {
    try {
      await appointmentService.transitionStatus(appointmentId, nextStatus);
      toast.success(`Appointment marked as ${nextStatus.replace('_', ' ')}`);
    } catch {
      toast.error('Failed to update appointment status');
    }
  };

  const handleConfirmCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelTarget || !cancelReason.trim()) {
      toast.error('Please specify a cancellation reason');
      return;
    }

    try {
      await appointmentService.transitionStatus(cancelTarget._id, 'CANCELLED', cancelReason.trim());
      toast.success(`Appointment ${cancelTarget.appointmentNumber} cancelled`);
      setCancelTarget(null);
      setCancelReason('');
    } catch {
      toast.error('Failed to cancel appointment');
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone || !doctorId || !dateTime) {
      toast.error('Please fill in required fields');
      return;
    }

    const selectedDoc = doctors.find((d) => d._id === doctorId);
    const selectedBr = branches.find((b) => b._id === branchId);

    try {
      const booked = await appointmentService.bookAppointment({
        patientId: `pat-${Date.now()}`,
        patientName,
        patientPhone,
        branchId,
        branchName: selectedBr?.name || 'Trichy Main Hospital',
        doctorId,
        doctorName: selectedDoc?.name || 'Dr. Priya Ramanathan',
        department: selectedDoc?.department || 'General Medicine',
        dateTime: new Date(dateTime).toISOString(),
        visitType,
        status: 'SCHEDULED',
        reason: reason || 'Routine OPD consultation',
        priority,
      });

      toast.success(`Appointment ${booked.appointmentNumber} scheduled!`);
      setIsBookModalOpen(false);
      setPatientName('');
      setPatientPhone('');
      setReason('');
    } catch {
      toast.error('Failed to schedule appointment');
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'SCHEDULED':
        return <Badge variant="info" size="sm">Scheduled</Badge>;
      case 'CONFIRMED':
        return <Badge variant="teal" size="sm">Confirmed</Badge>;
      case 'CHECKED_IN':
        return <Badge variant="warning" size="sm" dot>Checked In</Badge>;
      case 'IN_CONSULTATION':
        return <Badge variant="navy" size="sm" dot>In Consultation</Badge>;
      case 'COMPLETED':
        return <Badge variant="success" size="sm">Completed</Badge>;
      case 'CANCELLED':
        return <Badge variant="critical" size="sm">Cancelled</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  const columns: Column<Appointment>[] = [
    {
      key: 'appointmentNumber',
      header: 'Appt No',
      sortable: true,
      className: 'font-mono text-xs font-semibold text-brand-blue',
    },
    {
      key: 'patientName',
      header: 'Patient Details',
      sortable: true,
      render: (a) => (
        <div>
          <div className="font-bold text-text-main text-xs">{a.patientName}</div>
          <div className="text-[11px] text-text-muted">{a.patientPhone}</div>
        </div>
      ),
    },
    {
      key: 'doctorName',
      header: 'Doctor / Specialty',
      render: (a) => (
        <div>
          <div className="font-semibold text-text-main text-xs">{a.doctorName}</div>
          <div className="text-[11px] text-text-muted">{a.department}</div>
        </div>
      ),
    },
    {
      key: 'dateTime',
      header: 'Date & Time',
      sortable: true,
      render: (a) => (
        <div className="text-xs">
          <div className="font-medium text-text-main">{formatDate(a.dateTime)}</div>
          <div className="text-[11px] text-text-muted">{formatTime(a.dateTime)}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (a) => getStatusBadge(a.status),
    },
    {
      key: 'actions',
      header: 'Workflow Actions',
      className: 'text-right',
      render: (a) => (
        <div className="flex items-center justify-end gap-1.5">
          {a.status === 'SCHEDULED' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusTransition(a._id, 'CONFIRMED')}
            >
              Confirm
            </Button>
          )}
          {a.status === 'CONFIRMED' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleStatusTransition(a._id, 'CHECKED_IN')}
            >
              Check In
            </Button>
          )}
          {a.status === 'CHECKED_IN' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleStatusTransition(a._id, 'IN_CONSULTATION')}
            >
              Start Consult
            </Button>
          )}
          {a.status === 'IN_CONSULTATION' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleStatusTransition(a._id, 'COMPLETED')}
            >
              Complete
            </Button>
          )}
          {a.status !== 'COMPLETED' && a.status !== 'CANCELLED' && (
            <button
              onClick={() => setCancelTarget(a)}
              className="px-2 py-1 text-xs text-status-critical hover:bg-red-50 rounded font-medium transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight">
            Appointment Management (Spec APT-001–003)
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Book consultations, manage doctor schedules, and track patient status workflows.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="inline-flex rounded-lg border border-surface-border bg-white p-1 shadow-2xs text-xs">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-brand-blue text-white shadow-xs'
                  : 'text-text-secondary hover:text-text-main'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                viewMode === 'day'
                  ? 'bg-brand-blue text-white shadow-xs'
                  : 'text-text-secondary hover:text-text-main'
              }`}
            >
              Day Schedule
            </button>
          </div>

          <Button
            size="sm"
            onClick={() => setIsBookModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Book Appointment
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-3.5 flex flex-col sm:flex-row items-center gap-3">
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
            <option value="SCHEDULED">Scheduled</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CHECKED_IN">Checked In</option>
            <option value="IN_CONSULTATION">In Consultation</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs text-text-secondary font-medium whitespace-nowrap">
            Doctor:
          </label>
          <select
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            className="text-xs border border-surface-border rounded-lg px-2.5 py-1.5 bg-white text-text-main focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          >
            <option value="all">All Doctors</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} ({d.department})
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Content View */}
      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : viewMode === 'list' ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <DataTable
              columns={columns}
              data={appointments}
              keyExtractor={(a) => a._id}
              pageSize={8}
              emptyTitle="No appointments scheduled"
              emptyDescription="No appointments match the selected status or doctor filter."
            />
          </div>

          {/* Mobile Card Stack */}
          <div className="md:hidden space-y-3">
            {appointments.map((appt) => (
              <MobileRecordCard
                key={appt._id}
                title={appt.patientName}
                subtitle={`${appt.appointmentNumber} • ${appt.visitType}`}
                badge={getStatusBadge(appt.status)}
                fields={[
                  { label: 'Doctor', value: appt.doctorName },
                  { label: 'Specialty', value: appt.department },
                  { label: 'Time', value: formatDateTime(appt.dateTime) },
                  { label: 'Priority', value: appt.priority },
                ]}
                actions={
                  <div className="flex items-center gap-2 w-full">
                    {appt.status === 'SCHEDULED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleStatusTransition(appt._id, 'CONFIRMED')}
                      >
                        Confirm
                      </Button>
                    )}
                    {appt.status === 'CONFIRMED' && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleStatusTransition(appt._id, 'CHECKED_IN')}
                      >
                        Check In
                      </Button>
                    )}
                    {appt.status === 'CHECKED_IN' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleStatusTransition(appt._id, 'IN_CONSULTATION')}
                      >
                        Start Consult
                      </Button>
                    )}
                    {appt.status === 'IN_CONSULTATION' && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleStatusTransition(appt._id, 'COMPLETED')}
                      >
                        Complete
                      </Button>
                    )}
                    {appt.status !== 'COMPLETED' && appt.status !== 'CANCELLED' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => setCancelTarget(appt)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                }
              />
            ))}
          </div>
        </>
      ) : (
        /* Day Schedule / Timeline View */
        <div className="space-y-3">
          <div className="text-xs font-semibold text-text-secondary">
            Today's Scheduled Consultations ({appointments.length})
          </div>
          <div className="grid grid-cols-1 gap-3">
            {appointments.map((appt) => (
              <Card key={appt._id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-center shrink-0 min-w-[70px]">
                    <span className="text-[11px] font-bold text-brand-blue block">
                      {formatTime(appt.dateTime)}
                    </span>
                    <span className="text-[10px] text-text-muted uppercase">Today</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-text-main">{appt.patientName}</h4>
                      <span className="font-mono text-xs text-text-muted">
                        ({appt.appointmentNumber})
                      </span>
                      {getStatusBadge(appt.status)}
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Consultant: <strong className="text-text-main">{appt.doctorName}</strong> •{' '}
                      {appt.department} • Visit: {appt.visitType}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5 italic">"{appt.reason}"</p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2">
                  {appt.status === 'CONFIRMED' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStatusTransition(appt._id, 'CHECKED_IN')}
                    >
                      Check In
                    </Button>
                  )}
                  {appt.status === 'CHECKED_IN' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleStatusTransition(appt._id, 'IN_CONSULTATION')}
                    >
                      Start Consult
                    </Button>
                  )}
                  {appt.status === 'IN_CONSULTATION' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStatusTransition(appt._id, 'COMPLETED')}
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Book Appointment Modal */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title="Schedule OPD Appointment (Spec APT-001)"
        description="Book consultation slot for an existing or new patient"
        maxWidth="lg"
      >
        <form onSubmit={handleBookAppointment} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-text-main mb-1">Patient Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. K. Ramasamy"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-text-main mb-1">Contact Phone *</label>
              <input
                type="text"
                required
                placeholder="+91 94430 00000"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-text-main mb-1">Select Hospital Branch *</label>
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
              <label className="block font-medium text-text-main mb-1">Consulting Doctor *</label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs bg-white focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              >
                {doctors.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({d.specialization})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-text-main mb-1">Date & Time *</label>
              <input
                type="datetime-local"
                required
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-text-main mb-1">Visit Type</label>
              <select
                value={visitType}
                onChange={(e) => setVisitType(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs bg-white focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              >
                <option value="OPD">OPD Consultation</option>
                <option value="FOLLOW_UP">Follow Up</option>
                <option value="CONSULTATION">Specialist Opinion</option>
                <option value="EMERGENCY">Emergency</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-text-main mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs bg-white focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              >
                <option value="NORMAL">Normal</option>
                <option value="URGENT">Urgent</option>
                <option value="EMERGENCY">Emergency</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-text-main mb-1">Clinical Reason / Chief Complaint</label>
            <textarea
              rows={2}
              placeholder="e.g. Chest discomfort on exertion, blood pressure review"
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
              onClick={() => setIsBookModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Confirm Booking
            </Button>
          </div>
        </form>
      </Modal>

      {/* Cancel Appointment Reason Modal */}
      <Modal
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        title="Cancel Appointment"
        description={`Cancellation reason is mandatory for auditing (${cancelTarget?.appointmentNumber})`}
        maxWidth="md"
      >
        <form onSubmit={handleConfirmCancel} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-medium text-text-main mb-1">
              Cancellation Reason *
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Patient requested reschedule due to travel / Doctor on emergency surgery"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-status-critical/30 focus:border-status-critical focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCancelTarget(null)}
            >
              Back
            </Button>
            <Button type="submit" variant="danger" size="sm">
              Confirm Cancellation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
