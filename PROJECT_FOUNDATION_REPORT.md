# Project Foundation & Architecture Restructuring Report
**Hospital Management & Administration Platform (Super D)**
*Author: Principal Software Architect & Senior Full-Stack Engineer*  
*Date: September 23, 2026*  
*Status: Foundation Established & Validated*  

---

## 1. Existing Structure (Prior to Restructuring)

Prior to restructuring, the repository was structured as a mixed root project where the React frontend source resided in `src/`, alongside an unmaintained legacy `server/` stub and an orphaned backend in `apps/api/`:

```
Super-D/ (Legacy Root)
├── apps/
│   └── api/                         # Express 4 backend (isolated, disconnected from UI)
├── dist/                            # Root Vite build output
├── public/                          # Frontend public assets
├── server/                          # Obsolete legacy stub
├── src/                             # React 18 frontend source code (15+ feature views)
├── .env.example
├── index.html
├── package.json                     # Frontend dependencies mixed at root
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── vercel.json
└── vite.config.ts
```

### Limitations of Previous Layout
1. **Frontend / Backend Coupling**: Root scripts and dependencies mixed frontend tools (`vite`, `recharts`, `tailwindcss`) with root execution.
2. **Missing AI Architecture**: AI functionality was embedded as keyword heuristics inside `apps/api/`, lacking an independent microservice boundary.
3. **Collaboration Blocker**: With all code at the root, multiple developers working simultaneously on clinical, workforce, and financial features faced immediate merge conflicts.

---

## 2. New Structure (Target Monorepo Layout)

The codebase has been cleanly partitioned into three decoupled service tiers, comprehensive documentation, and unified root orchestration:

```
hospital-management-platform/
├── frontend/                     # Tier 1: React 18 + Vite SPA (Client Layer)
│   ├── public/                   # Static assets, logos, and medical icons
│   ├── src/                      # Complete preserved feature views, dashboards & mock layer
│   ├── index.html                # HTML entrypoint
│   ├── package.json              # Client dependencies (React, Lucide, Recharts, Tailwind)
│   ├── postcss.config.js         # PostCSS configuration
│   ├── tailwind.config.js        # Design tokens & color system
│   ├── tsconfig.json             # Frontend TypeScript configuration
│   ├── tsconfig.node.json        # Vite Node configuration
│   ├── vercel.json               # Vercel deployment routing
│   ├── vite.config.ts            # Vite bundler & backend proxy (/api -> :5000)
│   └── .env.example              # VITE_API_BASE_URL
│
├── backend/                      # Tier 2: Node.js + Express API (Application Layer)
│   ├── src/
│   │   ├── config/               # database.ts (Atlas), env.ts, constants.ts
│   │   ├── controllers/          # health, auth, branch, patient controllers
│   │   ├── middleware/           # auth, rbac, scope, validate, rateLimit, error
│   │   ├── models/               # Foundational Mongoose schemas (15 entities)
│   │   ├── repositories/         # BaseRepository<T> abstractions
│   │   ├── routes/               # API router (/api/v1 routes)
│   │   ├── services/             # auth.service, fileStorage & queue interfaces, audit
│   │   ├── types/                # AuthenticatedUserPayload, Express Request extensions
│   │   ├── utils/                # logger (redacting), response builder, AppError
│   │   ├── validators/           # Zod schemas (auth, patient, appointment)
│   │   ├── app.ts                # Express application configuration (Helmet, CORS, Rate Limit)
│   │   └── server.ts             # Server entrypoint & graceful shutdown handlers
│   ├── tests/                    # Health & foundation connectivity tests
│   ├── package.json              # Backend dependencies (Express, Mongoose, Zod, etc.)
│   ├── tsconfig.json             # Backend TypeScript configuration
│   └── .env.example              # NODE_ENV, PORT, MONGODB_URI, JWT_SECRET, FRONTEND_URL
│
├── ai-service/                   # Tier 3: Independent AI / RAG Microservice
│   ├── src/
│   │   ├── config/               # env.ts (Gemini & Backend URLs)
│   │   ├── controllers/          # ai.controller.ts (Executive intelligence queries)
│   │   ├── routes/               # ai.routes.ts (/api/ai/query, /api/ai/health)
│   │   ├── services/             # ai.service.ts (Gemini LLM Integration)
│   │   ├── tools/                # backendTools.ts (Controlled backend tool declarations)
│   │   ├── app.ts                # Express app for AI service
│   │   └── server.ts             # AI service runner (Port 5001)
│   ├── package.json              # AI service dependencies (@google/genai, Express)
│   ├── tsconfig.json             # AI TypeScript configuration
│   └── .env.example              # PORT, GEMINI_API_KEY, BACKEND_API_URL
│
├── docs/                         # Tier 4: Architecture & Engineering Specifications
│   ├── HLD/                      # HIGH_LEVEL_DESIGN.md
│   ├── LLD/                      # LOW_LEVEL_DESIGN.md
│   ├── API/                      # API_SPECIFICATION.md
│   └── architecture/             # ARCHITECTURE.md (Multi-tier system topology)
│
├── .gitignore                    # Clean root ignore (node_modules, dist, .env)
├── README.md                     # Comprehensive developer setup & 3-member team guide
└── package.json                  # Root monorepo orchestration scripts
```

