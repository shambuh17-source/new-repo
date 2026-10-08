# Smart College Financial Intelligence & Analytics API Specification

**Author:** Member 4 (Analytics, Visualisation, Cost Optimisation & Reporting)  
**Target Platform:** Node.js / Express  
**Security Model:** Role-Based Access Control (RBAC) with Strict Multi-Tenant Department Isolation  

---

## 1. Authentication & Security Headers

Every request to the `/api/analytics/*` and `/api/reports/*` endpoints requires authenticated user context:

| Header Name | Example Value | Description |
|---|---|---|
| `Authorization` | `Bearer <JWT_TOKEN>` | Standard Bearer JWT token |
| `X-User-Role` | `COLLEGE_ADMIN` or `DEPARTMENT_ADMIN` | User Role |
| `X-Department-Id` | `1` (or `null` for College Admin) | Associated Department ID |

### Access Control Rules:
1. **`COLLEGE_ADMIN`**:
   - Access permitted to `/api/analytics/college/*`
   - Access permitted to `/api/analytics/department/:departmentId/*` for any department.
   - Access permitted to `/api/reports/college/export`
2. **`DEPARTMENT_ADMIN`**:
   - Access permitted ONLY to `/api/analytics/department/:departmentId/*` where `:departmentId == user.department_id`.
   - Access to `/api/analytics/college/*` returns **HTTP 403 Forbidden**.
   - Access to any other department ID returns **HTTP 403 Forbidden**.

---

## 2. College Admin Analytics Endpoints

### 2.1 College Overview KPIs
- **Endpoint:** `GET /api/analytics/college/overview`
- **Role Required:** `COLLEGE_ADMIN`
- **Sample Response:**
```json
{
  "success": true,
  "data": {
    "college": {
      "id": 1,
      "name": "Mysuru Institute of Technology",
      "code": "MIT-MYS",
      "financialYear": "2024-2025",
      "currency": "INR"
    },
    "kpi": {
      "totalBudget": 3600000,
      "budgetAllocated": 3600000,
      "totalPlanned": 3310000,
      "totalExpenditure": 2940000,
      "remainingBudget": 660000,
      "overallUtilisation": 81.7,
      "status": {
        "code": "ATTENTION",
        "label": "Attention",
        "icon": "🟡",
        "color": "#EAB308"
      },
      "departmentCount": 5,
      "healthyCount": 2,
      "attentionCount": 1,
      "nearLimitCount": 1,
      "overspentCount": 1,
      "pendingRequestsCount": 2,
      "pendingRequestsAmount": 90000
    },
    "formatted": {
      "totalBudget": "₹36,00,000",
      "totalExpenditure": "₹29,40,000",
      "remainingBudget": "₹6,60,000",
      "totalPlanned": "₹33,10,000",
      "overallUtilisation": "81.7%",
      "pendingRequestsAmount": "₹90,000",
      "compactTotalBudget": "₹36.0L",
      "compactTotalExpenditure": "₹29.4L",
      "compactRemainingBudget": "₹6.6L"
    }
  }
}
```

---

### 2.2 Department Comparison Matrix
- **Endpoint:** `GET /api/analytics/college/department-comparison`
- **Role Required:** `COLLEGE_ADMIN`
- **Description:** Returns ranked list of departments sorted by utilisation percentage.
- **Sample Item in Array:**
```json
{
  "departmentId": 3,
  "code": "ME",
  "name": "Mechanical Engineering",
  "head": "Dr. Raghavendra Rao",
  "allocated": 600000,
  "spent": 630000,
  "remaining": -30000,
  "utilisation": 105.0,
  "variance": 40000,
  "status": "OVERSPENT",
  "statusLabel": "Overspent",
  "statusIcon": "🔴",
  "statusColor": "#EF4444",
  "formatted": {
    "allocated": "₹6,00,000",
    "spent": "₹6,30,000",
    "remaining": "-₹30,000",
    "utilisation": "105.0%"
  }
}
```

---

### 2.3 College Category Distribution
- **Endpoint:** `GET /api/analytics/college/category-distribution`
- **Role Required:** `COLLEGE_ADMIN`
- **Used For:** Recharts Donut / Pie Chart.

---

### 2.4 College Monthly Spending Trends
- **Endpoint:** `GET /api/analytics/college/monthly-trends`
- **Role Required:** `COLLEGE_ADMIN`
- **Used For:** Recharts Line / Area Chart.

---

## 3. Department Admin Analytics Endpoints

### 3.1 Department Overview KPIs
- **Endpoint:** `GET /api/analytics/department/:departmentId/overview`
- **Role Required:** `COLLEGE_ADMIN` or `DEPARTMENT_ADMIN` matching `:departmentId`
- **Privacy Enforcement:** If Department Admin 1 calls `/api/analytics/department/2/overview`, returns:
```json
{
  "error": "403 Forbidden: Access Denied. You do not have permission to access another department's financial records.",
  "attemptedDepartmentId": 2,
  "userDepartmentId": 1
}
```
- **Sample Valid Response:**
```json
{
  "success": true,
  "data": {
    "department": {
      "id": 1,
      "code": "CSE",
      "name": "Computer Science & Engineering",
      "head": "Dr. K. S. Ramanujam"
    },
    "kpi": {
      "allocatedBudget": 1000000,
      "plannedExpenditure": 850000,
      "actualExpenditure": 700000,
      "remainingBudget": 300000,
      "utilisation": 70.0,
      "variance": -150000,
      "variancePercentage": -17.6,
      "status": "HEALTHY",
      "statusLabel": "Healthy",
      "statusIcon": "🟢",
      "statusColor": "#10B981"
    },
    "formatted": {
      "allocatedBudget": "₹10,00,000",
      "actualExpenditure": "₹7,00,000",
      "remainingBudget": "₹3,00,000",
      "utilisation": "70.0%"
    }
  }
}
```

---

### 3.2 Department Planned vs Actual Variance
- **Endpoint:** `GET /api/analytics/department/:departmentId/planned-vs-actual`
- **Sample Item:**
```json
{
  "category": "Events",
  "allocated": 150000,
  "planned": 120000,
  "actual": 125000,
  "difference": 5000,
  "variancePercentage": 4.2,
  "status": "Attention",
  "formatted": {
    "planned": "₹1,20,000",
    "actual": "₹1,25,000",
    "difference": "₹5,000",
    "variancePercentage": "4.2%"
  }
}
```

---

## 4. Cost Optimisation Endpoints

- **Endpoint:** `GET /api/analytics/college/optimisation-insights`
- **Endpoint:** `GET /api/analytics/department/:departmentId/optimisation-insights`
- **Returns:**
  * Categorized rules triggered from real transactions
  * Severity (`CRITICAL`, `HIGH`, `WARNING`, `MEDIUM`, `INFO`)
  * Estimated identifiable savings in INR
  * Read-only AI advisory synthesis with safety guardrails.

---

## 5. Report Export Endpoints

- **College Export:** `GET /api/reports/college/export?format=pdf|excel|csv|json`
- **Department Export:** `GET /api/reports/department/:departmentId/export?format=pdf|excel|csv|json`
- **Response Headers for Files:**
  * `Content-Disposition: attachment; filename="<filename>"`
  * `Content-Type: text/csv` | `application/vnd.ms-excel` | `text/html`
