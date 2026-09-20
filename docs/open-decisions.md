# Open Decisions & Demo Assumptions

This document tracks ambiguities, open product decisions from `spec.md` Section 23, and the safe, non-breaking demo assumptions made for Release D0.

| # | Spec Item | Description / Question | Release D0 Safe Demo Assumption | Status |
|---|---|---|---|---|
| **OD-01** | Sec 23.1 | Official hospital chain brand name and logo | Use fictional brand **"Aarogya Super Speciality Hospitals"** with initial branches: Trichy, Chennai, Madurai, Pudukkottai. | Documented & Adopted |
| **OD-02** | Sec 23.3, 23.4 | Clinical data scope & cross-branch patient visibility | In D0 demo, Owner & Global Admin have cross-branch view. Branch Managers and Doctors view patients associated with their active branch or assignment. | Documented & Adopted |
| **OD-03** | Sec 23.4 | Patient identification format | Standardized format: `PAT-[BRANCH_CODE]-[SERIAL]`, e.g., `PAT-TRY-1001`, `PAT-CHN-2015`. | Documented & Adopted |
| **OD-04** | Sec 23.6 | Leave approval workflows | 2-stage approval (`MANAGER_REVIEW` -> `HR_REVIEW` -> `APPROVED`). Rejections immediately transition to `REJECTED` and mandate a reviewer reason. | Documented & Adopted |
| **OD-05** | Sec 23.7 | Complaint SLA rules | SLA calculated as: High priority = 24h, Medium = 48h, Low = 72h. Overdue flag is automatically triggered when `now > slaDueAt`. | Documented & Adopted |
| **OD-06** | Sec 23.14 | Marketing platforms | Fictional campaigns across Google Search, Meta (Instagram Reels, Facebook Ads), and YouTube Shorts with realistic Indian CPM/CPC metrics. | Documented & Adopted |
| **OD-07** | Sec 23.15 | Localization & Languages | English primary UI with Indian currency formatting (`₹`, lakhs/crores formatting `12,50,000`) and Indian date format `DD-MM-YYYY`. | Documented & Adopted |
| **OD-08** | Sec 23.16 | Export formats | Simulated asynchronous export for PDF and CSV with a progress indicator and mock download toast notification. | Documented & Adopted |
| **OD-09** | Sec 23.8 | Revenue categories | Fixed 9 categories from spec: `OP`, `Medical`, `Lab`, `Day Care`, `Dressing`, `KIT`, `Socks`, `Slipper`, `Other Collections`. | Documented & Adopted |
