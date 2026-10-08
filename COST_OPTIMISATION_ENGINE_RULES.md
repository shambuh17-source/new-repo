# Cost Optimisation Engine Rules & Rationale

**Module:** `backend/services/costOptimisationEngine.js`  
**Purpose:** Automated financial anomaly detection, procurement optimization, and waste prevention.  
**Principle:** 100% deterministic, auditable rules based on actual ledger transactions.

---

## 1. Rule Catalog

### Rule 1: Budget Deficit / Overspent (`OVERSPENT_DEFICIT`)
- **Trigger:** Department budget utilisation exceeds 100.0%.
- **Severity:** `CRITICAL` 🔴
- **Math:** `Deficit = Actual - Allocated`
- **Rationale:** Operating past allocated budget violates college fiscal governance and exhausts liquid cash.
- **Actionable Recommendation:** Immediately freeze non-statutory operational disbursements and submit a formal supplementary budget reallocation request to the College Admin.
- **Estimated Savings Potential:** 50% of overrun amount via discretionary freeze.

---

### Rule 2: Approaching Budget Limit (`APPROACHING_BUDGET_LIMIT`)
- **Trigger:** Utilisation is between 85.0% and 100.0% with active fiscal quarters remaining.
- **Severity:** `WARNING` 🟠
- **Rationale:** Spending velocity indicates high probability of fund exhaustion prior to fiscal year-end.
- **Actionable Recommendation:** Institute a 30-day discretionary spending pause; restrict disbursements strictly to core laboratory consumables.

---

### Rule 3: Category Budget Overrun (`CATEGORY_OVERRUN`)
- **Trigger:** Category Actual spending exceeds Category Planned spending by $\ge 15.0\%$ with variance $\ge ₹20,000$.
- **Severity:** `HIGH` 🟠
- **Math:** `Variance = Actual - Planned; Variance% = (Variance / Planned) * 100`
- **Example:** Actual Equipment expenditure = ₹2,60,000 vs Planned = ₹2,40,000.
- **Actionable Recommendation:** Audit recent vendor purchase orders, verify pre-approval thresholds, and require three competitive quotations for transactions exceeding ₹25,000.

---

### Rule 4: Repeated / Fragmented Purchases (`REPEATED_PURCHASES`)
- **Trigger:** $\ge 3$ transactions with the same vendor in the same category within the fiscal period totaling $\ge ₹25,000$.
- **Severity:** `MEDIUM` 🔵
- **Example:** 3 separate stationery purchases with Chamundi Stationery totaling ₹35,000.
- **Rationale:** Repeated low-value orders bypass tender scrutiny and miss volume-based institutional discounts.
- **Actionable Recommendation:** Consolidate ad-hoc orders into an annual rate contract or quarterly bulk order. Negotiate institutional discounts of 10%–15%.

---

### Rule 5: Category Spending Concentration (`CATEGORY_CONCENTRATION`)
- **Trigger:** A single expenditure category accounts for $\ge 40.0\%$ of total departmental disbursements.
- **Severity:** `INFO` 🔵
- **Rationale:** Single-category concentration limits budgetary resilience against unanticipated equipment breakdowns or travel needs.
- **Actionable Recommendation:** Evaluate whether large asset acquisitions can be phased across fiscal semesters or shared with allied departments.

---

### Rule 6: Underutilisation / Year-End Fund Lapse Risk (`BUDGET_REMAINING_LAPSE`)
- **Trigger:** Utilisation $< 60.0\%$ for an active department with sanctioned allocation $\ge ₹4,00,000$.
- **Severity:** `INFO` 🟢
- **Rationale:** Persistent underutilisation risks university budget clawback and lower sanctions in subsequent cycles.
- **Actionable Recommendation:** Expedite planned laboratory equipment upgrades, student project grants, and faculty development seminars.

---

### Rule 7: Campus-Wide Software & Infrastructure Synergies (`CENTRALIZED_CAMPUS_AGREEMENT`)
- **Scope:** College Admin Level.
- **Trigger:** Multiple departments independently procuring identical software (e.g., MATLAB, AWS, Cadence, JetBrains) totaling $\ge ₹1,00,000$.
- **Severity:** `HIGH` 🟠
- **Rationale:** Institutional site licenses provide up to 25% savings over fragmented departmental retail purchases.
- **Actionable Recommendation:** Negotiate a centralized campus agreement under the Principal's office.

---

## 2. Architectural Guardrail: AI Integration

The cost optimisation engine includes an optional AI advisory synthesis hook (`getAiEnhancedAdvisory`).

### STRICT SYSTEM GUARANTEES:
1. **Zero Write Privileges:** AI components have strictly read-only access. AI NEVER mutates database tables, registers expenses, or approves vouchers.
2. **Audit Disclaimer:** Every AI response carries metadata:
   - `readOnly: true`
   - `canMutateFinancialRecords: false`
   - `guardrailNotice: "AI advisory is strictly informational. AI cannot directly edit ledger accounts, approve vouchers, or modify budget allocations."`
