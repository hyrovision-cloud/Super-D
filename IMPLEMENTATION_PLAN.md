# SUPER D — Master Implementation Plan
**Centralized Multi-Branch Hospital Management Web Application Prototype**
**Document Version:** 1.0  
**Target Branch:** `frontend-development`  
**Reference Document:** `SDD.md` (v1.0) & UI Reference Screenshots in `docs/reference-ui/`

---

## 1. Existing Project Analysis

### Current Codebase State
- **Git Branch:** `frontend-development` (created from `main`).
- **Framework & Build System:** React 18.3.1, Vite 6.0.3, TypeScript 5.6.3.
- **Styling:** Tailwind CSS 3.4.17 with PostCSS and Autoprefixer.
- **Iconography & Visuals:** Lucide React 0.468.0.
- **Charts:** Recharts 2.15.0.
- **Routing:** React Router DOM 6.28.0 (`createBrowserRouter`).
- **Utilities:** `clsx`, `tailwind-merge`.
- **Initial Code Baseline:** The project was initialized with a generic hospital administration template titled "Aarogya Hospital" featuring 9 generic roles (`Hospital Owner`, `Global Admin`, `Branch Manager`, `Doctor`, `HR Manager`, `Finance Manager`, `Marketing Manager`, `Complaints and Query Manager`, `Receptionist`) and routes (`/dashboards/owner`, `/patients`, `/appointments`, etc.).
- **Build Status:** Verified passing `npm run build` after `npm install`.

### Critical Finding
The initial template is misaligned with the Super D product requirements defined in `SDD.md` and the supplied reference screenshots:
1. Branding is currently "Aarogya Hospital" instead of "Super D" ("Care Today, Healthier Tomorrow" and "Compassion / Care / Community").
2. Roles in existing code (9 generic personas) do not match the 7 official Super D roles defined in SDD Section 5 & 19.
3. Routes do not match the SDD Section 18 route architecture (`/dashboard`, `/advertisements`, `/income-reports`, `/revenue-accounts`, `/attendance`, `/grievances`, `/patient-discharge`, `/leave-permission`, `/profile`, `/settings`, `/access-denied`).
4. Visual design (currently dark navy sidebar and generic tables) does not match the crisp, premium healthcare UI shown in the reference screenshots (light sidebar with hospital watermark, bright blue active states, 4-panel filter cards, 2x2 platform/status checkboxes, exact KPI cards, split report tables).

---

## 2. Existing Technology Stack Preservation

We strictly preserve the existing stack without introducing unnecessary frameworks or packages:
- **Core:** HTML5 + TypeScript + React 18
- **Bundler:** Vite 6
- **CSS:** Tailwind CSS 3 (configured with custom tokens matching Super D design)
- **Icons:** Lucide React
- **Charts:** Recharts (AreaChart, BarChart, LineChart, PieChart/Donut)
- **Routing:** React Router DOM v6
- **Data/State:** Typed in-memory state with mockStore pattern, React Context, and localStorage persistence for presentation stability.

No packages will be removed or rewritten unnecessarily.

---

## 3. Existing Architecture

- **`src/App.tsx`:** Root app wrapping providers (`ToastProvider`, `AuthProvider`, `BranchProvider`, `RouterProvider`).
- **`src/app/providers/`:**
  - `AuthProvider.tsx`: Role state, demo role switcher, user profile, permission checks.
  - `BranchProvider.tsx`: Active branch selector (`Trichy`, `Chennai`, `Madurai`, `Pudukottai` + All Branches).
  - `ToastProvider.tsx`: User feedback notifications for CRUD actions.
- **`src/components/layout/`:**
  - `AppShell.tsx`: Application container coordinating Sidebar, TopNav, MobileNav, and content outlet.
  - `DesktopSidebar.tsx`: Persistent desktop navigation.
  - `TopNav.tsx`: Top header with branch selector, notifications menu, and user/role avatar dropdown.
  - `MobileNav.tsx`: Responsive drawer for tablet/mobile.
