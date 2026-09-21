SUPER D
Software Design Document (SDD)
Web Application Prototype — Antigravity Build Specification

| Item | Specification |
| --- | --- |
| Project | Super D — Centralized Multi-Branch Hospital Management Platform |
| Prototype Target | Responsive Web Application |
| Build Tool | Antigravity AI coding agent |
| Prototype Purpose | Board meeting / client validation |
| Future Direction | Production web + Android + iOS + tablet |
| Primary Branches | Trichy, Chennai, Madurai, Pudukottai |
| Roles | Super Admin, Admin, HR, Branch Doctor, Branch Manager, Staff, Employee |
| Document Version | 1.0 |

## 1. Document Purpose
This SDD defines the functional scope, UI structure, role-based access model, prototype behavior, data requirements, and implementation guidance for building the Super D web application prototype using Antigravity. The prototype must be visually credible for a board/client presentation while keeping the architecture clean enough to evolve into the production system.

## 2. Product Overview
Super D is a centralized hospital administration platform intended to manage multi-branch operations from a role-based system. It brings together employee attendance and leave workflows, employee concerns, advertisement management, revenue and accounts, patient discharge operations, dashboards, reports, and branch-level data access.
Core application flow:
Login → Authentication → Role Identification → Branch Scope → Dashboard → Authorized Modules → Data / Approval / Reports

## 3. Prototype Objectives
- Create a polished, professional hospital-management dashboard suitable for a board/client demonstration.
- Represent all seven user roles and their permitted modules.
- Demonstrate realistic navigation, filters, tables, forms, dashboards, status badges, charts, modals and detail views.
- Use realistic mock data based on the provided reference screens.
- Implement frontend RBAC simulation so each role sees only its authorized navigation and screens.
- Keep business logic and UI components modular so a real backend can replace mock data later.
- Build the web prototype responsively for desktop, laptop and tablet-sized browser layouts.
- Avoid treating the prototype as disposable UI; structure it for later API integration and mobile migration.

## 4. Prototype Scope

| In Scope | Prototype Treatment |
| --- | --- |
| Authentication | Login screen + simulated role selection/authentication |
| RBAC | Role-based navigation and protected routes |
| Branch Access | Branch-scoped mock data and filters |
| Dashboards | Role-specific KPI cards, charts, activity/queue widgets |
| Attendance | Leave Requests, Permissions, Attendance tabs and filters |
| Employee Concerns | Grievance list, KPI cards, filters and view action |
| Advertisements | Campaign list, filters, add/edit/view/delete UI |
| Revenue & Accounts | Income/expense list, filters, add/edit UI, summary cards |
| Patient Discharge | Discharge list, patient details and status views |
| Employee Self-Service | Leave/permission form and own request history |
| Reports | Income/revenue summary and branch comparison presentation |
| Responsive UI | Desktop-first but responsive for smaller screens |
| Backend | Not required for prototype; use mock/local state |
| Real Authentication | Not required for prototype |
| Real Payments / Ads APIs | Not required for prototype |

## 5. Roles & Responsibilities

| Role | Primary Responsibility | Data Scope |
| --- | --- | --- |
| Super Admin | Organization-wide monitoring and administration | All branches |
| Admin | Central administration, employee concerns and attendance management | All branches |
| HR / Branch HR | HR attendance, leave/permission and HR review workflows | Cross-branch / final scope to confirm |
| Branch Doctor | Branch attendance and patient discharge operations | Assigned branch |
| Branch Manager | Branch attendance and leave/permission approval operations | Assigned branch / workflow to confirm |
| Staff | Branch advertisements, revenue/accounts and patient discharge operations | Assigned branch |
| Employee | Own leave and permission self-service | Own employee record only |

## 6. Role-to-Module Access Matrix

