# Deployment Guide: Super-D Multi-Branch Hospital Platform

This project is a modern full-stack hospital management system consisting of:
1. **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS (Single Page Application)
2. **Backend API**: Node.js + Express + TypeScript + Mongoose (`apps/api`)
3. **Database**: MongoDB (Atlas cloud cluster or self-hosted)

---

## Deployment Options

| Deployment Method | Best For | Complexity | Cost |
| :--- | :--- | :--- | :--- |
| **Option A: Vercel (Frontend) + Render / Railway (Backend) + MongoDB Atlas** | Recommended for quick production / showcase | Low | Free / Very Low |
| **Option B: Docker Compose (VPS / AWS / DigitalOcean)** | Full control, single server | Low-Medium | $5–$12/month |
| **Option C: Unified Single-Server with PM2** | Bare-metal Ubuntu / Debian VPS | Medium | Custom |

---

## Option A: Free Cloud Deployment (Recommended)

### Step 1: Set Up MongoDB Atlas (Cloud Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Click **Build a Database** -> select the **M0 Free** cluster.
3. Under **Database Access**, create a database user (e.g., `hospital_admin` and set a secure password).
4. Under **Network Access**, click **Add IP Address** -> select **Allow Access from Anywhere (`0.0.0.0/0`)**.
5. Go to **Clusters** -> click **Connect** -> **Drivers (Node.js)**.
6. Copy your connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/aarogya_hospital?retryWrites=true&w=majority
   ```

---

### Step 2: Deploy Backend to Render.com (or Railway)
1. Sign up/log in at [Render.com](https://render.com).
2. Click **New +** -> **Web Service**.
3. Select your GitHub repository: `hyrovision-cloud/Super-D`.
4. Configure the service:
   - **Name**: `aarogya-hospital-api`
   - **Region**: Closest to your users (e.g., Singapore, Frankfurt, Oregon)
   - **Root Directory**: `apps/api`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. Click **Environment Variables** and add:
   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Production mode |
   | `PORT` | `5000` | (Render provides its own, but good to have) |
   | `MONGODB_URI` | `mongodb+srv://...` | Connection string from Step 1 |
   | `JWT_SECRET` | `<your-32-char-random-secret>` | Secret for token signing |
   | `JWT_EXPIRES_IN` | `8h` | Token lifespan |
   | `REFRESH_TOKEN_EXPIRES_IN` | `7d` | Refresh lifespan |
   | `DEMO_MODE` | `false` | Enable live database mode |
   | `FORCE_SEED` | `true` | **Set to `true` on first deploy** to seed initial roles/users/branches; set to `false` after |
   | `GEMINI_API_KEY` | `<your-api-key>` | (Optional) Enables Owner Intelligence AI Assistant |
6. Click **Create Web Service**.
7. Once deployed, note down your backend URL (e.g., `https://aarogya-hospital-api.onrender.com`).

---

### Step 3: Deploy Frontend to Vercel (or Netlify)
1. Sign up/log in at [Vercel](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository: `hyrovision-cloud/Super-D`.
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand **Environment Variables** and add:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_BASE_URL` | `https://aarogya-hospital-api.onrender.com/api/v1` |
   *(Replace with your actual Render backend URL followed by `/api/v1`)*
6. Click **Deploy**.
7. Vercel will build and deploy your frontend. The repository already includes [`vercel.json`](file:///e:/Project/Hospital/Super%20D/Super-D/vercel.json) to ensure SPA client-side routes (e.g. `/patients`, `/appointments`) resolve without 404s.

---

## Option B: Deploy via Docker Compose (VPS / Cloud VM)

For a Virtual Private Server (Ubuntu 22.04/24.04 on AWS EC2, DigitalOcean Droplet, Hetzner, etc.):

### 1. Install Docker & Docker Compose
```bash
sudo apt update && sudo apt install -y docker.io docker-compose-v2
sudo systemctl enable --now docker
```

### 2. Clone the Repository & Configure Environment
```bash
git clone https://github.com/hyrovision-cloud/Super-D.git
cd Super-D

# Copy example environment
cp .env.example .env
# Edit with your secrets (nano .env)
```

### 3. Launch with Docker Compose
```bash
docker compose up -d --build
```

This starts:
- **`aarogya-mongodb`**: MongoDB 7.0 database on port `27017`
- **`aarogya-api`**: Backend Node.js API on port `5000`
- **`aarogya-web`**: Nginx container serving the React frontend on port `80` with built-in reverse proxy routing `/api/*` to the backend

Open your server's public IP in a browser: `http://<YOUR_SERVER_IP>`.

---

## Seed Accounts & Login Credentials

When `FORCE_SEED=true` is enabled, the system automatically provisions the default multi-branch structure and test accounts:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Owner / Super Admin** | `owner@aarogya.com` | `Owner@123` | Global access across all branches |
| **Branch Admin (Main Branch)** | `admin.delhi@aarogya.com` | `Admin@123` | Branch administrative control |
| **Senior Doctor / Specialist** | `doctor.sharma@aarogya.com` | `Doctor@123` | Consultations, appointments, records |
| **Receptionist / Front Desk** | `reception.delhi@aarogya.com` | `Staff@123` | Patient check-ins, bookings |
| **Finance Manager** | `finance.delhi@aarogya.com` | `Finance@123` | Invoicing, revenue dashboards |

---

## Health Check & Verification Endpoints

After deployment, test the backend health and routes:

- **Health check**: `GET https://<YOUR_API_URL>/api/v1/health`
  - Response: `{"status":"UP","timestamp":"...","database":"connected"}`
- **Authentication**: `POST https://<YOUR_API_URL>/api/v1/auth/login`
- **Frontend SPA**: Direct link visits to `/login`, `/dashboard`, `/patients` should load seamlessly.
