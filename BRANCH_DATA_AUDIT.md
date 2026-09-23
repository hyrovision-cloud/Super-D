# Multi-Branch Hospital Platform: Comprehensive Branch Data Flow Audit

**Document:** `BRANCH_DATA_AUDIT.md`  
**Date:** September 2026  
**Status:** Audit Completed — Root Cause Identified  
**Platform:** Super D Hospital Management & Administration Platform  

---

## 1. Executive Summary

An audit of the multi-branch Hospital Management & Administration Platform was conducted to investigate why only **3 branches** appear in multiple reports, dashboards, and analytics screens instead of all **4 configured hospital branches**.

The audit verified every stage of the data lifecycle:
```
Database / Mock Data 
       ↓
Branch Data Model 
       ↓
Income & Revenue Records 
       ↓
Backend Services & Aggregations 
       ↓
Frontend Mock Store & API Clients 
       ↓
Dashboard State & Transformers 
       ↓
Charts, Tables & UI Dropdowns
```

The audit conclusively confirmed that the missing 4th branch across all affected reporting screens is:
**Pudukkottai Healthcare Center** (Branch ID: `branch-pudukkottai` / `branch-pdk`, Code: `PDK` / `BR-PDK`).

---

## 2. Expected Branch List vs Actual Branch List

### 2.1 Configured Hospital Branches (Source of Truth)
| # | Branch Name | Canonical Backend ID | Legacy Frontend ID | Code | City | Bed Capacity |
|---|---|---|---|---|---|---|
| 1 | **Trichy Main Hospital** | `branch-trichy` | `branch-try` | `TRY` / `BR-TRY` | Tiruchirappalli | 120 |
| 2 | **Chennai Super Speciality** | `branch-chennai` | `branch-chn` | `CHN` / `BR-CHN` | Chennai | 250 |
| 3 | **Madurai City Hospital** | `branch-madurai` | `branch-mdu` | `MDU` / `BR-MDU` | Madurai | 180 |
| 4 | **Pudukkottai Healthcare Center** | `branch-pudukkottai` | `branch-pdk` | `PDK` / `BR-PDK` | Pudukkottai | 80 |

### 2.2 Actual Branch List in Affected Views
| Screen / Component | Displayed Branches | Missing Branch |
|---|---|---|
| **Income Reports — Branch Comparison Bar Chart** (`BRANCH_BAR_DATA`) | Madurai, Chennai, Trichy (3) | **Pudukkottai** |
| **Income Reports — Revenue Datewise Line Chart** (`REVENUE_DATEWISE_SERIES`) | Madurai, Chennai, Trichy (3) | **Pudukkottai** |
| **Income Reports — Branch Comparison Table** (`BRANCH_COMPARISON_REPORT`) | Madurai, Chennai, Trichy (3) | **Pudukkottai** |
| **Income Reports — Branch-wise Patient Summary Table** (`BRANCH_WISE_PATIENT_SUMMARY`) | Madurai, Chennai, Trichy (3) | **Pudukkottai** |
| **Income Reports — Patient Summary Annotation Note** | Hardcoded: *"across all 3 monitoring branches: 376"* | **Pudukkottai** |
| **Income Reports — Revenue Composition Branch Dropdown** | Trichy, Chennai, Madurai (3) | **Pudukkottai** |
| **Income Reports — Daily Branch Report Dropdown** | Trichy, Chennai, Madurai (3) | **Pudukkottai** |
| **Income Reports — CSV Export Routine** (`handleExport`) | Madurai, Chennai, Trichy + Total 7,63,488 (3) | **Pudukkottai** |
| **Super Admin / Role Dashboard Quick Access** (`RoleDashboardView.tsx`) | Hardcoded Total Revenue ₹ 7,63,488 & Patients 376 (sum of only 3 branches) | **Pudukkottai** (₹ 41,800 omitted) |
| **Finance Service Branch Summary Aggregation** (`financeService.getRevenueSummary`) | Only generates keys for branches that have active records; zero-revenue branches drop out | Any branch with 0 records in filtered period |

---

## 3. Data Flow Tracing & Disappearance Point

### 3.1 Trace Analysis

