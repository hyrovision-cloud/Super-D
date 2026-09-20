# Multi-Branch Hospital Management & Administration Platform
## Interactive Client Demo Implementation Plan (Release D0)

| Field | Value |
|---|---|
| Document | `docs/demo-plan.md` |
| Version | 1.0.0 |
| Baseline Reference | `spec.md` (v1.0.0) |
| Target Release | D0 — Interactive Client Demo (Fictional Data Only) |
| Architecture | React + TypeScript + Tailwind CSS (Vite SPA) |
| Target Devices | Desktop (1280px, 1440px), Tablet (768px, 1024px), Mobile (360px, 390px, 430px) |
| Locale / Currency / Date | India / INR (`₹`) / `DD-MM-YYYY` (`Asia/Kolkata`) |

---

## 1. Executive Summary & Objective

The objective is to construct a responsive web application demonstrating the **Hospital Management & Administration Platform** for a multi-branch hospital chain operating across **Trichy**, **Chennai**, **Madurai**, and **Pudukkottai**.

This build strictly adheres to `spec.md` as the single source of truth:
1. **Interactive Client Demo (D0)**: Focuses on high fidelity, realistic responsive UX, role-based workflows, and coherent mock data.
2. **Strict Fictional Data**: All data represents fictional Indian healthcare entities. No real patient, clinical, employee, credential, or financial data is used.
3. **Reconciled Data Model**: Dashboard metrics, appointment cards, complaint counts, finance sums, and report tables reconcile mathematically across all filters.
4. **Mock API Boundary**: Clean typed service layer (`services/mock/*.ts`) mimicking future `/api/v1` REST endpoints, permitting an eventual migration to production Node.js/Express + MongoDB without UI redesign.
5. **State & Persistence**: In-memory store with `localStorage` caching so interactions (adding patients, booking appointments, approving/rejecting leaves, resolving complaints) survive refreshes, with a visible "Reset Demo Data" option.

---

## 2. Technology Stack & Architectural Structure

### 2.1 Core Stack
- **Framework & Runtime**: React 18/19 with TypeScript in strict mode.
- **Build Tool**: Vite (fast HMR, optimized production build).
- **Styling**: Tailwind CSS configured with the authoritative color palette from `spec.md` Section 12.4.
- **Routing**: `react-router-dom` v6/v7 with role-guarded route layout.
- **Icons**: `lucide-react` for enterprise medical & administration iconography.
- **Charts**: `recharts` for responsive, accessible, theme-aligned data visualizations.
- **Utility**: `clsx` + `tailwind-merge` for ergonomic dynamic classes.

### 2.2 Directory Hierarchy
Strictly conforming to the specified directory architecture:
```text
src/
  app/
    router/            # Route definitions, guards, role-based route matchers
    providers/         # AuthProvider, BranchProvider, NotificationProvider, DemoStoreProvider
  components/
    layout/            # AppShell, DesktopSidebar, TopNav, MobileNav, MoreDrawer, DemoBanner
    ui/                # Button, Modal, Drawer, Badge, Toast, Tabs, Card, KPICard, Dropdown, Skeleton
    charts/            # RevenueChart, AppointmentTrendChart, MarketingConversionChart, BranchComparisonChart
    tables/            # DataTable, MobileRecordCard, TablePagination, TableEmptyState
    forms/             # Input, Select, Textarea, Checkbox, Radio, DatePicker, SearchBar, FilterSheet
  features/
    auth/              # Login, RoleSelector, UserProfileModal
    dashboards/        # OwnerDashboard, AdminDashboard, DoctorDashboard, BranchSummary
    branches/          # BranchList, BranchDetailModal, BranchFormModal
    users/             # UserList, UserFormModal, UserStatusToggle
    roles/             # RoleList, PermissionMatrixTable, ScopeSelector
    patients/          # PatientList, PatientRegistrationModal, PatientProfileView, MedicalRecordsTab
    appointments/      # AppointmentCalendar, AppointmentList, AppointmentCreateModal, StatusTransitionModal
    employees/         # EmployeeList, EmployeeProfileModal, AttendanceSummary
    leave/             # LeaveRequestList, LeaveDecisionModal (mandatory rejection comment), LeaveSubmitModal
    complaints/        # ComplaintsDashboard, ComplaintDetailDrawer, AssignComplaintModal, ResolutionModal
    marketing/         # CampaignList, AdPerformanceTable, DigitalContentGrid, LeadEnquiryFunnel
    finance/           # RevenueDashboard, IncomeRecordTable, NewIncomeModal, CategoryBreakdown
    reports/           # ReportBuilder, ScopedPreviewTable, MockExportModal
  data/
    seed/              # Seed data for branches, users, roles, patients, doctors, appointments, etc.
  services/
    mock/              # Typed async mock services simulating REST /api/v1
    api/               # Shared response types, pagination types, error envelope types
  hooks/               # useAuth, useBranch, usePagination, useDebounce, useMediaQuery
  lib/                 # Formatters (currency, date, phone), storage helpers, validators
  types/               # Domain entities (Branch, User, Patient, Appointment, Employee, Leave, Complaint, etc.)
  styles/              # Tailwind base, components, utilities, design tokens
```