| Module | Super Admin | Admin | HR | Doctor | Manager | Staff | Employee |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Dashboard | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Advertisement Management | ✓ | — | — | — | — | ✓ | — |
| Income / Revenue Reports | ✓ | — | — | — | — | ✓* | — |
| Revenue & Accounts | ✓ | — | — | — | — | ✓ | — |
| Attendance Management | ✓ | ✓ | ✓ | ✓ | ✓ | — | — |
| Employee Grievances / Concerns | — | ✓ | — | — | — | — | — |
| Patient Discharge Summary | ✓ | — | — | ✓ | — | ✓ | — |
| Leave & Permission Request | — | — | ✓ | ✓ | ✓ | — | ✓ |
| Profile | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Settings | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
* Staff may have branch-level revenue/accounts access; organization-wide income reporting remains a Super Admin capability. Exact reporting permissions should be confirmed before production.

## 7. Application Navigation

| Role | Prototype Sidebar |
| --- | --- |
| Super Admin | Dashboard | Advertisement Management | Income Reports | Patient Discharge Summary | Profile | Settings | Log out |
| Admin | Dashboard | Attendance Management | Grievances (Employee Concerns) | Profile | Settings | Log out |
| HR | Dashboard | Attendance Management | Profile | Settings | Log out |
| Branch Doctor | Dashboard | Attendance Management | Patient Discharge Summary | Profile | Settings | Log out |
| Branch Manager | Dashboard | Attendance Management | Profile | Settings | Log out |
| Staff | Dashboard | Advertisement Management | Revenue & Accounts | Patient Discharge Management | Profile | Settings | Log out |
| Employee | Dashboard | Leave & Permission Request | Profile | Settings | Log out |

## 8. Detailed Screen Specifications

### 8.1 Super Admin — Advertisement Management
- Purpose: Create, manage and track advertisements across branches.
- Filters: Branch, Category, Platform/Channel, Status, Search.
- Platforms: Google Ads, YouTube, Meta Ads, Other.
- Statuses: Running, Scheduled, Completed, Draft.
- Table fields: Date, Running Ads By, No. of Leads, Enquiry, Spent Amount, Ad Status, Source Name, URL, Action.
- Actions: View, Edit, Delete.
- Prototype should show lead/click ratio or comparable campaign performance indicator where represented by the reference UI.

### 8.2 Super Admin — Income Reports
- Date range filter and branch filter.
- Export Report button.
- KPI cards: Total Revenue, Total Patients, New Patients, Dressing Amount, Day Care Amount.
- Branch comparison chart with revenue and patient counts.
- Date-wise revenue chart.
- Branch comparison table.
- Collection/revenue composition visualization.
- Branch-wise patient summary and daily branch report.

### 8.3 Super Admin — Patient Discharge Summary
- Add Patient action.
- Search by Patient ID/name.
- Date range, branch and status filters.
- Table: Patient ID, Patient Name, Entry Date, Exit Date, Status, Action.
- Statuses should include at least Admitted and Discharged for prototype demonstration.

### 8.4 Admin — Attendance Management
- Tabs: Leave Requests, Permissions, Attendance.
- Filters: Branch, Leave Type, From Date, To Date, Review Stage.
- Search employee/role and Export.
- Table: Employee & Role, Leave Type, Duration & Dates, Hospital Branch, Reason, Review Stage, Approval Action.
- Actions: Approve / Reject where the role is authorized.
- Prototype workflow states: Submitted, HR Review, Approved, Finalized, Rejected.

### 8.5 Admin — Employee Concerns / Grievances
- KPI cards: Total Concerns, Pending Review, Resolved, Closed.
- Filters: Branch, Concern Type, Status, Date Range.
- Table: Employee & Role, Branch, Concern Type, Subject, Date, Status, Action.
- Statuses: Pending, In Review, Resolved, Closed.
- View action opens a concern detail panel/modal.

### 8.6 HR — Attendance Management
- Cross-branch HR visibility as represented in the reference UI.
- Tabs: Leave Requests, Permissions, Attendance.
- Filters and search identical in structure to the HR reference screen.
- Show Review Stage independently from request Status.
- Dashboard prototype should include pending HR review queue, attendance overview, leave summary and branch-wise HR overview.

### 8.7 Branch Doctor — Attendance Management
- Branch-scoped attendance and leave/permission visibility.
- Same core tabs and filtering pattern as attendance management.
- Approval controls must appear only when permitted by the workflow.

