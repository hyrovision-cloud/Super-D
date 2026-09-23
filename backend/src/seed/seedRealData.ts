import { AdvertisementModel } from '../models/Advertisement.model';
import { AppointmentModel } from '../models/Appointment.model';
import { AttendanceRecordModel } from '../models/AttendanceRecord.model';
import { BranchModel } from '../models/Branch.model';
import { ComplaintModel } from '../models/Complaint.model';
import { EmployeeModel } from '../models/Employee.model';
import { ExpenseModel } from '../models/Expense.model';
import { IncomeRecordModel } from '../models/IncomeRecord.model';
import { LeadModel } from '../models/Lead.model';
import { LeaveRequestModel } from '../models/LeaveRequest.model';
import { MedicalRecordModel } from '../models/MedicalRecord.model';
import { NotificationModel } from '../models/Notification.model';
import { PatientModel } from '../models/Patient.model';
import { UserModel } from '../models/User.model';
import { BRANCH_CODES, BRANCH_IDS, BRANCH_NAMES, BranchId } from '../config/constants';

const baseDate = new Date('2026-09-01T09:00:00.000Z');
const isoDay = (offset: number) => new Date(baseDate.getTime() + offset * 86400000);
const pick = <T>(values: readonly T[], index: number): T => values[index % values.length];

async function upsertMany(model: any, key: string, records: any[]) {
  if (!records.length) return;
  await model.bulkWrite(records.map((record) => ({
    updateOne: { filter: { [key]: record[key] }, update: { $set: record }, upsert: true },
  })), { ordered: false });
}

