# Hospital Intelligence: Owner AI & Governed RAG Architecture

> **Document**: `docs/ai-intelligence-design.md`  
> **Target Module**: `modules/owner-intelligence` & `modules/knowledge`  
> **Source of Truth**: RCRAFT Master Prompt & [`spec.md`](../spec.md)  
> **Primary Persona**: Hospital Owner / Group Managing Director  
> **Status**: Technical Architecture & Design Specification (Step 1 Planning Complete)

---

## 1. Executive Summary & Core Philosophy

The **Hospital Intelligence** module serves as an executive command copilot designed specifically for the **Hospital Owner**. It provides actionable strategic insights across all branches (Trichy, Chennai, Madurai, Pudukkottai), covering revenue trends, branch performance comparisons, category contributions, and operational alerts.

### The 4 Non-Negotiable AI Security Invariants:
1. **Zero Direct Database Query Generation**:
   The LLM is **strictly prohibited from generating or executing direct MongoDB queries (no raw MQL or SQL)**. It can only invoke **8 pre-approved, allow-listed analytical tools** implementing hardened MongoDB aggregation pipelines.
2. **RAG Exclusion for Numerical Calculations**:
   **Retrieval-Augmented Generation (RAG) is strictly forbidden for calculating revenue, counts, balances, or financial metrics.** Financial numbers must always come directly from aggregation tools. RAG is reserved strictly for authorized unstructured knowledge (SOPs, policies, guidelines).
3. **Zero Patient & Employee PII Exposure**:
   Analytics tools return aggregated statistical summaries only. No patient names, telephone numbers, clinical notes, employee identifiers, or credential records are ever exposed to the model context.
4. **Mandatory Audit Logging**:
   Every AI invocation, query prompt hash, tool executed, filter applied, and response latency is logged to `ai_query_audit_logs`.

---

## 2. Access Control & Authorization Gates

Access to Hospital Intelligence requires satisfying **BOTH** security constraints:
```text
permission: owner.ai.view
scope: ORGANIZATION
```
- **Authorized Roles**: Hospital Owner / Group Managing Director.
- **Denied Roles**: Any non-owner role (Global Admin, Branch Manager, Doctor, Nurse, HR, Finance, Receptionist) attempting to call `/api/v1/owner/intelligence/*` will immediately receive `403 Forbidden` with error code `INSUFFICIENT_PERMISSIONS`.

---

## 3. The 8 Allow-Listed Analytics Aggregation Tools

The AI agent interacts with the hospital database exclusively through these 8 allow-listed tools implemented in `server/src/modules/owner-intelligence/tools/`:

```text
┌────────────────────────────────────────────────────────┐
│             Owner AI Intelligence Agent                │
└───────────────────────────┬────────────────────────────┘
                            │ Structured Tool Calls
┌───────────────────────────▼────────────────────────────┐
│              Allow-Listed Analytics Engine             │
├────────────────────────────────────────────────────────┤
│ 1. getRevenueSummary(branchId, dateFrom, dateTo)       │
│ 2. getRevenueTrend(branchId, interval, dateRange)      │
│ 3. getBranchComparison(dateFrom, dateTo)               │
│ 4. getRevenueCategoryContribution(branchId, dateRange) │
│ 5. getAppointmentSummary(branchId, dateRange)          │
│ 6. getComplaintSummary(branchId, dateRange)            │
│ 7. getMarketingSummary(branchId, dateRange)            │
│ 8. getPendingApprovals(branchId)                       │
└───────────────────────────┬────────────────────────────┘
                            │ Hardened MongoDB Aggregation
┌───────────────────────────▼────────────────────────────┐
│                    MongoDB Collections                 │
│  (income_records, appointments, complaints, campaigns) │
└────────────────────────────────────────────────────────┘
```

### Detailed Tool Specifications:

#### 1. `getRevenueSummary`
- **Inputs**: `{ branchId?: string; dateFrom: string; dateTo: string }`
- **Pipeline**: `$match` (branch scope, date range, `status: 'ACTIVE'`) $\to$ `$group` (sum of amount, count of transactions, payment mode breakdown).
- **Returns**: Total revenue (`₹`), transaction count, average ticket size, cash vs. digital share, and percentage change against previous period.

#### 2. `getRevenueTrend`
- **Inputs**: `{ branchId?: string; interval: 'day' | 'week' | 'month'; dateFrom: string; dateTo: string }`
- **Pipeline**: Date grouping bucketed by day or week.
- **Returns**: Time-series array `{ date: string; amount: number; opdAmount: number; ipdAmount: number }`.

#### 3. `getBranchComparison`
- **Inputs**: `{ dateFrom: string; dateTo: string }`
- **Pipeline**: Aggregates revenue, patient footfall, and bed occupancy grouped by `branchId`.
- **Returns**: Comparative matrix across Trichy, Chennai, Madurai, and Pudukkottai.

#### 4. `getRevenueCategoryContribution`
- **Inputs**: `{ branchId?: string; dateFrom: string; dateTo: string }`
- **Pipeline**: Groups by the 9 mandatory categories: `OP`, `Medical`, `Lab`, `Day Care`, `Dressing`, `KIT`, `Socks`, `Slipper`, `Other Collections`.
- **Returns**: Category breakdown with amount (`₹`) and percentage share.

#### 5. `getAppointmentSummary`
- **Inputs**: `{ branchId?: string; dateFrom: string; dateTo: string }`
- **Pipeline**: Counts appointments grouped by status (`SCHEDULED`, `COMPLETED`, `CANCELLED`, `NO_SHOW`).
- **Returns**: Total scheduled, completion rate (%), no-show rate, top consulting specialities.

