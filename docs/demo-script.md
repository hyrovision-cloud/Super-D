# Aarogya Hospital Management Platform — Client Presentation Demo Script

> **Target Audience**: Hospital Chairman, Managing Directors, Medical Superintendents, Chief Financial Officers, and IT Steering Committee.  
> **Duration**: 20–25 minutes  
> **Demonstrator**: Technical Lead / Solutions Architect  
> **Environment URL**: `http://localhost:3000` (Frontend) | `http://localhost:5000` (MERN Backend API)  
> **Pre-requisite**: Ensure backend server is running (`npm run dev` in `apps/api`) and MongoDB is connected.

---

## Executive Demo Flow (Quick Overview)

1. **Owner Login** (`owner@aarogya.com` / `admin123`)
2. **Revenue Dashboard** (Consolidated MTD & 9-category breakdown)
3. **Ask Hospital Intelligence** (Owner-only AI Command Center)
4. **Revenue Summary & Trend Chart** (Allow-listed aggregation `getRevenueSummary`)
5. **Branch Comparison** (`getBranchComparison` analytics)
6. **Suggested Management Actions & Strategic Insights**
7. **Open Notifications** (Event bus alerts, priority badges & mark-all-as-read)
8. **View Revenue Record & Audit Trail** (Financial integrity & compliance)
9. **Show Responsive Mobile Dashboard** (390px mobile viewport)

---

## 1. Executive Introduction & Brand Overview (2 mins)

### Presenter Talking Points:
> *"Good morning / afternoon esteemed leadership. Today, I am proud to walk you through the operational preview of the Aarogya Super Speciality Multi-Branch Hospital Management & Administration Platform.*
> 
> *Our platform unites clinical, operational, financial, and marketing governance across all four regional branches — Trichy, Chennai, Madurai, and Pudukkottai — backed by a high-performance MERN backend (Node.js, Express, MongoDB, and TypeScript).*
> 
> *Notice at the very top our persistent banner confirming that this is a simulated sandbox populated with realistic, compliant Tamil Nadu healthcare scenarios. Every metric adheres strictly to Indian healthcare norms — currency in Indian Rupees (₹), Indian standard date-time, and UHID formats."*

### Screen Actions:
1. Open `http://localhost:3000/login`.
2. Point out the brand identity and the **Role Presets** allowing instant evaluation of 3-tier RBAC security.
3. Select **"Hospital Owner"** (`owner@aarogya.com`) and click **"Access Demo Dashboard"**.

---

## 2. Super Admin & Group Owner Multi-Branch View (3 mins)

### Presenter Talking Points:
> *"We begin through the eyes of the Group Managing Director and Hospital Owner. From this unified Command Center, leadership has real-time visibility across the entire network: today’s total patient footfall, active in-patient bed census, network-wide revenue, and operating margin.*
> 
> *Notice the 'Ask Hospital Intelligence' button on the top right — an Owner-only AI Command Copilot powered by hardened, allow-listed MongoDB aggregation pipelines with zero raw patient data exposure."*

### Screen Actions:
1. Land on `/dashboards/owner`.
2. Highlight the 4 top KPI cards:
   - **Network Revenue (M-T-D)** (₹1.45 Lakhs seeded demo transactions)
   - **Active Patient Census** (OPD + IPD)
   - **Bed Occupancy Rate** across 855 total network beds
   - **Active Clinical Workforce** (Doctors, Duty Registrars, Nursing Leads)
3. Review the **Branch Performance Comparison Matrix** showing Trichy (Flagship), Chennai, Madurai, and Pudukkottai.

---

## 3. Hospital Intelligence — Owner AI Command Center (4 mins)

### Presenter Talking Points:
> *"Now, let's explore our premier executive capability: 'Hospital Intelligence'.*
> 
> *Unlike generic chatbot wrappers, Hospital Intelligence is architecturally constrained by strict security guardrails:*
> - *It is accessible ONLY to the Hospital Owner (`permission: owner.ai.view`, `scope: ORGANIZATION`). Other roles receive a strict 403 Forbidden.*
> - *It has NO direct database access or free-form query ability.*
> - *It executes ONLY 8 allow-listed MongoDB aggregation tools (`getRevenueSummary`, `getBranchComparison`, `getRevenueCategoryContribution`, etc.).*
> - *It NEVER exposes patient names, phone numbers, or clinical notes.*
> - *Every insight cites its exact source analytical tool and data filters."*

### Screen Actions:
1. Click the **"Ask Hospital Intelligence"** button in the top right.
2. The sleek copilot drawer slides in with pre-configured executive chips:
   - *"Summarize this month’s revenue."*
   - *"Compare all branches."*
   - *"Which branch needs attention?"*
   - *"Show top revenue categories."*
   - *"Give weekly management actions."*
3. Click **"Summarize this month’s revenue."**:
   - Observe the loading state.
   - Inspect the **Executive Summary Answer** in simple, clear English.
   - Point out the **Period** (`September 2026`) and **Scope** (`All Branches`) badges.
   - Inspect the **Strategic Insight Cards** with color-coded severity (`positive`, `warning`).
   - Review the **Recommended Management Actions** (e.g. OPD doctor attendance, procedure consumables).
   - Point out the **Verified Allow-Listed Sources** at the bottom showing `getRevenueSummary` and `getRevenueCategoryContribution`.
