# Hospital Management & Administration Platform (Super D)

A production-grade, multi-branch hospital management and administration platform architected for modern healthcare networks. Designed with distinct role-based command centers, multi-branch operational scoping, clinical EMR, workforce governance, financial accounting, and grounded executive intelligence.

---

## 1. System Architecture

The platform is structured into three decoupled services:

```
hospital-management-platform/
├── frontend/                     # React 18 + Vite SPA (Client Tier)
│   ├── src/                      # Role dashboards & feature modules
│   ├── public/                   # Static assets & icons
│   ├── package.json              # Client dependencies
│   └── vite.config.ts            # Vite proxy to backend :5000
│
├── backend/                      # Node.js + Express API (Application Tier)
│   ├── src/
│   │   ├── config/               # MongoDB Atlas, Env, Constants
│   │   ├── controllers/          # Express route controllers
│   │   ├── middleware/           # Auth, RBAC, Scope, Zod Validation, Rate Limit
│   │   ├── models/               # Mongoose domain schemas
│   │   ├── routes/               # API v1 routes (/api/v1)
│   │   ├── services/             # Domain business logic & storage/queue interfaces
│   │   ├── repositories/         # Base repository abstractions
│   │   ├── validators/           # Zod request validation schemas
│   │   └── utils/                # Logger, standard response helpers, AppError
│   └── package.json
│
├── ai-service/                   # Independent AI / RAG Microservice
│   ├── src/
│   │   ├── config/               # AI model environment
│   │   ├── tools/                # Controlled Backend Tool Specifications
│   │   ├── services/             # Gemini LLM Integration
│   │   ├── controllers/          # AI query handlers
│   │   └── routes/               # /api/ai routes
│   └── package.json
│
├── docs/                         # Architecture & Engineering Specifications
│   ├── HLD/                      # High-Level Architecture Design
│   ├── LLD/                      # Low-Level Domain & Schema Design
│   ├── API/                      # REST API Contract Specifications
│   └── architecture/             # Multi-Tier System Topology
│
├── .gitignore
├── README.md
└── package.json                  # Monorepo orchestration scripts
```

---

## 2. Multi-Branch Network

All platform records are partitioned by four standardized branch identifiers:
- **`branch-trichy`**: Trichy Main Hospital (Code: `TRY`)
- **`branch-chennai`**: Chennai Super Speciality (Code: `CHN`)
- **`branch-madurai`**: Madurai City Hospital (Code: `MDU`)
- **`branch-pudukkottai`**: Pudukkottai Healthcare Center (Code: `PDK`)

---

## 3. Local Environment Setup

### Prerequisites
- Node.js 20+ LTS
- npm 10+
- MongoDB Atlas cluster or local MongoDB 7.0+ instance

### Step 1: Clone & Configure Environments
```bash
# Frontend environment
cp frontend/.env.example frontend/.env

# Backend environment
cp backend/.env.example backend/.env

# AI Service environment
cp ai-service/.env.example ai-service/.env
```

Edit `backend/.env` to configure your MongoDB connection string:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/superd_hospital?retryWrites=true&w=majority
JWT_SECRET=your_cryptographically_secure_random_key
```

### Step 2: Install Dependencies
```bash
# Install frontend dependencies
npm install --prefix frontend

# Install backend dependencies
npm install --prefix backend

# Install AI service dependencies
npm install --prefix ai-service
```

---

## 4. Running the Platform Locally

Run each tier in a dedicated terminal:

### Terminal 1: Backend API Server (Port 5000)
```bash
npm run dev:backend
```
- **Base API**: `http://localhost:5000/api/v1`
- **Health Check**: `http://localhost:5000/health`

### Terminal 2: Frontend Web Application (Port 3000)
```bash
npm run dev:frontend
```
- **Web App**: `http://localhost:3000/`

### Terminal 3: AI Intelligence Microservice (Port 5001)
```bash
npm run dev:ai
```
- **AI Service Health**: `http://localhost:5001/health`

---

## 5. Development & Build Commands

| Command | Description |
| :--- | :--- |
| `npm run dev:frontend` | Starts Vite development server for frontend (`:3000`) |
| `npm run dev:backend` | Starts Express development server with live reload (`:5000`) |
| `npm run dev:ai` | Starts AI intelligence service (`:5001`) |
| `npm run build:frontend` | Compiles TypeScript and builds production bundle for frontend |
| `npm run build:backend` | Compiles TypeScript for backend API into `dist/` |
| `npm run build:ai` | Compiles TypeScript for AI microservice into `dist/` |
| `npm run build` | Builds all three services sequentially |
| `npm run test:backend` | Executes backend connectivity and foundation tests |

---

## 6. Team Development Workflow (3 Developers)

Development is split into 3 independent functional tracks to avoid merge conflicts:

| Track | Developer | Domain Responsibilities | Git Branch Pattern |
| :--- | :--- | :--- | :--- |
| **Track 1** | Developer 1 (Clinical) | Patients, Appointments, Medical Records, Doctors, Discharges | `feature/member-1/*` |
| **Track 2** | Developer 2 (Workforce & Ops) | Employees, Attendance, Leaves, Grievances, Complaints SLA | `feature/member-2/*` |
| **Track 3** | Developer 3 (Finance & Growth) | Revenue Ledgers, Income Receipts, Ads, Leads, AI Service | `feature/member-3/*` |

All pull requests merge into `develop` and require automated build validation.
