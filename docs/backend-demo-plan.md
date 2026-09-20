# Backend Demonstration & Production Transition Plan

> **Author**: Senior Full-Stack MERN Architect, MongoDB Data Engineer & Technical Lead  
> **Source of Truth**: [`spec.md`](../spec.md) and RCRAFT Backend Architecture Specification  
> **API Base Path**: `/api/v1`  
> **Frontend Preservation Invariant**: 100% preservation of existing React/TypeScript frontend (`src/`). Zero breaking changes or redesign of completed UI screens.

---

## 1. Executive Summary & Objective

The **Release D0 Frontend Demonstration** has successfully verified all 15 priority hospital screens, multi-branch scoping, role switching across 9 roles, and local persistence.

This plan specifies the architecture and implementation roadmap for the **MERN Backend Demonstration (Release D1)**. It introduces a modular, scalable Node.js + Express + TypeScript backend under `apps/api/`, backed by MongoDB and Mongoose, featuring:
1. **Production-Ready Layered Architecture**: Strict separation of route, controller, validation schema, service/use-case, repository, model, policy, and tests.
2. **3-Tier Authorization Engine**: Role membership + Permission (`<module>.<action>`) + Multi-branch Data Scope (`ORGANIZATION`, `SELECTED_BRANCHES`, `OWN_BRANCH`, `DEPARTMENT`, `ASSIGNED_RECORDS`, `OWN_RECORDS`).
3. **Owner AI Command Center ("Hospital Intelligence")**: Secure, restricted executive intelligence module accessible strictly with `permission: owner.ai.view` and `scope: ORGANIZATION`, utilizing **8 allow-listed analytical aggregation tools** rather than unconstrained database queries.
4. **Governed RAG Architecture**: Retrieval-augmented generation strictly for authorized unstructured knowledge (SOPs, clinical guidelines, hospital bylaws) with pre-retrieval role/branch/department filtering, with a strict architectural prohibition against using RAG for financial or numerical computations.
5. **Real-Time In-App Notification System**: Event-driven notification service tracking appointments, leave decisions, grievances, and revenue events.
6. **Append-Only Audit Trail**: Automated audit logging for all state mutations, security events, and AI tool invocations.
7. **Zero-Disruption Frontend Integration**: A clean client API layer in `src/services/api/` with dual-mode fallback, preserving all completed UI components and routes.

---

## 2. Directory Structure & Modular Layout

The backend conforms strictly to the architecture specified in the prompt, situated under `apps/api/`:

```text
Super-D/
├── apps/
│   └── api/
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── config/                         # Environment variables, DB connection, constants
│           │   ├── env.ts                      # Zod-validated environment config
│           │   ├── database.ts                 # MongoDB / Mongoose connection & in-memory fallback
│           │   └── constants.ts                # System codes, token expirations, currency (INR)
│           ├── common/                         # Shared cross-cutting infrastructure
│           │   ├── errors/                     # AppError, NotFoundError, ForbiddenError, ValidationError
│           │   ├── middleware/                 # RequestId, errorHandler, cors, helmet, morgan
│           │   ├── auth/                       # JWT verify, session validation, password hashing
│           │   ├── rbac/                       # Permission evaluator (<module>.<action>)
│           │   ├── scope/                      # Multi-branch data scope query builder
│           │   ├── audit/                      # Audit logger middleware & service
│           │   ├── events/                     # Event-service abstraction for notifications
│           │   └── validation/                 # Zod request validation middleware
│           ├── modules/                        # Domain-driven feature modules
│           │   ├── auth/                       # Login, refresh, logout, me, effective-permissions
│           │   ├── users/                      # User directory, activation, deactivation, sessions
│           │   ├── roles/                      # System & custom roles, permission matrix
│           │   ├── branches/                   # Trichy, Chennai, Madurai, Pudukkottai facilities
│           │   ├── patients/                   # Patient registry, UHID generator, 360° EMR profile
│           │   ├── appointments/               # Scheduling, conflict detection, status transitions
│           │   ├── employees/                  # Staff directory, shifts, credentials
│           │   ├── leave/                      # Leave approvals with mandatory rejection comments
│           │   ├── complaints/                 # Patient grievances, priority triage, SLA timers
│           │   ├── revenue/                    # 9-category revenue ledger, cash/UPI receipts
│           │   ├── notifications/              # In-app notifications inbox & mark-as-read
│           │   ├── owner-intelligence/         # Hospital Intelligence AI query, brief, history
│           │   └── knowledge/                  # RAG collections for SOPs, guidelines & chunk search
│           ├── jobs/                           # Background tasks (SLA breach monitor, report generator)
│           │   └── slaMonitor.job.ts
│           ├── seed/                           # Reconciled database seed runner & fixtures
│           │   ├── seedData.ts                 # Reconciled from frontend seed fixtures
│           │   └── seedRunner.ts               # Automated idempotent seeder
│           ├── app.ts                          # Express application assembly & middleware stack
│           └── server.ts                       # HTTP server entrypoint
├── src/                                        # Existing React 18 frontend (PRESERVED)
│   ├── services/
│   │   ├── api/                                # Typed API client adapters
│   │   │   ├── authApi.ts
│   │   │   ├── branchApi.ts
│   │   │   ├── patientApi.ts
│   │   │   ├── appointmentApi.ts
│   │   │   ├── leaveApi.ts
│   │   │   ├── complaintApi.ts
│   │   │   ├── revenueApi.ts
│   │   │   ├── notificationApi.ts
│   │   │   └── ownerIntelligenceApi.ts
│   │   └── index.ts                            # Transparent switcher (Mock vs Real API)
│   └── ...                                     # All 15 screens & UI components intact
├── docs/
│   ├── backend-demo-plan.md                    # [THIS DOCUMENT]
│   ├── backend-api-checklist.md                # Complete 60+ route checklist
│   └── ai-intelligence-design.md               # AI & RAG technical design
├── spec.md                                     # Authoritative single source of truth
└── README.md                                   # Master project documentation
```