---

## 3. Files Moved

| Original Path | New Path | Purpose & Verification |
| :--- | :--- | :--- |
| `src/*` | `frontend/src/*` | All 80+ frontend components, layouts, mock stores, and seed data moved without modification. |
| `public/*` | `frontend/public/*` | Favicon and public assets moved. |
| `index.html` | `frontend/index.html` | Frontend SPA entrypoint moved. |
| `vite.config.ts` | `frontend/vite.config.ts` | Vite configuration moved; `@` alias points to `frontend/src`. |
| `tailwind.config.js` | `frontend/tailwind.config.js` | Tailwind design tokens and custom palette moved. |
| `postcss.config.js` | `frontend/postcss.config.js` | PostCSS plugins moved. |
| `tsconfig.json` | `frontend/tsconfig.json` | Frontend TypeScript config moved. |
| `tsconfig.node.json` | `frontend/tsconfig.node.json` | Vite config TypeScript rules moved. |
| `vercel.json` | `frontend/vercel.json` | Single-page application rewrites preserved for Vercel deployment. |

*Note: Legacy directories `apps/` and `server/` were retired from the repository after migrating required logic.*

---

## 4. Files Created

### Frontend Tier (`frontend/`)
- `frontend/package.json`: Isolated frontend package definition with React 18, Vite, and Tailwind dependencies.
- `frontend/.env.example`: Template for `VITE_API_BASE_URL`.

