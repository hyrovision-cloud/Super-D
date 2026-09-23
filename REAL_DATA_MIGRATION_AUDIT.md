# Real Data Migration Audit

Audit date: 2026-09-24

## Scope and method

The repository was searched for `mock`, `dummy`, `demo`, `sample`, `seed`, `fake`, `hardcoded`, `localStorage`, `sessionStorage`, static business arrays, fallback data, placeholder handlers, and direct HTTP calls. UI labels, enums, permission names, route metadata, and configuration constants were excluded from migration scope.

## Executive summary

- The secure cookie authentication flow and the canonical four-branch model already exist in `backend`.
- Real backend routes currently exist for authentication, branches, and patients. Appointment, employee, attendance, leave, complaint, revenue, and advertisement routes are placeholder responses.
- The frontend's operational source of truth is `frontend/src/services/mock/mockStore.ts`, which hydrates business records from `frontend/src/data/seed/*` and persists them to localStorage.
- Most major views call services in `frontend/src/services/mock`. Several views and layout components access `mockStore` directly.
- Existing MongoDB models cover branches, users, roles, patients, medical records, appointments, employees, attendance, leave, complaints/queries, income, advertisements, leads, discharge summaries, and audit logs.
- Missing persistent domains include departments, doctors as a dedicated profile, expenses, notifications, digital content, and persistent report definitions/exports. Admissions are represented only indirectly by patient/discharge data.
- Frontend branch selection is a UI preference and may remain browser-persisted, but it must never grant access. The API must authorize every requested branch.

## Module migration matrix

