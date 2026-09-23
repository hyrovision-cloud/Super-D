# RBAC Access Control Audit

Audit date: 2026-09-24

## Existing system

- Roles and permission arrays are persisted in MongoDB through the existing `Role` model.
- Users store a primary role, optional role array, primary branch, assigned branches, and account status.
- Authentication uses an HttpOnly cookie. `/api/v1/auth/me` returns current identity, roles, database-resolved permissions, branch assignments, and status.
- The project convention is singular `module.action`, such as `patient.view` and `revenue.create`. This convention was retained.

## Findings

1. Frontend route and sidebar access were hardcoded in separate role-name matrices.
2. `AuthProvider.hasPermission` unconditionally trusted three role names as all-powerful.
3. Backend `requirePermission` unconditionally bypassed checks for Owner and Global Admin.
4. JWT permission claims could remain authoritative after role permissions changed.
5. Generic PATCH endpoints checked create permission instead of update permission.
6. Notifications lacked a permission guard, and owner dashboards used role-name gates.
7. User and role management views mutated the frontend mock store rather than protected APIs.
8. The role editor displayed several permission keys that did not exist in backend seeds.
9. User updates lacked a backend role-assignment escalation check.

## Changes made

- Removed all role-name permission bypasses from frontend and backend.
- Authentication middleware now loads the active user and current role permissions from MongoDB on each protected request. Disabled accounts are rejected even when holding an older token.
- Organization scope now requires explicit `organization.view`; route defaults and role names cannot elevate scope.
- Added granular update permissions to generic APIs and explicit guards for notifications, owner dashboards, expenses, leads, users, and roles.
- Added protected user and role APIs. Password hashes are stripped from responses.
- Role changes require `role.assign`; roles and branches are validated before assignment.
- Patient DELETE requires `patient.delete` and performs a recoverable deactivation rather than physical deletion.
- Replaced the frontend role route matrix with one central permission metadata map. Direct URLs and both navigation surfaces use the same map.
- Removed the demo role switcher. Role names remain only for presentation and role-specific dashboard content.
- Migrated user and role management compatibility services from mock storage to backend APIs.
- Added action-level checks for patient creation/update/clinical notes, appointment creation/workflow/cancellation, user creation/status changes, and role matrix editing.

## Central page mapping

| Route | Required permission |
|---|---|
| `/dashboard` | `dashboard.view` |
| `/owner-dashboard` | `dashboard.owner.view` |
| `/patients`, `/patients/:id` | `patient.view` |
| `/appointments` | `appointment.view` |
| `/patient-discharge` | `patient.discharge` |
| `/employees` | `employee.view` |
| `/attendance` | `attendance.view` or `attendance.mark` |
| `/leave-approval` | `leave.approve` |
| `/leave-permission` | `leave.view` |
| `/grievances` | `grievance.view` or `grievance.submit` |
| `/complaints` | `complaint.view` |
| `/advertisements` | `advertisement.view` |
| `/marketing` | `marketing.view` |
| `/revenue-accounts` | `revenue.view` |
| `/income-reports` | `income.view` |
| `/finance` | `revenue.view` or `expense.view` |
| `/branches` | `branch.manage` |
| `/users` | `user.view` |
| `/roles` | `role.view` |
| `/reports` | `report.view` |
| `/profile` | authenticated session |
| `/settings` | `settings.view` |

Unknown protected routes are denied by default. Unauthenticated users go to `/login`; authenticated users without route permission go to `/access-denied` (also available at `/unauthorized`).

## Backend enforcement

All operational collection routes use `authenticate`, `requirePermission`, and branch scope middleware. GET/POST/PATCH permissions are separate. User and role administration has dedicated permission guards. A standard missing permission returns HTTP 403 with code `FORBIDDEN` and a non-sensitive message. Missing or invalid authentication returns HTTP 401.

## Branch and escalation protection

- Selected branch headers and query/body branch IDs are treated as requests, never authority.
- Users without `organization.view` are constrained to assigned branches.
- A Branch Manager requesting Chennai revenue while assigned to Trichy receives 403.
- A user without `role.assign` cannot assign themselves or another user a privileged role.
- Current permissions are reloaded from the database on every protected API call, so subsequent authorization checks reflect saved role changes.

## Verification

- Backend TypeScript build: passed.
- Frontend TypeScript check: passed.
- New RBAC integration suite: 15/15 passed across Owner, Global Admin, Branch Manager, Doctor, HR, Finance, Marketing, Complaints Manager, and Employee.
- The suite verifies authorized APIs, forbidden APIs, cross-branch denial, owner/global distinction, patient-delete denial, role-page denial, and role escalation denial.
- Browser verification: Doctor login reached the permitted dashboard with only authorized navigation items; direct navigation to `/finance` redirected to `/access-denied` and rendered the 403 experience without exposing the finance page.

## Remaining legacy boundary

Some operational views still use legacy mock services for business records, as documented in `REAL_DATA_MIGRATION_REPORT.md`. Their page access is now permission-gated, but completing their API migration remains a separate real-data task. Role-name checks that only choose presentation copy or dashboard layout remain acceptable; role-name checks inside legacy views that filter mock data should be removed when those modules are migrated to scoped APIs.
