# Backend REST API Implementation Checklist

> **Baseline Reference**: [`spec.md`](../spec.md) Section 11, Section 5.4 & RCRAFT Master Specification  
> **Base Path**: `/api/v1`  
> **Format**: JSON Request / Response Envelopes with Correlation ID (`X-Request-Id`)  
> **Status**: Ready for Implementation (Step 1 Planning Complete)

---

## 1. System Health & Infrastructure

| HTTP Method | Route Path | Spec Ref | Permissions Required | Data Scope | Description & Key Invariants | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health/live` | Sec 11.6 | Public | None | Liveness probe returning server status, environment, and uptime. | Pending Execution |
| `GET` | `/health/ready` | Sec 11.6 | Public | None | Readiness probe checking MongoDB connection & system memory stats. | Pending Execution |

---

## 2. Authentication & Identity (`modules/auth`)

| HTTP Method | Route Path | Spec Ref | Permissions Required | Data Scope | Description & Key Invariants | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Sec 6.4, 11.1 | Public | None | Authenticates email & password. Issues access JWT + refresh token. Audits login attempt. | Pending Execution |
| `POST` | `/auth/refresh` | Sec 6.4, 11.1 | Public | None | Rotates refresh token; returns new short-lived access JWT. | Pending Execution |
| `POST` | `/auth/logout` | Sec 6.4, 11.1 | Authenticated | None | Invalidates active refresh token; records logout audit event. | Pending Execution |
| `GET` | `/auth/me` | Sec 11.1 | Authenticated | None | Returns active user profile, assigned roles, branch assignments, and permissions. | Pending Execution |
| `GET` | `/auth/effective-permissions` | Sec 6.1, 11.1 | Authenticated | None | Returns compiled set of granular `<module>.<action>` permission keys and branch scopes. | Pending Execution |

---

## 3. Administration (`modules/users`, `modules/roles`, `modules/branches`)

| HTTP Method | Route Path | Spec Ref | Permissions Required | Data Scope | Description & Key Invariants | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/users` | ADM-001 | `user.manage` | `ORGANIZATION` | List users with pagination, role filter, status filter, and search. | Pending Execution |
| `POST` | `/users` | ADM-001 | `user.manage` | `ORGANIZATION` | Create new user with role and branch assignments. Enforces email uniqueness. | Pending Execution |
| `GET` | `/users/:userId` | ADM-001 | `user.manage` | `ORGANIZATION` | Fetch single user details, profile, assigned branches, and active sessions. | Pending Execution |
| `PATCH` | `/users/:userId` | ADM-001 | `user.manage` | `ORGANIZATION` | Update user metadata, role assignments, or branch mappings. Audited. | Pending Execution |
| `POST` | `/users/:userId/activate` | ADM-001 | `user.manage` | `ORGANIZATION` | Transition user status to `ACTIVE`. | Pending Execution |
| `POST` | `/users/:userId/disable` | ADM-001 | `user.manage` | `ORGANIZATION` | Transition user status to `DISABLED`; revokes active tokens. | Pending Execution |
| `POST` | `/users/:userId/revoke-sessions` | ADM-001 | `user.manage` | `ORGANIZATION` | Invalidate all issued refresh tokens for target user. | Pending Execution |
| `GET` | `/roles` | ADM-002 | `role.manage` | `ORGANIZATION` | List all system and custom roles with user counts. | Pending Execution |
| `POST` | `/roles` | ADM-002 | `role.manage` | `ORGANIZATION` | Create custom role with descriptive metadata. | Pending Execution |
| `PATCH` | `/roles/:roleId` | ADM-002 | `role.manage` | `ORGANIZATION` | Update role name, description, or status (protected system roles blocked). | Pending Execution |
| `PUT` | `/roles/:roleId/permissions` | ADM-003 | `permission.manage` | `ORGANIZATION` | Replace permission array and default scopes for the target role. Audited. | Pending Execution |
| `GET` | `/permissions` | ADM-003 | `permission.manage` | `ORGANIZATION` | Get full catalogue of available permission keys grouped by module. | Pending Execution |
| `GET` | `/branches` | ADM-004 | `branch.manage` / `branch.view` | `ORGANIZATION` / `OWN_BRANCH` | List all hospital branches (Trichy, Chennai, Madurai, Pudukkottai) with status and stats. | Pending Execution |
| `POST` | `/branches` | ADM-004 | `branch.manage` | `ORGANIZATION` | Register new hospital branch facility. Enforces unique branch code. | Pending Execution |
| `PATCH` | `/branches/:branchId` | ADM-004 | `branch.manage` | `ORGANIZATION` | Update branch contact info, manager, bed capacity, or operational status. | Pending Execution |

---

## 4. Hospital Operations (`modules/patients`, `modules/appointments`)

