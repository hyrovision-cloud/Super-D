# Hospital Management & Administration Platform

## Software Design and Spec-Driven Development Specification

| Field | Value |
|---|---|
| Document | `spec.md` |
| Version | 1.0.0 |
| Status | Baseline specification for demo and production planning |
| Product type | Multi-branch hospital management and administration platform |
| Current delivery | Responsive MERN web application |
| Future delivery | Mobile applications consuming the same versioned APIs |
| Primary locale | India |
| Currency | INR (`₹`) |
| Date display | `DD-MM-YYYY` |
| Time zone | `Asia/Kolkata` |

---

## 1. Purpose and Authority

This document is the authoritative product and engineering specification for the Hospital Management & Administration Platform. It converts the approved high-level vision into implementable requirements, data domains, APIs, workflows, security rules, acceptance criteria, and delivery boundaries.

When implementation details conflict with this specification, this specification takes precedence unless an approved change request updates it. No AI coding agent, developer, designer, or tester may silently invent business rules. Unresolved decisions must be recorded under **Open Decisions** and confirmed before production implementation.

Requirement keywords have the following meanings:

- **MUST**: mandatory for the stated release.
- **SHOULD**: expected unless a documented reason prevents it.
- **MAY**: optional enhancement.
- **DEMO**: required only as simulated behaviour for the client demonstration.
- **PRODUCTION**: required before real hospital data is used.

---

## 2. Product Vision

The product is a centralized command center for a hospital organization operating multiple branches. It combines hospital operations, workforce administration, complaints and queries, marketing, finance, management analytics, notifications, and auditability in one role-aware platform.

The platform shall provide:

- Organization-wide visibility for the Hospital Owner.
- Technical access management for the Global Admin.
- Branch-restricted operations for Branch Managers.
- Assigned-patient and appointment views for Doctors.
- Workforce workflows for HR.
- Revenue and reporting tools for Finance.
- Campaign, advertisement, lead, enquiry, and content tracking for Marketing.
- Case-management workflows for Complaints and Query Managers.
- Configurable roles and permissions for future users.

Initial branches:

1. Trichy
2. Chennai
3. Madurai
4. Pudukkottai

Additional branches must be configurable without code changes.

---

## 3. Delivery Strategy and Scope Boundaries

### 3.1 Release D0 — Interactive Client Demo

The immediate deliverable is a responsive web demonstration using fictional data. It is intended to validate information architecture, screens, workflows, terminology, and visual direction.

D0 MUST include:

- Responsive desktop and mobile layouts.
- Fifteen priority screens defined in Section 12.
- Role selection and simulated login.
- Navigation and clickable primary workflows.
- Fictional, internally consistent seed data.
- Search, filters, status changes, forms, charts, and simulated success/error states.
- Local state or browser storage where persistence helps the demonstration.
- A visible non-production/demo indicator.

D0 MUST NOT:

- Contain real patient, employee, finance, or credential data.
- Claim production-grade authentication or security.
- Send real emails, SMS messages, payments, or advertisements.
- Depend on production third-party credentials.
- Be represented as a completed production system.

### 3.2 Release V1 — Production Web Platform

V1 is the authenticated, database-backed, multi-branch MERN web platform described throughout this specification. Production release requires security review, data backup, audit verification, testing, UAT, deployment approval, and operational documentation.

### 3.3 Future Mobile Applications

Native or cross-platform mobile applications are outside the immediate web build. The V1 backend MUST nevertheless be mobile-ready:

- Business logic must live in backend services, not only in React components.
- APIs must be versioned under `/api/v1`.
- API responses must not depend on web-only rendering assumptions.
- Authentication and refresh mechanisms must support secure mobile clients later.
- Uploaded media and documents must be accessed through authorized service endpoints or time-limited URLs.
- Notification services must support additional channels such as mobile push in a future release.

The future mobile application shall reuse the same API contracts and authorization policies rather than duplicating business rules.

### 3.4 Explicitly Out of Scope Until Approved

- Pharmacy inventory and procurement.
- Inpatient bed/ward management.
- Operation theatre management.
- Insurance claim processing.
- Payroll processing.
- Accounting-grade general ledger and statutory filing.
- Telemedicine/video consultation.
- E-prescription regulatory integrations.
- Laboratory machine integrations.
- FHIR/HL7/EHR integrations.
- Biometric attendance devices.
- Payment gateway collection.
- Native mobile applications.

These may be added only through an approved specification change.

---

## 4. Stakeholders and Roles

### 4.1 Hospital Owner

- Business owner with organization-wide read visibility.
- May view consolidated and branch-level operational, employee, marketing, complaint, and revenue information.
- May receive and act on configured final approvals.
- Must not automatically receive technical administration powers unless a separate role grants them.

### 4.2 Global Admin

- Technical/system administration role.
- Manages users, roles, permissions, branches, departments, configuration, and audit access.
- Global Admin is not equivalent to Hospital Owner.
- Business-sensitive access must be explicitly granted; it must not be assumed merely because the user is an administrator.

### 4.3 Branch Manager

- Operates within assigned branches.
- Views branch patients, appointments, employees, attendance, complaints, revenue summaries, and reports according to permissions.

### 4.4 Doctor

- Views own schedule, assigned appointments, authorized patients, medical information, discharge summaries, notifications, and own leave/permission requests.

### 4.5 HR Manager

- Manages employee records, attendance, leave, permissions, replacement assignments, grievances, approvals, and HR reports within authorized scope.

### 4.6 Finance Manager

- Manages income records, daily collection, reports, corrections, exports, and revenue analytics within authorized branches.

### 4.7 Marketing Manager

- Manages campaigns, advertisements, digital content, leads, enquiries, spending, and performance data.

### 4.8 Complaints and Query Manager

- Manages assigned cases, priority, responsible person, investigation, responses, escalation, resolution, SLA, and closure.

### 4.9 Receptionist

- Registers patients, searches authorized patient information, creates/reschedules appointments, and performs check-in actions.

### 4.10 Custom Roles

- Global Admin may create custom roles.
- Custom roles use the same permission and data-scope model.
- Role names alone never authorize API access; permissions and data scope do.

---

## 5. Core Architectural Decisions

### 5.1 Technology Stack

The production website shall use the MERN ecosystem with TypeScript:

