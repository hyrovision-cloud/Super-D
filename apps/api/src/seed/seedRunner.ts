import { BranchModel } from '../modules/branches/branch.model';
import { RoleModel } from '../modules/roles/role.model';
import { UserModel } from '../modules/users/user.model';
import { PatientModel } from '../modules/patients/patient.model';
import { MedicalRecordModel } from '../modules/patients/medicalRecord.model';
import { AppointmentModel } from '../modules/appointments/appointment.model';
import { EmployeeModel } from '../modules/employees/employee.model';
import { LeaveRequestModel } from '../modules/leave/leaveRequest.model';
import { ComplaintModel } from '../modules/complaints/complaint.model';
import { IncomeRecordModel } from '../modules/revenue/incomeRecord.model';
import { knowledgeService } from '../modules/knowledge/knowledge.service';
import { KnowledgeDocModel } from '../modules/knowledge/knowledgeDoc.model';
import { SEED_BRANCHES, SEED_ROLES } from './seedData';
import { hashPassword } from '../common/auth/token.service';

export async function seedDatabase(force = false): Promise<void> {
  const branchCount = await BranchModel.countDocuments();
  if (branchCount > 0 && !force) {
    console.log(`[Seed] Database already seeded (${branchCount} branches present). Skipping seed.`);
    return;
  }

  console.log('[Seed] Starting database seeding with realistic Tamil Nadu hospital datasets...');

  // 1. Branches
  await BranchModel.deleteMany({});
  await BranchModel.insertMany(SEED_BRANCHES);
  console.log(`[Seed] Seeded ${SEED_BRANCHES.length} branches.`);

  // 2. Roles
  await RoleModel.deleteMany({});
  await RoleModel.insertMany(SEED_ROLES);
  console.log(`[Seed] Seeded ${SEED_ROLES.length} roles.`);

  // 3. Users
  await UserModel.deleteMany({});
  const defaultHash = await hashPassword('admin123');
  const doctorHash = await hashPassword('doctor123');

  const seedUsers = [
    {
      userId: 'usr-owner',
      name: 'Dr. S. Rajasekaran',
      email: 'owner@aarogya.com',
      passwordHash: defaultHash,
      roles: ['Hospital Owner'],
      assignedBranches: ['branch-trichy', 'branch-chennai', 'branch-madurai', 'branch-pudukkottai'],
      primaryBranchId: 'branch-trichy',
      department: 'Executive Board',
      status: 'ACTIVE',
    },
    {
      userId: 'usr-admin-global',
      name: 'P. Vijay Anand',
      email: 'admin.global@aarogya.com',
      passwordHash: defaultHash,
      roles: ['Global Admin'],
      assignedBranches: ['branch-trichy', 'branch-chennai', 'branch-madurai', 'branch-pudukkottai'],
      primaryBranchId: 'branch-trichy',
      department: 'Information Technology',
      status: 'ACTIVE',
    },
    {
      userId: 'usr-admin-trichy',
      name: 'K. Senthil Nathan',
      email: 'admin.trichy@aarogya.com',
      passwordHash: defaultHash,
      roles: ['Branch Manager'],
      assignedBranches: ['branch-trichy'],
      primaryBranchId: 'branch-trichy',
      department: 'Hospital Administration',
      status: 'ACTIVE',
    },
    {
      userId: 'usr-doc-karthik',
      name: 'Dr. Karthik Raja',
      email: 'doctor.karthik@aarogya.com',
      passwordHash: doctorHash,
      roles: ['Doctor'],
      assignedBranches: ['branch-trichy'],
      primaryBranchId: 'branch-trichy',
      department: 'Cardiology',
      status: 'ACTIVE',
    },
    {
      userId: 'usr-hr-lakshmi',
      name: 'R. Lakshmi',
      email: 'hr.lakshmi@aarogya.com',
      passwordHash: defaultHash,
      roles: ['HR Manager'],
      assignedBranches: ['branch-trichy'],
      primaryBranchId: 'branch-trichy',
      department: 'Human Resources',
      status: 'ACTIVE',
    },
    {
      userId: 'usr-fin-anand',
      name: 'N. Anand Kumar',
      email: 'billing.anand@aarogya.com',
      passwordHash: defaultHash,
      roles: ['Finance Manager'],
      assignedBranches: ['branch-trichy', 'branch-chennai'],
      primaryBranchId: 'branch-trichy',
      department: 'Finance & Accounts',
      status: 'ACTIVE',
    },
    {
      userId: 'usr-mkt-divya',
      name: 'S. Divya',
      email: 'marketing.divya@aarogya.com',
      passwordHash: defaultHash,
      roles: ['Marketing Manager'],
      assignedBranches: ['branch-trichy', 'branch-chennai', 'branch-madurai', 'branch-pudukkottai'],
      primaryBranchId: 'branch-trichy',
      department: 'Growth & Outreach',
      status: 'ACTIVE',
    },
    {
      userId: 'usr-cqm-revathi',
      name: 'M. Revathi',
      email: 'complaints.revathi@aarogya.com',
      passwordHash: defaultHash,
      roles: ['Complaints and Query Manager'],
      assignedBranches: ['branch-trichy'],
      primaryBranchId: 'branch-trichy',
      department: 'Quality & Patient Care',
      status: 'ACTIVE',
    },
    {
      userId: 'usr-rec-priya',
      name: 'T. Priya',
      email: 'reception.priya@aarogya.com',
      passwordHash: defaultHash,
      roles: ['Receptionist'],
      assignedBranches: ['branch-trichy'],
      primaryBranchId: 'branch-trichy',
      department: 'Front Desk',
      status: 'ACTIVE',
    },
  ];

  await UserModel.insertMany(seedUsers);
  console.log(`[Seed] Seeded ${seedUsers.length} user accounts.`);

  // 4. Patients
  await PatientModel.deleteMany({});
  const seedPatients = [
    {
      patientId: 'PAT-TRY-1001',
      uhid: 'UHID-TRY-1001',
      name: 'K. Subramanian',
      age: 58,
      gender: 'Male',
      phone: '98421 55670',
      address: '24, West Boulevard Road, Trichy',
      emergencyContact: { name: 'S. Gomathi', phone: '98421 55671', relationship: 'Spouse' },
      branchId: 'branch-trichy',
      category: 'IPD',
      status: 'ADMITTED',
      bloodGroup: 'B+',
      allergies: ['Penicillin'],
      assignedDoctorId: 'usr-doc-karthik',
      assignedDoctorName: 'Dr. Karthik Raja',
      bedNumber: 'ICCU-04',
      ward: 'Cardiac Intensive Care',
      admissionDate: new Date('2026-09-15T08:30:00Z'),
      medicalAlerts: ['Hypertensive Crisis', 'Post-PTCA Day 3'],
    },
    {
      patientId: 'PAT-TRY-1002',
      uhid: 'UHID-TRY-1002',
      name: 'R. Meenakshi Sundaram',
      age: 46,
      gender: 'Female',
      phone: '94433 12890',
      address: '5, Rockfort Main Street, Trichy',
      emergencyContact: { name: 'M. Sundaram', phone: '94433 12891', relationship: 'Husband' },
      branchId: 'branch-trichy',
      category: 'OPD',
      status: 'ACTIVE',
      bloodGroup: 'O+',
      allergies: [],
      assignedDoctorId: 'usr-doc-karthik',
      assignedDoctorName: 'Dr. Karthik Raja',
    },
    {
      patientId: 'PAT-CHN-2001',
      uhid: 'UHID-CHN-2001',
      name: 'V. Ramanathan',
      age: 62,
      gender: 'Male',
      phone: '98840 77123',
      address: 'Plot 12, T. Nagar, Chennai',
      emergencyContact: { name: 'R. Janaki', phone: '98840 77124', relationship: 'Spouse' },
      branchId: 'branch-chennai',
      category: 'IPD',
      status: 'ADMITTED',
      bloodGroup: 'A+',
      allergies: ['Sulfa drugs'],
      bedNumber: 'ICU-12',
      ward: 'Cardiothoracic Ward',
      admissionDate: new Date('2026-09-17T11:00:00Z'),
    },
    {
      patientId: 'PAT-MDU-3001',
      uhid: 'UHID-MDU-3001',
      name: 'A. Murugan',
      age: 39,
      gender: 'Male',
      phone: '97900 33451',
      address: '14, Simmakkal, Madurai',
      emergencyContact: { name: 'M. Selvi', phone: '97900 33452', relationship: 'Wife' },
      branchId: 'branch-madurai',
      category: 'OPD',
      status: 'ACTIVE',
      bloodGroup: 'B+',
    },
    {
      patientId: 'PAT-PDK-4001',
      uhid: 'UHID-PDK-4001',
      name: 'P. Dhanalakshmi',
      age: 28,
      gender: 'Female',
      phone: '94422 88901',
      address: 'Near Old Palace, Pudukkottai',
      emergencyContact: { name: 'K. Palani', phone: '94422 88902', relationship: 'Father' },
      branchId: 'branch-pudukkottai',
      category: 'OPD',
      status: 'ACTIVE',
      bloodGroup: 'O-',
    },
  ];

  await PatientModel.insertMany(seedPatients);
  console.log(`[Seed] Seeded ${seedPatients.length} patients.`);

  // 5. Medical Records for PAT-TRY-1001
  await MedicalRecordModel.deleteMany({});
  await MedicalRecordModel.create({
    recordId: 'REC-26-001',
    patientId: 'PAT-TRY-1001',
    uhid: 'UHID-TRY-1001',
    branchId: 'branch-trichy',
    doctorId: 'usr-doc-karthik',
    doctorName: 'Dr. Karthik Raja',
    date: new Date('2026-09-18T10:00:00Z'),
    type: 'OPD_NOTE',
    diagnosis: 'Coronary Artery Disease - Post Angioplasty (LAD Stent)',
    clinicalNotes: 'Patient is clinically stable. Chest pain resolved. Vitals stable. Continue dual antiplatelet therapy.',
    vitals: { bp: '124/80', pulse: 74, temp: 98.4, spO2: 99, weight: 68 },
    prescriptions: [
      { medicine: 'Tab. Ecosprin 75mg', dosage: '75mg', frequency: '0-1-0', duration: '30 days', instructions: 'After lunch' },
      { medicine: 'Tab. Brilinta 90mg', dosage: '90mg', frequency: '1-0-1', duration: '30 days', instructions: 'With meals' },
      { medicine: 'Tab. Atorva 40mg', dosage: '40mg', frequency: '0-0-1', duration: '30 days', instructions: 'At bedtime' },
    ],
    labInvestigations: [
      { testName: 'Serum Troponin-I', status: 'RESULT_READY', result: '0.02 ng/mL (Normal)' },
      { testName: '2D Echocardiogram', status: 'RESULT_READY', result: 'LVEF 55%, mild anterior hypokinesia' },
    ],
  });

  // 6. Appointments
  await AppointmentModel.deleteMany({});
  const seedAppointments = [
    {
      appointmentId: 'APT-TRY-001',
      patientId: 'PAT-TRY-1001',
      patientName: 'K. Subramanian',
      patientPhone: '98421 55670',
      doctorId: 'usr-doc-karthik',
      doctorName: 'Dr. Karthik Raja',
      department: 'Cardiology',
      branchId: 'branch-trichy',
      date: '2026-09-20',
      slotTime: '10:00',
      type: 'Specialist Review',
      status: 'CHECKED_IN',
      reason: 'Post-PTCA routine cardiac consultation and ECG evaluation',
    },
    {
      appointmentId: 'APT-TRY-002',
      patientId: 'PAT-TRY-1002',
      patientName: 'R. Meenakshi Sundaram',
      patientPhone: '94433 12890',
      doctorId: 'usr-doc-karthik',
      doctorName: 'Dr. Karthik Raja',
      department: 'Cardiology',
      branchId: 'branch-trichy',
      date: '2026-09-20',
      slotTime: '10:30',
      type: 'General Checkup',
      status: 'SCHEDULED',
      reason: 'Occasional palpitation and shortness of breath upon stair climbing',
    },
    {
      appointmentId: 'APT-CHN-003',
      patientId: 'PAT-CHN-2001',
      patientName: 'V. Ramanathan',
      patientPhone: '98840 77123',
      doctorId: 'usr-doc-karthik',
      doctorName: 'Dr. Karthik Raja',
      department: 'Cardiology',
      branchId: 'branch-chennai',
      date: '2026-09-21',
      slotTime: '11:00',
      type: 'Follow-up',
      status: 'SCHEDULED',
      reason: 'Bi-annual pacemaker check and lead integrity review',
    },
  ];
  await AppointmentModel.insertMany(seedAppointments);

  // 7. Employees
  await EmployeeModel.deleteMany({});
  const seedEmployees = [
    {
      employeeId: 'EMP-1001',
      employeeNumber: 'E-1001',
      name: 'Dr. Karthik Raja, MD, DM',
      email: 'doctor.karthik@aarogya.com',
      phone: '98421 11223',
      role: 'Doctor',
      department: 'Cardiology',
      branchId: 'branch-trichy',
      designation: 'Senior Consultant Cardiologist',
      shift: 'Morning (07:00 - 15:00)',
      status: 'ACTIVE',
      joiningDate: '2022-03-15',
      qualification: 'MBBS, MD (Gen Med), DM (Cardio)',
    },
    {
      employeeId: 'EMP-1002',
      employeeNumber: 'E-1002',
      name: 'N. Meenakshi',
      email: 'nurse.meenakshi@aarogya.com',
      phone: '98421 33445',
      role: 'Nurse',
      department: 'ICU & Critical Care',
      branchId: 'branch-trichy',
      designation: 'Nursing Supervisor',
      shift: 'Night (23:00 - 07:00)',
      status: 'ACTIVE',
      joiningDate: '2023-01-10',
      qualification: 'B.Sc Nursing',
    },
    {
      employeeId: 'EMP-1003',
      employeeNumber: 'E-1003',
      name: 'R. Murugesan',
      email: 'murugan@aarogya.com',
      phone: '98421 55667',
      role: 'Pharmacist',
      department: 'Pharmacy',
      branchId: 'branch-trichy',
      designation: 'Chief Pharmacist',
      shift: 'General (09:00 - 17:00)',
      status: 'ACTIVE',
      joiningDate: '2021-08-01',
      qualification: 'B.Pharm',
    },
  ];
  await EmployeeModel.insertMany(seedEmployees);

  // 8. Leave Requests
  await LeaveRequestModel.deleteMany({});
  const seedLeave = [
    {
      requestId: 'LR-2026-001',
      employeeId: 'EMP-1002',
      employeeName: 'N. Meenakshi',
      department: 'ICU & Critical Care',
      branchId: 'branch-trichy',
      leaveType: 'Casual Leave',
      startDate: '2026-09-22',
      endDate: '2026-09-23',
      daysCount: 2,
      reason: 'Family temple festival at Srirangam',
      status: 'SUBMITTED',
      currentStage: 'Manager Review',
      replacementEmployeeName: 'Staff Nurse K. Revathi',
    },
    {
      requestId: 'LR-2026-002',
      employeeId: 'EMP-1001',
      employeeName: 'Dr. Karthik Raja',
      department: 'Cardiology',
      branchId: 'branch-trichy',
      leaveType: 'Earned Leave',
      startDate: '2026-09-28',
      endDate: '2026-09-30',
      daysCount: 3,
      reason: 'Attending Cardiological Society of India (CSI) Annual Conclave',
      status: 'APPROVED',
      currentStage: 'Approved',
      decisionComment: 'Approved. Duty handover to Dr. Ramanathan confirmed.',
      decidedBy: 'Dr. R. Sundaram (Medical Superintendent)',
      decidedAt: new Date('2026-09-18T14:00:00Z'),
    },
  ];
  await LeaveRequestModel.insertMany(seedLeave);

  // 9. Complaints
  await ComplaintModel.deleteMany({});
  const seedComplaints = [
    {
      ticketId: 'TKT-24-001',
      subject: 'Cardiology OPD Token Delay Exceeded 90 Minutes',
      category: 'Wait Time & Queue',
      source: 'Patient',
      branchId: 'branch-trichy',
      department: 'Cardiology',
      priority: 'HIGH',
      status: 'ASSIGNED',
      slaHours: 12,
      slaTargetDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours remaining
      isBreached: false,
      assignedToUserId: 'usr-cqm-revathi',
      assignedToName: 'M. Revathi',
      complainantName: 'S. Rajagopalan',
      complainantPhone: '98421 99881',
      description: 'Senior citizen patient token #14 was scheduled for 10:00 AM, but was called in only at 11:45 AM without prior explanation.',
      isConfidential: false,
    },
    {
      ticketId: 'TKT-24-002',
      subject: 'Pharmacy Counter Billing Mismatch on Consumables',
      category: 'Billing & Insurance',
      source: 'Attendant',
      branchId: 'branch-trichy',
      department: 'Pharmacy',
      priority: 'MEDIUM',
      status: 'UNDER_REVIEW',
      slaHours: 24,
      slaTargetDate: new Date(Date.now() + 18 * 60 * 60 * 1000),
      isBreached: false,
      assignedToUserId: 'usr-cqm-revathi',
      assignedToName: 'M. Revathi',
      complainantName: 'V. Sundaram',
      complainantPhone: '94431 11220',
      description: 'Billed for two antiseptic surgical scrub bottles while only one was dispensed at the counter.',
      isConfidential: false,
    },
    {
      ticketId: 'TKT-24-003',
      subject: 'Confidential Staff Grievance: Duty Shift Allocation',
      category: 'Other',
      source: 'Employee',
      branchId: 'branch-trichy',
      department: 'Nursing',
      priority: 'MEDIUM',
      status: 'NEW',
      slaHours: 24,
      slaTargetDate: new Date(Date.now() + 20 * 60 * 60 * 1000),
      isBreached: false,
      complainantName: 'Staff Nurse [Internal]',
      complainantPhone: '98421 00000',
      description: 'Persistent consecutive night shifts without mandatory rest rotation.',
      isConfidential: true,
    },
  ];
  await ComplaintModel.insertMany(seedComplaints);

  // 10. Income Records (Covering all 9 mandatory categories)
  await IncomeRecordModel.deleteMany({});
  const seedIncome = [
    {
      receiptNumber: 'RCP-TRY-26-1001',
      transactionDate: new Date('2026-09-18T09:15:00Z'),
      category: 'OP',
      amount: 800,
      paymentMethod: 'upi',
      branchId: 'branch-trichy',
      patientName: 'R. Meenakshi Sundaram',
      uhid: 'UHID-TRY-1002',
      recordedBy: 'usr-rec-priya',
      recordedByName: 'T. Priya (Reception)',
      status: 'ACTIVE',
      notes: 'Consultation fee with Senior Cardiologist',
    },
    {
      receiptNumber: 'RCP-TRY-26-1002',
      transactionDate: new Date('2026-09-18T11:30:00Z'),
      category: 'Lab',
      amount: 2400,
      paymentMethod: 'card',
      branchId: 'branch-trichy',
      patientName: 'K. Subramanian',
      uhid: 'UHID-TRY-1001',
      recordedBy: 'usr-fin-anand',
      recordedByName: 'N. Anand Kumar (Cashier)',
      status: 'ACTIVE',
      notes: 'Serum Troponin-I & 2D Echo billing',
    },
    {
      receiptNumber: 'RCP-TRY-26-1003',
      transactionDate: new Date('2026-09-18T14:00:00Z'),
      category: 'Medical',
      amount: 45000,
      paymentMethod: 'insurance_tpa',
      branchId: 'branch-trichy',
      patientName: 'K. Subramanian',
      uhid: 'UHID-TRY-1001',
      recordedBy: 'usr-fin-anand',
      recordedByName: 'N. Anand Kumar (Cashier)',
      status: 'ACTIVE',
      notes: 'Star Health TPA Cashless interim bed & nursing settlement',
    },
    {
      receiptNumber: 'RCP-TRY-26-1004',
      transactionDate: new Date('2026-09-19T08:45:00Z'),
      category: 'Day Care',
      amount: 6500,
      paymentMethod: 'upi',
      branchId: 'branch-trichy',
      patientName: 'T. Murugavel',
      recordedBy: 'usr-rec-priya',
      recordedByName: 'T. Priya',
      status: 'ACTIVE',
      notes: 'Chemotherapy day care ward observation charges',
    },
    {
      receiptNumber: 'RCP-TRY-26-1005',
      transactionDate: new Date('2026-09-19T10:15:00Z'),
      category: 'Dressing',
      amount: 650,
      paymentMethod: 'cash',
      branchId: 'branch-trichy',
      patientName: 'G. Kannan',
      recordedBy: 'usr-fin-anand',
      recordedByName: 'N. Anand Kumar',
      status: 'ACTIVE',
      notes: 'Diabetic foot ulcer sterile debridement dressing',
    },
    {
      receiptNumber: 'RCP-TRY-26-1006',
      transactionDate: new Date('2026-09-19T12:00:00Z'),
      category: 'KIT',
      amount: 1200,
      paymentMethod: 'upi',
      branchId: 'branch-trichy',
      patientName: 'M. Selvan',
      recordedBy: 'usr-fin-anand',
      recordedByName: 'N. Anand Kumar',
      status: 'ACTIVE',
      notes: 'Sterile surgical disposable kit for minor procedure',
    },
    {
      receiptNumber: 'RCP-TRY-26-1007',
      transactionDate: new Date('2026-09-19T13:30:00Z'),
      category: 'Socks',
      amount: 450,
      paymentMethod: 'cash',
      branchId: 'branch-trichy',
      patientName: 'K. Subramanian',
      recordedBy: 'usr-fin-anand',
      recordedByName: 'N. Anand Kumar',
      status: 'ACTIVE',
      notes: 'Graduated compression anti-embolic socks (Class II)',
    },
    {
      receiptNumber: 'RCP-TRY-26-1008',
      transactionDate: new Date('2026-09-19T15:00:00Z'),
      category: 'Slipper',
      amount: 350,
      paymentMethod: 'cash',
      branchId: 'branch-trichy',
      patientName: 'P. Dhanalakshmi',
      recordedBy: 'usr-fin-anand',
      recordedByName: 'N. Anand Kumar',
      status: 'ACTIVE',
      notes: 'Orthopaedic anti-skid recovery slipper',
    },
    {
      receiptNumber: 'RCP-TRY-26-1009',
      transactionDate: new Date('2026-09-19T16:30:00Z'),
      category: 'Other Collections',
      amount: 1500,
      paymentMethod: 'upi',
      branchId: 'branch-trichy',
      patientName: 'S. Rajagopalan',
      recordedBy: 'usr-fin-anand',
      recordedByName: 'N. Anand Kumar',
      status: 'ACTIVE',
      notes: 'Emergency medical record duplicate certificate issue',
    },
    {
      receiptNumber: 'RCP-CHN-26-2001',
      transactionDate: new Date('2026-09-19T11:00:00Z'),
      category: 'Medical',
      amount: 85000,
      paymentMethod: 'insurance_tpa',
      branchId: 'branch-chennai',
      patientName: 'V. Ramanathan',
      recordedBy: 'usr-fin-anand',
      recordedByName: 'Chennai Billing Desk',
      status: 'ACTIVE',
      notes: 'Cardiac ICU critical care and monitoring package',
    },
    {
      receiptNumber: 'RCP-MDU-26-3001',
      transactionDate: new Date('2026-09-19T14:30:00Z'),
      category: 'OP',
      amount: 600,
      paymentMethod: 'upi',
      branchId: 'branch-madurai',
      patientName: 'A. Murugan',
      recordedBy: 'usr-fin-anand',
      recordedByName: 'Madurai Billing',
      status: 'ACTIVE',
      notes: 'Orthopaedic initial consultation',
    },
    {
      receiptNumber: 'RCP-PDK-26-4001',
      transactionDate: new Date('2026-09-19T15:45:00Z'),
      category: 'OP',
      amount: 400,
      paymentMethod: 'cash',
      branchId: 'branch-pudukkottai',
      patientName: 'P. Dhanalakshmi',
      recordedBy: 'usr-fin-anand',
      recordedByName: 'Pudukkottai Front Desk',
      status: 'ACTIVE',
      notes: 'General outpatient screening',
    },
  ];
  await IncomeRecordModel.insertMany(seedIncome);
  console.log(`[Seed] Seeded ${seedIncome.length} income transactions across all 9 categories.`);

  // 11. Knowledge Documents (Governed RAG)
  await KnowledgeDocModel.deleteMany({});
  await knowledgeService.createDocument({
    documentId: 'doc-sop-001',
    title: 'Aarogya SOP: Emergency Department Triage and Code Blue Activation',
    documentType: 'EMERGENCY_PROTOCOL',
    branchId: 'all',
    confidentiality: 'INTERNAL',
    allowedRoles: ['Doctor', 'Nurse', 'Branch Manager', 'Hospital Owner'],
    content: `1. Purpose: To define standard triage criteria for patients presenting to Casualty and Emergency at Aarogya Hospitals.\n\n2. Priority Categorization:\nCategory 1 (Immediate / Red): Life-threatening airway, breathing, or hemodynamic compromise. Code Blue alert immediately.\nCategory 2 (Very Urgent / Orange): Severe chest pain, suspected stroke within 4.5h window. Triage time <= 10 minutes.\nCategory 3 (Urgent / Yellow): Moderate pain, stable vitals. Triage time <= 30 minutes.\n\n3. Escalation: Any unresolved emergency queue issue must be escalated to the Medical Superintendent within 15 minutes.`,
  });

  await knowledgeService.createDocument({
    documentId: 'doc-pol-002',
    title: 'Hospital Governance Bylaws: Leave & Replacement Mandate',
    documentType: 'POLICY',
    branchId: 'all',
    confidentiality: 'INTERNAL',
    allowedRoles: ['HR Manager', 'Branch Manager', 'Doctor', 'Hospital Owner'],
    content: `1. Mandatory Staffing Ratio: Intensive Care Units must maintain a 1:1 nurse-to-patient ratio for ventilated patients, and 1:2 for step-down beds.\n\n2. Leave Approval Workflow: All clinical leave requests require on-duty replacement nomination.\n\n3. Rejection Compliance: Rejection of any leave request strictly requires a recorded, auditable justification reason in accordance with NABH HR standards.`,
  });

  console.log('[Seed] Database seeding completed successfully.');
}
