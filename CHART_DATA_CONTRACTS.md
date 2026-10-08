# Chart Data Contracts for Frontend Developer (Member 1)

This document specifies the exact JSON schemas and props required by the Recharts visualization components built by Member 4.

---

## 1. Budget vs Actual Bar Chart (`BudgetVsActualBarChart.jsx`)

**Purpose:** Grouped dual-bar comparison of Planned Budget vs Actual Expenditure across categories.

### Data Contract (`Array<CategoryVarianceItem>`):
```typescript
interface CategoryVarianceItem {
  category: string;             // Category name (e.g. "Equipment", "Software")
  allocated: number;            // Total sanctioned allocation in INR
  planned: number;              // Target planned expenditure in INR
  actual: number;               // Actual approved spending in INR
  difference: number;           // actual - planned (+ is overrun, - is savings)
  variancePercentage: number;   // ((actual - planned) / planned) * 100
  status: "Good" | "Attention" | "High";
  statusColor: string;          // Hex color
  formatted: {
    allocated: string;          // "₹3,00,000"
    planned: string;            // "₹2,50,000"
    actual: string;             // "₹2,10,000"
    difference: string;         // "-₹40,000"
    variancePercentage: string; // "-16.0%"
  };
}
```

---

## 2. Monthly Spending Trends Line Chart (`MonthlyExpenditureLineChart.jsx`)

**Purpose:** 12-month fiscal curve showing spending velocity with toggle between Monthly and Cumulative views.

### Data Contract (`Array<MonthlyTrendItem>`):
```typescript
interface MonthlyTrendItem {
  monthKey: string;             // "2024-04"
  month: string;                // "Apr 2024"
  actual: number;               // Spending in this specific month
  planned: number;              // Target monthly planned baseline
  cumulativeActual: number;     // Running total of actual spending
  cumulativePlanned: number;    // Running total of planned target
  formattedActual: string;      // "₹2,10,000"
  formattedPlanned: string;     // "₹70,833"
  formattedCumulativeActual: string;
}
```

---

## 3. Category Distribution Donut Chart (`CategoryDistributionDonutChart.jsx`)

**Purpose:** Proportionate breakdown of college or department expenditure with percentage callouts.

### Data Contract:
```typescript
interface CategoryDistributionResponse {
  totalSpent: number;
  formattedTotalSpent: string;  // "₹7,00,000"
  distribution: Array<{
    name: string;               // Category name
    value: number;              // Amount in INR
    percentage: number;         // e.g. 30.0 (meaning 30%)
    color: string;              // Hex color
    formattedValue: string;     // "₹2,10,000"
  }>;
}
```

---

## 4. Department Utilisation Bar Chart (`DepartmentUtilisationBarChart.jsx`)

**Purpose:** College Admin comparative horizontal ranking with 85% Warning and 100% Limit reference lines.

### Data Contract (`Array<DepartmentComparisonItem>`):
```typescript
interface DepartmentComparisonItem {
  departmentId: number;
  code: string;                 // "CSE", "ECE", "ME", etc.
  name: string;                 // "Mechanical Engineering"
  head: string;                 // "Dr. Raghavendra Rao"
  allocated: number;            // 600000
  spent: number;                // 630000
  remaining: number;            // -30000
  utilisation: number;          // 105.0
  status: "HEALTHY" | "ATTENTION" | "WARNING" | "OVERSPENT";
  statusColor: string;          // "#EF4444"
  formatted: {
    allocated: string;          // "₹6,00,000"
    spent: string;              // "₹6,30,000"
    remaining: string;          // "-₹30,000"
    utilisation: string;        // "105.0%"
  };
}
```

---

## 5. Budget Utilisation Radial Gauge (`RemainingBudgetChart.jsx`)

**Purpose:** Semi-circle radial dial for department dashboard KPI header.

### Props:
```typescript
interface RemainingBudgetChartProps {
  allocated: number;            // e.g. 1000000
  spent: number;                // e.g. 700000
  remaining: number;            // e.g. 300000
  utilisation: number;          // e.g. 70.0
  status: "HEALTHY" | "ATTENTION" | "WARNING" | "OVERSPENT";
}
```
