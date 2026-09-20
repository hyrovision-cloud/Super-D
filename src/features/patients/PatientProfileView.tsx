import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building2,
  FileText,
  Pill,
  HeartPulse,
  Activity,
  Plus,
  ArrowLeft,
  FileDown,
  Printer,
  ShieldAlert,
} from 'lucide-react';
import {
  Patient,
  MedicalRecord,
  Prescription,
  DischargeSummary,
  PatientStatus,
} from '@/types';
import { patientService } from '@/services/mock/patientService';
import { appointmentService } from '@/services/mock/appointmentService';
import { useToast } from '@/app/providers/ToastProvider';
import { mockStore } from '@/services/mock/mockStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Tabs, TabItem } from '@/components/ui/Tabs';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate, formatDateTime } from '@/lib/utils';

export const PatientProfileView: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [dischargeSummary, setDischargeSummary] = useState<DischargeSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Add Medical Record Modal
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [notes, setNotes] = useState('');
  const [bp, setBp] = useState('120/80 mmHg');
  const [pulse, setPulse] = useState('74');
  const [spo2, setSpo2] = useState('99%');
  const [temp, setTemp] = useState('98.4 °F');
  const [weight, setWeight] = useState('68');

  useEffect(() => {
    if (!patientId) return;

    let isMounted = true;
    Promise.all([
      patientService.getPatientById(patientId),
      patientService.getMedicalRecords(patientId),
      patientService.getPrescriptions(patientId),
      patientService.getDischargeSummary(patientId),
    ]).then(([pat, records, prscs, disc]) => {
      if (isMounted) {
        setPatient(pat || null);
        setMedicalRecords(records);
        setPrescriptions(prscs);
        setDischargeSummary(disc || null);
        setLoading(false);
      }
    });

    const unsubscribe = mockStore.subscribe(() => {
      patientService.getPatientById(patientId).then((pat) => {
        if (isMounted && pat) setPatient(pat);
      });
      patientService.getMedicalRecords(patientId).then((records) => {
        if (isMounted) setMedicalRecords(records);
      });
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [patientId]);

  const handleStatusChange = async (newStatus: PatientStatus) => {
    if (!patient) return;
    try {
      const updated = await patientService.updatePatientStatus(patient._id, newStatus);
      setPatient(updated);
      toast.success(`Patient status updated to ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleSaveMedicalRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient || !diagnosis) return;

    try {
      const newRec = await patientService.addMedicalRecord({
        patientId: patient._id,
        doctorId: patient.primaryDoctorId || 'doc-priya',
        doctorName: patient.primaryDoctorName || 'Dr. Priya Ramanathan',
        branchId: patient.branchId,
        date: new Date().toISOString(),
        diagnosis,
        symptoms,
        treatmentPlan,
        notes,
        vitalSigns: {
          bloodPressure: bp,
          pulseRate: Number(pulse) || 72,
          temperature: temp,
          spo2,
          weightKg: Number(weight) || 65,
        },
      });

      toast.success('Clinical examination record logged!');
      setIsAddRecordOpen(false);
      setDiagnosis('');
      setSymptoms('');
      setTreatmentPlan('');
      setNotes('');
    } catch {
      toast.error('Failed to log medical record');
    }
  };

  if (loading || !patient) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  const tabs: TabItem[] = [
    { id: 'overview', label: 'Patient Overview' },
    { id: 'clinical', label: 'Medical Records', badge: medicalRecords.length },
    { id: 'prescriptions', label: 'Prescriptions', badge: prescriptions.length },
    {
      id: 'discharge',
      label: 'Discharge Summary',
      badge: dischargeSummary ? '1' : undefined,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Back Navigation */}
      <div>
        <button
          onClick={() => navigate('/patients')}
          className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-main transition-colors font-medium mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Patient Registry</span>
        </button>
      </div>

      {/* Patient Header Banner */}
      <Card className="p-6 bg-gradient-to-r from-white via-slate-50 to-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-blue to-teal-500 flex items-center justify-center text-white text-2xl font-bold shadow-md shrink-0">
              {patient.name.charAt(0)}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-text-main tracking-tight">
                  {patient.name}
                </h1>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 border text-slate-700 font-bold">
                  {patient.patientNumber}
                </span>
                <Badge
                  variant={
                    patient.status === 'ACTIVE'
                      ? 'success'
                      : patient.status === 'ADMITTED'
                      ? 'critical'
                      : 'info'
                  }
                  size="sm"
                  dot
                >
                  {patient.status}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-text-secondary mt-1.5">
                <span>{patient.age} Years / {patient.gender}</span>
                <span>•</span>
                <span className="font-semibold text-rose-600">Blood: {patient.bloodGroup}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-text-muted" />
                  {patient.branchName}
                </span>
                <span>•</span>
                <span>Reg: {formatDate(patient.registeredAt)}</span>
              </div>

              {/* Medical Alerts Pill List */}
              {patient.medicalAlerts.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-status-critical shrink-0" />
                  <span className="text-[11px] font-semibold text-status-critical mr-1">
                    Alerts:
                  </span>
                  {patient.medicalAlerts.map((alert, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full text-[10px] bg-red-100 text-red-800 font-bold"
                    >
                      {alert}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 self-start lg:self-center">
            <select
              value={patient.status}
              onChange={(e) => handleStatusChange(e.target.value as PatientStatus)}
              className="text-xs border border-surface-border rounded-lg px-3 py-1.5 bg-white font-medium text-text-main focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
            >
              <option value="ACTIVE">Status: Active</option>
              <option value="ADMITTED">Status: Admitted</option>
              <option value="FOLLOW_UP">Status: Follow Up</option>
              <option value="DISCHARGED">Status: Discharged</option>
            </select>

            <Button
              size="sm"
              onClick={() => setIsAddRecordOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Clinical Note
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs Bar */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Personal & Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-text-secondary">Full Name:</span>
                <span className="font-semibold text-text-main">{patient.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-text-secondary">Patient Identification:</span>
                <span className="font-mono text-brand-blue font-semibold">
                  {patient.patientNumber}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-text-secondary">Age / Gender:</span>
                <span className="font-medium text-text-main">
                  {patient.age} yrs / {patient.gender}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-text-secondary">Blood Group:</span>
                <span className="font-bold text-rose-600">{patient.bloodGroup}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-text-secondary">Contact Phone:</span>
                <span className="font-medium text-text-main">{patient.phone}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-text-secondary">Email:</span>
                <span className="font-medium text-text-main">{patient.email}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-text-secondary">Residential Address:</span>
                <span className="font-medium text-text-main text-right max-w-xs">
                  {patient.address}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Emergency Contact & Hospital Care</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1 mb-2">
                <div className="text-[11px] font-bold text-amber-900 uppercase">
                  Designated Emergency Contact
                </div>
                <div className="font-bold text-text-main text-sm">
                  {patient.emergencyContact?.name || 'N/A'}
                </div>
                <div className="text-text-secondary">
                  Relationship: {patient.emergencyContact?.relationship || 'Family'} • Phone:{' '}
                  <span className="font-medium text-text-main">
                    {patient.emergencyContact?.phone || patient.phone}
                  </span>
                </div>
              </div>

              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-text-secondary">Primary Hospital Branch:</span>
                <span className="font-semibold text-text-main">{patient.branchName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-text-secondary">Attending Consultant:</span>
                <span className="font-medium text-brand-blue">
                  {patient.primaryDoctorName || 'Dr. Priya Ramanathan'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-text-secondary">Last Visit Recorded:</span>
                <span className="font-medium text-text-main">
                  {formatDateTime(patient.lastVisitDate)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 2: Clinical Medical Records */}
      {activeTab === 'clinical' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-text-main">
              Clinical Consultations ({medicalRecords.length})
            </h3>
            <Button
              size="sm"
              onClick={() => setIsAddRecordOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Record
            </Button>
          </div>

          {medicalRecords.length === 0 ? (
            <Card className="p-8 text-center text-xs text-text-secondary">
              No clinical notes recorded yet for this patient.
            </Card>
          ) : (
            medicalRecords.map((rec) => (
              <Card key={rec._id} className="p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <h4 className="font-bold text-sm text-text-main">{rec.diagnosis}</h4>
                    <p className="text-xs text-brand-blue font-medium">
                      Consultant: {rec.doctorName}
                    </p>
                  </div>
                  <span className="text-xs text-text-secondary">
                    {formatDateTime(rec.date)}
                  </span>
                </div>

                {/* Vitals Ribbon */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 py-2 px-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-text-muted block">Blood Pressure</span>
                    <span className="font-bold text-text-main">{rec.vitalSigns.bloodPressure}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted block">Pulse Rate</span>
                    <span className="font-bold text-text-main">{rec.vitalSigns.pulseRate} bpm</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted block">Temperature</span>
                    <span className="font-bold text-text-main">{rec.vitalSigns.temperature}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted block">Oxygen SpO2</span>
                    <span className="font-bold text-text-main">{rec.vitalSigns.spo2}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted block">Weight</span>
                    <span className="font-bold text-text-main">{rec.vitalSigns.weightKg} kg</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                  <div>
                    <span className="font-semibold text-text-main block mb-1">
                      Presenting Symptoms:
                    </span>
                    <p className="text-text-secondary leading-relaxed bg-white p-2.5 rounded border border-gray-100">
                      {rec.symptoms}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold text-text-main block mb-1">
                      Treatment Plan & Advice:
                    </span>
                    <p className="text-text-secondary leading-relaxed bg-white p-2.5 rounded border border-gray-100">
                      {rec.treatmentPlan}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Prescriptions */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-text-main">
            Issued Medications ({prescriptions.length})
          </h3>
          {prescriptions.length === 0 ? (
            <Card className="p-8 text-center text-xs text-text-secondary">
              No active prescriptions recorded.
            </Card>
          ) : (
            prescriptions.map((prsc) => (
              <Card key={prsc._id} className="p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                  <div className="text-xs">
                    <span className="font-bold text-text-main">Prescribed by {prsc.doctorName}</span>
                  </div>
                  <span className="text-xs text-text-secondary">{formatDate(prsc.date)}</span>
                </div>

                <div className="divide-y divide-gray-100 text-xs">
                  {prsc.medications.map((med, idx) => (
                    <div key={idx} className="py-2.5 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-2.5">
                        <Pill className="w-4 h-4 text-brand-teal mt-0.5 shrink-0" />
                        <div>
                          <span className="font-bold text-text-main">{med.name}</span>
                          <span className="text-text-muted ml-2">({med.dosage})</span>
                          <div className="text-text-secondary text-[11px] mt-0.5">
                            {med.instructions}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-medium text-text-main">{med.frequency}</div>
                        <div className="text-[11px] text-text-muted">Duration: {med.duration}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Tab 4: Discharge Summary (Spec DIS-001, DIS-002) */}
      {activeTab === 'discharge' && (
        <div>
          {dischargeSummary ? (
            <Card className="p-6 space-y-5 border-2 border-teal-100 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-4">
                <div>
                  <Badge variant="teal" size="sm" className="mb-1">
                    Official Inpatient Discharge Summary (Version {dischargeSummary.version})
                  </Badge>
                  <h3 className="text-lg font-bold text-text-main">
                    {dischargeSummary.finalDiagnosis}
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Issued at {dischargeSummary.branchName} by {dischargeSummary.issuedBy}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      window.print();
                    }}
                    leftIcon={<Printer className="w-3.5 h-3.5" />}
                  >
                    Print
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => toast.success('Discharge summary PDF exported successfully!')}
                    leftIcon={<FileDown className="w-3.5 h-3.5" />}
                  >
                    Export PDF
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-text-muted block text-[11px]">Admission Date</span>
                  <span className="font-semibold text-text-main">
                    {formatDate(dischargeSummary.admissionDate)}
                  </span>
                </div>
                <div>
                  <span className="text-text-muted block text-[11px]">Discharge Date</span>
                  <span className="font-semibold text-text-main">
                    {formatDate(dischargeSummary.dischargeDate)}
                  </span>
                </div>
                <div>
                  <span className="text-text-muted block text-[11px]">Condition at Discharge</span>
                  <Badge variant="success" size="sm">
                    {dischargeSummary.conditionAtDischarge}
                  </Badge>
                </div>
                <div>
                  <span className="text-text-muted block text-[11px]">Next Follow Up</span>
                  <span className="font-bold text-brand-blue">
                    {formatDate(dischargeSummary.followUpDate)}
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-text-main mb-1">Clinical Course & Summary</h4>
                  <p className="text-text-secondary leading-relaxed bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                    {dischargeSummary.summary}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-text-main mb-1">
                    Discharge Instructions & Wound Care
                  </h4>
                  <p className="text-text-secondary leading-relaxed bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                    {dischargeSummary.instructions}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-text-muted">
                <span>Certified Clinical Document • Immutable Record</span>
                <span>Issued: {formatDateTime(dischargeSummary.issuedAt)}</span>
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center text-xs text-text-secondary">
              No formal inpatient discharge summary recorded for this patient profile.
            </Card>
          )}
        </div>
      )}

      {/* Add Medical Record Modal */}
      <Modal
        isOpen={isAddRecordOpen}
        onClose={() => setIsAddRecordOpen(false)}
        title="Record Clinical Examination"
        description={`Add clinical diagnosis and treatment notes for ${patient.name}`}
        maxWidth="xl"
      >
        <form onSubmit={handleSaveMedicalRecord} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-medium text-text-main mb-1">Primary Diagnosis *</label>
            <input
              type="text"
              required
              placeholder="e.g. Acute Bronchitis / Lumbar Spondylosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div>
              <label className="block text-[11px] font-medium text-text-secondary mb-1">BP</label>
              <input
                type="text"
                value={bp}
                onChange={(e) => setBp(e.target.value)}
                className="w-full px-2 py-1.5 border rounded border-surface-border text-xs bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-text-secondary mb-1">Pulse</label>
              <input
                type="number"
                value={pulse}
                onChange={(e) => setPulse(e.target.value)}
                className="w-full px-2 py-1.5 border rounded border-surface-border text-xs bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-text-secondary mb-1">Temp</label>
              <input
                type="text"
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                className="w-full px-2 py-1.5 border rounded border-surface-border text-xs bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-text-secondary mb-1">SpO2</label>
              <input
                type="text"
                value={spo2}
                onChange={(e) => setSpo2(e.target.value)}
                className="w-full px-2 py-1.5 border rounded border-surface-border text-xs bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-text-secondary mb-1">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-2 py-1.5 border rounded border-surface-border text-xs bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-text-main mb-1">Presenting Symptoms</label>
            <textarea
              rows={2}
              placeholder="Patient reported symptoms and physical findings..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-text-main mb-1">Treatment Plan</label>
            <textarea
              rows={2}
              placeholder="Medical management, follow-up timeline, dietary restrictions..."
              value={treatmentPlan}
              onChange={(e) => setTreatmentPlan(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg border-surface-border text-xs focus:ring-2 focus:ring-brand-blue/30 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddRecordOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Clinical Note
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