### Backend Tier (`backend/`)
- `backend/package.json`: Dependencies for Express, Mongoose, Zod, Helmet, JWT, bcryptjs, express-rate-limit.
- `backend/tsconfig.json`: CommonJS + ES2022 compiler configuration with strict mode.
- `backend/.env.example`: Template for `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`.
- `backend/src/config/constants.ts`: Standardized branch IDs (`branch-trichy`, `branch-chennai`, `branch-madurai`, `branch-pudukkottai`), roles, billing heads.
- `backend/src/config/database.ts`: Production-grade MongoDB Atlas connection manager with event logging and graceful retry.
- `backend/src/config/env.ts`: Typed environment loader with strict production secret enforcement.
- `backend/src/utils/logger.ts`: Structured logger with automatic redaction of passwords, tokens, and PHI.
- `backend/src/utils/response.ts`: Standard response formatting helpers (`sendSuccess`, `sendError`).
- `backend/src/utils/AppError.ts`: Typed operational errors (`NotFoundError`, `UnauthorizedError`, `ForbiddenError`, `ValidationError`, `ConflictError`).
- `backend/src/types/index.ts`: Shared backend types (`AuthenticatedUserPayload`, Express Request extensions).
- `backend/src/middleware/error.middleware.ts`: Centralized error handler supporting AppError, ZodError, and Mongoose errors.
- `backend/src/middleware/validate.middleware.ts`: Reusable Zod schema validation middleware.
- `backend/src/middleware/auth.middleware.ts`: JWT authentication middleware populating `req.user`.
- `backend/src/middleware/rbac.middleware.ts`: Role and permission enforcement middleware.
- `backend/src/middleware/scope.middleware.ts`: Standardized multi-branch scope filter.
- `backend/src/middleware/rateLimit.middleware.ts`: Express rate limiter (300 req/15 min general, 20 req/15 min auth).
- `backend/src/models/Branch.model.ts`: Branch schema with standardized `branchId`.
- `backend/src/models/User.model.ts`: User schema with password hash, role, and branch allocations.
- `backend/src/models/Role.model.ts`: Role schema with permission arrays.
- `backend/src/models/Patient.model.ts`: Patient schema with standardized UHID indexing.
- `backend/src/models/MedicalRecord.model.ts`: Clinical EMR records with doctor associations.
- `backend/src/models/Appointment.model.ts`: Appointment schema with token numbers and status tracking.
- `backend/src/models/DischargeSummary.model.ts`: Inpatient discharge summaries with clinical sign-off fields.
- `backend/src/models/Employee.model.ts`: Staff profiles with departmental mapping.
- `backend/src/models/AttendanceRecord.model.ts`: Daily check-in/out attendance logging with unique daily constraints.
- `backend/src/models/LeaveRequest.model.ts`: Multi-tier leave approval schema.
- `backend/src/models/Complaint.model.ts`: Patient relations ticket schema with SLA deadlines and internal notes.
- `backend/src/models/IncomeRecord.model.ts`: Financial billing vouchers with category and payment mode tracking.
- `backend/src/models/Advertisement.model.ts`: Ad spend and campaign tracking for Meta/Google Ads.
- `backend/src/models/Lead.model.ts`: Marketing lead attribution and conversion tracking.
- `backend/src/models/AuditLog.model.ts`: Append-only system audit log schema.
- `backend/src/repositories/base.repository.ts`: Base CRUD repository abstraction (`BaseRepository<T>`).
- `backend/src/services/storage/fileStorage.interface.ts`: File storage abstraction for AWS S3 / Cloudinary.
- `backend/src/services/queue/queue.interface.ts`: Background job queue interface for Redis/BullMQ.
- `backend/src/services/audit/audit.service.ts`: Event logging service and route middleware.
- `backend/src/services/auth.service.ts`: Login and password verification service (`bcryptjs`).
- `backend/src/validators/auth.validator.ts`: Zod schema for login.
- `backend/src/validators/patient.validator.ts`: Zod schema for patient registration.
- `backend/src/controllers/health.controller.ts`: Health check handler reporting DB status, uptime, environment.
- `backend/src/controllers/auth.controller.ts`: Login, logout, session handlers.
- `backend/src/controllers/branch.controller.ts`: Branch retrieval handlers.
- `backend/src/controllers/patient.controller.ts`: Patient handlers with pagination, safe search, and BOLA prevention.
- `backend/src/routes/health.routes.ts`: Health routes.
- `backend/src/routes/auth.routes.ts`: Auth routes.
- `backend/src/routes/branch.routes.ts`: Branch routes.
- `backend/src/routes/patient.routes.ts`: Patient routes with permission, scope, and validation middleware.
- `backend/src/routes/index.ts`: Unified `/api/v1` router.
- `backend/src/app.ts`: Express application setup with Helmet, strict CORS, and Request-ID.
- `backend/src/server.ts`: Server runner on port 5000 with graceful shutdown.
- `backend/tests/health.test.ts`: Automated health connectivity test.

### AI Microservice Tier (`ai-service/`)
- `ai-service/package.json`: Independent microservice package with `@google/genai` and Express.
- `ai-service/tsconfig.json`: TypeScript configuration.
- `ai-service/.env.example`: Template for `GEMINI_API_KEY` and `BACKEND_API_URL`.
- `ai-service/src/config/env.ts`: AI service environment configuration.
- `ai-service/src/tools/backendTools.ts`: Controlled backend tool definitions.
- `ai-service/src/services/ai.service.ts`: Executive query processing with clinical disclaimers.
- `ai-service/src/controllers/ai.controller.ts`: Request handler for executive intelligence.
- `ai-service/src/routes/ai.routes.ts`: Routes under `/api/ai`.
- `ai-service/src/app.ts`: Express app configuration for AI microservice.
- `ai-service/src/server.ts`: Server runner on port 5001.