---

## 3. Design System & Tokens

Implemented in Tailwind CSS matching `spec.md` Section 12.4:
- **Primary Navy**: `#123B5D` (Sidebar, headers, primary brand presence)
- **Primary Blue**: `#2563EB` (Interactive primary buttons, active links, accents)
- **Healthcare Teal**: `#0F766E` (Clinical highlights, verified status, medical badges)
- **Background**: `#F6F8FB` (Calm, neutral enterprise background)
- **Surface**: `#FFFFFF` (Cards, modals, table surfaces)
- **Text Main**: `#172033` (High contrast, readable typography)
- **Text Secondary**: `#64748B` (Subtitles, metadata, table headers)
- **Border**: `#E2E8F0` (Subtle dividers, input borders)
- **Status Colors**:
  - Success: `#16A34A` (Completed, Approved, Active, Present)
  - Warning: `#D97706` (Pending review, Under review, Late, In progress)
  - Critical: `#DC2626` (Cancelled, Rejected, Overdue, Escalated, Emergency)

---

## 4. Demo Roles & Navigation Matrix

| Role | Accessible Navigation Items | Default Landing Page |
|---|---|---|
| **Hospital Owner** | Owner Dashboard, Branches, Patients, Appointments, Workforce, Complaints, Marketing, Finance, Reports | `/dashboards/owner` |
| **Global Admin** | Admin Dashboard, Branches, Users, Roles & Permissions, System Config, Audit Logs | `/dashboards/admin` |
| **Branch Manager** | Branch Operations, Patients, Appointments, Employees, Leave Review, Complaints, Revenue Summary | `/dashboards/owner` (scoped) |
| **Doctor** | Doctor Schedule, Today's Appointments, Assigned Patients, Medical Records, Own Leaves | `/appointments` |
| **HR Manager** | Employee Directory, Attendance Log, Leave Approvals, Replacement Mapping | `/employees` |
| **Finance Manager**| Revenue Dashboard, Daily Collections, Income Records, Category Breakdown, Financial Reports | `/finance` |
| **Marketing Manager**| Campaign Tracking, Ad Spend & CPL, Digital Content (Reels/Shorts), Leads & Enquiries | `/marketing` |
| **Complaints Manager**| Case Inbox, SLA Monitor, Case Assignment, Resolution & Escalations | `/complaints` |
| **Receptionist** | Patient Search & Registration, Appointment Booking, Check-in Desk | `/patients` |

---

## 5. Implementation Phases & Milestones

### Phase 1: Project Scaffolding & Core Architecture
1. Initialize Vite + React + TypeScript in project root.
2. Install dependencies: `tailwindcss`, `postcss`, `autoprefixer`, `lucide-react`, `recharts`, `react-router-dom`, `clsx`, `tailwind-merge`.
3. Configure `tailwind.config.js` with color tokens and responsive breakpoints.
4. Establish domain TypeScript types (`types/index.ts`) matching `spec.md` Section 8 & 10.
5. Setup mock data storage layer with seed data in `data/seed/` and localStorage sync.
6. Create mock service layer (`services/mock/*.ts`) returning typed async promises.

### Phase 2: Shell, Navigation & Common UI Library
1. **App Shell**: Responsive desktop sidebar + top navigation + mobile bottom navigation + slide-over drawer.
2. **Top Navigation**: Branch selector (All Branches, Trichy, Chennai, Madurai, Pudukkottai), active role badge, quick actions, notifications dropdown, user profile dropdown with "Reset Demo Data".
3. **Demo Banner**: "Demo Environment — Fictional Data (D0 Prototype)" persistent badge.
4. **Shared Components**:
   - `KPICard`, `Badge`, `Button`, `Modal`, `Drawer`, `ToastProvider`
   - `DataTable` with pagination, search, filter chips, loading skeletons, empty states
   - Mobile-specific cards replacing wide tables at `<768px`.

### Phase 3: Identity & Administration Features
1. **Screen 1: Login & Quick Role Switcher**:
   - One-click role presets (Owner, Admin, Doctor, HR, Finance, etc.) with prefilled credentials.
   - Clean login card with branding and demo banner.
2. **Screen 2: Hospital Owner Dashboard**:
   - Consolidated KPIs: Revenue, Total Patients, Appointments & Completion %, Doctors/Employees, Pending Approvals, Complaint SLA %, Marketing CPL.
   - Interactive Branch Comparison table & charts.
   - Date range selector (Today, This Week, This Month, Quarter).
3. **Screen 3: Global Admin Dashboard**:
   - System health, active users, branch status, role distribution, configuration shortcuts, audit event feed.
