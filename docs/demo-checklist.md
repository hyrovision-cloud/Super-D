# Requirement-to-Screen Checklist (Release D0 Demo)

| Screen # | Screen Name | Route Path | Spec Requirements Covered | Primary Interactions | Demo Role Visibility | Status |
|---|---|---|---|---|---|---|
| **01** | Login with Role Selection | `/login` | ADM-001, Sec 6.4, Sec 12.1 | Quick role selector presets, fictional credentials, demo environment banner | Public / Unauthenticated | Complete (Verified) |
| **02** | Hospital Owner Dashboard | `/dashboards/owner` | OWN-001, OWN-002, Sec 12.1 | Branch filter, period picker, consolidated KPIs (Revenue, Patients, Appointments, Approvals, Complaints, Marketing), branch comparison table & charts | Hospital Owner, Global Admin | Complete (Verified) |
| **03** | Global Admin Dashboard | `/dashboards/admin` | ADM-001–006, Sec 12.1 | System health metrics, active users, branch uptime, role distribution, audit activity feed | Global Admin | Complete (Verified) |
| **04** | Branch Management | `/branches` | ADM-004, Sec 7 | Branch listing (Trichy, Chennai, Madurai, Pudukkottai), operational status badges, branch detail modal, add/edit branch modal | Global Admin, Hospital Owner | Complete (Verified) |
| **05** | User Management | `/users` | ADM-001, Sec 6.1 | User search, role filter, status toggle (Active/Disabled), Add User modal, session revoke action | Global Admin | Complete (Verified) |
| **06** | Roles and Permission Matrix | `/roles` | ADM-002, ADM-003, Sec 6.3 | Module permission matrix (`<module>.<action>`), data scope display (`ORGANIZATION`, `OWN_BRANCH`, etc.), role creation/editing | Global Admin | Complete (Verified) |
| **07** | Patient List & Registration | `/patients` | PAT-001, PAT-002, PAT-004 | Search by name/phone/ID, status filter (`ACTIVE`, `FOLLOW_UP`, `ADMITTED`, `DISCHARGED`), branch filter, Register Patient modal | Receptionist, Doctor, Branch Manager, Hospital Owner | Complete (Verified) |
| **08** | Patient Profile | `/patients/:patientId` | PAT-003, PAT-005, DIS-001 | Demographic summary banner, tabs (Overview, Appointments, Medical Records, Prescriptions, Discharge Summaries), Add Medical Note modal | Doctor, Receptionist, Branch Manager, Hospital Owner | Complete (Verified) |
| **09** | Appointment Calendar & Booking | `/appointments` | APT-001, APT-002, APT-003 | Day/List view toggle, doctor/branch filter, status filters, Create Appointment modal, Status Transition workflow (Scheduled -> Checked In -> Completed / Cancelled) | Doctor, Receptionist, Branch Manager, Hospital Owner | Complete (Verified) |
| **10** | Employee Management | `/employees` | EMP-001, EMP-002, ATT-001 | Employee directory, department & branch filters, daily attendance status (`PRESENT`, `ABSENT`, `ON_LEAVE`, etc.), employee detail modal | HR Manager, Branch Manager, Global Admin, Hospital Owner | Complete (Verified) |
| **11** | Leave & Permission Approval | `/leave` | LEA-001, LEA-002, LEA-003 | Multi-stage request inbox (`SUBMITTED`, `MANAGER_REVIEW`, `HR_REVIEW`), Approve modal, Reject modal with **mandatory comment**, New Request modal | HR Manager, Branch Manager, Doctor (own), Hospital Owner | Complete (Verified) |
| **12** | Complaints & Query Dashboard | `/complaints` | CQM-001–005 | Status workflow cards (`NEW`, `ASSIGNED`, `UNDER_REVIEW`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`), SLA tracking, priority badge, assign user, resolve case drawer | Complaints Manager, Branch Manager, Hospital Owner | Complete (Verified) |
| **13** | Marketing Dashboard | `/marketing` | MKT-001–005, DGM-001–003 | Campaign spend, impressions, leads, enquiries, CPL (`₹`), conversion rate (%), digital content table (Reels, Videos, Posts) across Meta/Google/YouTube | Marketing Manager, Hospital Owner | Complete (Verified) |
| **14** | Finance & Revenue Dashboard | `/finance` | FIN-001–005 | Daily collection, category breakdown (OP, Medical, Lab, Day Care, etc.), payment method breakdown (Cash, UPI, Card), Record Income modal, adjustment entry | Finance Manager, Hospital Owner | Complete (Verified) |
| **15** | Reports & Analytics | `/reports` | REP-001–004 | Report type selector (Revenue, Patient Footfall, Workforce, Complaints), branch filter, date range filter, preview data table, mock PDF/CSV export with success toast | Hospital Owner, Finance Manager, Global Admin | Complete (Verified) |

---

## Cross-Cutting & Responsive Verification Matrix

| Area | Requirement | Expected Behavior | Verification Status |
|---|---|---|---|
| **Role Navigation** | Only relevant navigation shown per role | Doctor sees `/appointments`, `/patients`, `/leave`; Finance sees `/finance`, `/reports`, etc. | Complete (Verified) |
| **Branch Scope** | Switching branch in TopNav updates data | Changing to "Chennai" filters patients, appointments, revenue, and complaints to Chennai branch only | Complete (Verified) |
| **Reconciliation** | Totals match underlying records | Dashboard Revenue = Sum of Income records; Patient count = Total patients in seed | Complete (Verified) |
| **Persistence** | Demo interactions persist in localStorage | Registering patient PAT-CHN-1055 remains in patient list on page reload | Complete (Verified) |
| **Reset Demo** | Restore seed baseline | User clicks "Reset Demo Data" in user dropdown; store reverts to pristine seed state | Complete (Verified) |
| **Mobile Shell (390px)** | Bottom nav + More drawer | 4-5 primary bottom items; hamburger/more drawer for remaining; touch targets >= 44px | Complete (Verified) |
| **Mobile Tables** | Responsive table transformation | Wide desktop tables transform to card stacks on small screens | Complete (Verified) |
| **Demo Banner** | Visible non-production indicator | Sticky badge: "Demo Environment — Fictional Data" visible at all times | Complete (Verified) |