- **`src/components/ui/`:** Reusable UI primitives (`Button`, `Card`, `Badge`, `Modal`, `KPICard`, `Drawer`, `Tabs`).
- **`src/components/tables/`:** `DataTable` with search, sorting, and pagination.
- **`src/services/`:** `mockStore.ts` managing mock domain entities with subscription and localStorage hydration.

---

## 4. Existing Completed Features

- Functional mockStore infrastructure with persistence and listener subscriptions.
- Working base UI components (`Card`, `Badge`, `Button`, `Modal`, `KPICard`, `Tabs`).
- Working Toast notification context for interactive feedback.
- Vite build and TypeScript compilation passing cleanly.

---

## 5. Existing Incomplete / Misaligned Features

1. **Brand Identity:** Incorrect logo, name, and color theme across login, sidebar, and headers.
2. **Role Model:** Mismatched role definitions and permissions.
3. **Route Architecture:** Old routes (`/dashboards/owner`, `/appointments`, `/complaints`, `/finance`, etc.) need to be replaced/mapped to official SDD routes (`/dashboard`, `/advertisements`, `/income-reports`, `/revenue-accounts`, `/attendance`, `/grievances`, `/patient-discharge`, `/leave-permission`, `/profile`, `/settings`, `/access-denied`).
4. **Screens Missing or Incomplete:**
   - Super Admin: Advertisement Management (exact screenshot layout), Income Reports (exact charts and WhatsApp-sourced tables), Patient Discharge Summary.
   - Admin: Attendance Management (tabs, filters, HR review stage, Approve/Reject), Grievances (4 KPI cards, concern types, view modal).
   - HR: Attendance Management (cross-branch visibility, pending review queue).
   - Branch Doctor: Attendance Management (branch-scoped) & Patient Discharge Summary (3 KPI cards, table with entry/exit dates and age).
   - Branch Manager: Attendance Management (branch approval controls).
   - Staff: Advertisement Management (with Add form), Revenue & Accounts (with Add form and income/expense breakdown), Patient Discharge Management (clean list/placeholder without unconfirmed fields).
   - Employee: Leave & Permission Request (2-day advance notice banner, auto-calculated duration, 0/200 char count, attachment, My Requests table).
   - Login Screen: Super D branded login with quick role switcher for all 7 roles.
   - Role-Specific Dashboards: Distinct executive dashboards for each of the 7 roles matching SDD Section 9 and preview infographics.

---

## 6. SDD Requirements (Functional Source of Truth)

- **Branches (4):** Trichy, Chennai, Madurai, Pudukottai.
- **Roles (7):**
  1. Super Admin: Organization-wide monitoring, ads, income reports, discharge summary.
  2. Admin: Cross-branch administration, attendance management, employee grievances.
  3. HR: Attendance management, cross-branch review workflows.
  4. Branch Doctor: Branch-scoped attendance and patient discharge operations.
  5. Branch Manager: Branch-scoped attendance and approval workflows.
  6. Staff: Branch-scoped ads, revenue & accounts, patient discharge management.
  7. Employee: Own leave and permission requests (self-service).
- **Attendance Workflow:** Submitted → HR Review → Approved / Rejected → Finalized (separate `status` and `reviewStage`).
- **Advance Notice Policy:** 2-day advance submission validation.
- **Strict Prohibition on Invention:**
  - Do NOT invent unconfirmed Staff Patient Discharge fields (keep a clean list/placeholder).
  - Do NOT invent unconfirmed Manager vs HR approval hierarchy (keep flexible/configurable).
  - Keep prototype authorization frontend-simulated while maintaining clean service boundaries.

---

## 7. Gap Analysis