### Module Boundary Pattern
Each feature module in `apps/api/src/modules/<feature>/` strictly implements:
- `*.routes.ts`: Express router definitions with applied middleware stack.
- `*.controller.ts`: Request parsing, HTTP response serialization in standard envelope.
- `*.validator.ts`: Zod schemas for `body`, `query`, and `params`.
- `*.service.ts`: Core business logic, status transitions, calculations.
- `*.repository.ts`: Mongoose data access operations with injected data scopes.
- `*.model.ts`: Mongoose Schema with indexes and TypeScript interface.
- `*.policy.ts`: Module-specific authorization and transition constraints.
- `*.test.ts`: Integration and unit tests.

---

## 3. Database Architecture & Collections

The backend uses MongoDB with Mongoose ODM, defining the exact collections required:

| Collection Name | Model File | Purpose & Indexes |
| :--- | :--- | :--- |
| `users` | `User.model.ts` | Credentials, roles, branch assignments. Unique: `email`, `employeeId`. |
| `roles` | `Role.model.ts` | 9 baseline roles + custom roles, permission arrays, default scopes. |
| `branches` | `Branch.model.ts` | Trichy, Chennai, Madurai, Pudukkottai. Unique: `code`. |
| `patients` | `Patient.model.ts` | Demographics, medical alerts, status. Index: `organizationId + branchId + status`, `uhid`. |
| `appointments` | `Appointment.model.ts` | Consultations, slots, statuses. Index: `doctorId + date + slotTime`, `branchId + date`. |
| `employees` | `Employee.model.ts` | Staff directory, department, shift. Unique: `employeeNumber`. |
| `leave_requests` | `LeaveRequest.model.ts`| Leave & permission requests. Index: `employeeId + status`, `branchId + status`. |
| `complaints` | `Complaint.model.ts` | Grievances, SLA target date, category. Index: `branchId + status + priority`. |
| `income_records` | `IncomeRecord.model.ts`| 9-category revenue ledger. Index: `branchId + category + transactionDate`. |
| `notifications` | `Notification.model.ts`| In-app notifications. Index: `recipientUserId + isRead + createdAt`. |
| `audit_logs` | `AuditLog.model.ts` | Append-only security & mutation trail. Index: `module + action + timestamp`. |
| `ai_query_audit_logs` | `AiAuditLog.model.ts` | Prompt hash, tool calls executed, response metadata, latency. |
| `knowledge_documents` | `KnowledgeDoc.model.ts`| SOPs, policy docs. Index: `organizationId + branchId + departmentId + allowedRoles`. |
| `knowledge_chunks` | `KnowledgeChunk.model.ts`| Chunked text with embeddings and metadata for pre-filtered retrieval. |

### Zero-Friction Database Strategy:
- **Standard**: Direct connection to `MONGODB_URI` (local daemon or MongoDB Atlas).
- **Embedded Fallback**: If local MongoDB is not running, the application automatically boots an embedded in-memory database (`mongodb-memory-server`) during demo mode. Evaluators can start the backend instantly without database installation hurdles.
- **Automated Seeding**: On initial connection, the seed runner populates all 14 collections with the reconciled datasets matching the frontend fixtures.