- **Frontend:** React with TypeScript; a modern React framework or Vite may be selected during setup.
- **Backend:** Node.js, Express.js, and TypeScript.
- **Database:** MongoDB using Mongoose or an equivalent typed data-access layer.
- **API:** RESTful JSON APIs documented with OpenAPI.
- **Authentication:** Short-lived access tokens and secure refresh-token/session handling.
- **Validation:** Shared schemas where practical, with authoritative validation on the backend.
- **Charts:** Accessible chart components.
- **File storage:** Abstracted cloud object-storage service.
- **Testing:** Unit, integration, API, component, and end-to-end testing.
- **Containerization:** Docker for reproducible backend and supporting-service environments.

Only maintained stable/LTS releases shall be selected at implementation time. Exact dependency versions must be locked in the package lockfile and updated through reviewed pull requests.

### 5.2 System Layers

1. Presentation layer: responsive React UI.
2. API layer: routes, request parsing, validation, and response serialization.
3. Authorization layer: identity, permissions, and record/data-scope enforcement.
4. Application layer: use cases and workflows.
5. Domain layer: entities, policies, status transitions, and calculations.
6. Data layer: repositories, MongoDB collections, indexes, and transactions where required.
7. Integration layer: email, SMS, storage, advertising, analytics, and future providers.
8. Operational layer: audit logging, application logging, health checks, monitoring, backup, and recovery.

### 5.3 Repository Structure

A monorepo is recommended:

```text
apps/
  web/                 React web application
  api/                 Express API
packages/
  contracts/           API DTOs, shared enums, validation schemas
  ui/                  Reusable UI components and design tokens
  config/              Shared lint, TypeScript and testing config
  test-utils/          Fixtures and testing helpers
docs/
  openapi/             OpenAPI contract
  decisions/           Architecture decision records
  runbooks/            Deployment and operations guides
spec.md                Authoritative product specification
```

Frontend code should be organized by feature, not by file type alone. Backend modules should expose route/controller, validation, service/use-case, repository, policy, and test boundaries.

### 5.4 API Contract

- Base path: `/api/v1`.
- JSON request and response bodies.
- ISO 8601 UTC timestamps in APIs; localized display only in clients.
- Stable machine-readable error codes.
- Pagination for every potentially large list.
- Filtering and sorting must be allow-listed.
- Request correlation ID returned in `X-Request-Id`.
- Breaking changes require a new API version or an approved migration plan.

Success envelope:

```json
{
  "data": {},
  "meta": {
    "requestId": "string"
  }
}
```