### 8.8 Branch Doctor — Patient Discharge Summary
- KPI cards: Total Discharged, Today Discharged, This Month Discharged.
- Branch and date-range filters.
- Table: #, Patient ID, Patient Name, Age, Entry Date & Time, Exit Date & Time, Action.
- View action opens patient/discharge details.

### 8.9 Branch Manager — Attendance Management
- Attendance management with Leave Requests, Permissions and Attendance tabs.
- Branch filter and date/review filters.
- Leave/permission approval controls.
- Prototype must visually communicate the manager's approval responsibility without assuming an unconfirmed final approval sequence.

### 8.10 Staff — Advertisement Management
- Branch-scoped campaign management.
- Filters: Category, Platform/Channel, Ad Status, From/To dates, Search.
- Table: #, Date, Running Ads By, Ad Handled By, Leads, Enquiry, Spent Amount, Status, Source Name, URL, Action.
- Add Advertisement form: Branch, Category, Platform/Channel, Ad Title, Start Date, End Date, Running Ads By, Ad Handled By, Leads, Enquiry, Spent Amount, Source Name, URL, Ad Status.
- Actions: Link/View/Edit/Delete.

### 8.11 Staff — Revenue & Accounts
- Purpose: Add, manage and track income and expenses for the branch.
- Filters: Transaction Type, Category, Date Range, Search.
- Table: Date, Type, Category, Description, Amount, Reference No., Added By, Action.
- Transaction types: Income and Expense.
- Prototype categories may include OP Consultation, Laboratory, Medicine Purchase, IP Admission, Utilities, Pharmacy Sales, Staff Salary and Others.
- Add form: Branch, Transaction Type, Category, Amount, Date, Reference No., Description.
- Include edit/delete UI with confirmation.

### 8.12 Staff — Patient Discharge Management
The Staff reference image supplied for analysis did not show the detailed patient-discharge screen. Therefore, the prototype should expose the module in navigation and provide a placeholder/initial list screen without inventing unconfirmed production fields. Final Staff discharge fields/actions should be confirmed by the client.

### 8.13 Employee — Leave & Permission Request
- Primary CTA: Apply for Leave / Permission.
- Information banner: requests should normally be submitted at least 2 days before the leave start date.
- Fields: Date of Application, Employee Name, Department, Contact No., Leave Type, From Date, To Date, Total Days, Reason, Replacement Member, Attachment.
- Total Days must be calculated automatically from the selected dates.
- Attachment formats: PDF/JPG/PNG, maximum 5 MB in prototype validation.
- My Leave / Permission Requests table: Application Date, Leave Type, From/To Date, No. of Days, Reason, Replacement Member, Attachment, Status, Action.
- Employee should see only their own requests.
- View action should show request details and approval history.
- Employee identity fields should be read-only and populated from the simulated authenticated profile.

## 9. Dashboard Requirements

| Role | Dashboard Content |
| --- | --- |
| Super Admin | Total Revenue, Total Patients, New Patients, Active Ads, Total Ad Spend, Pending Operations; branch comparison and revenue trends. |
| Admin | Total Employees, Pending Leave Requests, Pending Permissions, Pending HR Review, Attendance Rate; grievance summary and pending concerns. |
| HR | Total Employees, Pending Leave Requests, Pending Permissions, Pending HR Review, Attendance Rate; branch-wise HR overview. |
| Branch Doctor | Branch attendance, pending leave/permission, discharge totals, today discharges, monthly discharges. |
| Branch Manager | Attendance overview, pending approvals, leave/permission queue, branch employee summary. |
| Staff | Active Campaigns, Leads, Enquiries, Ad Spend, Total Income, Total Expenses, Net Balance, Discharge summary, recent transactions. |
| Employee | Total Requests, Pending, Approved, Rejected; recent requests and Apply Leave/Permission CTA. |

## 10. Leave & Permission Workflow
Prototype state model:
Employee submits → Submitted → Review → Approved / Rejected → Finalized
- HR Review is represented as a distinct review stage in the supplied screens.
- Status and reviewStage must be separate fields in the prototype data model.
- Manager vs HR approval order is not fully confirmed by the supplied screens; do not hard-code a production workflow sequence without client confirmation.
- The 2-day advance submission rule should be represented as a frontend validation in the prototype.
- Emergency/sick-leave exception handling should be confirmed before production implementation.