```
[DATABASE / MOCK DATA]
   ├─ frontend/src/data/seed/branches.ts ───────── ALL 4 BRANCHES EXIST (TRY, CHN, MDU, PDK)
   ├─ frontend/src/data/seed/finance.ts ────────── ALL 4 BRANCHES EXIST (Pudukkottai has 4 records totaling ₹41,800)
   ├─ frontend/src/data/seed/superDSeed.ts ─────── PARTIAL: Ads & discharges have PDK, BUT reports ONLY HAVE 3!
   │                                               ├── REVENUE_DATEWISE_SERIES (Madurai, Chennai, Trichy only)
   │                                               ├── BRANCH_COMPARISON_REPORT (Madurai, Chennai, Trichy only)
   │                                               └── BRANCH_WISE_PATIENT_SUMMARY (Madurai, Chennai, Trichy only)
   │
[SERVICES / AGGREGATION LAYER]
   ├─ frontend/src/services/mock/dashboardService.ts ── Maps over state.branches (Includes all 4 branches)
   ├─ frontend/src/services/mock/financeService.ts ──── Iterates ONLY over records (Omits zero-revenue branches)
   ├─ backend/src/seed/seedAuth.ts ──────────────────── BranchModel NOT seeded into database
   ├─ backend/src/controllers/branch.controller.ts ──── Reads BranchModel (empty until seeded)
   │
[FRONTEND PRESENTATION LAYER]
   ├─ frontend/src/features/reports/IncomeReportsView.tsx ── HARDCODED 3-BRANCH STRUCTURE:
   │   ├── BRANCH_BAR_DATA = [Madurai, Chennai, Trichy]
   │   ├── Recharts <LineChart> defines only 3 <Line> keys (Madurai, Chennai, Trichy)
   │   ├── Table headers define only 3 branch columns (Madurai, Chennai, Trichy)
   │   ├── Select dropdowns define only 3 options (Trichy, Chennai, Madurai)
   │   └── handleExport() CSV generator exports only 3 branches
   │
   └─ frontend/src/features/dashboards/RoleDashboardView.tsx ── HARDCODED TOTALS:
       ├── Total Revenue: ₹ 7,63,488 (= 280,209 + 278,907 + 204,372 from the 3 branches)
       └── Total Patients: 376 (= 114 + 127 + 135 from the 3 branches)
```

---

## 4. Root Cause Analysis

### Root Cause 1: Incomplete Demo Data Ingestion (`superDSeed.ts`)
The demo datasets (`REVENUE_DATEWISE_SERIES`, `BRANCH_COMPARISON_REPORT`, and `BRANCH_WISE_PATIENT_SUMMARY`) were transcribed directly from a legacy 3-branch pilot operational sheet (covering Madurai, Chennai, and Trichy for the dates 01.09.2026 to 11.09.2026). During initial setup, the 4th branch (**Pudukkottai Healthcare Center**) was configured in the branch master and financial records (`finance.ts`), but was never backfilled into `superDSeed.ts`.

### Root Cause 2: Hardcoded 3-Column Visual Layouts in `IncomeReportsView.tsx`
`IncomeReportsView.tsx` was coded assuming the data shape of the 3-branch pilot sheet:
1. `BRANCH_BAR_DATA` statically listed only Madurai, Chennai, and Trichy.
2. The Recharts multi-line chart only declared `<Line dataKey="Madurai" />`, `<Line dataKey="Chennai" />`, and `<Line dataKey="Trichy" />`.
3. The comparison table headers (`<th>`) and table row cells (`<td>`) statically rendered 3 branch columns.
4. The branch dropdowns for `compositionBranch` and `dailyReportBranch` omitted Pudukkottai.
5. The CSV export function in `handleExport` only exported 3 branches.

### Root Cause 3: Aggregation Starting from Transactions Instead of Branch Master
In `financeService.ts`, the `getRevenueSummary` function creates `byBranch` entries strictly on-the-fly while iterating through existing income transactions:
```typescript
if (!byBranch[rec.branchId]) {
  byBranch[rec.branchId] = { branchName: rec.branchName, amount: 0 };
}
byBranch[rec.branchId].amount += rec.amount;
```
If a branch has zero transactions for a selected date range or category filter, it is never added to `byBranch`. In organization-wide reports, this causes inactive or newly opened branches to completely vanish from branch comparison tables instead of displaying `₹ 0`.

### Root Cause 4: Disconnected Branch Model Seeding in Backend
In `backend/src/seed/seedAuth.ts`, `RoleModel` and `UserModel` were seeded, but `BranchModel` was never initialized. When connecting live backend aggregations, `BranchModel.find()` would return an empty array if not seeded, preventing live left-join aggregations.

### Root Cause 5: Branch Identifier Naming Inconsistency
- Backend canonical constants: `branch-trichy`, `branch-chennai`, `branch-madurai`, `branch-pudukkottai`.
- Frontend mock store: `branch-try`, `branch-chn`, `branch-mdu`, `branch-pdk`.
- While internal mapping in `dashboardService.ts` works when self-contained, inconsistent IDs between layers risk dropping records when services interact.