#### 6. `getComplaintSummary`
- **Inputs**: `{ branchId?: string; dateFrom: string; dateTo: string }`
- **Pipeline**: Grievances count, open tickets, SLA breaches, average resolution time.
- **Returns**: Active grievance volume, breach count, priority distribution.

#### 7. `getMarketingSummary`
- **Inputs**: `{ branchId?: string; dateFrom: string; dateTo: string }`
- **Pipeline**: Marketing spend, leads acquired, enquiries logged, conversion rates.
- **Returns**: Campaign spend, total leads, Cost-per-Lead (CPL), and conversion rate.

#### 8. `getPendingApprovals`
- **Inputs**: `{ branchId?: string }`
- **Pipeline**: Counts pending leave requests (`SUBMITTED`), pending purchases, and escalated complaints.
- **Returns**: Actionable pending approvals grouped by branch.

---

## 4. Structured Output Format

The AI endpoint `/api/v1/owner/intelligence/query` returns a deterministic JSON envelope:

```json
{
  "answer": "Consolidated network revenue for the current month reached ₹1.42 Cr, an increase of 14.2% over August. Chennai and Trichy generated 72% of total revenue. Pudukkottai showed significant outpatient growth following the rural health camp.",
  "summary": {
    "period": "01-09-2026 to 19-09-2026",
    "branchScope": "All Branches"
  },
  "insights": [
    {
      "title": "Revenue Growth Momentum",
      "severity": "positive",
      "message": "Daily collection run-rate exceeded budget targets by 8.4%."
    },
    {
      "title": "High Occupancy in Chennai",
      "severity": "neutral",
      "message": "Chennai Cardiac ICU occupancy reached 91%, indicating need for bed reallocation."
    },
    {
      "title": "Pending High-Priority Grievance",
      "severity": "warning",
      "message": "Cardiology OPD in Trichy has 1 grievance approaching SLA breach (2h remaining)."
    }
  ],
  "recommendedActions": [
    "Reallocate 10 semi-private beds to cardiac post-op in Chennai to address peak occupancy.",
    "Instruct Trichy Medical Superintendent to expedite resolution of ticket TKT-24-001.",
    "Scale up the Srirangam diabetes screening campaign based on positive CPL conversion."
  ],
  "charts": [
    {
      "type": "line",
      "title": "Daily Revenue Trend (Consolidated)",
      "data": [
        { "label": "01-09", "value": 720000 },
        { "label": "05-09", "value": 785000 },
        { "label": "10-09", "value": 810000 },
        { "label": "15-09", "value": 890000 },
        { "label": "19-09", "value": 940000 }
      ]
    },
    {
      "type": "bar",
      "title": "Branch Revenue Comparison",
      "data": [
        { "label": "Trichy", "value": 5800000 },
        { "label": "Chennai", "value": 4900000 },
        { "label": "Madurai", "value": 2400000 },
        { "label": "Pudukkottai", "value": 1100000 }
      ]
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

## 5. Governed RAG Architecture for Unstructured Documents

### Collections Schema:
1. **`knowledge_documents`**:
   - `organizationId`, `branchId`, `departmentId`, `documentType` (`POLICY`, `SOP`, `GUIDELINE`, `REPORT`), `title`, `confidentiality` (`PUBLIC`, `INTERNAL`, `RESTRICTED`), `allowedRoles: string[]`, `createdAt`.
2. **`knowledge_chunks`**:
   - `documentId`, `chunkIndex`, `text`, `embedding: number[]`, `metadata: { branchId, departmentId, allowedRoles }`.
3. **`ai_query_audit_logs`**:
   - `userId`, `userRole`, `promptHash`, `toolsCalled: string[]`, `retrievedChunks: string[]`, `latencyMs`, `timestamp`.

### Pre-Retrieval Enforcement:
Before querying vector or keyword indices, the system constructs a mandatory filter:
```javascript
const filter = {
  organizationId: req.user.organizationId,
  allowedRoles: { $in: req.user.roles },
  $or: [
    { branchId: 'all' },
    { branchId: { $in: req.user.assignedBranches } }
  ]
};
```
Content retrieved is strictly treated as passive informational background and cannot alter application state, financial data, or user permissions.

---

## 6. Frontend UI: Owner Intelligence Command Drawer

On the **Owner Dashboard** (`/dashboards/owner`), an executive entry point is added:
- **Button**: `"Ask Hospital Intelligence"` with an AI spark icon.
- **Drawer Component**: Opens a responsive right-side slide-over panel on desktop or full-screen bottom sheet on mobile.
- **Sample Question Chips**:
  1. *"Summarize this month’s revenue."*
  2. *"Compare all branches."*
  3. *"Which branch needs attention?"*
  4. *"Show top revenue categories."*
  5. *"Give weekly management actions."*
- **UI States Rendered**:
  - Executive answer card
  - Filter badge & data sources label
  - Severity-coded insight cards (green for positive, amber for warning, red for critical)
  - Interactive charts (using existing chart components)
  - Recommended action checklist
  - Interactive query history timeline
  - Loading skeleton state
  - Graceful failure fallback state

---

## 7. Definition of Done for Hospital Intelligence

This module will be accepted when:
1. An Owner query (`POST /api/v1/owner/intelligence/query`) executes allow-listed tools, records an audit log in `ai_query_audit_logs`, and returns valid JSON.
2. Non-owner roles receive a strict `403 Forbidden` response.
3. Numerical figures match dashboard figures for identical date/branch scopes.
4. The frontend renders answers, sources, insights, charts, and recommendations cleanly without console warnings.