## 11. RBAC & Branch-Level Security
- Every route must declare the roles allowed to access it.
- Every branch-scoped module must use the authenticated user's branchId rather than trusting a client-supplied branch value.
- Super Admin may view organization-wide data.
- Admin/HR visibility should be controlled by explicit role permissions and final business rules.
- Branch Doctor, Branch Manager and Staff should be branch-scoped.
- Employee must be restricted to their own employeeId for leave/permission history.
- UI hiding is not security; production API authorization must enforce the same rules server-side.

## 12. Prototype Data Model

| Entity | Prototype Fields |
| --- | --- |
| User | id, name, email, role, branchId, department, phone, avatar, status |
| Branch | id, name, code, location, status |
| LeaveRequest | id, employeeId, employeeName, department, branchId, applicationDate, leaveType, fromDate, toDate, totalDays, reason, replacementMember, attachment, status, reviewStage, approvalHistory |
| Attendance | id, employeeId, branchId, date, checkIn, checkOut, status |
| Grievance | id, employeeId, branchId, concernType, subject, description, date, status, resolution |
| Advertisement | id, branchId, category, platform, title, startDate, endDate, runningAdsBy, handledBy, leads, enquiry, spentAmount, status, sourceName, url |
| Transaction | id, branchId, type, category, amount, date, referenceNo, description, addedBy, status |
| Patient | id, branchId, patientName, age, entryDateTime, exitDateTime, status |
| AuditLog | id, userId, action, module, recordId, timestamp, metadata |

## 13. Technology Stack

The production application shall use the **MERN ecosystem with TypeScript**. The current prototype may use mock/local state, but its boundaries must remain compatible with the production stack.

| Layer | Technology |
| --- | --- |
| Frontend | React + TypeScript |
| Frontend Setup | Modern React Framework or Vite |
| Backend | Node.js + Express.js + TypeScript |
| Database | MongoDB |
| ODM / Data Access | Mongoose or equivalent typed data-access layer |
| API | RESTful JSON API |
| API Documentation | OpenAPI |
| Authentication | Short-lived Access Tokens + Secure Refresh Token / Session Handling |
| Validation | Shared validation schemas + authoritative backend validation |
| Charts | Accessible React chart components |
| File Storage | Cloud Object Storage abstraction |
| Testing | Unit + Integration + API + Component + E2E Testing |
| Containerization | Docker |
| Architecture | MERN + TypeScript |
| Repository | Monorepo recommended |
| API Versioning | `/api/v1` |
| Future Mobile | Mobile apps consuming the same versioned APIs |

The production stack shall use maintained stable/LTS releases selected at implementation time. Exact dependency versions must be locked in the package lockfile and updated through reviewed changes.

### 13.1 Monorepo Structure

```text
apps/
  web/              React Web Application
  api/              Express API

packages/
  contracts/        API DTOs, shared enums, validation schemas
  ui/               Reusable UI components + design tokens
  config/            Shared TS / lint / testing config
  test-utils/       Testing helpers

docs/
  openapi/          OpenAPI contract
  decisions/        Architecture Decision Records
  runbooks/         Deployment & operations guides

spec.md             Authoritative product specification
```

### 13.2 API Architecture

- Base API path: `/api/v1`
- RESTful JSON request and response format.
- APIs shall be documented using OpenAPI.
- Backend validation is authoritative.
- Shared validation schemas should be used where practical.
- Pagination shall be supported for potentially large lists.
- Filtering and sorting shall use allow-listed fields.
- Request correlation IDs should be supported.
- Breaking API changes require a new API version or an approved migration plan.
- API responses must remain independent of web-only rendering assumptions so future mobile clients can consume the same APIs.

### 13.3 Authentication and Validation

- Use short-lived access tokens.
- Use secure refresh-token/session handling.
- Backend authorization and validation are authoritative.
- Prototype authentication may remain simulated because this phase is a frontend-only demo.
- Production authentication must enforce RBAC, branch-level authorization and employee ownership rules.

### 13.4 File Storage

