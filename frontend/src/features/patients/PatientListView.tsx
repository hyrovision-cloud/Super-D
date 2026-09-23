import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Search,
  Building2,
  Calendar,
  AlertCircle,
  Eye,
  Phone,
  Droplet,
} from 'lucide-react';
import { Patient, PatientStatus } from '@/types';
import { patientService } from '@/services/mock/patientService';
import { useBranch } from '@/app/providers/BranchProvider';
import { useToast } from '@/app/providers/ToastProvider';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { DataTable, Column } from '@/components/tables/DataTable';
import { MobileRecordCard } from '@/components/tables/MobileRecordCard';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/app/providers/AuthProvider';

export const PatientListView: React.FC = () => {
  const { selectedBranchId, branches } = useBranch();
  const toast = useToast();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const canCreatePatient = hasPermission('patient.create');

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PatientStatus | 'ALL'>('ALL');

  // Registration modal
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [medicalAlertsInput, setMedicalAlertsInput] = useState('');
  const [branchId, setBranchId] = useState(selectedBranchId !== 'all' ? selectedBranchId : 'branch-trichy');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRel, setEmergencyRel] = useState('Spouse');

  const fetchPatients = () => {
    patientService
      .getPatients({
        branchId: selectedBranchId,
        status: statusFilter,
        searchQuery,
      })
      .then((data) => {
        setPatients(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPatients();
  }, [selectedBranchId, statusFilter, searchQuery]);

  const handleRegisterPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || !phone) {
      toast.error('Please enter patient name, age, and phone number');
      return;
    }

    const selectedBranch = branches.find((b) => b._id === branchId);

    try {
      const created = await patientService.registerPatient({
        name,
        age: Number(age),
        gender,
        phone,
        email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@fictionalmail.com`,
        address: address || 'Tiruchirappalli, Tamil Nadu',
        bloodGroup,
        medicalAlerts: medicalAlertsInput
          ? medicalAlertsInput.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        branchId,
        branchName: selectedBranch?.name || 'Trichy Main Hospital',
        status: 'ACTIVE',
        emergencyContact: {
          name: emergencyName || 'Primary Family Member',
          phone: emergencyPhone || phone,
          relationship: emergencyRel,
        },
      });

      toast.success(`Patient ${created.name} registered with ID ${created.patientNumber}!`);
      setIsRegisterModalOpen(false);
      // Reset form
      setName('');
      setAge('');
      setPhone('');
      setEmail('');
      setAddress('');
      setMedicalAlertsInput('');
    } catch {
      toast.error('Failed to register patient');
    }
  };

  const getStatusBadgeVariant = (status: PatientStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'ADMITTED':
        return 'critical';
      case 'FOLLOW_UP':
        return 'info';
      case 'DISCHARGED':
        return 'teal';
      default:
        return 'neutral';
    }
  };

  const columns: Column<Patient>[] = [
    {
      key: 'patientNumber',
      header: 'Patient ID',
      sortable: true,
      className: 'font-mono font-semibold text-brand-blue text-xs',
    },
    {
      key: 'name',
      header: 'Patient Details',
      sortable: true,
      render: (p) => (
        <div>
          <div className="font-bold text-text-main text-xs">{p.name}</div>
          <div className="text-[11px] text-text-muted">
            {p.age} yrs • {p.gender} • <span className="font-semibold">{p.bloodGroup}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Contact',
      render: (p) => (
        <div className="text-xs text-text-secondary flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-text-muted shrink-0" />
          <span>{p.phone}</span>
        </div>
      ),
    },
    {
      key: 'branchName',
      header: 'Registered Branch',
      render: (p) => (
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <Building2 className="w-3.5 h-3.5 text-text-muted shrink-0" />
          <span>{p.branchName}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (p) => (
        <Badge variant={getStatusBadgeVariant(p.status)} size="sm" dot>
          {p.status}
        </Badge>
      ),
    },
    {
      key: 'medicalAlerts',
      header: 'Alerts',
      render: (p) =>
        p.medicalAlerts && p.medicalAlerts.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {p.medicalAlerts.slice(0, 2).map((alert, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded text-[10px] bg-red-50 text-red-700 border border-red-100 font-semibold"
              >
                {alert}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-[11px] text-slate-400">None</span>
        ),
    },
    {
      key: 'actions',
      header: 'Action',
      className: 'text-right',
      render: (p) => (
        <>
          {canCreatePatient && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/patients/${p._id}`);
              }}
              leftIcon={<Eye className="w-3.5 h-3.5" />}
            >
              Profile
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight">
            Patient Registry (Spec PAT-001, PAT-002)
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Search patient records, view clinical profiles, and register new patients.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsRegisterModalOpen(true)}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          Register New Patient
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-3.5 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search patient by name, patient ID, or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-surface-border focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs text-text-secondary font-medium whitespace-nowrap">
            Status Filter:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs border border-surface-border rounded-lg px-2.5 py-1.5 bg-white text-text-main focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="ADMITTED">Admitted</option>
            <option value="FOLLOW_UP">Follow Up</option>
            <option value="DISCHARGED">Discharged</option>
          </select>
        </div>
      </Card>

      {/* Responsive View: Desktop Table & Mobile Cards */}
      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <DataTable
              columns={columns}
              data={patients}
              keyExtractor={(p) => p._id}
              pageSize={8}
              onRowClick={(p) => navigate(`/patients/${p._id}`)}
              emptyTitle="No patients found"
              emptyDescription="No patients match your search or status filter."
              emptyActionLabel={canCreatePatient ? 'Register First Patient' : undefined}
              onEmptyAction={canCreatePatient ? () => setIsRegisterModalOpen(true) : undefined}
            />
          </div>

          {/* Mobile Card Stack */}
          <div className="md:hidden space-y-3">
            {patients.map((patient) => (
              <MobileRecordCard
                key={patient._id}
                title={patient.name}
                subtitle={`${patient.patientNumber} • ${patient.age}y / ${patient.gender}`}
                badge={
                  <Badge variant={getStatusBadgeVariant(patient.status)} size="sm" dot>
                    {patient.status}
                  </Badge>
                }
                fields={[
                  { label: 'Phone', value: patient.phone },
                  { label: 'Branch', value: patient.branchName },
                  { label: 'Blood Group', value: patient.bloodGroup },
                  {
                    label: 'Alerts',
                    value: patient.medicalAlerts.length > 0 ? patient.medicalAlerts[0] : 'None',
                  },
                ]}
                actions={
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate(`/patients/${patient._id}`)}
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                  >
                    Open Patient Profile
                  </Button>
                }
              />
            ))}
          </div>
        </>
      )}

      {/* Patient Registration Modal (Spec PAT-001) */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title="Register New Patient (Spec PAT-001)"
        description="Patient ID will be automatically generated based on the selected hospital branch"
        maxWidth="xl"
      >
        <form onSubmit={handleRegisterPatient} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-medium text-text-main mb-1">Patient Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. S. Meenakshi Sundaram"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-text-main mb-1">Age *</label>
              <input
                type="number"
                required
                placeholder="e.g. 45"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-text-main mb-1">Gender *</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs bg-white focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-text-main mb-1">Phone Number *</label>
              <input
                type="text"
                required
                placeholder="+91 94430 00000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-text-main mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs bg-white focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-text-main mb-1">Registering Hospital Branch *</label>
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
              <label className="block font-medium text-text-main mb-1">Email ID</label>
              <input
                type="email"
                placeholder="patient@fictionalmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-text-main mb-1">Residential Address</label>
            <input
              type="text"
              placeholder="Door No, Street Name, Area, City"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-text-main mb-1">
              Medical Alerts (Comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Penicillin Allergy, Diabetic, Cardiac Stent"
              value={medicalAlertsInput}
              onChange={(e) => setMedicalAlertsInput(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
            <div className="font-semibold text-text-main text-xs">Emergency Contact Details</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Contact Name"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                className="px-2.5 py-1.5 border rounded-lg border-surface-border text-xs bg-white"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="px-2.5 py-1.5 border rounded-lg border-surface-border text-xs bg-white"
              />
              <input
                type="text"
                placeholder="Relationship (e.g. Spouse, Son)"
                value={emergencyRel}
                onChange={(e) => setEmergencyRel(e.target.value)}
                className="px-2.5 py-1.5 border rounded-lg border-surface-border text-xs bg-white"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsRegisterModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Complete Registration
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
