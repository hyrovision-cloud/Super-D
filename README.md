# Aarogya Super Speciality Hospitals — Multi-Branch Platform Demo (Release D0)

> **DEMO ENVIRONMENT — FICTIONAL DATA ONLY**  
> All patient names, staff profiles, identification numbers (UHID, Aadhaar, PAN), medical records, contact numbers, and monetary figures in this demonstration are entirely simulated for platform evaluation purposes.

---

## 1. Executive Summary & Purpose

This repository delivers the **Release D0 Interactive Demonstration** of the **Aarogya Multi-Branch Hospital Management & Administration Platform**, built strictly according to the product specifications in [`spec.md`](./spec.md).

The platform models operational workflows for a 4-branch tertiary care hospital network in Tamil Nadu:
- **Trichy (Main Hub / Flagship)** — Tertiary & Emergency Center (250 beds)
- **Chennai (Speciality)** — Advanced Cardiac & Oncology Center (350 beds)
- **Madurai (Regional)** — Multi-Speciality Care Center (180 beds)
- **Pudukkottai (Outreach)** — Rural & Outpatient Center (75 beds)

Release D0 serves as a high-fidelity client demo for executive stakeholders, hospital directors, department heads, and clinicians to test user flows, role-based security boundaries, clinical workflows, and administrative dashboards before backend and cloud infrastructure are deployed.

---

## 2. Technology Stack & Architecture

- **Frontend Core**: React 18 with TypeScript 5 (Strict Mode enabled, zero `any` policy)
- **Build System**: Vite 5 with Hot Module Replacement (HMR)
- **Styling & Design System**: Tailwind CSS configured with exact tokens from `spec.md` Section 12.4 (Primary Deep Navy `#0F2942`, Clinical Blue `#2563EB`, Mint Teal `#0D9488`, Warning Amber `#D97706`, Critical Coral `#E11D48`)
- **Icons**: Lucide React
- **Client Mock Architecture**:
  - Reconciled Mock Service Layer implementing real backend service contracts.
  - Persistent LocalStorage cache (`aarogya_demo_store_v1`) supporting in-session mutations (creates, status updates, approvals, rejections).
  - One-click demo state reset restoring baseline seed data.
- **Indian Healthcare Standards**:
  - Currency: Indian Rupee (`₹` / INR formatting)
  - Date & Time: `DD-MM-YYYY` / 12-hour format (`Asia/Kolkata` IST timezone)
  - Medical Record Identifiers: UHID (`UHID-TRY-XXXX`), Employee ID (`EMP-XXXX`), IPD/OPD Bill Numbers.

---

## 3. Quick Start & Local Execution

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Run

```bash
# 1. Clone the repository
git clone <repo-url>
cd Super-D

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The application will start on **`http://localhost:3000`** (or the next available port if port 3000 is occupied).

### Validation & Build Commands

```bash
# Type check without emitting files (Zero errors required)
npx tsc --noEmit

# Production bundle build
npm run build

# Preview production build locally
npm run preview
```

---

## 4. Demo Role Credentials Matrix

The system includes pre-configured demo accounts covering all 9 defined operational roles. Use the quick **Role Switcher** dropdown in the top navigation bar or log in directly:

| Role | Demo Email | Password | Default Landing | Scope / Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin / Group Owner** | `owner@aarogya.com` | `admin123` | `/dashboards/owner` | Cross-branch financial oversight, executive KPIs, full system audit |
| **Branch Admin (Trichy)** | `admin.trichy@aarogya.com` | `admin123` | `/dashboards/admin` | Branch operational control, staff approvals, facility management |
| **Doctor / Consultant** | `doctor.karthik@aarogya.com` | `doctor123` | `/appointments` | Clinical queue, patient EMR, diagnosis, prescriptions, discharge |
| **Nurse / In-Patient Lead** | `nurse.meenakshi@aarogya.com` | `nurse123` | `/patients` | Inpatient rounds, vitals charting, medication logs, ward oversight |
| **Receptionist / Front Desk** | `reception.priya@aarogya.com` | `reception123` | `/patients` | Patient registration, appointment booking, queue management |
| **Pharmacist** | `pharma.ravi@aarogya.com` | `pharma123` | `/finance` | Prescription dispensing, drug inventory, pharmacy billing |
| **Lab Technician** | `lab.suresh@aarogya.com` | `lab123` | `/patients` | Diagnostic test queues, specimen logging, lab report publishing |
| **Accountant / Billing Clerk** | `billing.anand@aarogya.com` | `billing123` | `/finance` | 9-category hospital revenue ledger, cash/UPI receipts, insurance |
| **Marketing Lead** | `marketing.divya@aarogya.com` | `marketing123` | `/marketing` | Health camp campaigns, patient lead acquisition, outreach tracking |