File storage shall be implemented behind a cloud object-storage abstraction rather than coupling application logic directly to a specific storage provider.

### 13.5 Testing and Containerization

Production implementation shall include:

- Unit testing
- Integration testing
- API testing
- Component testing
- End-to-end testing
- Docker-based reproducible backend and supporting-service environments

### 13.6 Future Mobile Architecture

The immediate deliverable remains a responsive web application. Future Android, iOS and tablet applications shall consume the same versioned `/api/v1` APIs and reuse the same business rules, authorization policies and contracts rather than duplicating backend logic.

## 14. Frontend Architecture
Recommended project structure:
src/
app/                  # app bootstrap, providers, route configuration
components/           # reusable UI components
components/ui/        # buttons, inputs, cards, modals, tables, badges
layouts/              # auth layout, dashboard layout
pages/                # role/module screens
features/             # advertisements, attendance, revenue, discharge, grievances
routes/               # protected routes and role guards
store/                # auth, UI and demo state
data/                 # typed mock data
types/                # domain TypeScript types
utils/                # formatters, validation, calculations
services/             # API abstraction layer for future backend
assets/               # logos, images, illustrations

## 15. UI / UX Requirements
- Professional healthcare enterprise dashboard aesthetic.
- Clean sidebar + top header + content workspace layout.
- Use a consistent spacing, typography, card, badge, table and form system.
- Use status colors consistently but do not rely on color alone; include text labels/icons.
- Tables must support search, filters, sorting/pagination where relevant.
- Long tables should remain usable on laptop screens.
- On smaller screens, dense tables should transform into horizontally scrollable tables or responsive cards.
- Forms should have clear required-field indicators and inline validation.
- Use confirmation dialogs for destructive actions.
- Use empty states, loading states and error states even with mock data.
- Provide realistic chart legends/tooltips.
- Maintain accessible contrast, keyboard focus states and semantic labels.

## 16. Prototype Behavior Requirements
- Login should allow demonstration of all seven roles using demo accounts or a role selector.
- After login, the sidebar must change according to role.
- Protected routes must redirect unauthorized users to an Access Denied page or dashboard.
- Branch selector should filter mock data for applicable roles.
- Add/Edit forms should update local mock state so the demo feels interactive.
- Delete actions should require confirmation.
- Search and filters should actually modify visible records.
- Date filters should work on mock data.
- Export buttons may generate CSV for prototype where practical.
- Charts must derive from the same mock data shown in the tables to avoid contradictory demo results.
- Logout should clear demo session state.

## 17. Antigravity Implementation Rules
- Build this phase as a WEB APPLICATION PROTOTYPE only.
- Use React + TypeScript and do not build the current phase as React Native.
- Keep business/domain types and UI components modular so the future product can be migrated to Expo/React Native with minimal business-logic rewrite.
- Do not create a single giant component. Split pages, feature modules, tables, forms, charts and reusable UI primitives.
- Do not hard-code role-specific navigation in many unrelated files. Centralize role permissions and route metadata.
- Do not hard-code branch filtering separately in every page. Create reusable branch-scope utilities.
- Use mock data for the prototype; create a service abstraction so mock services can later be replaced by REST APIs.
- Do not claim that frontend-only RBAC is production security. Mark it as prototype simulation.
- Do not invent unconfirmed Staff Patient Discharge fields.
- Do not change the business workflow without documenting the assumption.
- Make the application fully responsive for desktop, laptop and tablet browser widths.
- Use reusable components for DataTable, FilterBar, KPI cards, StatusBadge, Modal, FormField, DateRangeFilter, EmptyState and ConfirmDialog.

## 18. Suggested Prototype Routes

| Route | Screen |
| --- | --- |
| /login | Login |
| /dashboard | Role-specific Dashboard |
| /advertisements | Advertisement Management |
| /income-reports | Super Admin Income Reports |
| /revenue-accounts | Staff Revenue & Accounts |
| /attendance | Attendance Management |
| /grievances | Employee Concerns |
| /patient-discharge | Patient Discharge |
| /leave-permission | Employee Leave & Permission |
| /profile | Profile |
| /settings | Settings |
| /access-denied | Unauthorized Access |

## 19. Demo Accounts

