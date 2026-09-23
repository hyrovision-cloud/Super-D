# Admin Configuration Guide

## Authorization model

All configuration requests require an authenticated database user. The API resolves the user role and permissions from MongoDB on every request; browser state is not authority.

| Capability | API | Permission | Scope |
|---|---|---|---|
| View application settings | `GET /api/v1/config/application` | `config.view` | Organization |
| Update application settings | `PATCH /api/v1/config/application` | `config.update` | Organization |
| View users | `GET /api/v1/users` | `user.view` | Organization |
| Create/update users | `POST/PATCH /api/v1/users` | `user.create` / `user.update`; role changes also require `role.assign` | Organization |
| View/update roles | `GET/PATCH /api/v1/roles` | `role.view` / `role.update` | Organization |
| View branches | `GET /api/v1/branches` | `branch.view` | Authorized branches |
| Manage attendance | `GET/POST/PATCH/DELETE /api/v1/attendance` | `attendance.view`, `attendance.mark`, `attendance.update`, `attendance.delete` | Authorized branches |

## Application configuration

The application settings document is deliberately whitelisted rather than accepting arbitrary JSON. It supports notification preferences, the hospital date display format, and enabled attendance-status metadata. Currency is constrained to INR for this deployment. Configuration updates emit `CONFIG_UPDATED` audit records without storing secrets.

## Attendance lifecycle

Attendance records use POST for marking, PATCH for corrections, and DELETE for a safe archive action (`isActive: false`, `archivedAt`). Corrections record the verifier and emit `ATTENDANCE_UPDATED`; archives emit `ATTENDANCE_ARCHIVED`. Attendance queries accept server-side pagination, branch scope, employee, status, and `from`/`to` date filters. Dates must be real `YYYY-MM-DD` values and `from` cannot be after `to`.

## Configuration boundaries

Business options belong in the database only when they are safe and meaningful to administer. Authentication, RBAC keys, technical limits and arbitrary execution settings remain code-controlled. Departments, campaign taxonomy, payment/expense categories and leave types remain documented migration work until their dedicated models and approval workflows are introduced.
