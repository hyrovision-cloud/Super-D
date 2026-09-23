# Application UX and Admin Audit

Audit date: 2026-09-24  
Scope: current `frontend/` and `backend/` application after the RBAC phase. This is an implementation baseline, not a claim that legacy views are real-data backed.

## Findings summary

- Authentication, server-side permissions, route access and branch scoping are established. `ProtectedRoute` reads the centralized route permission metadata and backend routes authenticate, authorize and scope requests.
- The generic operations API provides paginated list, create and update endpoints for appointments, employees, attendance, leave, complaints, revenue, expenses, advertisements and leads. It has no generic archive/delete lifecycle and validates dates only by `new Date`, without a stable date-only/timezone contract or `from > to` protection.
- Most matching screens still subscribe to `mockStore`. That includes dashboards, attendance, employees, leave, finance, marketing, complaints, advertisements, branches, reports, discharge summaries and notifications. Those screens can be route-gated, but their displayed business data and mutations are not yet MongoDB-backed.
- No departments or business-configuration collection/API exists. Branches are database-backed, but branch creation/update/archive is not currently exposed.
- Common modal/drawer primitives already support backdrop and Escape closing, but do not restore a prior body overflow value or provide focus management. Top-nav profile/notification menus lack route-change, outside-click, and Escape handling. Mobile drawer lacks Escape/route-change cleanup and accessible dialog semantics.
- Tables generally use a local scroll container. Repeated page-specific fixed-width/filter implementations still require responsive verification; there is no reusable filter/date-range contract.

## Module inventory

| Module | Page | Current behavior / source | Backend API / CRUD | Permission requirement | Mobile / configuration finding | Required fix | Priority |
|---|---|---|---|---|---|---|---|
| Authentication | Login, profile | Backend login and `/auth/me`; profile UI is local presentation | Login/logout/me only | authenticated | No shared popup lifecycle | Keep backend authority; add transient-menu lifecycle | P0 |
| Navigation | sidebar, top nav, mobile nav | Permission-aware navigation list; top nav notifications use `mockStore` | Notifications GET/PATCH endpoints exist | `notification.view` | Top-nav popovers do not close outside/Escape/route change; mobile drawer lacks Escape lifecycle | Replace notification mock data and add controlled popover/menu primitive | P0 |
| Dashboards | role, owner, admin, finance, marketing | Predominantly `mockStore`; owner/finance summary APIs exist | Read summaries only | dashboard/revenue permissions | Filters can be visual-only and cards/charts need width audit | Connect each dashboard to scoped APIs and a reusable date range contract | P0 |
| Patients | list, profile, discharge | List/profile APIs are real-data; discharge screen is mock | Patients: GET/PATCH/soft delete/medical records; no discharge API | `patient.*`, `medical_record.*` | Forms/actions need shared loading/error states | Migrate discharge; add page pagination/filtering confirmation UX | P1 |
| Appointments | appointments | Screen and doctor selection use `mockStore` while operations API exists | GET/POST/PATCH, no archive/delete | `appointment.view/create/update/cancel` | Date/filter options are local | Replace screen service with paginated API; server date/status/doctor filters | P0 |
| Employees / doctors | employees | Screen uses `mockStore`; doctor route is derived from employees | GET/POST/PATCH, no archive/delete; no departments API | `employee.*` | Department and status options are local | Add employee lifecycle, departments model/API, real list/form filters | P0 |
| Attendance | attendance | Screen uses mock leave-review data rather than attendance records | GET/POST only; PATCH route exists but controller missing update handler | `attendance.view/mark/update` | No real correction workflow or server date/employee/branch filters | Add PUT/PATCH correction, lifecycle/audit, real UI and configurable status policy | P0 |
| Leave | leave approval, self-service | Both views use mock store | GET/POST/PATCH | `leave.view/request/approve` | Status/filter lists local; no reusable date range | Connect to API; validate approval transitions and filters | P1 |
| Complaints / grievances | complaints, grievances | Both screens use mock store | Complaints GET/POST/PATCH; grievances no API | `complaint.*` | Hardcoded statuses/priorities and tables | Migrate screens; add category configuration, lifecycle/audit | P1 |
| Finance | revenue accounts, finance, income reports | Views use mock data; generic revenue/expense APIs exist | GET/POST/PATCH; no archive/delete | `revenue.*`, `expense.*` | Income report has hardcoded Trichy branch state; date filters not consistently server-driven | Replace mock services, add robust date filters, soft lifecycle/audit | P0 |
| Marketing | marketing, advertisements | Views use mock store | Advertisements/leads GET/POST/PATCH; campaigns absent | `advertisement.*`, `lead.*` | Campaign/status/category filters local | Add campaign model/API or explicitly remove unsupported UI; migrate ads/leads | P1 |
| Administration | users, roles, branches | Users/roles have API facades but current UserList imports mock store; branches view mock | Users GET/POST/PATCH; Roles GET/PATCH; branches GET only | `user.*`, `role.*`, `branch.*` | No department/configuration management; no archive confirmation pattern | Repair consumers; add branch/dept/config CRUD with audit logging | P0 |
| Notifications | top nav | Mock store presentation | GET + read/read-all | `notification.view` | Popup lifecycle and loading/error absent | API client plus accessible popover and mutation feedback | P0 |
| Reports | reports, income reports | Mock store and hardcoded branch defaults | No report/export endpoint | `report.view` | Export can be stale client data; date/branch filters inconsistent | Server-backed report queries/exports with scoped filters | P1 |
| Settings | settings | Demo-reset/mocks configuration | No configuration API | `settings.view` only | Business configuration cannot be safely administered | Replace demo reset with permitted configuration pages | P0 |

## Hardcoded and local-state inventory

| Area | Finding | Classification |
|---|---|---|
| `services/mock/mockStore.ts` and feature subscribers | Persisted browser business data, including users, branches, attendance, finance, marketing and notifications | Must migrate; no new usage permitted |
| `BranchProvider` selected branch | UI preference in `localStorage` only; scope remains server-enforced | Acceptable UI preference, validate against assigned branches |
| `types/index.ts` attendance states | `PRESENT`, `ABSENT`, `LATE`, `HALF_DAY`, `ON_LEAVE` are a code enum | Keep as validated allowed set unless business requires configurable enablement |
| report branch defaults | `IncomeReportsView` initializes to `Trichy` | Must use API branch IDs and authorized branch list |
| departments / complaint categories / leave types / payment and expense categories | No configuration API or collection discovered | Business configuration candidates |

## Required implementation order

1. Harden shared modal/drawer/popover/menu lifecycle and responsive shell.
2. Establish authenticated API clients and reusable paginated/filter/date-range request helpers.
3. Add database-backed configuration, departments and attendance correction/audit APIs with permissions.
4. Migrate administration, attendance, notifications and branch-facing views first; then remaining mock modules by API availability.
5. Add server-side date validation, filters, pagination and lifecycle actions.
6. Verify desktop and mobile behavior through the browser at the required breakpoints; record limitations rather than masking overflow.