| Demo Email | Role | Scope |
| --- | --- | --- |
| superadmin@superd.demo | Super Admin | All branches |
| admin@superd.demo | Admin | All branches |
| hr@superd.demo | HR | Cross-branch demo |
| doctor.trichy@superd.demo | Branch Doctor | Trichy |
| manager.trichy@superd.demo | Branch Manager | Trichy |
| staff.trichy@superd.demo | Staff | Trichy |
| employee.trichy@superd.demo | Employee | Trichy |
Prototype password may be a shared demo password; production authentication must not use hard-coded credentials.

## 20. Non-Functional Requirements
- Responsive across common desktop/laptop/tablet browser sizes.
- Fast initial load with code-splitting where practical.
- Reusable TypeScript domain models.
- No duplicated role/module business logic.
- Clear error and empty states.
- Accessible keyboard navigation and visible focus states.
- Consistent date and currency formatting.
- Indian Rupee (₹) formatting for financial screens.
- Maintainable folder structure and naming conventions.
- Production migration path to REST API + MongoDB + JWT/RBAC.

## 21. Production Architecture Direction
The board prototype is frontend-only, but its boundaries should reflect the future production system:
React Web Prototype → REST API → Node.js/Express → MongoDB
↘ File Storage / Notifications / Audit Logs
After web approval, the same domain model and service contracts can be reused while the UI layer is progressively adapted to Expo/React Native for Android, iOS and tablet.

## 22. Security Requirements for Production
- JWT or equivalent secure session authentication.
- Server-side RBAC enforcement.
- Branch-level authorization on every branch-scoped API.
- Employee self-service APIs must enforce employee ownership.
- Password hashing using a modern password hashing algorithm.
- Secure file upload validation and storage.
- Audit logging for approvals, financial edits/deletions and sensitive record changes.
- Rate limiting, secure headers, input validation and server-side sanitization.
- HTTPS-only production deployment.
- Do not store production secrets in frontend source code.

## 23. Assumptions / Client Confirmation Items
- Confirm exact HR vs Branch HR scope and whether HR is organization-wide or branch-specific.
- Confirm exact approval sequence between Branch Manager and HR for leave/permission.
- Confirm whether Super Admin can create/edit/delete records across every module or is primarily a monitoring role.
- Confirm Staff's exact Patient Discharge fields and permitted actions.
- Confirm whether Admin can approve leave or only manage/route requests.
- Confirm financial accounting rules, edit/delete permissions and whether records require soft delete.
- Confirm notification channels: in-app, email, WhatsApp/SMS or other.
- Confirm patient discharge data fields and privacy requirements before production.
- Confirm exact attendance rules, shift handling, late/absent status and biometric integration if any.
- Confirm final branding, logo, colors and hospital/organization naming.

## 24. Development Phases

| Phase | Deliverables |
| --- | --- |
| Phase 1 — Prototype UI | React web app, layouts, role dashboards, all screens, mock data, navigation, filters and interactions. |
| Phase 2 — Board/Client Review | Collect UI and workflow feedback; finalize screens and permissions. |
| Phase 3 — Backend Integration | Node/Express API, MongoDB, authentication, RBAC, branch isolation, real CRUD. |
| Phase 4 — Production Hardening | Validation, audit logs, notifications, file storage, security, testing and deployment. |
| Phase 5 — Universal App | Adapt approved product to Expo/React Native for Android, iOS and tablet while reusing domain logic and APIs. |

## 25. Acceptance Criteria for Prototype
- All seven roles can be demonstrated from the login flow.
- Each role sees only its intended prototype modules.
- All supplied reference screens are represented with consistent UI patterns.
- Advertisement management is interactive.
- Revenue & Accounts is interactive.
- Attendance / Leave / Permission screens support search and filters.
- Employee can submit a demo leave/permission request and see it in My Requests.
- Patient discharge screens support realistic list/detail presentation.
- Grievance screen supports filtering and detail view.
- Dashboard KPIs and charts render from mock data.
- Application is responsive on desktop, laptop and tablet widths.
- No console-breaking errors during normal navigation.
- Project structure is clean and ready for later API integration.

