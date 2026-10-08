# Team Integration Guide (Member 4 Hand-off)

This document provides exact step-by-step instructions for **Member 1 (Frontend)**, **Member 2 (Backend & Security)**, and **Member 3 (CRUD)** to integrate Member 4's Analytics, Visualisation, Cost Optimisation, and Reporting subsystem.

---

## 1. Integration with Member 1 (Frontend Developer)

### Where to Import Visualisations:
Member 4 has created pre-built, production-ready Recharts components in `frontend/charts/` and `frontend/components/`:

```javascript
// In CollegeDashboard.jsx:
import DepartmentUtilisationBarChart from "../charts/DepartmentUtilisationBarChart";
import BudgetVsActualBarChart from "../charts/BudgetVsActualBarChart";
import MonthlyExpenditureLineChart from "../charts/MonthlyExpenditureLineChart";
import CategoryDistributionDonutChart from "../charts/CategoryDistributionDonutChart";
import CostOptimisationCards from "../components/analytics/CostOptimisationCards";
import OverspendingAlertBanner from "../components/analytics/OverspendingAlertBanner";
import FinancialReportExportModal from "../components/reports/FinancialReportExportModal";

// In DepartmentDashboard.jsx:
import RemainingBudgetChart from "../charts/RemainingBudgetChart";
import BudgetVsActualBarChart from "../charts/BudgetVsActualBarChart";
import MonthlyExpenditureLineChart from "../charts/MonthlyExpenditureLineChart";
import CategoryDistributionDonutChart from "../charts/CategoryDistributionDonutChart";
import CostOptimisationCards from "../components/analytics/CostOptimisationCards";
import OverspendingAlertBanner from "../components/analytics/OverspendingAlertBanner";
import FinancialReportExportModal from "../components/reports/FinancialReportExportModal";
```

### Fetching Data:
Use `frontend/services/analyticsApi.js`:
```javascript
import { analyticsApi } from "../services/analyticsApi";

// In College Dashboard:
const [overview, setOverview] = useState(null);
const [departments, setDepartments] = useState([]);
const [alerts, setAlerts] = useState([]);

useEffect(() => {
  async function loadData() {
    const ov = await analyticsApi.getCollegeOverview();
    const depts = await analyticsApi.getDepartmentComparison();
    const al = await analyticsApi.getCollegeAlerts();
    setOverview(ov);
    setDepartments(depts);
    setAlerts(al);
  }
  loadData();
}, []);
```

---

## 2. Integration with Member 2 (Backend, Auth & Database)

### 1. Mounting Routes in Express:
In your main `backend/app.js` or `backend/server.js`:
```javascript
import analyticsRoutes from "./routes/analyticsRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

app.use("/api/analytics", analyticsRoutes);
app.use("/api/reports", reportRoutes);
```

### 2. Replacing Mock Database with PostgreSQL / MySQL:
In `backend/services/analyticsService.js`, replace the `db` array filters with SQL queries or your ORM (Prisma / Drizzle / Sequelize / Knex):

- **Budgets:** `SELECT * FROM budgets WHERE college_id = $1 AND status = 'ACTIVE'`
- **Approved Expenses:** `SELECT * FROM expenses WHERE department_id = $1 AND approval_status = 'APPROVED'`
- **Budget Requests:** `SELECT * FROM budget_requests WHERE department_id = $1 AND status = 'PENDING'`

The mathematical functions in `backend/utils/financialMath.js` and `backend/utils/currencyFormatter.js` remain identical and database-agnostic.

### 3. JWT Middleware Handshake:
Update `backend/middleware/authMiddleware.js`:
Replace `req.headers["x-user-role"]` testing logic with your JWT verify:
```javascript
import jwt from "jsonwebtoken";

export function authenticateUser(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, college_id, department_id }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
```

---

## 3. Integration with Member 3 (CRUD Operations)

Whenever an action occurs in Member 3's modules, analytics values automatically adapt:

1. **When Expense Added & Approved:**
   - Call Member 3's `POST /api/expenses` -> status set to `APPROVED`.
   - On subsequent calls to `/api/analytics/department/:id/overview`, `actualExpenditure` immediately reflects the new total.
   - If utilisation crosses 85%, `getOverspendingAlerts()` automatically emits a `BUDGET_WARNING`.
   - If utilisation crosses 100%, `getOverspendingAlerts()` automatically emits a `BUDGET_OVERSPENT` alert.

2. **When Budget Allocation Revised:**
   - Member 3's `POST /api/budgets` or `PUT /api/budgets/:id` updates `allocated_amount`.
   - `analyticsService.getDepartmentOverview()` automatically recomputes remaining balance and recalculates utilisation.

3. **When Budget Request Approved:**
   - College Admin calls `PUT /api/budget-requests/:id/approve`.
   - Pending count automatically decreases.
   - Allocated budget increments by approved amount.

---

## 4. Demonstrating Privacy (Hackathon Step 20)

To present Step 20 during the hackathon demonstration:

```bash
# 1. Login as CSE Department Admin (Department ID: 1)
# 2. Attempt to fetch ECE Department Analytics (Department ID: 2)
curl -H "X-User-Role: DEPARTMENT_ADMIN" \
     -H "X-Department-Id: 1" \
     http://localhost:5000/api/analytics/department/2/overview

# Expected Response:
# HTTP 403 Forbidden
# {
#   "error": "403 Forbidden: Access Denied. You do not have permission to access another department's financial records.",
#   "attemptedDepartmentId": 2,
#   "userDepartmentId": 1
# }
```