Paginated response:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 0,
    "totalPages": 0,
    "requestId": "string"
  }
}
```

Error response:

```json
{
  "error": {
    "code": "PATIENT_NOT_FOUND",
    "message": "Patient was not found.",
    "fieldErrors": [],
    "requestId": "string"
  }
}
```

---

## 6. Identity, RBAC, and Data Scope

### 6.1 Authorization Model

Every protected request MUST pass all three checks:

1. **Role membership** — the user has one or more active roles.
2. **Permission** — at least one role grants the required action.
3. **Data scope** — the record belongs to a branch, department, assignment, or owner scope accessible to the user.

The frontend may hide unauthorized controls for usability, but backend authorization is mandatory and authoritative.

### 6.2 Data Scopes

- `ORGANIZATION`: all permitted records in the organization.
- `SELECTED_BRANCHES`: only explicitly assigned branches.
- `OWN_BRANCH`: branches assigned to the current user.
- `DEPARTMENT`: authorized branch and department intersection.
- `ASSIGNED_RECORDS`: records explicitly assigned to the current user.
- `OWN_RECORDS`: records created by, belonging to, or representing the current user as defined by the module.

When multiple roles apply, the effective access is the union of explicitly granted permissions and scopes. Denied or confidential-record rules may further restrict that union.

### 6.3 Permission Naming

Permission keys follow `<module>.<action>`, for example:

- `patient.view`, `patient.create`, `patient.update`, `patient.archive`
- `appointment.view`, `appointment.create`, `appointment.reschedule`, `appointment.cancel`
- `medical_record.view`, `medical_record.create`, `medical_record.update`
- `discharge.view`, `discharge.create`, `discharge.approve`, `discharge.export`
- `employee.view`, `employee.create`, `employee.update`, `employee.deactivate`
- `attendance.view`, `attendance.record`, `attendance.correct`, `attendance.export`
- `leave.view`, `leave.submit`, `leave.review`, `leave.final_approve`
- `complaint.view`, `complaint.create`, `complaint.assign`, `complaint.resolve`, `complaint.view_confidential`
- `marketing.view`, `marketing.manage`, `lead.manage`, `enquiry.manage`
- `revenue.view`, `revenue.create`, `revenue.correct`, `revenue.export`
- `report.view`, `report.generate`, `report.export`
- `user.manage`, `role.manage`, `permission.manage`, `branch.manage`, `department.manage`
- `audit.view`, `settings.manage`

Hard deletion of operational records is not a normal permission. Archive, deactivate, cancel, reverse, or correct operations should preserve history.

### 6.4 Authentication Requirements

- Unique normalized email or employee login identifier.
- Passwords hashed using an approved adaptive password-hashing algorithm.
- Account states: `PENDING_ACTIVATION`, `ACTIVE`, `LOCKED`, `DISABLED`.
- Login rate limiting and progressive protection against repeated failures.
- Configurable idle and absolute session expiration.
- Refresh-token rotation and server-side revocation capability.
- Password reset tokens must be single-use, short-lived, and stored safely.
- Successful login, failed login, logout, password reset, token revocation, and account-state changes must be audited.
- MFA should be supported for privileged production roles and may be mandated by configuration.
- Sensitive tokens must not be stored in browser local storage in production.

---

## 7. Multi-Branch Rules

- Every applicable operational record MUST include `organizationId` and `branchId`.
- Department-specific records SHOULD also include `departmentId`.
- A record's branch is immutable after downstream financial or medical activity unless an authorized transfer workflow is used.
- Branch-scoped queries MUST apply scope filters in the repository/service layer before data is returned.
- Client-supplied `branchId` must be checked against the authenticated user's accessible branches.
- Aggregations must apply identical scope rules to list endpoints.
- Cross-branch patient history access requires an explicit policy and audit entry.
- New branches are configuration data, not source-code constants.

---

## 8. Shared Domain Conventions

All primary domain records SHOULD contain:

```text
_id
organizationId
branchId (when applicable)
status
createdAt
createdBy
updatedAt
updatedBy
version
archivedAt (nullable)
archivedBy (nullable)
```

Rules:

- IDs are opaque to clients.
- Optimistic concurrency must prevent silent overwrite of important records.
- Money is stored as integer minor units or MongoDB Decimal128; floating-point storage is prohibited.
- All server timestamps are UTC.
- Status transitions are validated by domain policies.
- Personally identifiable and medical information is returned only when needed for the use case.
- Audit records are append-only from application users' perspective.
- List endpoints default to active, non-archived records.

---

## 9. Functional Requirements by Module

### 9.1 Administration

#### ADM-001 User Management

The system MUST allow authorized admins to create, view, update, activate, disable, lock/unlock, and assign users. A user may hold multiple roles and branch assignments. Deactivation must revoke active sessions without deleting history.

Acceptance criteria:

- Duplicate normalized email/employee identifiers are rejected.
- A disabled user cannot authenticate.
- Role and branch assignment changes take effect on the next authorized request or token refresh.
- Every privilege change records before/after values in the audit log.

#### ADM-002 Role Management

Authorized admins MUST create, clone, update, activate/deactivate, and inspect roles. Protected system roles may not be deleted. A role in active use cannot be removed without reassignment or an explicit migration.

#### ADM-003 Permission Management

Permissions MUST be grouped by module and action. The permission editor MUST support a matrix view, data-scope selection, unsaved-change warning, and explicit save confirmation.

#### ADM-004 Branch Management

Branch fields:

- Name, code, address, phone, email, manager, operational status, time zone, and optional settings.
- Branch code must be unique within the organization.
- Deactivation must be blocked or require a migration plan when active operations remain.

#### ADM-005 Department Management

Departments may be organization-level templates with branch availability. Fields include name, code, description, head, branch assignments, and active status.

#### ADM-006 System Configuration

Configurable items include:

- Leave notice rules and approval workflow.
- Appointment durations and statuses.
- Complaint categories, priorities, SLAs, and escalation rules.
- Revenue categories and payment methods.
- Notification templates and channels.
- File size/type restrictions.
- Date, currency, and organization settings.

Configuration changes must be versioned and audited.

### 9.2 Owner Command Center

#### OWN-001 Organization Dashboard

The Owner dashboard MUST provide organization and branch filters, period comparison, drill-down links, and the following KPIs where data exists:

- Total and daily revenue.
- Total and new patients.
- Appointment totals and completion rate.
- Doctor and employee statistics.
- Attendance and pending approvals.
- Complaint volume, priority, overdue count, and resolution rate.
- Marketing spend, leads, enquiries, conversion, and cost per lead.

Dashboard values must be derived from authoritative records and use a stated date range. Financial totals displayed on cards, charts, and reports must reconcile for identical filters.

#### OWN-002 Branch Comparison

The Owner MUST compare branches by revenue, patients, appointments, doctors, employees, complaints, and marketing results. Missing data must be shown as unavailable or zero according to metric semantics, never silently omitted.

### 9.3 Patient Management

#### PAT-001 Registration

Authorized users MUST register patients with:

- Patient number generated by the system.
- Name, date of birth or age, gender, phone, email, address.
- Emergency contact.
- Branch and referral source.
- Medical alerts and consent metadata.
- Optional identity and supporting documents.

Potential duplicates must be detected using configurable combinations such as phone, normalized name, and date of birth. Duplicate warnings require review; forced creation requires permission and audit reason.

#### PAT-002 Patient Search

Search must support patient number, name, normalized phone, branch, doctor, last visit, registration period, and status. Results must respect data scope and use pagination.

#### PAT-003 Patient Profile

The patient profile includes overview, appointments, medical records, prescriptions, documents, discharge summaries, billing references, and activity history. Tabs and fields are permission-aware.

#### PAT-004 Patient Status

Supported initial statuses:

- `ACTIVE`
- `FOLLOW_UP`
- `ADMITTED`
- `DISCHARGED`
- `INACTIVE`

Status changes must be validated and audited.

#### PAT-005 Medical Records

Medical records are sensitive. Doctors and specifically authorized roles may create and update records within policy. Corrections must preserve prior values or an immutable revision history. General administrators do not automatically receive clinical access.

### 9.4 Appointment Management

#### APT-001 Appointment Creation

An appointment requires patient, branch, department, doctor, date/time, visit type, reason, priority, and status. The server must validate doctor assignment, availability, branch, and conflicting active appointments.

#### APT-002 Calendar and List Views

Provide day, week, month, and list views with filters for branch, department, doctor, status, date, and patient.

#### APT-003 Status Workflow

Initial statuses:

```text
SCHEDULED -> CONFIRMED -> CHECKED_IN -> IN_CONSULTATION -> COMPLETED
     |           |             |
     +-----------+-------------+-> CANCELLED
     +---------------------------> NO_SHOW