4. **Screen 4: Branch Management**:
   - Branch cards/table: Trichy, Chennai, Madurai, Pudukkottai with operational status, manager name, contact info, bed/consultation capacity, action to edit/view details.
5. **Screen 5: User Management**:
   - User table with role badges, assigned branch, status (Active/Disabled), Add User modal, activate/deactivate action.
6. **Screen 6: Roles & Permission Matrix**:
   - Interactive matrix displaying permissions (`patient.view`, `revenue.create`, etc.) across roles, with data scope indicator (`ORGANIZATION`, `OWN_BRANCH`, etc.).

### Phase 4: Hospital Operations Features
1. **Screen 7: Patient List & Registration**:
   - Search by patient number, name, phone, branch, status (`ACTIVE`, `FOLLOW_UP`, `ADMITTED`, `DISCHARGED`).
   - "Register Patient" modal with auto-generated ID (e.g. `PAT-TRY-1042`), demographic fields, branch selector, medical alerts.
2. **Screen 8: Patient Profile**:
   - Overview banner with avatar, vitals summary, medical alerts.
   - Tabs: Overview, Appointments History, Medical Records, Prescriptions & Discharge Summaries.
3. **Screen 9: Appointment Calendar/List & Booking**:
   - View toggle: List view and Calendar/Day view.
   - Status filters: `SCHEDULED`, `CONFIRMED`, `CHECKED_IN`, `IN_CONSULTATION`, `COMPLETED`, `CANCELLED`.
   - "New Appointment" modal with doctor selection, branch, date/time picker, reason, priority.
   - Status transition workflow modal (e.g. Check In -> Complete, or Cancel with reason).

### Phase 5: Workforce Features
1. **Screen 10: Employee Management**:
   - Employee directory with designation, branch, department, attendance badge (`PRESENT`, `ON_LEAVE`, etc.).
   - Employee detail modal with replacement mapping and contact info.
2. **Screen 11: Leave & Permission Approvals**:
   - Request list with status (`SUBMITTED`, `MANAGER_REVIEW`, `HR_REVIEW`, `APPROVED`, `REJECTED`).
   - Interactive Approval / Rejection modal: **mandatory rejection comment** as required by `spec.md` LEA-003.
   - "Submit Leave Request" modal for testing self-service submission.

### Phase 6: Cases, Marketing & Finance Features
1. **Screen 12: Complaints & Query Dashboard**:
   - Status summary cards: `NEW`, `ASSIGNED`, `UNDER_REVIEW`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`, `ESCALATED`.
   - Case table with SLA indicator (On Track / Approaching / Overdue), priority badges, confidential marker.
   - Case detail drawer with assignment, internal notes, resolution modal.
2. **Screen 13: Marketing Dashboard**:
   - Campaign summary: Google Ads, Facebook, Instagram, YouTube.
   - Metrics: Total Spend, Leads Generated, Enquiries, Conversion Rate (%), Cost per Lead (`₹`).
   - Digital Marketing Content grid (Reels, Videos, Posts) with views, likes, shares.
3. **Screen 14: Finance & Revenue Dashboard**:
   - Consolidated & branch-filtered revenue metrics.
   - Category breakdown: OP, Medical, Lab, Day Care, Dressing, KIT, Socks, Slipper, Other Collections.
   - Payment method breakdown: Cash, UPI, Card, Bank Transfer.
   - Daily income transaction table with "Record Income" modal and reversal/adjustment simulation.

### Phase 7: Reports, Analytics & Verification
1. **Screen 15: Reports & Analytics**:
   - Report generator: Choose report type (Operational, Branch, Financial, Workforce, Marketing), select branch, select date range.
   - Filtered preview table reconciling with dashboard numbers.
   - "Export PDF / CSV" mock flow with animated progress and toast feedback.
2. **Responsive Refinement**:
   - Thorough validation at 360px, 390px, 768px, 1280px, 1440px.
   - Bottom navigation bar on mobile with quick actions and More menu.
   - Filter bottom sheets and full-screen mobile detail overlays.
3. **Documentation & Demo Script**:
   - `README.md` with setup instructions, fictional data disclosure, route list.
   - `docs/demo-script.md` containing the guided walkthrough flow for client presentation.

---

## 6. Verification and Acceptance Checklist
- [ ] TypeScript strict compilation (`tsc --noEmit`) passes with 0 errors.
- [ ] Production bundle build (`npm run build`) completes successfully.
- [ ] All 15 priority routes load and render correctly.
- [ ] Role switcher seamlessly changes available routes and navigation items.
- [ ] Branch switcher updates dashboard metrics and tables consistently.
- [ ] Patient registration adds a record that appears immediately in the patient list.
- [ ] Appointment creation and status transition update the calendar and status counts.
- [ ] Leave rejection enforces non-empty comment and updates status to `REJECTED`.
- [ ] Complaint assignment and resolution update case status and SLA cards.
- [ ] Revenue totals match category breakdowns and report previews.
- [ ] Tested on Chrome mobile emulator at 390px width.