| HTTP Method | Route Path | Spec Ref | Permissions Required | Data Scope | Description & Key Invariants | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/patients` | PAT-001, PAT-002 | `patient.view` | `OWN_BRANCH` / `ORGANIZATION` | Paginated patient list with query search (name/UHID/phone), status & branch filters. | Pending Execution |
| `POST` | `/patients` | PAT-001 | `patient.create` | `OWN_BRANCH` | Register walk-in or referred patient. Generates unique UHID (`PAT-<BRANCH>-XXXX`). Duplicate check. | Pending Execution |
| `GET` | `/patients/:patientId` | PAT-003 | `patient.view` | `OWN_BRANCH` / `ORGANIZATION` | Get patient 360° profile, demographics, vitals, medical history, and active tags. | Pending Execution |
| `PATCH` | `/patients/:patientId` | PAT-001, PAT-004 | `patient.update` | `OWN_BRANCH` | Update contact details, emergency contacts, or status (`ACTIVE`, `ADMITTED`, `DISCHARGED`). | Pending Execution |
| `GET` | `/patients/:patientId/timeline` | PAT-003 | `patient.view` | `OWN_BRANCH` / `ORGANIZATION` | Consolidated chronological timeline of visits, admissions, lab orders, and prescriptions. | Pending Execution |
| `GET` | `/patients/:patientId/medical-records` | PAT-005 | `medical_record.view` | `OWN_BRANCH` / `ASSIGNED_RECORDS` | Clinical consultation notes and diagnoses. Restricted to authorized medical personnel. | Pending Execution |
| `POST` | `/patients/:patientId/medical-records` | PAT-005 | `medical_record.create` | `OWN_BRANCH` | Add clinical consultation note, diagnosis, or prescription. Immutable revision log. | Pending Execution |
| `GET` | `/appointments` | APT-001, APT-002 | `appointment.view` | `OWN_BRANCH` / `ASSIGNED_RECORDS` | Get appointments for day/week/month with doctor, branch, and status filters. | Pending Execution |
| `POST` | `/appointments` | APT-001 | `appointment.create` | `OWN_BRANCH` | Book appointment. Validates doctor availability and prevents slot double-booking. Triggers notification. | Pending Execution |
| `GET` | `/appointments/:appointmentId` | APT-001 | `appointment.view` | `OWN_BRANCH` / `ASSIGNED_RECORDS` | Fetch appointment details, patient summary, and slot time. | Pending Execution |
| `PATCH` | `/appointments/:appointmentId` | APT-001 | `appointment.reschedule` | `OWN_BRANCH` | Update appointment details, notes, or priority. | Pending Execution |
| `POST` | `/appointments/:appointmentId/transition` | APT-003 | `appointment.view` | `OWN_BRANCH` / `ASSIGNED_RECORDS` | Transition status: `SCHEDULED` $\to$ `CONFIRMED` $\to$ `CHECKED_IN` $\to$ `IN_CONSULTATION` $\to$ `COMPLETED` or `CANCELLED`. | Pending Execution |
| `POST` | `/appointments/:appointmentId/reschedule` | APT-003 | `appointment.reschedule` | `OWN_BRANCH` | Move appointment to new slot with mandatory reason. Triggers notification. | Pending Execution |

---

## 5. Workforce & Governance (`modules/employees`, `modules/leave`)

| HTTP Method | Route Path | Spec Ref | Permissions Required | Data Scope | Description & Key Invariants | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/employees` | EMP-001 | `employee.view` | `OWN_BRANCH` / `ORGANIZATION` | Paginated staff directory with branch, department, and role filtering. | Pending Execution |
| `POST` | `/employees` | EMP-001 | `employee.create` | `OWN_BRANCH` | Register employee with profile, qualification, shift, and reporting manager. | Pending Execution |
| `GET` | `/employees/:employeeId` | EMP-001 | `employee.view` | `OWN_BRANCH` / `ORGANIZATION` | Fetch employee profile, contact info, shift roster, and leave balance. | Pending Execution |
| `PATCH` | `/employees/:employeeId` | EMP-002 | `employee.update` | `OWN_BRANCH` | Update employee record, designation, or employment status. | Pending Execution |
| `GET` | `/leave-requests` | LEA-001 | `leave.view` | `OWN_BRANCH` / `OWN_RECORDS` | List leave requests filtered by status (`SUBMITTED`, `APPROVED`, `REJECTED`). | Pending Execution |
| `POST` | `/leave-requests` | LEA-001 | `leave.submit` | `OWN_RECORDS` | Submit leave request with dates, type (Casual/Sick/Earned), and replacement mapping. Triggers notification. | Pending Execution |
| `GET` | `/leave-requests/:requestId` | LEA-001 | `leave.view` | `OWN_BRANCH` / `OWN_RECORDS` | View leave request details, stage progress, and approval history. | Pending Execution |
| `POST` | `/leave-requests/:requestId/decision` | LEA-002, LEA-003 | `leave.review` / `leave.final_approve` | `OWN_BRANCH` | Record decision (`APPROVED` or `REJECTED`). **Enforces mandatory rejection comment**. Updates attendance upon final approval. Triggers notification. | Pending Execution |

---

## 6. Complaints & Grievances (`modules/complaints`)