| Requirement Area | Existing Codebase State | Target State (SDD + Reference Screenshots) | Action |
|---|---|---|---|
| Branding | Aarogya Hospital | Super D (Hospital Management Platform, Care Today, Healthier Tomorrow) | Update logos, branding, metadata, sidebar watermark, titles |
| Roles | 9 legacy roles | 7 exact roles: Super Admin, Admin, HR, Branch Doctor, Branch Manager, Staff, Employee | Update `RoleType`, `User`, `SystemRole` types and seed data |
| Demo Accounts | Old email addresses | Exact demo accounts from SDD Section 19 | Seed exact 7 demo accounts with passwords prefilled |
| Navigation Sidebar | Dark navy, generic groups | Light off-white `#f8fafc`, blue active pill `#0d6efd`, hospital illustration, role-specific items | Redesign `DesktopSidebar` and `MobileNav` |
| Route Structure | Legacy routes | SDD Section 18 routes (`/dashboard`, `/advertisements`, `/income-reports`, `/revenue-accounts`, `/attendance`, `/grievances`, `/patient-discharge`, `/leave-permission`, `/profile`, `/settings`, `/access-denied`) | Refactor `AppRouter.tsx` and centralized RBAC guards |
| Advertisement Mgmt | Generic marketing view | Exact screenshot layout: 4 filter cards (Branch, Category, Platform 2x2 checkboxes, Status 2x2 checkboxes), search, table with lead/clicks, View/Edit/Delete modals | Implement pixel-accurate `AdvertisementManagementView` |
| Income Reports | Basic finance view | Exact screenshot layout: 5 KPI cards, branch comparison bar chart, 11-day multi-line revenue chart, 11.09.2026 branch comparison table, revenue composition donut chart, Trichy branch daily report table | Implement pixel-accurate `IncomeReportsView` with exact WhatsApp data |
| Patient Discharge | Legacy patient list | Exact screenshot layouts: Super Admin discharge summary, Doctor discharge summary (3 KPI cards, entry/exit date-time, age, View modal), Staff placeholder/list | Implement pixel-accurate `PatientDischargeSummaryView` |
| Attendance Mgmt | Old leave approval list | Exact screenshot layout: Tabs (Leave Requests, Permissions, Attendance), filter bar with branch dropdown, leave type, dates, review stage, table with multi-line employee role, branch icon, reason, review stage badge, Approve/Reject buttons | Implement pixel-accurate `AttendanceManagementView` |
| Grievances (Concerns)| Generic complaint tickets | Exact screenshot layout: 4 KPI cards (Total 24, Pending 10, Resolved 12, Closed 2), filter row, table with category pills (Facilities, HR Policy, etc.), Status badges, detail modal | Implement pixel-accurate `GrievancesView` |
| Staff Revenue & Accounts | Not implemented | Exact screenshot layout: filter row, table with Income/Expense pills, added by, reference no., plus Add Revenue/Expense form panel | Implement pixel-accurate `RevenueAccountsView` |
| Employee Self-Service | Not implemented | Exact screenshot layout: 2-day warning banner, form with auto-calculated duration, char counter, attachment, My Requests table | Implement pixel-accurate `EmployeeLeaveRequestView` |
| Role Dashboards | 2 dashboards (Owner, Admin) | 7 distinct role dashboards with KPIs, quick actions, and relevant charts | Implement `RoleDashboardView` dynamically rendering role content |
| Login Screen | Old dark modal | Exact screenshot layout: Super D teal/green heart logo, email/password fields, remember me, quick role selector tabs/buttons | Redesign `LoginView` |

---

## 8. UI Implementation Plan & Design System

### Visual Language & Tokens
- **Color Palette:**
  - Primary Brand Blue: `#0d6efd` / `#2563eb` (active navigation, primary buttons, highlights)
  - Sidebar Background: `#f8fafc` / `#f1f5f9` with subtle border `#e2e8f0`
  - Content Workspace Background: `#f8fafc`
  - Card Surfaces: `#ffffff` with soft border `rgba(226, 232, 240, 0.8)` and subtle shadow `0 1px 3px 0 rgba(0, 0, 0, 0.05)`
  - Text: Heading `#0f172a`, Body `#334155`, Muted `#64748b`, Subtle `#94a3b8`
  - Status Badges:
    - Running / Approved / Active / Discharged: Green (`bg-emerald-50 text-emerald-700 border-emerald-200`)
    - Completed / Admitted: Blue (`bg-blue-50 text-blue-700 border-blue-200`)
    - Scheduled / Pending: Orange/Amber (`bg-amber-50 text-amber-700 border-amber-200`)
    - Draft / Closed / Cancelled: Gray/Slate (`bg-slate-100 text-slate-700 border-slate-200`)
    - Rejected / Overdue: Red/Rose (`bg-rose-50 text-rose-700 border-rose-200`)
    - HR Review: Blue with active dot (`bg-blue-50 text-blue-700 border-blue-200`)