```

Only allowed transitions may be performed. Cancellation and rescheduling require a reason. Appointment history must preserve old date/time, doctor, status, actor, and timestamp.

#### APT-004 Notifications

Appointment creation, rescheduling, cancellation, and configured reminders create notification events. D0 simulates them; V1 sends only through configured providers.

### 9.5 Doctor Management

#### DOC-001 Doctor Profile

Store employee/user reference, specialization, department, branch assignments, qualifications, experience, contact information, availability, and active status.

#### DOC-002 Availability

Availability supports weekly schedules, branch, appointment duration, breaks, exceptions, holidays, and leave. Slot generation occurs on the backend and prevents conflicting bookings.

#### DOC-003 Doctor Dashboard

The doctor sees today's appointments, assigned patients, permitted history, consultation tasks, discharge work, notifications, and own leave/permission requests.

#### DOC-004 Performance Information

Performance metrics are management information, must use defined formulas, and must not infer medical quality from raw volume alone.

### 9.6 Discharge Summary

#### DIS-001 Workflow

```text
Search/Select Patient
-> Load authorized admission/visit information
-> Enter discharge details
-> Validate required fields
-> Review
-> Approve if configured
-> Generate versioned summary
-> View / Print / Export
```

#### DIS-002 Data

The summary may include patient identifiers, doctor, branch, admission/visit dates, diagnosis, treatment summary, condition at discharge, medicines, instructions, follow-up, author, approver, and generated version.

#### DIS-003 Immutability

An issued summary must not be silently overwritten. Amendments create a new version and retain the original.

### 9.7 Employee Management

#### EMP-001 Employee Profile

Fields include employee number, personal/contact information, employment type, joining date, role, branch, department, reporting manager, status, documents, and replacement mappings.

#### EMP-002 Status

Initial statuses: `ACTIVE`, `ON_NOTICE`, `SUSPENDED`, `RESIGNED`, `TERMINATED`, `INACTIVE`. Status changes preserve historical employment data and revoke access when required.

#### EMP-003 Replacement Mapping

Temporary replacements may be proposed for leave periods. Replacement does not automatically copy all permissions; access changes require explicit, time-bound authorization.

### 9.8 Attendance

#### ATT-001 Daily Attendance

Initial statuses:

- `PRESENT`
- `ABSENT`
- `LATE`
- `HALF_DAY`
- `ON_LEAVE`
- `PERMISSION`
- `HOLIDAY`

Attendance records are unique per employee, branch/work location, and work date unless split-shift support is later approved.

#### ATT-002 Correction

Authorized corrections require a reason and retain previous/new values in the audit history.

#### ATT-003 Reports

Support daily, employee-wise, department-wise, branch-wise, and date-range summaries with pagination/export permissions.

### 9.9 Leave and Permission

#### LEA-001 Submission

Employees may submit leave or permission requests with type, dates/times, reason, attachment, and optional replacement. Backend validation applies configured advance-notice, overlap, duration, and balance rules.

#### LEA-002 Configurable Approval Workflow

Default flow:

```text
SUBMITTED -> MANAGER_REVIEW -> HR_REVIEW -> FINAL_REVIEW
          -> APPROVED | REJECTED | CANCELLED
```

The number and identity of stages must be configurable by request type, branch, department, and role rather than hard-coded.

#### LEA-003 Decisions

- Only the current authorized approver may decide.
- Rejection requires a comment.
- Approval/rejection must record actor, stage, comment, and timestamp.
- Final approval updates attendance through an idempotent workflow.
- Cancellation after approval follows configured policy and audit requirements.

### 9.10 Complaints and Queries

#### CQM-001 Creation

Sources: patient, employee, public/general enquiry, or internal staff. Required fields include case type, subject, description, source, category, branch when applicable, priority, confidentiality, and contact details where permitted.

#### CQM-002 Status Workflow

Initial statuses:

```text
NEW -> ASSIGNED -> UNDER_REVIEW -> IN_PROGRESS
   -> WAITING_FOR_RESPONSE -> RESOLVED -> CLOSED
                              |           |
                              +-> REOPENED+