---

## 5. Affected Files & Artifacts

| Layer | File Path | Defect Description |
|---|---|---|
| **Data Seed** | `frontend/src/data/seed/superDSeed.ts` | Missing `Pudukkottai` in `REVENUE_DATEWISE_SERIES`, `BRANCH_COMPARISON_REPORT`, and `BRANCH_WISE_PATIENT_SUMMARY`. |
| **UI Component** | `frontend/src/features/reports/IncomeReportsView.tsx` | Hardcoded 3 branches in bar chart, line chart, table headers, table rows, dropdowns, and CSV export. Spelled `Pudukottai` in filter. |
| **UI Component** | `frontend/src/features/dashboards/RoleDashboardView.tsx` | Hardcoded revenue ₹ 7,63,488 and patient count 376 (sum of 3 branches excluding Pudukkottai). |
| **UI Component** | `frontend/src/features/finance/RevenueAccountsView.tsx` | Base revenue anchor 763,488 omits Pudukkottai collections. |
| **Service Layer** | `frontend/src/services/mock/financeService.ts` | `byBranch` omits branches with zero income records instead of returning `amount: 0`. |
| **Backend Seed** | `backend/src/seed/seedAuth.ts` | `BranchModel` not seeded with the 4 canonical hospital branches. |
| **Backend Route** | `backend/src/routes/branch.routes.ts` / `revenue.routes.ts` | Need canonical branch comparison aggregation respecting the zero-revenue left-join rule. |

---

## 6. Zero-Revenue Rule Compliance Specification

According to system architecture rules:
> **For organization-wide branch comparison reports:**  
> If a configured branch has ZERO revenue for a selected date range, it MUST still appear with:  
> `Revenue = 0` (or `₹ 0`) instead of disappearing.  

The aggregation pipeline must always start from the **Branch Master**:
```
Branch Master (All 4 Active Branches)
       ↓
LEFT JOIN / $lookup
       ↓
Income Records (Filtered by Date / Status)
       ↓
$group / reduce by Branch
       ↓
Return ALL 4 Branches (with zero fill for missing matches)
```

---

## 7. Recommended Remediation Plan

1. **Seed Master Update (`superDSeed.ts`)**:
   - Add `Pudukkottai` revenue data to `REVENUE_DATEWISE_SERIES` for all 11 days (consistent with Pudukkottai's operational figures).
   - Add `Pudukkottai` column to `BRANCH_COMPARISON_REPORT` with clinical and collection metrics.
   - Add `Pudukkottai` column to `BRANCH_WISE_PATIENT_SUMMARY` (e.g., 28 patients: 12 new, 16 review).
   - Update consolidated organization revenue (₹ 7,63,488 + ₹ 41,800 = ₹ 8,05,288) and total patient counts (376 + 28 = 404).

2. **IncomeReportsView Refactoring (`IncomeReportsView.tsx`)**:
   - Add `Pudukkottai` to `BRANCH_BAR_DATA` (revenue: 41,800, patients: 28).
   - Add 4th `<Line dataKey="Pudukkottai" stroke="#d97706" />` and legend badge to Recharts `LineChart`.
   - Update `BRANCH_COMPARISON_REPORT` table header and row rendering to display `Pudukkottai` as the 4th column.
   - Add `Pudukkottai` to `compositionBranch` and `dailyReportBranch` select options.
   - Update `BRANCH_WISE_PATIENT_SUMMARY` table headers and row rendering to include `Pudukkottai`.
   - Update summary text to: *"Total patients registered across all 4 monitoring branches: 404"*.
   - Update CSV export in `handleExport` to include all 4 branches.
   - Standardize spelling to `Pudukkottai` across all UI select elements.

3. **Service Layer Left-Join Zero-Revenue Fix (`financeService.ts`)**:
   - In `getRevenueSummary`, initialize `byBranch` from `mockStore.getState().branches` so every branch is present with `amount: 0`.

4. **Dashboard Totals Reconciliation (`RoleDashboardView.tsx` & `RevenueAccountsView.tsx`)**:
   - Update KPI card totals to reflect consolidated network metrics including all 4 branches.

5. **Backend Canonical Branch Seeding & Aggregation**:
   - Seed all 4 branches into `BranchModel` in `backend/src/seed/seedAuth.ts`.
   - Implement canonical branch revenue aggregation supporting date filtering and zero-revenue branch preservation.

6. **Automated Verification & Tests**:
   - Create test suite validating 4-branch consistency, zero-revenue branch retention, and frontend/backend build integrity.