*Tip: Any user account can also be tested by clicking on the quick role selector in the Top Navigation bar at any time.*

---

## 5. Screen & Route Directory

All 15 required platform screens have been implemented and verified:

| # | Route | Screen Name | Description & Key Capabilities |
| :--- | :--- | :--- | :--- |
| 1 | `/login` | **Authentication & Sign-In** | Branded split-screen portal with 1-click role switcher buttons and security credentials. |
| 2 | `/dashboards/owner` | **Group Owner Dashboard** | Cross-branch consolidated revenue, active patient census, bed occupancy, doctor rosters, and comparative metrics. |
| 3 | `/dashboards/admin` | **Branch Admin Dashboard** | Branch-scoped operational cockpit (Trichy/Chennai/Madurai/Pudukkottai) with live queue and department metrics. |
| 4 | `/branches` | **Branch Management** | 4-branch directory, address, emergency contact lines, active departments, bed counts, and branch detail views. |
| 5 | `/users` | **User Management** | Complete personnel directory with role filters, branch assignments, status toggles, and user creation modal. |
| 6 | `/roles` | **Roles & Permissions Matrix**| Dynamic security matrix mapping 9 operational roles against 30+ granular permission gates. |
| 7 | `/patients` | **Patient Directory & Registry** | Searchable patient registry with branch filtering, quick UHID lookup, and full 2-step registration modal. |
| 8 | `/patients/:patientId` | **Patient 360° Profile** | Longitudinal EMR with clinical notes, vitals history, active prescriptions, lab investigations, and Discharge Summary viewer. |
| 9 | `/appointments` | **Appointments & Scheduling** | Multi-view calendar and schedule list with doctor filtering, status workflow (Scheduled $\to$ Arrived $\to$ Completed), and booking modal. |
| 10| `/employees` | **Staff & HR Directory** | Medical, nursing, and administrative staff directory with department filtering, license numbers, and shift assignments. |
| 11| `/leave` | **Leave Approvals Engine** | Leave request management with **mandatory rejection comment enforcement** and one-click approvals. |
| 12| `/complaints` | **Complaints & SLA Monitor** | Grievance resolution cockpit with real-time SLA countdown badges (Normal vs Breach) and resolution notes logging. |
| 13| `/marketing` | **Marketing & Health Outreach**| Health camp campaign tracking, lead acquisition pipelines, source attribution (Meta, Google, Community Camp), and ROI analytics. |
| 14| `/finance` | **Finance & Revenue Ledger** | Financial tracking with **9 mandatory hospital revenue categories**, payment mode breakdowns (Cash/UPI/Card/TPA), and receipt generator. |
| 15| `/reports` | **Reports & Data Analytics** | Multi-domain analytics engine with real-time branch scoping and instant **CSV & JSON exports**. |

---

## 6. Key Demo Capabilities & Interactions

### A. Dynamic Branch Scoping
- The active branch can be toggled at any time using the header branch selector (`All Branches`, `Trichy`, `Chennai`, `Madurai`, `Pudukkottai`).
- When a specific branch is selected, all KPIs, patient lists, appointment schedules, employee directories, and financial ledgers immediately filter to that branch.

### B. Leave Approval & Mandatory Rejection Reason
- Navigate to `/leave` and locate any pending leave request.
- Clicking **Reject** opens a modal requiring a formal justification reason.
- The confirmation button remains disabled / validates until a meaningful reason (e.g. *"Staffing shortage on duty shift"*) is entered, preventing accidental or unjustified rejections.