Any active state -> ESCALATED
```

#### CQM-003 Assignment and SLA

- Cases may be assigned to an authorized user or responsible queue.
- SLA due time is calculated from configured category/priority rules.
- Escalations generate notifications and history entries.
- Overdue calculations must be consistent across cards, lists, and reports.

#### CQM-004 Confidentiality

Confidential cases are visible only to explicitly authorized administrators, assigned responsible users, and relevant management users with `complaint.view_confidential`. Search, counts, notifications, exports, and audit views must not leak restricted content.

#### CQM-005 Notes and Resolution

Internal notes are never included in external responses. Resolution requires summary, action taken, resolver, and timestamp. Closure may require a configured reviewer.

### 9.11 Advertisement and Campaign Management

#### MKT-001 Campaigns

Fields include name, objective, branch, platforms, dates, budget, owner/responsible person, target audience, status, and notes.

#### MKT-002 Advertisements

Track campaign, platform, source, URL, creative/content status, spend, branch, responsible person, leads, enquiries, and reporting period.

Supported initial platforms: Google Ads, Facebook, and Instagram. YouTube may be represented in digital content and campaign reporting.

#### MKT-003 Leads

Lead records include source, campaign, branch, contact data, interest, assigned person, status, follow-up date, consent/source metadata, and outcome.

#### MKT-004 Enquiries

Enquiries may originate from leads or be created independently. Conversion from lead to enquiry must preserve linkage and avoid duplicate counting.

#### MKT-005 Metrics

Support spend, impressions where entered/integrated, reach, clicks, leads, enquiries, conversion rate, and cost per lead. Formula definitions must be centralized:

```text
conversionRate = convertedCount / eligibleSourceCount * 100
costPerLead = spend / leads
```

Division-by-zero produces `null/not available`, not an invalid numeric value.

### 9.12 Digital Marketing Content

#### DGM-001 Content Types

- Instagram: posts and reels.
- Facebook: posts, videos, reels, stories.
- YouTube: videos and shorts.

#### DGM-002 Content Record

Store title, platform, content type, URL, thumbnail, branch, responsible person/team, publish date, status, reach, views, likes, comments, shares, and reporting date.

#### DGM-003 Analytics

Provide branch-, platform-, content-type-, person/team-, period-, and performance-based reports. Manual metrics must identify their source and last-updated time. Future APIs must be isolated behind integration adapters.

### 9.13 Finance and Revenue

#### FIN-001 Revenue Categories

Initial configurable categories:

- OP
- Medical
- Lab
- Day Care
- Dressing
- KIT
- Socks
- Slipper
- Other Collections

#### FIN-002 Income Record

Fields include transaction/reference number, branch, date/time, category, patient/reference where applicable, amount, payment method, status, recorded by, notes, and supporting reference.

Payment methods initially include cash, UPI, card, bank transfer, and insurance/credit reference if approved.

#### FIN-003 Financial Integrity

- Amount must be positive for normal entries.
- Issued records must not be hard-deleted.
- Corrections use reversal or adjustment records referencing the original.
- Financial mutations require reason, permission, and audit history.
- Duplicate transaction/reference checks must be implemented where identifiers exist.

#### FIN-004 Reports

Provide daily, date-range, branch, category, payment-method, recorder, and comparison reports. Exported totals must match filtered UI totals.

#### FIN-005 Profit

Revenue is in V1. Profit is calculated only after an approved expense domain exists and formulas are verified. Revenue must not be labelled profit.

### 9.14 Reporting and Analytics

#### REP-001 Report Levels

- Operational: department/user workflows.
- Branch: Branch Manager views.
- Organization: Owner and authorized organization roles.

#### REP-002 Report Builder

Filters may include report type, branch, department, doctor, date range, status, grouping, sorting, and previous-period comparison. Filters must be validated and authorized.

#### REP-003 Exports

PDF/Excel/CSV export requires permission. Large exports should run asynchronously in production, notify the requester, expire after a configured period, and be audited.

#### REP-004 Metric Definitions

Each KPI must have a documented source collection, filter semantics, formula, time zone, and refresh strategy. Dashboards may cache aggregates, but cached results must expose the applied period and refresh time.

### 9.15 Notifications

#### NOT-001 Channels

- In-app required for V1.
- Email supported through a provider adapter.
- SMS optional/configurable through a provider adapter.
- Future mobile push supported by the event architecture.

#### NOT-002 Events

Events include leave submitted/approved/rejected, complaint assigned/updated/resolved/escalated, appointment created/rescheduled/cancelled/reminder, export completed, account/security events, and important administration alerts.

#### NOT-003 Delivery

Notification creation and external delivery must be idempotent. Provider failure must not roll back the underlying approved business transaction. Retries, failure state, and correlation must be recorded.

### 9.16 Audit Logging

#### AUD-001 Required Fields

- Timestamp
- Actor user and effective roles
- Action
- Module
- Record type and identifier
- Organization/branch context
- Previous and new values, with sensitive-value redaction
- Request/correlation ID
- IP/session/device metadata when appropriate
- Outcome
- Reason where required

#### AUD-002 Coverage

At minimum: authentication events, user/role/permission changes, patient and medical changes, appointment changes, discharge versions, employee status, attendance corrections, leave decisions, complaint assignment/confidential access, financial mutations, configuration changes, exports, and sensitive record access where configured.

#### AUD-003 Protection

Application users cannot edit or delete audit events. Audit access is permission controlled. Secrets, raw passwords, tokens, and unnecessarily sensitive medical content must never be logged.

---

## 10. Data Model and Collections

The following logical collections are required. Names may change through an approved ADR, but domain boundaries must remain clear.

### 10.1 Identity and Organization

- `organizations`
- `branches`
- `departments`
- `users`
- `roles`
- `permissions`
- `user_role_assignments`
- `user_branch_assignments`
- `sessions` or `refresh_tokens`
- `system_configurations`

### 10.2 Hospital Operations

- `patients`
- `patient_documents`
- `medical_records`
- `appointments`
- `appointment_history`
- `doctor_profiles`
- `doctor_availability`
- `discharge_summaries`

### 10.3 Workforce

- `employees`
- `attendance_records`
- `leave_requests`
- `permission_requests`
- `approval_workflows`
- `approval_instances`
- `replacement_assignments`

### 10.4 Cases

- `cases` for complaints and queries with type discrimination
- `case_notes`
- `case_assignments`
- `case_history`
- `case_attachments`

### 10.5 Marketing

- `campaigns`
- `advertisements`
- `marketing_contents`
- `leads`
- `enquiries`
- `marketing_metric_snapshots`

### 10.6 Finance and Platform

- `revenue_categories`
- `income_records`
- `financial_adjustments`
- `notifications`
- `notification_deliveries`
- `audit_logs`
- `export_jobs`
- `files`

### 10.7 Indexing Requirements

At minimum, evaluate and define indexes for:

- Organization + branch + status + date queries.
- Unique normalized email and employee number.
- Unique organization + branch code.
- Patient number and normalized phone/name search.
- Doctor + appointment start/end/status conflict queries.
- Employee + attendance date uniqueness.
- Case assignee/status/priority/SLA date.
- Income branch/category/transaction date.
- Campaign/platform/date and lead/enquiry source.
- Audit record/module/timestamp and actor/timestamp.
- Notification recipient/read state/timestamp.

Indexes must be driven by documented query patterns. Unbounded regular-expression scans on sensitive, growing collections are prohibited.

### 10.8 Schema Validation

Mongoose/application validation is required. Production should additionally use MongoDB collection validation for critical invariants where practical. Multi-document operations that require atomicity—such as final approval plus attendance update or financial correction linkage—must use transactions when deployment topology supports them, or an explicitly designed idempotent workflow with reconciliation.

---

## 11. REST API Surface

This is the minimum route inventory; the OpenAPI document is the executable contract.

### 11.1 Authentication

```text
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
GET    /api/v1/auth/me
GET    /api/v1/auth/effective-permissions
```

### 11.2 Administration

```text
GET/POST       /api/v1/users
GET/PATCH      /api/v1/users/:userId
POST           /api/v1/users/:userId/activate
POST           /api/v1/users/:userId/disable
POST           /api/v1/users/:userId/revoke-sessions
GET/POST       /api/v1/roles
GET/PATCH      /api/v1/roles/:roleId
PUT            /api/v1/roles/:roleId/permissions
GET            /api/v1/permissions
GET/POST       /api/v1/branches
GET/PATCH      /api/v1/branches/:branchId
GET/POST       /api/v1/departments
GET/PATCH      /api/v1/departments/:departmentId
GET/PATCH      /api/v1/configurations/:configKey
```

### 11.3 Operations

```text
GET/POST       /api/v1/patients
GET/PATCH      /api/v1/patients/:patientId
GET            /api/v1/patients/:patientId/timeline
GET/POST       /api/v1/patients/:patientId/medical-records
GET/POST       /api/v1/appointments
GET/PATCH      /api/v1/appointments/:appointmentId
POST           /api/v1/appointments/:appointmentId/transition
POST           /api/v1/appointments/:appointmentId/reschedule
GET/POST       /api/v1/doctors
GET/PATCH      /api/v1/doctors/:doctorId
GET/PUT        /api/v1/doctors/:doctorId/availability
GET/POST       /api/v1/discharge-summaries
GET/PATCH      /api/v1/discharge-summaries/:summaryId
POST           /api/v1/discharge-summaries/:summaryId/issue
POST           /api/v1/discharge-summaries/:summaryId/amend
```

### 11.4 Workforce

```text
GET/POST       /api/v1/employees
GET/PATCH      /api/v1/employees/:employeeId
GET/POST       /api/v1/attendance
PATCH          /api/v1/attendance/:attendanceId/correct
GET/POST       /api/v1/leave-requests
GET/PATCH      /api/v1/leave-requests/:requestId
POST           /api/v1/leave-requests/:requestId/decision
GET/POST       /api/v1/permission-requests
POST           /api/v1/permission-requests/:requestId/decision
```

### 11.5 Cases, Marketing, and Finance

```text
GET/POST       /api/v1/cases
GET/PATCH      /api/v1/cases/:caseId
POST           /api/v1/cases/:caseId/assign
POST           /api/v1/cases/:caseId/notes
POST           /api/v1/cases/:caseId/transition
GET/POST       /api/v1/campaigns
GET/PATCH      /api/v1/campaigns/:campaignId
GET/POST       /api/v1/advertisements
GET/POST       /api/v1/marketing-contents
GET/POST       /api/v1/leads
GET/PATCH      /api/v1/leads/:leadId
GET/POST       /api/v1/enquiries
GET/POST       /api/v1/income-records
GET            /api/v1/income-records/:incomeId
POST           /api/v1/income-records/:incomeId/adjustments
```

### 11.6 Dashboards, Reports, and Platform

```text
GET            /api/v1/dashboards/owner
GET            /api/v1/dashboards/admin
GET            /api/v1/dashboards/branch
GET            /api/v1/dashboards/doctor
GET            /api/v1/dashboards/hr
GET            /api/v1/dashboards/finance
GET            /api/v1/dashboards/marketing
POST           /api/v1/reports/generate
GET            /api/v1/reports/:reportId
POST           /api/v1/exports
GET            /api/v1/exports/:exportId
GET            /api/v1/notifications
POST           /api/v1/notifications/:notificationId/read
POST           /api/v1/notifications/read-all
GET            /api/v1/audit-logs
GET            /api/v1/health/live
GET            /api/v1/health/ready
```

State-changing endpoints require validation, authorization, audit coverage, and idempotency where duplicate requests could create duplicate business effects.

---

## 12. Web UX and Screen Specification

### 12.1 Priority Fifteen Screens

1. Login and role-based demo entry.
2. Hospital Owner Dashboard.
3. Global Admin Dashboard.
4. Branch Management.
5. User Management.
6. Roles and Permission Matrix.
7. Patient List and Registration.
8. Patient Profile.
9. Appointment Calendar/List and Creation.
10. Employee Management.
11. Leave and Permission Approval.
12. Complaints and Query Dashboard.
13. Marketing Dashboard.
14. Finance and Revenue Dashboard.
15. Reports and Analytics.

Supporting production screens include doctor profile/dashboard, attendance, discharge summary, notifications, audit logs, departments, settings, access denied, session expired, forgot/reset password, and reusable detail/form states.

### 12.2 Desktop Application Shell

- Collapsible sidebar grouped into Overview, Hospital Operations, Workforce, Support, Growth, Finance, and Administration.
- Top navigation with title, breadcrumbs, search, branch selector, date filter where applicable, quick action, notifications, and user menu.
- Page heading, contextual description, primary action, filter bar, content, pagination, and feedback states.

### 12.3 Responsive/Mobile Web

Supported reference widths: 360, 390, 430, 768, 1024, 1280, and 1440 pixels.

- Desktop sidebar becomes role-aware bottom navigation plus a More drawer.
- Bottom navigation contains no more than five primary destinations.
- Wide tables become mobile record cards or intentionally scrollable, labelled tables.
- Filters open in a bottom sheet or full-screen filter view.
- Desktop side drawers become full-screen detail pages where space requires.
- Multi-column forms become one column.
- KPI grids become two columns or one column based on width.
- Primary mobile actions may be sticky but must not cover content.
- Touch targets should be at least 44 by 44 CSS pixels.
- Form input text must remain readable and avoid unintended mobile zoom.

### 12.4 Design System

Recommended foundation:

- Primary navy `#123B5D`.
- Primary blue `#2563EB`.
- Healthcare teal `#0F766E`.
- Background `#F6F8FB`.
- Surface `#FFFFFF`.
- Main text `#172033`.
- Secondary text `#64748B`.
- Border `#E2E8F0`.
- Success `#16A34A`.
- Warning `#D97706`.
- Critical `#DC2626`.