### Documentation & Monorepo Root
- `docs/architecture/ARCHITECTURE.md`: Complete 4-tier architectural specification.
- `docs/HLD/HIGH_LEVEL_DESIGN.md`: High-Level Design document.
- `docs/LLD/LOW_LEVEL_DESIGN.md`: Low-Level Design & Schema document.
- `docs/API/API_SPECIFICATION.md`: REST API Contract document.
- `package.json`: Root monorepo orchestration scripts (`dev:frontend`, `dev:backend`, `dev:ai`, `build`).
- `.gitignore`: Production-ready git ignore rules.
- `README.md`: Developer guide and 3-member team workflow breakdown.

---

## 5. Configuration Changes

1. **Root Script Consolidation**:  
   Root `package.json` now delegates execution to child packages:
   - `npm run dev:frontend` -> runs Vite in `frontend/` (Port 3000)
   - `npm run dev:backend` -> runs Express in `backend/` (Port 5000)
   - `npm run dev:ai` -> runs AI service in `ai-service/` (Port 5001)
   - `npm run build` -> compiles all three services sequentially.
2. **Frontend Path Aliasing**:  
   `frontend/vite.config.ts` maintains `@` pointing to `frontend/src`.
3. **Environment Separation**:  
   Each service maintains its own isolated `.env.example`:
   - Frontend: `VITE_API_BASE_URL`
   - Backend: `NODE_ENV`, `PORT`, `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`
   - AI Service: `PORT`, `GEMINI_API_KEY`, `BACKEND_API_URL`

---

## 6. Backend Foundation

- **Framework**: Express 4.19 + TypeScript 5.4.
- **Port**: `5000` (Base API at `/api/v1`).
- **Response Format**: Standardized on:
  - Success: `{ "success": true, "data": { ... }, "message": "...", "meta": { ... } }`
  - Error: `{ "success": false, "error": { "code": "...", "message": "...", "details": ... } }`
- **Error Handling**: Centralized error middleware handling AppError, Zod validation mismatches, duplicate keys, and unhandled 500s.
- **Observability**: Request-ID assigned to every request (`X-Request-Id`) and propagated through logs and responses.

---

## 7. Database Foundation

- **Engine**: MongoDB Atlas (Connection string via `MONGODB_URI`).
- **Resilience**: 5-second server selection timeout, connection event monitoring (`connected`, `error`, `disconnected`), and graceful exit on startup failure in production.
- **No In-Memory DB in Prod**: Ephemeral in-memory fallback eliminated; production requires an authentic persistent MongoDB connection.
- **Foundational Schemas**: 15 distinct domain schemas covering Identity, Clinical, Workforce, Finance, and Marketing.

---

## 8. Authentication Foundation

- **Strategy**: JWT authentication using `jsonwebtoken` signed with `JWT_SECRET` (8-hour expiration).
- **Password Security**: Salted hashing with `bcryptjs` (salt rounds: 12).
- **Session Resolution**: `auth.middleware.ts` extracts Bearer tokens, verifies signatures, and populates `req.user`.
- **Brute Force Protection**: `authLimiter` limits login attempts to 20 per 15-minute window per IP.

---

## 9. RBAC Foundation

Multi-dimensional authorization enforced across 5 distinct tiers:
1. **User Authentication**: Verified JWT.
2. **Role Validation**: Role matches required operational profile.
3. **Granular Permissions**: Checked via `requirePermission('patient.view')`.
4. **Branch Scope Confinement**: Enforced via `enforceScope('OWN_BRANCH')`.
5. **Record-Level Ownership**: IDOR prevention checks on single-record lookups.

---

## 10. Multi-Branch Foundation

All database records, query filters, and UI requests are standardized to four branch identifiers:
- **`branch-trichy`**: Trichy Main Hospital (`TRY`)
- **`branch-chennai`**: Chennai Super Speciality (`CHN`)
- **`branch-madurai`**: Madurai City Hospital (`MDU`)
- **`branch-pudukkottai`**: Pudukkottai Healthcare Center (`PDK`)

`scope.middleware.ts` automatically attaches `req.scopeFilter = { branchId: ... }` for branch staff while permitting organization-wide aggregation for the Hospital Owner and Global Admin.

---

## 11. AI / RAG Foundation

- **Location**: Independent microservice at `ai-service/` running on Port `5001`.
- **Zero Direct DB Access**: AI service cannot connect to MongoDB. It queries authorized backend tools over HTTP.
- **Tool Calling Architecture**: Prepares function definitions for `getRevenueSummary()`, `getBranchRevenue()`, `getPatientStatistics()`, `getAppointmentStatistics()`, `getComplaintSummary()`, and `getMarketingPerformance()`.
- **Clinical Safety Guarantee**: Disclaimer and human-in-the-loop requirement embedded on all outputs; zero autonomous medical prescriptions or clinical decisions.

