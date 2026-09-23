# Real Data Migration Report

Report date: 2026-09-24

## Outcome

This pass established the production-style MongoDB/API foundation and migrated the authoritative authentication, branch, patient, and finance entry points. It did **not** finish removing every legacy frontend mock consumer; those remaining modules are explicitly recorded below and the repository must not yet be described as fully migrated.

## Completed

- Created the repository-wide source audit in `REAL_DATA_MIGRATION_AUDIT.md` before implementation.
- Preserved the existing HttpOnly cookie authentication flow and removed mock identity/role authority from `AuthProvider`.
- Changed `BranchProvider` to load authorized branches from the backend. Browser storage now holds only a non-authoritative branch UI preference.
- Fixed organization-scope middleware so a route default cannot elevate a non-organization user.
- Added protected, permission-checked, branch-scoped routes for appointments, employees/doctors, attendance, leave, complaints, revenue, expenses, advertisements, leads, notifications, and dashboard summaries.
- Added MongoDB Expense and Notification models; reused existing models for all other implemented resources.
- Added server-side finance aggregation for revenue, expenses, net amount, category, payment method, and all authorized branches including zero-value branches.
- Migrated patient listing/registration/profile access and income listing/creation/adjustment/summary compatibility services to real APIs.
- Added deterministic, repeatable upsert seeds distributed across Trichy, Chennai, Madurai, and Pudukkottai.
- Added orphan branch validation and canonical four-branch verification.
- Removed a production-looking JWT value from `.env.example`; documented `CORS_ORIGIN` and removed the frontend demo-mode variable.

## Seed verification

The seed was run twice without seeded-record duplication. Verified seeded business counts were 4 branches, 23 patients, 18 employees, 23 appointments, 126 attendance records, 4 leave requests, 4 complaints, 32 income records, 16 expenses, 4 advertisements, 12 leads, 23 medical records, and 7 notifications. Seven active users received user-scoped notifications.

## Tests performed

- Backend TypeScript build: passed.
- Frontend production build: passed (2,284 modules; output generated in `frontend/dist`). Vite reported a non-failing large-chunk warning for the 1.19 MB main bundle.
- Authentication integration suite: 17/17 passed, including login, `/auth/me`, logout, invalid credentials, disabled users, permissions, and cross-branch denial.
- Health test: passed.
- Seed run, repeated seed, and seed verification: passed before later branch-test fixture activity.
- Branch integrity suite: all 11 checks passed after moving deterministic seed dates away from the suite's fixed test fixture date; all four branches and the zero-revenue left-join rule were verified.

## Remaining frontend mock data

The legacy `frontend/src/services/mock/mockStore.ts` and `frontend/src/data/seed/*` remain in use by appointments, employees, attendance, leave, complaints, marketing, advertisements, users, roles, reports, grievances/discharges, notifications, admin/owner dashboards, and several layout components. These modules require API contract adapters and loading/empty/error UI before the mock store can be deleted.

The patient compatibility facade still returns empty prescriptions/discharge data because those frontend contracts have not yet been connected to dedicated endpoints. This is an empty state, not a fake-data fallback.

## Known limitations and next boundary

- Generic mutation routes currently rely on Mongoose validation; dedicated Zod request validators should be added module-by-module.
- Users/roles/audit/report administration APIs are not implemented in this pass.
- Admissions, departments, and a dedicated doctor profile model remain design decisions; current doctor queries reuse employees with role `Doctor` to avoid duplicate identity data.
- Backend pagination exists for new collection routes, but several legacy pages still paginate in the browser.
- Full browser end-to-end validation for every role and all four branches remains outstanding until the remaining views are API-backed.
- `docs/API.md` cannot coexist on Windows with the existing `docs/API/` directory, so the requested API document is stored as `docs/API/REAL_DATA.md` without deleting the existing documentation tree.