Use a professional, calm, information-dense healthcare SaaS style. Avoid excessive gradients, glass effects, decorative animation, oversized cards, and colour-only status communication.

### 12.5 Shared UI States

Every data screen MUST define:

- Loading/skeleton state.
- Empty state with appropriate permitted action.
- No-search-results state.
- Recoverable error state.
- Access-denied state.
- Success feedback.
- Validation errors linked to fields.
- Confirmation for high-impact actions.
- Pagination or controlled incremental loading.

### 12.6 Accessibility

The web application SHOULD conform to WCAG 2.2 Level AA:

- Keyboard-operable controls and logical focus order.
- Visible focus states.
- Programmatic labels and error descriptions.
- Sufficient colour contrast.
- Text alternatives for meaningful images.
- Charts accompanied by legends, values, or accessible summaries.
- Status communicated with text/icon in addition to colour.
- Responsive layouts without loss of functionality.

---

## 13. Demo Data Specification

All D0 data is fictional and must be clearly marked as such.

Seed data should include:

- Four configured branches.
- At least one user for each primary role.
- 25–50 fictional patients distributed across branches.
- 8–12 fictional doctors with departments and schedules.
- 30–60 appointments across multiple statuses and dates.
- 20–40 employees with attendance records.
- Leave and permission requests at multiple workflow stages.
- Complaints/queries at every initial status and priority.
- Campaigns across Google, Facebook, Instagram, and YouTube-related content.
- Leads, enquiries, and content metrics.
- Income records covering every configured revenue category and payment method.
- Notifications and audit events.

Consistency requirements:

- Dashboard counts must equal underlying seeded records for the same filter.
- Branch totals must add up to organization totals, subject to stated rounding.
- Revenue charts and report totals must reconcile.
- Linked records must reference existing seed entities.
- Dates must support meaningful daily/monthly comparisons.
- No real names, phone numbers, emails, medical details, or financial records may be used.

---

## 14. Security and Privacy Requirements

Production security must be treated as a release gate.

### 14.1 Application Security

- HTTPS only outside local development.
- Secure response headers and restrictive CORS configuration.
- Backend input validation and output shaping.
- Parameterized/ODM-safe database access and operator sanitization.
- Rate limits on authentication, password reset, search abuse, upload, and expensive reports.
- CSRF protection where cookie-based state requires it.
- Content Security Policy suitable for deployed assets and integrations.
- Secrets stored in a secret manager/environment, never committed.
- Dependency and container vulnerability scanning.
- Redacted, structured logs.

### 14.2 File Security