| Module | Current data source | Frontend mock/hardcoded location | Existing backend API | Existing MongoDB model | Missing backend component | Required API | Required seed data | Status |
|---|---|---|---|---|---|---|---|---|
| Authentication | Backend cookie plus legacy mock-store coupling in provider/layout | `app/providers/AuthProvider.tsx`, layout mock-store imports | `/api/v1/auth/login`, `/me`, `/logout` | User, Role | Remove residual mock dependency | Existing auth contract | Users and roles | In progress |
| Branches | Mock store and localStorage-selected branch | `data/seed/branches.ts`, `services/mock/branchService.ts`, `BranchProvider.tsx` | GET `/api/v1/branches`, GET `/:id` | Branch | Frontend provider/API adoption | Branch list/detail; authorized mutation if retained | Four canonical branches | In progress |
| Patients | Mock service/store in primary views; partial API client exists | `data/seed/patients.ts`, `services/mock/patientService.ts` | List/create/detail/records | Patient, MedicalRecord, DischargeSummary | Contract normalization, update and discharge endpoints | Paginated list/search/detail/create/update/records/discharge | Branch-distributed patients and records | In progress |
| Doctors | Frontend seed array | `data/seed/doctors.ts`, appointment mock service | None | Employee/User can represent doctors; no profile model | Doctor query/service (avoid duplicate identity model unless profile fields require it) | GET `/doctors` with branch/department/search | Doctors per branch | Not started |
| Appointments | Mock service/store | `data/seed/appointments.ts`, `services/mock/appointmentService.ts` | Placeholder | Appointment | Controller/service/routes/validation | Paginated CRUD, status transition, search/filter | Varied appointments per branch/date/status | Not started |
| Employees | Mock service/store | `data/seed/employees.ts`, `services/mock/employeeService.ts` | Placeholder | Employee | Controller/service/routes/validation | Paginated CRUD/search/filter | Employees per branch/department | Not started |
| Attendance | Mock store | `data/seed/superDSeed.ts`, attendance view | Placeholder | AttendanceRecord | Controller/service/routes/validation | Paginated list/mark/update | Deterministic recent attendance | Not started |
| Leave | Mock service/store | `data/seed/leaveRequests.ts`, `services/mock/leaveService.ts` | Placeholder | LeaveRequest | Controller/service/routes/workflow validation | List/create/approve/reject | Leave cases across branches/statuses | Not started |
| Complaints and queries | Mock service/store | `data/seed/complaints.ts`, `services/mock/complaintService.ts` | Placeholder | Complaint (case type supports both) | Controller/service/routes/notes workflow | List/create/assign/note/resolve/status | Complaints and queries across branches | Not started |
| Revenue/income | Mock store and frontend aggregation | `data/seed/finance.ts`, `services/mock/financeService.ts`, report/dashboard services | Placeholder | IncomeRecord | Controller/service/routes plus aggregation | Paginated records, create/adjust, summary and breakdowns | Branch/date/category/payment-distributed income | Not started |
| Expenses | Frontend transaction seed | `data/seed/superDSeed.ts`, finance/report views | None | None | Expense model/service/controller/routes | CRUD/list plus summaries | Branch/date/category-distributed expenses | Not started |
| Finance/dashboard | Frontend calculations over mock arrays | `services/mock/dashboardService.ts`, `financeService.ts` | None | IncomeRecord; Expense missing | Server-side aggregate services | Owner/admin summary, branch comparisons, time series | Derived from seeded persisted records | Not started |
| Marketing/campaigns | Mock service/store | `data/seed/marketing.ts`, `services/mock/marketingService.ts` | Advertisement placeholder | Advertisement, Lead | Routes/controllers; content persistence decision | Campaign/ad/lead lists and metrics | Non-identical campaigns/leads by branch | Not started |
| Notifications | Mock store | `data/seed/notifications.ts`, `services/mock/notificationService.ts` | None | None | Notification model and user-scoped endpoints | List/mark read/mark all | User-specific notifications | Not started |
| Users | Mock service/store | `data/seed/users.ts`, `services/mock/userService.ts` | None beyond auth | User | Admin user routes with response sanitization | List/create/update/status | Auth seed users | Not started |
| Roles | Mock service/store | `data/seed/roles.ts`, `services/mock/roleService.ts` | None | Role | Role administration routes | List/update permissions | System roles | Not started |
| Reports | Frontend-generated mock reports and simulated exports | `services/mock/reportService.ts`, report views | None | Source collections available | Server aggregation/report service | Typed report endpoints with filters | Derived; no duplicate report seed required | Not started |
| Grievances | Mock store | `data/seed/superDSeed.ts`, grievances view | None | Complaint can represent internal grievances | Explicit case-type routing/contract | List/create/update scoped grievances | Employee grievances per branch | Not started |
| Admissions/discharges | Frontend seed/store | `data/seed/superDSeed.ts`, discharge view | Patient records only | DischargeSummary; no Admission model | Admission persistence and discharge endpoints | Admission/discharge list/detail/create | Active and discharged cases | Not started |
| Audit | Mock seed/service for UI; backend writes some audit logs | `data/seed/auditLogs.ts`, `services/mock/auditService.ts` | None | AuditLog | Read-only authorized audit route | Paginated list/filter | Generated by seed/actions as appropriate | Not started |

## Cross-cutting findings

### Browser storage

- `superd_demo_store_v3` stores operational records and must be removed.
- `superd_demo_selected_branch` and compatibility reads in `httpClient.ts` must be replaced. A branch selector may persist only a non-authoritative UI preference; backend scope remains authoritative.
- Authentication tokens are not intentionally stored in localStorage; the existing HttpOnly cookie flow must remain.

### API and contract gaps

- Existing `httpClient.ts` centralizes base URL, credentials, and error parsing, but derives branch context from legacy localStorage keys.
- Existing patient frontend types use `patientNumber` while the backend model uses `uhid`; appointment and finance field names also differ. These contracts must be normalized at the API boundary, not ad hoc in views.
- Large lists currently return arrays without pagination. The migration must use a consistent `{ data, pagination }` contract or preserve a typed compatibility layer while pages are migrated.

### Security findings

- Authentication, permission checks, and branch-scope middleware exist and should be reused on every new route.
- `enforceScope` currently treats `defaultScope === 'ORGANIZATION'` as granting organization scope regardless of role. Organization scope must only be granted by an authorized role/permission.
- Request body/query branch IDs require validation against the canonical branch IDs in addition to scope authorization.
- User responses must explicitly omit `passwordHash`; errors and logs must not expose credentials or secrets.

## Migration rule

No frontend mock fallback will be retained when an API fails. Each migrated page must render loading, empty, error, and success states. MongoDB seed code is development/demo infrastructure and is the only acceptable location for deterministic demo business data.