export async function seedRealData(): Promise<Record<string, number>> {
  const patients: any[] = [];
  const employees: any[] = [];
  const appointments: any[] = [];
  const attendance: any[] = [];
  const leave: any[] = [];
  const complaints: any[] = [];
  const income: any[] = [];
  const expenses: any[] = [];
  const advertisements: any[] = [];
  const leads: any[] = [];
  const records: any[] = [];

  const firstNames = ['Arun', 'Meena', 'Karthik', 'Nivetha', 'Senthil', 'Priya', 'Vignesh', 'Revathi'];
  const lastNames = ['Kumar', 'Raman', 'Devi', 'Raj', 'Selvam', 'Babu'];
  const departments = ['General Medicine', 'Orthopedics', 'Cardiology', 'Pediatrics', 'Dermatology'];
  const revenueCategories = ['OP Consultation', 'Medical / Pharmacy', 'Lab & Diagnostics', 'Day Care', 'Dressing & Procedures'] as const;
  const branchWeights = [1, 1.65, 1.3, 0.78];

  for (let b = 0; b < BRANCH_IDS.length; b += 1) {
    const branchId = BRANCH_IDS[b] as BranchId;
    const code = BRANCH_CODES[branchId];
    const branchName = BRANCH_NAMES[branchId];
    const patientCount = [5, 8, 6, 4][b];
    const employeeCount = [4, 6, 5, 3][b];

    for (let i = 1; i <= employeeCount; i += 1) {
      const employeeNumber = `EMP-${code}-${String(i).padStart(3, '0')}`;
      employees.push({
        employeeNumber,
        name: i === 1 ? `Dr. ${pick(firstNames, b + i)} ${pick(lastNames, b)}` : `${pick(firstNames, b * 2 + i)} ${pick(lastNames, i)}`,
        role: i === 1 ? 'Doctor' : pick(['Nurse', 'Receptionist', 'Lab Technician', 'Accounts Staff'], i),
        department: i === 1 ? pick(departments, b) : pick(departments, b + i),
        branchId,
        phone: `+91 9${b + 1}${String(70000000 + b * 1000 + i)}`,
        email: `${employeeNumber.toLowerCase()}@superd.demo`,
        status: 'ACTIVE',
        joinDate: `202${(b + i) % 5 + 1}-0${(i % 8) + 1}-15`,
      });
      for (let day = 0; day < 7; day += 1) {
        attendance.push({ employeeId: employeeNumber, employeeNumber, employeeName: employees[employees.length - 1].name, role: employees[employees.length - 1].role, branchId, date: isoDay(14 + day).toISOString().slice(0, 10), checkIn: day === 3 ? '09:22 AM' : '08:55 AM', checkOut: '05:35 PM', status: day === 3 ? 'LATE' : 'PRESENT', punchType: 'BIOMETRIC' });
      }
    }

    for (let i = 1; i <= patientCount; i += 1) {
      const uhid = `UHID-${code}-2026-${String(i).padStart(4, '0')}`;
      const name = `${pick(firstNames, b * 3 + i)} ${pick(lastNames, b + i)}`;
      patients.push({ uhid, name, age: 22 + ((b * 11 + i * 7) % 53), gender: i % 2 ? 'MALE' : 'FEMALE', phone: `+91 8${b + 1}${String(60000000 + b * 1000 + i)}`, email: `patient.${code.toLowerCase()}.${i}@example.test`, bloodGroup: pick(['O+', 'A+', 'B+', 'AB+', 'O-'], b + i), address: `${10 + i}, ${branchName}, Tamil Nadu`, branchId, emergencyContact: { name: `${pick(firstNames, i + 2)} ${pick(lastNames, i + 1)}`, relationship: 'Family', phone: `+91 9${b + 5}${String(50000000 + i)}` }, status: i === patientCount ? 'ADMITTED' : 'ACTIVE' });
      records.push({ recordNumber: `MR-${code}-${String(i).padStart(4, '0')}`, patientId: uhid, uhid, branchId, doctorId: `EMP-${code}-001`, doctorName: employees.find((x) => x.employeeNumber === `EMP-${code}-001`)!.name, date: isoDay(i), diagnosis: pick(['Viral fever', 'Hypertension review', 'Joint pain', 'Routine pediatric review'], i + b), clinicalNotes: 'Clinical assessment completed; follow-up advised as scheduled.', prescriptions: [{ medicineName: 'Paracetamol', dosage: '500 mg', frequency: 'Twice daily', duration: '3 days' }], vitals: { bp: '120/80', pulse: 76 + i, temperature: 98.4, spo2: 98 } });
      appointments.push({ appointmentNumber: `APT-${code}-${String(i).padStart(4, '0')}`, patientId: uhid, patientName: name, uhid, doctorId: `EMP-${code}-001`, doctorName: employees.find((x) => x.employeeNumber === `EMP-${code}-001`)!.name, department: pick(departments, b), branchId, date: isoDay(20 + i).toISOString().slice(0, 10), timeSlot: `${9 + (i % 7)}:00 AM`, type: i % 3 === 0 ? 'FOLLOW_UP' : 'OP', status: pick(['SCHEDULED', 'CONFIRMED', 'COMPLETED'], i), tokenNumber: i, reason: pick(['Consultation', 'Follow-up', 'Diagnostic review'], i) });
    }

    leave.push({ requestNumber: `LV-${code}-001`, employeeId: `EMP-${code}-002`, employeeName: employees.find((x) => x.employeeNumber === `EMP-${code}-002`)?.name || 'Staff', role: 'Nurse', department: pick(departments, b + 1), branchId, leaveType: b % 2 ? 'SICK' : 'CASUAL', startDate: '2026-09-25', endDate: '2026-09-26', daysCount: 2, reason: b % 2 ? 'Medical rest' : 'Family commitment', status: b === 0 ? 'APPROVED' : 'SUBMITTED', reviewStage: b === 0 ? 'APPROVED' : 'PENDING_MANAGER' });
    complaints.push({ ticketNumber: `CMP-${code}-001`, title: pick(['Waiting time feedback', 'Billing clarification', 'Facility maintenance'], b), description: 'Submitted for branch team review and tracked resolution.', category: pick(['WAIT_TIME', 'BILLING', 'FACILITY'], b), priority: pick(['MEDIUM', 'HIGH', 'LOW'], b), status: b === 1 ? 'INVESTIGATING' : 'NEW', branchId, patientId: patients.find((x) => x.branchId === branchId)?.uhid, patientName: patients.find((x) => x.branchId === branchId)?.name, notes: [], slaHours: 24, slaDeadline: isoDay(28), isOverdue: false });

    for (let i = 1; i <= 8; i += 1) {
      const amount = Math.round((650 + i * 275) * branchWeights[b]);
      income.push({ receiptNumber: `REC-${code}-${String(i).padStart(4, '0')}`, transactionDate: isoDay(i * 2 + 1), category: pick(revenueCategories, i + b), amount, paymentMethod: pick(['Cash', 'UPI', 'Card', 'Net Banking'] as const, i), branchId, patientId: patients.find((x) => x.branchId === branchId && x.uhid.endsWith(String(((i - 1) % patientCount) + 1).padStart(4, '0')))?.uhid, recordedBy: `EMP-${code}-002`, recordedByName: employees.find((x) => x.employeeNumber === `EMP-${code}-002`)?.name || 'Accounts Staff', status: 'ACTIVE' });
    }
    for (let i = 1; i <= 4; i += 1) expenses.push({ expenseNumber: `EXP-${code}-${String(i).padStart(4, '0')}`, branchId, category: pick(['Medical Supplies', 'Utilities', 'Maintenance', 'Housekeeping'], i + b), description: 'Verified monthly operating expense', amount: Math.round((900 + i * 430) * branchWeights[b]), expenseDate: isoDay(i * 5), paymentStatus: 'PAID', paymentMethod: pick(['UPI', 'Net Banking', 'Card'] as const, i), recordedByName: 'Finance Team' });

    advertisements.push({ campaignId: `CAM-${code}-001`, title: `${branchName} Preventive Health Camp`, platform: b % 2 ? 'Meta Ads' : 'Google Ads', status: 'Running', branchId, budget: Math.round(25000 * branchWeights[b]), spend: Math.round(11200 * branchWeights[b]), impressions: Math.round(42000 * branchWeights[b]), clicks: Math.round(1800 * branchWeights[b]), leadsCount: 12 + b * 4, startDate: '2026-09-01', endDate: '2026-10-15', responsiblePerson: 'Marketing Team' });
    for (let i = 1; i <= 3; i += 1) leads.push({ leadNumber: `LEAD-${code}-${String(i).padStart(3, '0')}`, name: `${pick(firstNames, b + i + 3)} ${pick(lastNames, i)}`, phone: `+91 7${b + 1}${String(50000000 + i)}`, source: i % 2 ? 'Google Ads' : 'Meta Ads', campaignId: `CAM-${code}-001`, branchId, interestedSpecialty: pick(departments, b + i), status: pick(['NEW', 'CONTACTED', 'APPOINTMENT_BOOKED'], i) });
  }

  await upsertMany(EmployeeModel, 'employeeNumber', employees);
  await upsertMany(PatientModel, 'uhid', patients);
  await upsertMany(MedicalRecordModel, 'recordNumber', records);
  await upsertMany(AppointmentModel, 'appointmentNumber', appointments);
  for (const item of attendance) await AttendanceRecordModel.updateOne({ employeeId: item.employeeId, date: item.date }, { $set: item }, { upsert: true });
  await upsertMany(LeaveRequestModel, 'requestNumber', leave);
  await upsertMany(ComplaintModel, 'ticketNumber', complaints);
  await upsertMany(IncomeRecordModel, 'receiptNumber', income);
  await upsertMany(ExpenseModel, 'expenseNumber', expenses);
  await upsertMany(AdvertisementModel, 'campaignId', advertisements);
  await upsertMany(LeadModel, 'leadNumber', leads);

  const users = await UserModel.find({ status: 'ACTIVE' }).select('_id primaryBranchId').lean();
  await upsertMany(NotificationModel, 'notificationKey', users.map((u) => ({ notificationKey: `WELCOME-${u._id}`, userId: String(u._id), branchId: u.primaryBranchId, title: 'Super D data is ready', message: 'Your authorized hospital data is available from the secure API.', type: 'SUCCESS', read: false, link: '/dashboard' })));

  return verifyRealData();
}

export async function verifyRealData(): Promise<Record<string, number>> {
  const branches = await BranchModel.find({ isActive: true }).select('branchId').lean();
  const valid = new Set(branches.map((b) => b.branchId));
  const scopedModels = [PatientModel, EmployeeModel, AppointmentModel, AttendanceRecordModel, LeaveRequestModel, ComplaintModel, IncomeRecordModel, ExpenseModel, AdvertisementModel, LeadModel];
  for (const model of scopedModels) {
    const orphan = await model.countDocuments({ branchId: { $nin: [...valid] } });
    if (orphan) throw new Error(`${model.modelName} has ${orphan} orphan branch references`);
  }
  const counts: Record<string, number> = { branches: branches.length };
  for (const model of [...scopedModels, MedicalRecordModel, NotificationModel]) counts[model.collection.name] = await model.countDocuments();
  if (branches.length !== 4 || BRANCH_IDS.some((id) => !valid.has(id))) throw new Error('Canonical four-branch verification failed');
  return counts;
}