- Allow-listed MIME types and extensions.
- Configurable file-size limits.
- Generated server-side object keys; original names retained only as metadata.
- Malware scanning or quarantine workflow before production download where feasible.
- Private storage by default.
- Authorization on every download or short-lived signed access.
- Upload, view, export, and deletion/archive actions audited.

### 14.3 Privacy

- Collect only required information.
- Separate demographic, clinical, employee, complaint, and financial permissions.
- Mask sensitive fields in lists and logs where full values are unnecessary.
- Define retention and deletion/anonymization policies with the hospital before production.
- Production backups must be encrypted and access controlled.
- Demo and non-production environments must not receive production data without an approved masking process.

### 14.4 Security Verification

Security testing must include authentication, session handling, object-level authorization, branch isolation, privilege escalation, confidential cases, file access, injection, XSS, mass assignment, rate limits, exports, and audit completeness. OWASP ASVS should guide verification depth.

---

## 15. Non-Functional Requirements

### 15.1 Performance

- Common read APIs should target p95 under 500 ms under the agreed normal-load test, excluding third-party latency.
- Common write APIs should target p95 under 800 ms.
- Dashboard aggregate responses should target p95 under 2 seconds or use cached/precomputed results.
- Initial authenticated page content should become usable within 3 seconds on an agreed representative connection/device.
- Lists must paginate; default page size 20 and configurable maximum no greater than 100 without explicit endpoint design.
- Expensive reports and exports should be asynchronous.

Targets are verified against an agreed production-like dataset and load profile before launch.

### 15.2 Availability and Recovery

- Production target availability must be agreed before launch; initial recommended target is 99.5% monthly excluding planned maintenance.
- Automated database backups are required.
- Backup restoration must be tested, not merely configured.
- Recommended initial targets: RPO 24 hours maximum and RTO 8 hours maximum, to be tightened if the hospital requires it.
- Deployment rollback procedure is required.

### 15.3 Scalability

- New branches, departments, roles, categories, and workflow configurations must not require core code changes.
- Stateless API instances should support horizontal scaling.
- Files remain outside the primary database.
- Aggregation workloads must be indexed, cached, precomputed, or moved to jobs as scale requires.

### 15.4 Maintainability

- TypeScript strict mode.
- Centralized error handling.
- Feature-level modularity.
- No business rules duplicated across UI and API.
- Public service/module interfaces documented.
- Architecture decisions recorded in ADRs.
- Automated formatting, linting, type checking, and tests in CI.

### 15.5 Observability

- Structured logs with timestamp, level, service, environment, request ID, route, actor ID where safe, and outcome.
- Error tracking with sensitive-data scrubbing.
- Health, readiness, and dependency checks.
- Metrics for request rate, latency, error rate, job failures, notification failures, database health, and resource saturation.
- Alerts for repeated authentication failures, high error rate, backup failure, storage exhaustion, and critical job failures.

---

## 16. Validation and Business Rules

- Server validation is authoritative; client validation improves usability only.
- Phone and email values must be normalized before duplicate checks.
- Date ranges require start less than or equal to end and must respect branch time zone when representing business days.
- User-selected organization/branch IDs may never override authenticated scope.
- Monetary reports use consistent rounding rules and display INR formatting.
- Approval actions must be idempotent; duplicate requests cannot approve twice.
- Status transition endpoints must reject illegal transitions with a stable error code.
- Referential checks are required before assignment.
- Archived/deactivated referenced entities remain displayable historically.
- Configuration changes apply prospectively unless an explicit migration is approved.

---

## 17. Testing Strategy

### 17.1 Unit Tests

Cover policies, permission evaluation, scope construction, status transitions, financial calculations, KPI formulas, validators, SLA calculations, and notification event mapping.

### 17.2 Integration and API Tests

Cover database repositories, transactions/idempotency, authentication, refresh/revocation, uploads, filters, pagination, report aggregation, audit generation, and provider adapters.

### 17.3 Authorization Matrix Tests

For every protected endpoint test:

- Allowed role + allowed scope.
- Allowed role + wrong branch.
- Missing permission.
- Assigned-record access and non-assigned denial.
- Confidential-record denial.
- Disabled account/session revocation.
- Direct object-ID attempts against inaccessible records.

### 17.4 UI and End-to-End Tests

Critical paths:

1. Login and role-aware navigation.
2. Create patient and locate profile.
3. Create/reschedule/cancel appointment.
4. Create and issue/amend discharge summary.
5. Submit, review, approve/reject leave.
6. Create, assign, resolve, close, and reopen complaint.
7. Create campaign and track lead/enquiry.
8. Record and adjust revenue.
9. Generate and export scoped report.
10. Change role/permission and verify effective access.

### 17.5 Quality Gates

Before merging:

- Formatting, lint, type check, and affected tests pass.
- New requirement IDs have tests or a documented reason.
- API changes update OpenAPI and client contracts.
- Authorization and audit implications are reviewed.

Before production:

- Full regression suite passes.
- No unresolved critical/high security findings.
- UAT sign-off completed.
- Backup restore and rollback verified.
- Monitoring and incident contacts configured.
- Demo data removed; production configuration confirmed.

---

## 18. Deployment Environments

Required environments:

- `local`: developer environment with fictional fixtures.
- `test`: automated integration environment.
- `staging`: production-like UAT environment with fictional/masked data.
- `production`: real hospital environment.

Environment rules:

- Separate credentials and databases.
- Production secrets never copied to local files.
- Database migrations/index changes are version controlled and reviewed.
- CI builds immutable artifacts.
- CD requires approval for production.
- Production deploys include health verification and rollback criteria.
- Frontend, API, database, storage, email/SMS, and monitoring providers remain replaceable behind interfaces where feasible.

---

## 19. Spec-Driven Development Workflow

Every implementation task must trace to a requirement ID or approved change request.

### 19.1 Work Item Template

```text
Title:
Requirement IDs:
User/role:
Problem and desired outcome:
In scope:
Out of scope:
UI states:
API contract:
Data changes and indexes:
Authorization/data-scope rules:
Validation/business rules:
Audit events:
Notification events:
Acceptance criteria:
Test cases:
Observability:
Rollout/migration notes:
```

### 19.2 Implementation Order

1. Clarify requirement and acceptance criteria.
2. Update specification/OpenAPI/data design before code when behaviour changes.
3. Define authorization and audit requirements.
4. Implement domain/service logic.
5. Implement repository/data changes and indexes.
6. Implement API controller and validation.
7. Implement UI and all states.
8. Add automated tests.
9. Verify security, accessibility, and responsive behaviour.
10. Demonstrate against acceptance criteria.