- **Typography:** Modern clean sans-serif (Inter/system-ui), strict font weights (500 medium, 600 semibold, 700 bold).
- **Hospital Watermark Illustration:** Subtle SVG illustration of modern hospital building positioned at the bottom left of the sidebar, followed by "Compassion / Care / Community" and copyright text.

---

## 9. Component Reuse Plan

- **`DesktopSidebar.tsx`:** Rewritten to match reference layout, supporting role-based navigation item filtering, active state styling, and bottom watermark.
- **`TopNav.tsx`:** Updated with hamburger toggle, branch selector (with branch scope locking for branch-scoped roles), notification popover, and role switcher dropdown for live demo inspection.
- **`FilterBar` & Filter Cards:** Reusable filter card layout (e.g. Branch, Category, Platform checkboxes, Status checkboxes).
- **`DataTable.tsx`:** Enhanced with sortable column headers (with double arrows `↕`), zebra/hover effects, custom status renderers, and responsive pagination.
- **`KPICard.tsx`:** Enhanced with colored circular icon backgrounds, trend indicators (`↑ 12% vs previous period`), and large crisp numbers.
- **`Modal.tsx` & `Drawer.tsx`:** Reused for Add/Edit forms, View details, and delete confirmation dialogs.

---

## 10. Routing & RBAC Plan

### Route Matrix
| Path | Screen Component | Permitted Roles |
|---|---|---|
| `/login` | `LoginView` | Public |
| `/dashboard` | `RoleDashboardView` | All Roles (renders role-specific dashboard) |
| `/advertisements` | `AdvertisementManagementView` | Super Admin, Staff |
| `/income-reports` | `IncomeReportsView` | Super Admin |
| `/revenue-accounts` | `RevenueAccountsView` | Super Admin, Staff |
| `/attendance` | `AttendanceManagementView` | Super Admin, Admin, HR, Branch Doctor, Branch Manager |
| `/grievances` | `GrievancesView` | Admin |
| `/patient-discharge` | `PatientDischargeSummaryView` | Super Admin, Branch Doctor, Staff |
| `/leave-permission` | `EmployeeLeaveRequestView` | Employee, HR, Branch Doctor, Branch Manager |
| `/profile` | `ProfileView` | All Roles |
| `/settings` | `SettingsView` | All Roles |
| `/access-denied` | `AccessDeniedView` | All Roles |
| `*` | Redirect to `/dashboard` | Authenticated |

### Centralized Permission Guard
A single configuration file `src/routes/rolePermissions.ts` defines:
```ts
export const ROLE_ROUTE_ACCESS: Record<RoleType, string[]> = {
  'Super Admin': ['/dashboard', '/advertisements', '/income-reports', '/patient-discharge', '/profile', '/settings'],
  'Admin': ['/dashboard', '/attendance', '/grievances', '/profile', '/settings'],
  'HR': ['/dashboard', '/attendance', '/leave-permission', '/profile', '/settings'],
  'Branch Doctor': ['/dashboard', '/attendance', '/patient-discharge', '/leave-permission', '/profile', '/settings'],
  'Branch Manager': ['/dashboard', '/attendance', '/leave-permission', '/profile', '/settings'],
  'Staff': ['/dashboard', '/advertisements', '/revenue-accounts', '/patient-discharge', '/profile', '/settings'],
  'Employee': ['/dashboard', '/leave-permission', '/profile', '/settings'],
};
```
Guarded by `<ProtectedRoute>` which redirects unauthorized roles to `/access-denied`.