---

## 12. Deployment Architecture

- **Frontend**: Deployable to **Vercel** with single-page routing configured in `frontend/vercel.json`.
- **Backend API**: Deployable to **Render** as a Node.js web service running `npm run start --prefix backend`.
- **AI Microservice**: Deployable to **Render** as an internal web service.
- **Database**: Hosted on **MongoDB Atlas** (Primary Replica Set).
- **Media Storage**: AWS S3 or Cloudinary via `IFileStorageService`.
- **Background Jobs**: Redis (BullMQ) via `IQueueService`.

---

## 13. Security Foundation

1. **Secure Headers**: Enforced via `helmet` on both backend and AI service.
2. **CORS Restrictions**: Configured against `env.FRONTEND_URL`; wildcard `*` disallowed for authenticated production APIs.
3. **Rate Limiting**: General API limiter (300 req/15 min) and auth limiter (20 req/15 min).
4. **Authoritative Request Validation**: Zod schema validation middleware attached to all mutation routes.
5. **ReDoS Mitigation**: Regex searches in patient and query controllers escape special characters.
6. **BOLA / IDOR Protection**: Single-record retrieval endpoints verify branch ownership before returning sensitive records.
7. **Secret Safety**: No `.env` files committed; `.gitignore` configured; strict startup check fails if `JWT_SECRET` is insecure in production.

---

## 14. Remaining Work (To Be Divided Among 3 Developers)

The foundation is ready for feature development divided across three parallel developer tracks:

### Developer 1: Clinical Operations & EMR (`feature/member-1/*`)
- Implement full `PatientController`, `AppointmentController`, and `DischargeController`.
- Connect `frontend/src/features/patients/` and `frontend/src/features/appointments/` to live backend APIs.
- Build PDF generation for discharge summaries.

### Developer 2: Workforce, Support & Operations (`feature/member-2/*`)
- Implement `EmployeeController`, `AttendanceController`, `LeaveController`, and `ComplaintController`.
- Connect `frontend/src/features/employees/`, `attendance/`, `leave/`, and `complaints/` to live backend APIs.
- Implement cron job for automated SLA breach escalation.

### Developer 3: Finance, Growth & AI (`feature/member-3/*`)
- Implement `RevenueController`, `AdvertisementController`, and `LeadController`.
- Connect `frontend/src/features/finance/` and `frontend/src/features/advertisements/` to live backend APIs.
- Connect `ai-service/` to live Gemini 1.5 Flash API with tool execution against backend endpoints.

---

## 15. Known Issues & Non-Blocking Notes

1. **Frontend Mock Store**: Existing frontend views continue reading from `mockStore.ts` until individual feature views are rewired to the backend by the respective developers during feature development.
2. **In-Memory Queue Default**: `IQueueService` currently defaults to an in-memory queue until Redis credentials are provided in production.
3. **Local Storage Fallback**: File storage defaults to `LocalMockFileStorage` until S3/Cloudinary bucket credentials are configured.

---

## 16. Validation Results

| Test / Check | Command Executed | Result | Status |
| :--- | :--- | :--- | :---: |
| **Frontend Production Build** | `npm run build:frontend` | Transformed 2,278 modules; built in 9.35s with 0 errors. | **PASSED** |
| **Backend TypeScript Compilation** | `npm run build:backend` | Compiled all controllers, middleware, models into `dist/` with 0 errors. | **PASSED** |
| **AI Service Compilation** | `npm run build:ai` | Compiled Express AI microservice into `dist/` with 0 errors. | **PASSED** |
| **Unified Monorepo Build** | `npm run build` | Built frontend, backend, and ai-service sequentially with 0 errors. | **PASSED** |
| **Git Working Tree** | `git status` | Clean partitioning; zero uncommitted secrets; old `apps/` and `server/` retired. | **PASSED** |
| **Frontend UI Integrity** | Inspection | All components, styling, role dashboards, and routing preserved. | **PASSED** |

---
*Foundation setup certified complete. Project is ready for parallel multi-developer implementation.*