## 26. Antigravity Master Prompt
The following prompt can be given to Antigravity as the initial implementation instruction.
```text
Build the Super D project as a professional, responsive React + TypeScript web application prototype.

PROJECT PURPOSE:
Super D is a centralized multi-branch hospital management platform. This phase is ONLY a web prototype for a board/client meeting. Do not build React Native in this phase. However, keep the architecture modular so the approved product can later be adapted to Expo/React Native for Android, iOS and tablet.

TECH STACK:
- Frontend: React + TypeScript
- Frontend setup: Modern React Framework or Vite
- Backend: Node.js + Express.js + TypeScript
- Database: MongoDB
- ODM / Data Access: Mongoose or equivalent typed data-access layer
- API: RESTful JSON API
- API Documentation: OpenAPI
- Authentication: Short-lived access tokens + secure refresh-token/session handling
- Validation: Shared validation schemas + authoritative backend validation
- Charts: Accessible React chart components
- File Storage: Cloud Object Storage abstraction
- Testing: Unit + Integration + API + Component + E2E testing
- Containerization: Docker
- Architecture: MERN + TypeScript
- Repository: Monorepo recommended
- API Versioning: /api/v1
- Future Mobile: Mobile apps consuming the same versioned APIs

PROTOTYPE UI TOOLING:
- React Router
- Tailwind CSS
- Lucide React
- Recharts or equivalent accessible React chart library
- React Hook Form + Zod
- Zustand or a clean React state approach
- Typed local mock data
- localStorage for demo persistence where useful

IMPORTANT:
- The prototype remains frontend-only.
- Do not build the production backend in this prototype phase.
- Keep a clean service/API abstraction so mock services can later be replaced by the REST API.
- Keep domain models and UI components modular for future mobile adaptation.

BRANCHES:
- Trichy
- Chennai
- Madurai
- Pudukottai

ROLES:
1. Super Admin
2. Admin
3. HR
4. Branch Doctor
5. Branch Manager
6. Staff
7. Employee

CORE RULE:
Implement centralized RBAC configuration. Do not scatter role checks throughout components. Every route and sidebar item must declare its allowed roles.

ROLE MODULES:
Super Admin:
Dashboard, Advertisement Management, Income Reports, Patient Discharge Summary, Profile, Settings.

Admin:
Dashboard, Attendance Management, Grievances (Employee Concerns), Profile, Settings.

HR:
Dashboard, Attendance Management, Profile, Settings.

Branch Doctor:
Dashboard, Attendance Management, Patient Discharge Summary, Profile, Settings.

Branch Manager:
Dashboard, Attendance Management, Profile, Settings.

Staff:
Dashboard, Advertisement Management, Revenue & Accounts, Patient Discharge Management, Profile, Settings.

Employee:
Dashboard, Leave & Permission Request, Profile, Settings.

SCREENS TO BUILD:
- Login
- Role-specific Dashboard
- Super Admin Advertisement Management
- Super Admin Income Reports
- Super Admin Patient Discharge Summary
- Admin Attendance Management
- Admin Employee Concerns
- HR Attendance Management
- Branch Doctor Attendance Management
- Branch Doctor Patient Discharge Summary
- Branch Manager Attendance Management
- Staff Advertisement Management
- Staff Revenue & Accounts
- Staff Patient Discharge Management placeholder/list
- Employee Leave & Permission Request
- Profile
- Settings
- Access Denied

DESIGN:
Create a premium healthcare enterprise dashboard. Use a clean sidebar, top header, KPI cards, professional tables, filters, status badges, charts, forms and modals. Use consistent spacing and typography. Do not make the UI look like a generic template. The UI should be suitable for a client board presentation.

RESPONSIVE:
Desktop-first, but fully responsive for laptop and tablet widths. On smaller widths, transform dense tables into horizontally scrollable tables or responsive cards. Do not break navigation or forms.

MOCK DATA:
Use realistic Indian hospital demo data and ₹ currency values. Use the supplied Super D reference data patterns:
- branches: Trichy, Chennai, Madurai, Pudukottai
- ad platforms: Google Ads, Meta Ads, YouTube, Other
- ad statuses: Running, Scheduled, Completed, Draft
- leave statuses/review stages: Submitted, HR Review, Approved, Finalized, Rejected
- grievance statuses: Pending, In Review, Resolved, Closed
- transaction types: Income, Expense

ATTENDANCE / LEAVE:
Tabs: Leave Requests, Permissions, Attendance.
Filters: Branch, Leave Type, From Date, To Date, Review Stage, Search.
Leave request fields:
applicationDate, employeeId, employeeName, department, contactNo, leaveType, fromDate, toDate, totalDays, reason, replacementMember, attachment, status, reviewStage, approvalHistory.
Employee must see only their own requests.
Employee name/department/contact should be populated from the simulated authenticated profile.
Total days must be calculated automatically.
Show the 2-day advance submission message from the reference UI.
Do not hard-code an unconfirmed final Manager-vs-HR approval sequence.

ADVERTISEMENT:
Build interactive list + add/edit modal.
Fields:
Branch, Category, Platform/Channel, Ad Title, Start Date, End Date, Running Ads By, Ad Handled By, Leads, Enquiry, Spent Amount, Source Name, URL, Ad Status.

REVENUE & ACCOUNTS:
Build interactive list + add/edit modal.
Fields:
Branch, Transaction Type, Category, Amount, Date, Reference No., Description.
Show Income, Expense and Net Balance summaries.
Include Added By and audit-friendly reference fields.

PATIENT DISCHARGE:
Build realistic list/detail presentation.
Do NOT invent unconfirmed Staff-specific fields. For Branch Doctor, use:
Patient ID, Patient Name, Age, Entry Date & Time, Exit Date & Time, Action.
Statuses can include Admitted and Discharged.

GRIEVANCES:
KPI cards:
Total Concerns, Pending Review, Resolved, Closed.
Filters:
Branch, Concern Type, Status, Date Range.
Table:
Employee & Role, Branch, Concern Type, Subject, Date, Status, Action.

DASHBOARDS:
Create a different dashboard for each role based on its responsibilities. Use KPI cards and useful charts/queues, not duplicated generic dashboards.

COMPONENT ARCHITECTURE:
Create reusable:
AppLayout
Sidebar
TopHeader
ProtectedRoute
RoleGuard
KpiCard
FilterBar
DataTable
StatusBadge
Modal
ConfirmDialog
FormField
DateRangeFilter
EmptyState
LoadingState
ChartCard
PageHeader
SearchInput
Pagination

PROJECT STRUCTURE:
src/
  app/
  components/
  components/ui/
  layouts/
  pages/
  features/
  routes/
  store/
  data/
  types/
  utils/
  services/
  assets/

SERVICE ABSTRACTION:
Create service interfaces/functions so mock data can later be replaced by REST APIs without rewriting page components.

PROTOTYPE AUTH:
Provide demo login accounts for all seven roles. Authentication is simulated. Do not represent frontend-only auth as production security.

DEMO DATA:
Keep mock data typed and consistent. Charts must be derived from the same data used by tables where possible.

UX:
- Search and filters must actually work.
- Add/edit forms must update demo state.
- Delete requires confirmation.
- Show success/error feedback.
- Show empty states.
- Show loading states where appropriate.
- Use Indian Rupee formatting.
- Use accessible labels and visible focus states.

SECURITY PREPARATION:
Even though this is a frontend prototype, structure route permissions and domain types so production can later enforce:
JWT authentication
RBAC
branch-level authorization
employee ownership checks
audit logging
secure file uploads

IMPORTANT:
Do not build one giant App.tsx.
Do not duplicate role logic.
Do not invent business rules not present in this SDD.
Do not invent Staff Patient Discharge fields.
Do not use browser-only code in a way that prevents future UI migration to React Native.
Finish the complete prototype with working navigation and realistic interactions before polishing visual details.

## 27. Final Implementation Note
```

This SDD is intentionally written for a web-only prototype phase. The objective is to validate the product's information architecture, role permissions, workflows and UI with the client before production backend/mobile implementation. Once the client approves the prototype, the next SDD revision should freeze the confirmed workflows and define the production API, database schema, security model, audit model, notification system and Expo/React Native adaptation strategy.