---

## 11. Data and Mock-State Plan

### Exact Data Integration
To guarantee visual consistency with reference screenshots and WhatsApp source sheets:
1. **Income Reports Data:**
   - Pre-seeded with the exact numbers from WhatsApp images:
     - 11-day Revenue: Madurai (2,80,209), Chennai (2,78,907), Trichy (2,04,372), Total: ₹ 7,63,488.
     - Trichy Branch Daily Report (08.09.2026): Total Patients 26, New 4, Dressing 26, OP 34,190, Medical 11,643, Lab 1,200, Total ₹ 47,033.
     - Branch Comparison Report (11.09.2026): Madurai 63,401, Chennai 24,927, Trichy 10,068.
2. **Advertisements Data:**
   - Pre-seeded with rows from screenshot: Google Ads (Search Ads, 48 leads, ₹2,500), Meta Ads (Facebook Campaign, 36 leads, ₹1,800), YouTube (Video Promotion, 22 leads, ₹3,000), etc.
3. **Attendance & Leave Data:**
   - Pre-seeded with rows from screenshot: R. Ganesan (Sick, 3 days, Approved/Finalized), Dr. Anand Kumar (Earned, 3 days, HR Review), Divya Bharathi (Permission, 1 day, Submitted), Karthik Selvam (Casual, 2 days, Submitted), Meena Priya (Sick, 2 days, HR Review), Suresh Babu (Earned, 5 days, Submitted).
4. **Grievances Data:**
   - Pre-seeded with rows from screenshot: Divya Bharathi (Facilities, Pending), Karthik Selvam (Work Environment, Pending), R. Ganesan (HR Policy, Resolved), Meena Priya (Leave & Permission, In Review), etc.
5. **Patient Discharge Data:**
   - Pre-seeded with rows from screenshot: PT-001 Ramesh Kumar (Discharged), PT-002 Meena Devi (Admitted), PT-003 Arun Kumar (Discharged), etc.
6. **Interactive State:**
   - Adding/editing/deleting records dynamically updates the `mockStore` and immediately reflects across tables and charts without requiring page reload.

---

## 12. Screenshot / Reference Visual Checklist

Every implemented screen will be cross-referenced against its reference screenshot:
- [x] Super Admin Advertisement Management (`Super Admin Dashboard\Advertisement Management.png`)
- [x] Super Admin Income Reports (`Super Admin Dashboard\Income Reports.png`)
- [x] Super Admin Patient Discharge Summary (`Super Admin Dashboard\Patient Discharge Summary.png`)
- [x] Admin Attendance Management (`Admin Dashboard\Attendance Management.png`)
- [x] Admin Grievances (`Admin Dashboard\grievance(Employee Concerns).png`)
- [x] Branch Doctor Attendance Management (`Branch Doctor Dashboard\Attendance Management.png`)
- [x] Branch Doctor Patient Discharge Summary (`Branch Doctor Dashboard\Patient Discharge Summary.png`)
- [x] Branch Manager Attendance Management (`Manager Dashboard\Attendance management.png`)
- [x] HR Attendance Management (`HR Dashboard\Attendance Management.png`)
- [x] Staff Advertisement Management (`Staff Dashboard\Advertisement Managegement.png`)
- [x] Staff Revenue & Accounts (`Staff Dashboard\Revenue &  Accounts.png`)
- [x] Staff Patient Discharge Management (`Staff Dashboard\Patient Discharge Management.png` — placeholder/list)
- [x] Employee Leave & Permission Request (`Employees Dashboard\Leave & Permission Request.png`)
- [x] Login Screen & Role Flow (`ChatGPT Image Sep 20, 2026, 05_49_46 PM.png`)

---

## 13. Responsive Implementation Plan

- **Desktop (>= 1280px):** Full multi-column dashboard layouts, sticky sidebar, side-by-side charts, expanded tables.
- **Laptop (1024px - 1279px):** Balanced grids, 2-column or 3-column KPI card layouts, responsive chart containers.
- **Tablet (768px - 1023px):** Collapsible sidebar toggle via hamburger menu, horizontal table scrolling with fixed headers, stacked filter cards.
- **Mobile (< 768px):** Drawer sidebar, stacked cards, full-width modal forms, touch-friendly controls.