| HTTP Method | Route Path | Spec Ref | Permissions Required | Data Scope | Description & Key Invariants | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/complaints` | CQM-001, CQM-004 | `complaint.view` | `OWN_BRANCH` / `ORGANIZATION` | List grievances with SLA countdowns. Confidential cases masked without `complaint.view_confidential`. | Pending Execution |
| `POST` | `/complaints` | CQM-001 | `complaint.create` | `OWN_BRANCH` | Log new complaint with category, source, priority, and confidentiality. Computes SLA due time. | Pending Execution |
| `GET` | `/complaints/:complaintId` | CQM-001, CQM-004 | `complaint.view` | `OWN_BRANCH` / `ORGANIZATION` | Fetch complaint timeline, assigned officer, external/internal notes, and SLA status. | Pending Execution |
| `POST` | `/complaints/:complaintId/assign` | CQM-003 | `complaint.assign` | `OWN_BRANCH` | Assign ticket to designated investigator. Triggers notification. | Pending Execution |
| `POST` | `/complaints/:complaintId/notes` | CQM-005 | `complaint.view` | `OWN_BRANCH` | Add internal investigation note or external patient communication. | Pending Execution |
| `POST` | `/complaints/:complaintId/transition` | CQM-002, CQM-005 | `complaint.resolve` | `OWN_BRANCH` | Transition status: `NEW` $\to$ `ASSIGNED` $\to$ `UNDER_REVIEW` $\to$ `IN_PROGRESS` $\to$ `RESOLVED` $\to$ `CLOSED`. **Requires resolution summary on resolve**. Triggers notification. | Pending Execution |

---

## 7. Finance & Revenue Management (`modules/revenue`)

| HTTP Method | Route Path | Spec Ref | Permissions Required | Data Scope | Description & Key Invariants | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/income-records` | FIN-001, FIN-002 | `revenue.view` | `OWN_BRANCH` / `ORGANIZATION` | List revenue transactions with branch, date, category, and payment mode filters. | Pending Execution |
| `POST` | `/income-records` | FIN-002, FIN-003 | `revenue.create` | `OWN_BRANCH` | Record new hospital income. **Enforces all 9 mandatory revenue categories** (OP, Medical, Lab, Day Care, Dressing, KIT, Socks, Slipper, Other Collections). Generates receipt number. | Pending Execution |
| `GET` | `/income-records/:incomeId` | FIN-002 | `revenue.view` | `OWN_BRANCH` / `ORGANIZATION` | Fetch single receipt details, category breakdown, and recording clerk. | Pending Execution |
| `POST` | `/income-records/:incomeId/adjustments` | FIN-003 | `revenue.correct` | `OWN_BRANCH` | Record financial reversal or adjustment entry referencing original receipt. Immutable ledger. Triggers notification. | Pending Execution |

---

## 8. In-App Notifications (`modules/notifications`)

| HTTP Method | Route Path | Spec Ref | Permissions Required | Data Scope | Description & Key Invariants | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/notifications` | NOT-001, NOT-002 | Authenticated | `OWN_RECORDS` | Fetch current user notifications with unread counts and priority flags. | Pending Execution |
| `POST` | `/notifications/:notificationId/read` | NOT-001 | Authenticated | `OWN_RECORDS` | Mark specific notification as read. | Pending Execution |
| `POST` | `/notifications/read-all` | NOT-001 | Authenticated | `OWN_RECORDS` | Mark all unread notifications for current user as read. | Pending Execution |

---

## 9. Owner AI Revenue Intelligence ("Hospital Intelligence") (`modules/owner-intelligence`)

| HTTP Method | Route Path | Spec Ref | Permissions Required | Data Scope | Description & Key Invariants | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/owner/intelligence/query` | Prompt Sec 4 & 5 | `owner.ai.view` | `ORGANIZATION` | Executes executive query via **8 allow-listed tools**. Prohibits direct MongoDB queries. Returns structured JSON with answer, insights, recommended actions, charts, and sources. | Pending Execution |
| `GET` | `/owner/intelligence/brief` | Prompt Sec 4 | `owner.ai.view` | `ORGANIZATION` | Generates daily executive briefing summarizing cross-branch revenue, occupancy, and anomalies. | Pending Execution |
| `GET` | `/owner/intelligence/history` | Prompt Sec 4 & 5 | `owner.ai.view` | `ORGANIZATION` | Returns audit history of previous Owner AI queries, filters applied, and latency. | Pending Execution |

---

## 10. Audit Logging & Knowledge Retrieval (`modules/audit`, `modules/knowledge`)

| HTTP Method | Route Path | Spec Ref | Permissions Required | Data Scope | Description & Key Invariants | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/audit-logs` | AUD-001–003 | `audit.view` | `ORGANIZATION` / `OWN_BRANCH` | Append-only system audit log with actor, action, timestamp, and before/after diffs. | Pending Execution |
| `GET` | `/knowledge/search` | Prompt Sec 6 | Authenticated | Role / Dept Scoped | Governed pre-filtered retrieval of SOPs, bylaws, and guidelines (NEVER for numerical totals). | Pending Execution |