4. Click **"Compare all branches."**:
   - Point out the cross-branch breakdown highlighting Trichy as the flagship driver and Pudukkottai as the community outreach center.
5. Click **"View Query History"** to show the append-only AI query audit log.
6. Close the drawer.

---

## 4. In-App Notifications & Event Bus (3 mins)

### Presenter Talking Points:
> *"Hospital operations move fast. Our unified in-app notification engine receives real-time operational alerts from across the hospital network — appointment reschedules, leave submissions, SLA escalations, and revenue milestones.*
> 
> *Notice the notification bell in the top navigation bar with an unread badge counter."*

### Screen Actions:
1. Click the **Bell Icon** in the top navigation bar.
2. Review the incoming alerts categorized by module and priority:
   - *Leave Request*: Sister Shanthi Edward casual leave.
   - *SLA Escalation*: Ambulance delay grievance (TKT-24-007).
   - *Emergency Admission*: Trichy Emergency Care arrival.
   - *Daily Revenue Milestone*: Chennai branch collections.
3. Click **"Mark all as read"** — observe the unread badge clearing instantly and state persisting to the backend.

---

## 5. Revenue Integrity & 9-Category Ledger (3 mins)

### Presenter Talking Points:
> *"Next, we inspect financial transparency in the Finance module. Healthcare accounting requires granular categorization far beyond retail books.*
> 
> *Our backend enforces all 9 mandatory healthcare revenue categories specified in the hospital charter, with complete audit trails for every transaction."*

### Screen Actions:
1. Navigate to `/finance`.
2. Review the **9 Revenue Categories Summary Cards**:
   - *1. OPD Consultation*
   - *2. IPD Bed Charges*
   - *3. Lab / Diagnostics*
   - *4. Pharmacy*
   - *5. Surgical Procedures*
   - *6. Emergency / Casualty*
   - *7. Teleconsultation*
   - *8. Ambulance Services*
   - *9. Miscellaneous*
3. Point out the **Cashless Share** indicator demonstrating UPI and TPA health insurance claim reconciliation.
4. Review the recent transactions table and receipt generation.

---

## 6. Branch Scoping & Role-Based Access Control (3 mins)

### Presenter Talking Points:
> *"Let us verify that regional autonomy and 3-tier authorization are strictly enforced by the backend.*
> 
> *When a Branch Manager logs in, their data scope is constrained to their assigned branch. If a non-owner attempts to access Hospital Intelligence, the backend returns a hard 403 Forbidden."*

### Screen Actions:
1. Use the Quick Role Switcher in the top bar to switch to **"Branch Manager"** or **"Doctor"**.
2. Notice the "Ask Hospital Intelligence" button is hidden from the UI.
3. Show that branch data automatically scopes to the manager's facility.
4. Switch back to **"Hospital Owner"** to restore network-wide organization scope.

---

## 7. Operational Workflows: Leave Governance & Complaints SLA (3 mins)

### Presenter Talking Points:
> *"Our HR and Patient Experience modules enforce strict administrative policies:*
> - *Leave Governance: Supervisors cannot reject staff leave without providing a mandatory written justification.*
> - *Complaints Redressal: NABH compliance requires SLA countdown timers on patient grievances."*

### Screen Actions:
1. Navigate to `/leave`:
   - Click "Reject" on a pending nurse leave request.
   - Attempt to submit without a reason — note the mandatory comment validation.
   - Add justification `"Staffing shortage on intensive care night shift"` and confirm.
2. Navigate to `/complaints`:
   - Point out SLA countdown badges ("On Track" vs "Overdue / SLA Breached").
   - Open ticket `TKT-24-001`, add resolution summary, and mark as Resolved.

---

## 8. Mobile-First Responsiveness (2 mins)

### Presenter Talking Points:
> *"Doctors on rounds and duty administrators carry smartphones. Our interface is fully responsive down to 390px mobile screens without any horizontal scroll or broken layout."*

### Screen Actions:
1. Open Browser DevTools (`F12`), toggle Device Toolbar, and select **iPhone 14 / 15** (390px width).
2. Point out:
   - Ergonomic **Mobile Bottom Navigation** (`Dashboard`, `Patients`, `Appts`, `Revenue`, `More`).
   - Clean transformation of operational metrics and charts into fluid mobile cards.
   - Touch-friendly action drawers and responsive navigation.
3. Close DevTools to return to desktop view.

---

## 9. Conclusion & Technical Architecture (2 mins)

### Presenter Talking Points:
> *"In summary, this demonstration proves a complete, modern healthcare administration platform:*
> - *React 18 + TypeScript responsive frontend.*
> - *Express + Node.js + MongoDB backend running on `/api/v1`.*
> - *Role + Permission + Branch-Scope 3-tier authorization.*
> - *Hardened Owner AI Command Center ('Hospital Intelligence') with allow-listed aggregations.*
> - *In-app notification engine with event-bus decoupling.*
> - *Complete append-only audit trail.*
> 
> *Thank you, and we welcome your questions."*

### Screen Actions:
1. Conclude presentation and open Q&A.