### C. Grievance Tracking & SLA Enforcement
- Navigate to `/complaints` to inspect patient and attendant feedback.
- Tickets approaching or exceeding SLA thresholds display red **"Breach"** or amber **"Attention"** indicators.
- Resolving a ticket requires logging the formal corrective action taken.

### D. Hospital Revenue Breakdown (9 Mandatory Categories)
- The Finance module (`/finance`) enforces the complete 9-category hospital income breakdown:
  1. **OPD Consultation**
  2. **IPD Bed Charges**
  3. **Lab / Diagnostics**
  4. **Pharmacy**
  5. **Surgical Procedures**
  6. **Emergency / Casualty**
  7. **Teleconsultation**
  8. **Ambulance Services**
  9. **Miscellaneous**
- Recording a new income transaction instantly updates branch revenue totals, cashless share calculations, and the live transaction ledger.

### E. Mobile-First Responsive Experience
- Test on viewport widths down to **390px** (e.g., iPhone 14/15, Samsung Galaxy).
- Desktop side navigation automatically shifts to an accessible **Mobile Bottom Navigation Bar** with a slide-up drawer for secondary modules.
- Tables gracefully transform into optimized touch-friendly card stacks.

---

## 7. Data Reset & State Management

All mutations made during demonstration sessions (adding patients, scheduling appointments, approving/rejecting leave, resolving complaints, logging income) are persisted in the browser's `localStorage`.

To restore the environment to baseline seed data at any time:
1. Open the **User Profile Dropdown** in the top right corner of the navigation bar.
2. Click **"Reset Demo Data"**.
3. Confirm the dialog prompt. The application will re-initialize all collections from clean seed fixtures.

Alternatively, execute in the browser console:
```javascript
localStorage.removeItem('aarogya_demo_store_v1');
window.location.reload();
```

---

## 8. Production Implementation Roadmap (Release D1+)

The D0 demo architecture was designed with drop-in compatibility for the upcoming production MERN backend:

```
┌────────────────────────────────────────────────────────┐
│                   React + TypeScript UI                │
│                 (AppShell, Features, Views)            │
└───────────────────────────┬────────────────────────────┘
                            │
              ┌─────────────▼─────────────┐
              │     Service Abstraction   │
              │  (client/src/services/*)  │
              └───────┬─────────────┬─────┘
                      │ (D0 Demo)   │ (D1+ Production)
       ┌──────────────▼─────┐ ┌─────▼────────────────────┐
       │ LocalStorage Mock  │ │ Axios / Fetch Client     │
       │   Service Layer    │ │ Base URL: /api/v1/*      │
       └────────────────────┘ └──────────┬───────────────┘
                                         │ REST + WebSockets
                              ┌──────────▼───────────────┐
                              │  Node.js + Express API   │
                              │ (JWT Auth, RBAC Guards)  │
                              └──────────┬───────────────┘
                                         │ Mongoose ORM
                              ┌──────────▼───────────────┐
                              │    MongoDB Database      │
                              │  (Sharded Multi-Tenant)  │
                              └──────────────────────────┘
```

### Production Milestones:
1. **D1 — Core Engine & Security**:
   - Express REST API (`/api/v1`) with TypeScript and validation via Zod.
   - MongoDB multi-tenant schema with branch isolation indices.
   - HTTP-only secure cookie authentication with JWT refresh rotation.
2. **D2 — Clinical Integrations & ABDM**:
   - National Health Stack (ABDM / Ayushman Bharat Digital Mission) M1/M2/M3 compliance.
   - HL7 / FHIR compliant diagnostic data interchange.
   - S3/MinIO signed URL medical imaging and digital prescription storage.
3. **D3 — Telephony & Financial Gateways**:
   - SMS / WhatsApp notifications via Gupshup / Twilio for appointment reminders.
   - Razorpay & Pine Labs POS integration for automated hospital cashier reconciliations.
   - Real-time queue and ward status notifications powered by Socket.io.