---

## 4. Authentication, RBAC & Multi-Branch Data Scoping

Every protected API request is evaluated through a strict 3-tier gateway:

```text
Incoming Request -> [1. Auth Middleware] -> [2. RBAC Middleware] -> [3. Scope Middleware] -> Controller
```

1. **Authentication**:
   - Validates Bearer JWT (`Authorization: Bearer <token>`).
   - Verifies user exists and status is `ACTIVE` (rejects `LOCKED` or `DISABLED`).
   - Populates `req.user` (`userId`, `email`, `roles`, `permissions`, `assignedBranches`, `primaryBranchId`).
2. **RBAC Permission Gate**:
   - Compares required permission key `<module>.<action>` (e.g. `patient.create`, `leave.review`, `revenue.create`, `owner.ai.view`) against the user's compiled permissions.
3. **Multi-Branch Data Scope Enforcement**:
   - `ORGANIZATION`: Unrestricted cross-branch access (Hospital Owner, Global Admin).
   - `SELECTED_BRANCHES` / `OWN_BRANCH`: Request query automatically restricted to `{ branchId: { $in: req.user.assignedBranches } }`. Direct ID lookups against unauthorized branches return `403 Forbidden`.
   - `DEPARTMENT`: Restricted to user's assigned branch and department.
   - `ASSIGNED_RECORDS`: Restricted to records assigned to `req.user.id` (Doctor's own patients/consultations).
   - `OWN_RECORDS`: Restricted to records created by the user (own leave requests).

---

## 5. Owner AI Revenue Intelligence ("Hospital Intelligence")

### 5.1 Architecture & Access Guardrails
- **Endpoint**:
  - `POST /api/v1/owner/intelligence/query`
  - `GET  /api/v1/owner/intelligence/brief`
  - `GET  /api/v1/owner/intelligence/history`
- **Security Constraint**: Strictly restricted to users satisfying BOTH:
  ```text
  permission: owner.ai.view
  scope: ORGANIZATION
  ```
  Any non-owner role (e.g. Branch Admin, Doctor, Receptionist) attempting to call these endpoints receives an immediate `403 Forbidden`.

### 5.2 The 8 Allow-Listed Analytical Tools
The AI agent is prohibited from generating raw, unrestricted MongoDB queries. It can only execute allow-listed aggregation tools:
1. `getRevenueSummary({ branchId, dateFrom, dateTo })`: Aggregates total collections, daily average, and previous period variance.
2. `getRevenueTrend({ branchId, interval: 'day'|'week'|'month', dateFrom, dateTo })`: Returns time-series revenue data points.
3. `getBranchComparison({ dateFrom, dateTo })`: Compares revenue, occupancy, and patient volume across Trichy, Chennai, Madurai, and Pudukkottai.
4. `getRevenueCategoryContribution({ branchId, dateFrom, dateTo })`: Returns revenue breakdown across the 9 mandatory categories.
5. `getAppointmentSummary({ branchId, dateFrom, dateTo })`: Consultation volumes, completion rates, cancellation rates.
6. `getComplaintSummary({ branchId, dateFrom, dateTo })`: Open cases, SLA breaches, resolution velocity.
7. `getMarketingSummary({ branchId, dateFrom, dateTo })`: Campaign spend, leads acquired, cost-per-lead (CPL), conversion rate.
8. `getPendingApprovals({ branchId })`: Pending leave requests, pending purchase orders, urgent tickets.

### 5.3 Deterministic JSON Output Envelope
The AI response strictly conforms to:
```json
{
  "answer": "Consolidated network revenue for September 2026 stands at ₹1.42 Cr, reflecting a 14.2% growth over August. Chennai and Trichy remain top contributors, while Pudukkottai shows increasing outpatient adoption.",
  "summary": {
    "period": "01-09-2026 to 19-09-2026",
    "branchScope": "All Branches"
  },
  "insights": [
    {
      "title": "Revenue Growth Momentum",
      "severity": "positive",
      "message": "Network collection exceeded daily run-rate targets by 8.4%."
    },
    {
      "title": "Surgical Procedure Contribution",
      "severity": "neutral",
      "message": "Surgical procedures accounted for 34.2% of total collections."
    }
  ],
  "recommendedActions": [
    "Review Pudukkottai outreach camp conversion to increase IPD occupancy.",
    "Address 2 pending high-priority complaints in Cardiology OPD to preserve patient satisfaction."
  ],
  "charts": [
    {
      "type": "line",
      "title": "Daily Revenue Trend (All Branches)",
      "data": []
    },
    {
      "type": "bar",
      "title": "Branch Revenue Comparison",
      "data": []
    }
  ],
  "sources": [
    {
      "tool": "getRevenueSummary",
      "filters": {
        "branchId": "all",
        "dateFrom": "2026-09-01",
        "dateTo": "2026-09-19"
      }
    },
    {
      "tool": "getBranchComparison",
      "filters": {
        "dateFrom": "2026-09-01",
        "dateTo": "2026-09-19"
      }
    }
  ]
}
```

---

## 6. Governed RAG Design for Unstructured Knowledge

### Strict Architectural Boundaries:
- **Rule 1**: **RAG is NEVER used for financial calculations or numerical metrics.** Numerical insights must derive strictly from MongoDB aggregation tools.
- **Rule 2**: RAG is utilized exclusively for authorized unstructured knowledge:
  - Hospital Standard Operating Procedures (SOPs)
  - NABH Clinical Guidelines
  - HR Leave & Replacement Policies
  - Bio-Medical Waste & Emergency Escalation Protocols
- **Rule 3**: Pre-retrieval filtering is mandatory. The retrieval engine filters chunks against the caller's authorized `organizationId`, `branchId`, `departmentId`, and `allowedRoles`.
- **Rule 4**: Retrieved chunks are injected as untrusted reference context and cannot override system RBAC rules or execution policies.

---

## 7. In-App Notifications Architecture

- **Endpoints**:
  - `GET  /api/v1/notifications`
  - `POST /api/v1/notifications/:notificationId/read`
  - `POST /api/v1/notifications/read-all`
- **Workflow Triggers**:
  - `APPOINTMENT_CREATED` / `APPOINTMENT_RESCHEDULED`: Alert patient & consulting doctor.
  - `LEAVE_SUBMITTED`: Alert reporting manager and HR lead.
  - `LEAVE_DECISION`: Alert applicant with decision status and comment.
  - `COMPLAINT_ASSIGNED`: Alert designated investigation officer.
  - `COMPLAINT_ESCALATED`: Alert Medical Superintendent if SLA timer breaches.
  - `REVENUE_ADJUSTMENT`: Alert Finance Manager on receipt reversal/correction.
  - `OWNER_ALERT`: Alert Hospital Owner on critical network anomalies.

---

## 8. Frontend Integration & UI Touchpoints

1. **Client API Layer (`src/services/api/`)**:
   - `authApi.ts`, `branchApi.ts`, `patientApi.ts`, `appointmentApi.ts`, `leaveApi.ts`, `complaintApi.ts`, `revenueApi.ts`, `notificationApi.ts`, `ownerIntelligenceApi.ts`.
2. **Transparent Switcher (`src/services/index.ts`)**:
   - Feature flag `VITE_USE_REAL_API=true` switches calls from local mock storage to live backend endpoints, while preserving all component state handling.
3. **Owner Dashboard Command Center ("Ask Hospital Intelligence")**:
   - Prominent **"Ask Hospital Intelligence"** action button on the Owner Dashboard.
   - Interactive sliding drawer with query input and 5 quick question chips:
     - *"Summarize this month's revenue."*
     - *"Compare all branches."*
     - *"Which branch needs attention?"*
     - *"Show top revenue categories."*
     - *"Give weekly management actions."*
   - Renders executive answer, insight badges, charts, recommended actions, and query history.

---

## 9. Phased Execution Roadmap

1. **Step 1 (Done)**: Planning documents written (`docs/backend-demo-plan.md`, `docs/backend-api-checklist.md`, `docs/ai-intelligence-design.md`).
2. **Step 2**: Backend foundation in `apps/api/` (Express setup, MongoDB/in-memory fallback, seed runner, middleware, health endpoints).
3. **Step 3**: Core domain modules (Auth, Users, Roles, Branches, Patients, Appointments, Employees, Leave, Complaints, Revenue).
4. **Step 4**: Notifications & Audit logging services.
5. **Step 5**: Owner AI Revenue Intelligence & Analytical Tool suite.
6. **Step 6**: Frontend API client connection & Owner Dashboard Intelligence Drawer.
7. **Step 7**: Comprehensive verification & testing (RBAC checks, branch isolation, AI query audit, mobile responsive checks).