### 19.3 AI Coding Agent Rules

AI tools may accelerate design-to-code, scaffolding, CRUD, tests, refactoring, documentation, and browser verification. They MUST follow these rules:

- Read this specification and the relevant module before implementation.
- Plan the smallest verifiable slice.
- Never invent missing business rules.
- Never disable authorization, validation, tests, lint, or type checks to make code pass.
- Do not expose secrets or real hospital data to prompts.
- Do not add dependencies without explaining purpose and reviewing maintenance/security.
- Treat generated code as untrusted until reviewed and tested.
- Record assumptions and unresolved questions.
- Preserve existing behaviour outside the approved task.

---

## 20. Delivery Phases

### Phase 0 — Demo

- Fifteen responsive screens.
- Fictional coherent data.
- Clickable priority workflows.
- Client feedback capture.

### Phase 1 — Foundation

- Repository, environments, CI, UI system, API skeleton, database, logging, error handling, health checks.

### Phase 2 — Identity and Administration

- Authentication, users, roles, permissions, data scopes, branches, departments, configuration, audit foundation.

### Phase 3 — Patients and Appointments

- Patient registration/search/profile, appointment calendar/workflow, doctor allocation, notifications.

### Phase 4 — Doctors and Discharge

- Doctor profiles/availability/dashboard, medical permissions, discharge workflow and versioned export.

### Phase 5 — Workforce

- Employees, attendance, leave, permission, replacement, configurable approvals, reports.

### Phase 6 — Complaints and Queries

- Case workflow, assignment, confidentiality, SLA, escalation, notifications, reports.

### Phase 7 — Marketing

- Campaigns, advertisements, leads, enquiries, digital content, manual metrics, reports.

### Phase 8 — Finance

- Income records, categories, corrections, daily/date-range/branch reports, exports.

### Phase 9 — Analytics and Communication

- Management dashboards, notifications, advanced reports, background exports, metric reconciliation.

### Phase 10 — Production Readiness

- Full QA, authorization tests, security testing, performance testing, UAT, backup/restore, monitoring, deployment, training, documentation.

Mobile application planning starts only after API and V1 requirements stabilize unless separately approved.

---

## 21. Definition of Done

A feature is done only when:

- Requirement and acceptance criteria are approved.
- Desktop and mobile-responsive behaviour is implemented where applicable.
- Backend validation, authorization, and data scope are enforced.
- Data model/index changes are documented and applied.
- Audit and notification events are implemented where required.
- Loading, empty, validation, success, error, and access-denied states exist.
- Unit/integration/UI tests appropriate to risk pass.
- OpenAPI and relevant documentation are updated.
- No sensitive data appears in logs or unauthorized responses.
- Accessibility and keyboard behaviour are verified.
- Code is reviewed and merged through CI.
- Product owner/UAT accepts the stated criteria.

Demo completion does not imply production Definition of Done.

---

## 22. Change Control

This specification defines the baseline. New features and changed workflows are not automatically included.

Change process:

1. Record the request.
2. Classify as bug, clarification, small enhancement, major feature, integration, or architecture change.
3. Analyze affected requirements, UI, API, data, security, testing, timeline, and cost.
4. Obtain written approval and priority.
5. Update `spec.md`, OpenAPI, backlog, and version history.
6. Implement within agreed capacity.

An ongoing support agreement means continuous development within agreed capacity; it does not mean unlimited simultaneous or unestimated features.

---

## 23. Open Decisions Required Before Production

1. Official hospital/organization name and branding.
2. Legal/privacy requirements applicable to the operating organization and locations.
3. Exact clinical-data scope and who may access each field.
4. Cross-branch patient visibility and patient-number format.
5. Whether inpatient/admission data exists outside the defined discharge workflow.
6. Leave types, balances, notice rules, approval stages, and cancellation rules.
7. Complaint categories, SLA hours, business hours, escalation levels, and external response process.
8. Revenue approval, correction, reconciliation, and accounting ownership.
9. Required reports and exact KPI formulas.
10. Document retention, archival, anonymization, and deletion policy.
11. Email, SMS, storage, hosting, and monitoring providers.
12. MFA requirements and session durations by role.
13. Expected users, concurrent usage, data volume, file volume, availability, RPO, and RTO.
14. Whether Google Ads, Meta, and YouTube begin as manual tracking or live integrations.
15. Supported languages and whether Tamil localization is required.
16. Export branding and authorized distribution rules.
17. Mobile application users, offline requirements, and push-notification expectations.

Open decisions must not block D0 when safe fictional assumptions are clearly labelled. They must be resolved before the affected production feature is accepted.

---

## 24. Demo Acceptance Checklist

The immediate demo is accepted when:

- All fifteen priority routes render without blocking errors.
- Desktop and 390px mobile layouts are usable.
- Login can simulate at least Owner, Global Admin, Branch Manager, Doctor, HR, Finance, Marketing, and Complaints Manager roles.
- Navigation changes appropriately by role.
- Owner can switch branches and see consistent dashboard changes.
- A fictional patient can be searched, opened, and added.
- A fictional appointment can be created and status updated.
- A leave request can be approved or rejected with a comment.
- A complaint can be assigned and moved through statuses.
- Marketing and finance dashboards show reconciled fictional metrics.
- A report can be filtered and a mock export action completed.
- Loading, empty, error, validation, and success examples exist.
- No real data or production credentials are present.
- The demo is visibly identified as a prototype.

---

## 25. Reference Standards

Implementation and review should use:

- OWASP Application Security Verification Standard for security verification.
- OWASP guidance for authentication, access control, logging, file uploads, and common web risks.
- WCAG 2.2 Level AA for web accessibility.
- OpenAPI 3.1 or the supported current OpenAPI standard for API contracts.
- MongoDB official guidance for indexes, schema validation, transactions, backup, and operational safety.
- Node.js supported LTS policy and official framework security guidance.

This specification does not itself certify legal or regulatory compliance. Applicable legal, medical-record, privacy, tax, and employment requirements must be reviewed with qualified hospital and legal stakeholders before production launch.

---

## 26. Version History

| Version | Change |
|---|---|
| 1.0.0 | Initial complete SDD baseline: responsive MERN web platform, interactive demo scope, production requirements, and future mobile-readiness contract. |