---

## 14. Error Handling & Self-Debugging Strategy

- Run `tsc --noEmit` and `npm run build` after every major implementation step.
- Diagnose and fix all type, import, or CSS errors directly using the self-debugging loop.
- Never use `any` shortcuts, suppress errors, or disable TypeScript.

---

## 15. Risk Areas and Mitigations

1. **Risk:** Overwriting existing working code when aligning routes and types.
   - **Mitigation:** Keep existing domain types compatible, extend rather than delete unnecessarily, and update mock seed data cleanly.
2. **Risk:** Inconsistent charts vs tables during demo.
   - **Mitigation:** Compute chart metrics directly from the underlying seeded mock data.
3. **Risk:** Unconfirmed workflow assumptions.
   - **Mitigation:** Adhere strictly to SDD: do not force an unconfirmed approval order or invent unconfirmed Staff discharge fields.

---

## 16. Implementation Order

1. **Step 1: Domain Types & RBAC Centralization**
   - Update `src/types/index.ts` with Super D 7 roles, branches, and entity models.
   - Create `src/routes/rolePermissions.ts` with route guards and permissions map.
2. **Step 2: Seed Data & Mock Store**
   - Update `src/data/seed/` with the exact 7 demo users, branches, advertisements, income records, attendance records, grievances, and patient discharge summaries.
   - Update `mockStore.ts` with typed CRUD operations for all entities.
3. **Step 3: Core Layout & Navigation**
   - Redesign `DesktopSidebar.tsx` to match Super D light UI with hospital watermark.
   - Update `TopNav.tsx` with role switcher and branch selector.
   - Implement `ProtectedRoute.tsx` and `RoleGuard.tsx`.
4. **Step 4: Login Screen**
   - Redesign `LoginView.tsx` with Super D heart cross logo, authentic form, and 7-role demo selector.
5. **Step 5: Role-Specific Dashboards**
   - Implement `RoleDashboardView.tsx` supporting custom dashboards for Super Admin, Admin, HR, Doctor, Manager, Staff, Employee.
6. **Step 6: Advertisement Management**
   - Implement `AdvertisementManagementView.tsx` with 4 filter cards, search, data table, and Add/Edit modal.
7. **Step 7: Income Reports**
   - Implement `IncomeReportsView.tsx` with 5 KPI cards, Recharts branch comparison, 11-day revenue multi-line chart, branch comparison table, donut chart, and daily report breakdown.
8. **Step 8: Patient Discharge Summary**
   - Implement `PatientDischargeSummaryView.tsx` with role variations (Doctor vs Super Admin vs Staff placeholder), KPI cards, and patient detail modal.
9. **Step 9: Attendance Management**
   - Implement `AttendanceManagementView.tsx` with tabs (Leave Requests, Permissions, Attendance), filter bar, review stage badge, and Approve/Reject interaction.
10. **Step 10: Grievances (Employee Concerns)**
    - Implement `GrievancesView.tsx` with 4 KPI cards, filter bar, concern type badges, and concern detail modal.
11. **Step 11: Staff Revenue & Accounts**
    - Implement `RevenueAccountsView.tsx` with income/expense filters, table, and Add Record modal.
12. **Step 12: Employee Leave & Permission Request**
    - Implement `EmployeeLeaveRequestView.tsx` with 2-day advance notice banner, auto duration calculation, char counter, attachment upload, and My Requests table.
13. **Step 13: Profile, Settings & Access Denied**
    - Implement `ProfileView.tsx`, `SettingsView.tsx`, and `AccessDeniedView.tsx`.
14. **Step 14: Router Configuration**
    - Update `AppRouter.tsx` with all routes mapped and protected.
15. **Step 15: Verification, Self-Debugging & Visual QA**
    - Run TypeScript typecheck, production build, and test interactions.
