/**
 * Analytics Service
 * 
 * Core financial intelligence calculations, KPI metrics, aggregations,
 * variance calculations, monthly trends, and department comparisons.
 * 
 * Enforces strict multi-tenant privacy:
 * - College Admin can view college-wide & any department.
 * - Department Admin can ONLY view its own department data.
 */

import {
  COLLEGE,
  DEPARTMENTS,
  BUDGETS,
  EXPENSES,
  BUDGET_REQUESTS,
  CATEGORIES
} from "../data/mockDb.js";

import {
  formatINR,
  formatINRCompact,
  formatPercent
} from "../utils/currencyFormatter.js";

import {
  calculateRemainingBudget,
  calculateUtilisation,
  calculateVariance,
  calculateVariancePercentage,
  getUtilisationStatus,
  STATUS_CONFIG
} from "../utils/financialMath.js";

// Palette for Category charts
const CATEGORY_COLORS = {
  Infrastructure: "#6366F1", // Indigo
  Equipment: "#3B82F6",      // Blue
  Laboratory: "#0EA5E9",     // Sky
  Software: "#10B981",       // Emerald
  Events: "#8B5CF6",         // Purple
  Maintenance: "#F59E0B",    // Amber
  Training: "#EC4899",       // Pink
  Research: "#14B8A6",       // Teal
  Travel: "#F97316",         // Orange
  Stationery: "#84CC16",     // Lime
  Utilities: "#06B6D4",      // Cyan
  Miscellaneous: "#64748B"   // Slate
};

export class AnalyticsService {
  constructor(db = { COLLEGE, DEPARTMENTS, BUDGETS, EXPENSES, BUDGET_REQUESTS, CATEGORIES }) {
    this.college = db.COLLEGE;
    this.departments = db.DEPARTMENTS;
    this.budgets = db.BUDGETS;
    this.expenses = db.EXPENSES;
    this.budgetRequests = db.BUDGET_REQUESTS;
    this.categories = db.CATEGORIES;
  }

  /**
   * Enforce backend multi-tenant access control
   */
  assertDepartmentAccess(user, requestedDeptId) {
    if (!user) {
      const err = new Error("Unauthorized: Authentication required");
      err.status = 401;
      throw err;
    }

    if (user.role === "COLLEGE_ADMIN") {
      return true; // College Admin can access any department in the college
    }

    if (user.role === "DEPARTMENT_ADMIN") {
      const reqId = Number(requestedDeptId);
      const userDeptId = Number(user.department_id);
      if (reqId !== userDeptId) {
        const err = new Error("403 Forbidden: Department Admin cannot access another department's financial data.");
        err.status = 403;
        throw err;
      }
      return true;
    }

    const err = new Error("403 Forbidden: Invalid role");
    err.status = 403;
    throw err;
  }

  /**
   * COLLEGE ADMIN: Get college-wide overview KPIs
   */
  getCollegeOverview(user) {
    if (user && user.role !== "COLLEGE_ADMIN") {
      const err = new Error("403 Forbidden: Only College Admin can view college-wide financial overview.");
      err.status = 403;
      throw err;
    }

    // Sum all allocated and planned budgets
    const totalAllocated = this.budgets
      .filter(b => b.status === "ACTIVE")
      .reduce((sum, b) => sum + (Number(b.allocated_amount) || 0), 0);

    const totalPlanned = this.budgets
      .filter(b => b.status === "ACTIVE")
      .reduce((sum, b) => sum + (Number(b.planned_amount) || 0), 0);

    // Sum all approved expenses
    const totalExpenditure = this.expenses
      .filter(e => e.approval_status === "APPROVED")
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    const remainingBudget = calculateRemainingBudget(totalAllocated, totalExpenditure);
    const overallUtilisation = calculateUtilisation(totalExpenditure, totalAllocated);
    const overallStatus = getUtilisationStatus(overallUtilisation);

    // Department-level classifications
    const deptSummaries = this.getDepartmentComparisonMatrix(user);
    const nearLimitCount = deptSummaries.filter(d => d.utilisation >= 85 && d.utilisation <= 100).length;
    const overspentCount = deptSummaries.filter(d => d.utilisation > 100).length;
    const attentionCount = deptSummaries.filter(d => d.utilisation >= 70 && d.utilisation < 85).length;
    const healthyCount = deptSummaries.filter(d => d.utilisation < 70).length;

    // Pending budget requests
    const pendingRequests = this.budgetRequests.filter(r => r.status === "PENDING");
    const pendingRequestsCount = pendingRequests.length;
    const pendingRequestsAmount = pendingRequests.reduce((sum, r) => sum + (Number(r.requested_amount) || 0), 0);

    return {
      college: {
        id: this.college.id,
        name: this.college.name,
        code: this.college.code,
        financialYear: this.college.financial_year,
        currency: this.college.currency
      },
      kpi: {
        totalBudget: totalAllocated,
        budgetAllocated: totalAllocated,
        totalPlanned,
        totalExpenditure,
        remainingBudget,
        overallUtilisation,
        status: overallStatus,
        departmentCount: this.departments.length,
        healthyCount,
        attentionCount,
        nearLimitCount,
        overspentCount,
        pendingRequestsCount,
        pendingRequestsAmount
      },
      formatted: {
        totalBudget: formatINR(totalAllocated),
        totalExpenditure: formatINR(totalExpenditure),
        remainingBudget: formatINR(remainingBudget),
        totalPlanned: formatINR(totalPlanned),
        overallUtilisation: formatPercent(overallUtilisation),
        pendingRequestsAmount: formatINR(pendingRequestsAmount),
        compactTotalBudget: formatINRCompact(totalAllocated),
        compactTotalExpenditure: formatINRCompact(totalExpenditure),
        compactRemainingBudget: formatINRCompact(remainingBudget)
      }
    };
  }

  /**
   * COLLEGE ADMIN: Get department comparison table / matrix
   */
  getDepartmentComparisonMatrix(user) {
    if (user && user.role !== "COLLEGE_ADMIN") {
      const err = new Error("403 Forbidden: Department Admins cannot access department comparison data.");
      err.status = 403;
      throw err;
    }

    return this.departments.map(dept => {
      const deptBudgets = this.budgets.filter(b => b.department_id === dept.id && b.status === "ACTIVE");
      const allocated = deptBudgets.reduce((sum, b) => sum + (Number(b.allocated_amount) || 0), 0);
      const planned = deptBudgets.reduce((sum, b) => sum + (Number(b.planned_amount) || 0), 0);

      const deptExpenses = this.expenses.filter(e => e.department_id === dept.id && e.approval_status === "APPROVED");
      const spent = deptExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

      const remaining = calculateRemainingBudget(allocated, spent);
      const utilisation = calculateUtilisation(spent, allocated);
      const status = getUtilisationStatus(utilisation);
      const variance = calculateVariance(spent, planned);

      const pendingReqs = this.budgetRequests.filter(r => r.department_id === dept.id && r.status === "PENDING");

      return {
        departmentId: dept.id,
        code: dept.code,
        name: dept.name,
        head: dept.head,
        allocated,
        planned,
        spent,
        remaining,
        utilisation,
        variance,
        status: status.code,
        statusLabel: status.label,
        statusIcon: status.icon,
        statusColor: status.color,
        statusBgClass: status.bgClass,
        pendingRequestsCount: pendingReqs.length,
        formatted: {
          allocated: formatINR(allocated),
          spent: formatINR(spent),
          remaining: formatINR(remaining),
          planned: formatINR(planned),
          utilisation: formatPercent(utilisation),
          variance: formatINR(variance),
          compactAllocated: formatINRCompact(allocated),
          compactSpent: formatINRCompact(spent),
          compactRemaining: formatINRCompact(remaining)
        }
      };
    }).sort((a, b) => b.utilisation - a.utilisation); // Default sort: highest utilisation first
  }

  /**
   * DEPARTMENT ADMIN & COLLEGE ADMIN: Get department-specific overview KPIs
   */
  getDepartmentOverview(departmentId, user) {
    const deptId = Number(departmentId);
    if (user) {
      this.assertDepartmentAccess(user, deptId);
    }

    const dept = this.departments.find(d => d.id === deptId);
    if (!dept) {
      const err = new Error(`Department with ID ${deptId} not found`);
      err.status = 404;
      throw err;
    }

    const deptBudgets = this.budgets.filter(b => b.department_id === deptId && b.status === "ACTIVE");
    const allocated = deptBudgets.reduce((sum, b) => sum + (Number(b.allocated_amount) || 0), 0);
    const planned = deptBudgets.reduce((sum, b) => sum + (Number(b.planned_amount) || 0), 0);

    const deptExpenses = this.expenses.filter(e => e.department_id === deptId && e.approval_status === "APPROVED");
    const spent = deptExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    const remaining = calculateRemainingBudget(allocated, spent);
    const utilisation = calculateUtilisation(spent, allocated);
    const variance = calculateVariance(spent, planned);
    const variancePct = calculateVariancePercentage(spent, planned);
    const status = getUtilisationStatus(utilisation);

    const pendingRequests = this.budgetRequests.filter(r => r.department_id === deptId && r.status === "PENDING");
    const pendingAmount = pendingRequests.reduce((sum, r) => sum + (Number(r.requested_amount) || 0), 0);

    return {
      department: {
        id: dept.id,
        code: dept.code,
        name: dept.name,
        head: dept.head
      },
      kpi: {
        allocatedBudget: allocated,
        plannedExpenditure: planned,
        actualExpenditure: spent,
        remainingBudget: remaining,
        utilisation,
        variance,
        variancePercentage: variancePct,
        status: status.code,
        statusLabel: status.label,
        statusIcon: status.icon,
        statusColor: status.color,
        statusBgClass: status.bgClass,
        pendingRequestsCount: pendingRequests.length,
        pendingRequestsAmount: pendingAmount
      },
      formatted: {
        allocatedBudget: formatINR(allocated),
        plannedExpenditure: formatINR(planned),
        actualExpenditure: formatINR(spent),
        remainingBudget: formatINR(remaining),
        utilisation: formatPercent(utilisation),
        variance: formatINR(variance),
        variancePercentage: formatPercent(variancePct),
        pendingRequestsAmount: formatINR(pendingAmount),
        compactAllocated: formatINRCompact(allocated),
        compactSpent: formatINRCompact(spent),
        compactRemaining: formatINRCompact(remaining)
      }
    };
  }

  /**
   * PLANNED VS ACTUAL ANALYSIS (Department or College aggregate)
   */
  getPlannedVsActualAnalysis(departmentId = null, user = null) {
    if (departmentId !== null && user) {
      this.assertDepartmentAccess(user, departmentId);
    } else if (departmentId === null && user && user.role !== "COLLEGE_ADMIN") {
      const err = new Error("403 Forbidden: Only College Admin can view college-wide planned vs actual analysis.");
      err.status = 403;
      throw err;
    }

    const deptId = departmentId !== null ? Number(departmentId) : null;

    // Filter budgets and expenses
    const filteredBudgets = deptId !== null
      ? this.budgets.filter(b => b.department_id === deptId && b.status === "ACTIVE")
      : this.budgets.filter(b => b.status === "ACTIVE");

    const filteredExpenses = deptId !== null
      ? this.expenses.filter(e => e.department_id === deptId && e.approval_status === "APPROVED")
      : this.expenses.filter(e => e.approval_status === "APPROVED");

    // Aggregate by category
    const categoryMap = {};

    filteredBudgets.forEach(b => {
      const cat = b.category || "Miscellaneous";
      if (!categoryMap[cat]) {
        categoryMap[cat] = { planned: 0, allocated: 0, actual: 0 };
      }
      categoryMap[cat].planned += Number(b.planned_amount) || 0;
      categoryMap[cat].allocated += Number(b.allocated_amount) || 0;
    });

    filteredExpenses.forEach(e => {
      const cat = e.category || "Miscellaneous";
      if (!categoryMap[cat]) {
        categoryMap[cat] = { planned: 0, allocated: 0, actual: 0 };
      }
      categoryMap[cat].actual += Number(e.amount) || 0;
    });

    // Build tabular / chart list
    const result = Object.entries(categoryMap).map(([category, data]) => {
      const planned = data.planned;
      const actual = data.actual;
      const allocated = data.allocated;
      const difference = calculateVariance(actual, planned);
      const diffPct = calculateVariancePercentage(actual, planned);

      // Section 10 Status tag: "Good" if within planned, "Attention" if slight overrun, "High" if > 15% overrun
      let statusTag = "Good";
      let statusColor = "#10B981";
      if (diffPct > 15) {
        statusTag = "High";
        statusColor = "#EF4444";
      } else if (diffPct > 0) {
        statusTag = "Attention";
        statusColor = "#F59E0B";
      }

      return {
        category,
        allocated,
        planned,
        actual,
        difference, // actual - planned
        variancePercentage: diffPct,
        status: statusTag,
        statusColor,
        formatted: {
          allocated: formatINR(allocated),
          planned: formatINR(planned),
          actual: formatINR(actual),
          difference: formatINR(difference),
          variancePercentage: formatPercent(diffPct),
          compactPlanned: formatINRCompact(planned),
          compactActual: formatINRCompact(actual)
        }
      };
    }).sort((a, b) => b.difference - a.difference);

    return result;
  }

  /**
   * MONTHLY SPENDING TRENDS (Department or College aggregate)
   * Builds 12-month or date-bound progression with monthly & cumulative points
   */
  getMonthlySpendingTrends(departmentId = null, user = null) {
    if (departmentId !== null && user) {
      this.assertDepartmentAccess(user, departmentId);
    } else if (departmentId === null && user && user.role !== "COLLEGE_ADMIN") {
      const err = new Error("403 Forbidden: Only College Admin can view college-wide monthly spending trends.");
      err.status = 403;
      throw err;
    }

    const deptId = departmentId !== null ? Number(departmentId) : null;

    const filteredExpenses = deptId !== null
      ? this.expenses.filter(e => e.department_id === deptId && e.approval_status === "APPROVED")
      : this.expenses.filter(e => e.approval_status === "APPROVED");

    const filteredBudgets = deptId !== null
      ? this.budgets.filter(b => b.department_id === deptId && b.status === "ACTIVE")
      : this.budgets.filter(b => b.status === "ACTIVE");

    const totalPlannedAnnual = filteredBudgets.reduce((sum, b) => sum + (Number(b.planned_amount) || 0), 0);
    const monthlyPlannedBaseline = Math.round(totalPlannedAnnual / 12);

    // Standard fiscal months for Indian FY (Apr 2024 to Mar 2025)
    const fiscalMonths = [
      { key: "2024-04", label: "Apr 2024" },
      { key: "2024-05", label: "May 2024" },
      { key: "2024-06", label: "Jun 2024" },
      { key: "2024-07", label: "Jul 2024" },
      { key: "2024-08", label: "Aug 2024" },
      { key: "2024-09", label: "Sep 2024" },
      { key: "2024-10", label: "Oct 2024" },
      { key: "2024-11", label: "Nov 2024" },
      { key: "2024-12", label: "Dec 2024" },
      { key: "2025-01", label: "Jan 2025" },
      { key: "2025-02", label: "Feb 2025" },
      { key: "2025-03", label: "Mar 2025" }
    ];

    // Bucket expenses by month
    const monthExpensesMap = {};
    fiscalMonths.forEach(m => {
      monthExpensesMap[m.key] = 0;
    });

    filteredExpenses.forEach(e => {
      const ym = e.date ? e.date.substring(0, 7) : "";
      if (monthExpensesMap[ym] !== undefined) {
        monthExpensesMap[ym] += Number(e.amount) || 0;
      }
    });

    let cumulativeActual = 0;
    let cumulativePlanned = 0;

    const trends = fiscalMonths.map(m => {
      const monthActual = monthExpensesMap[m.key] || 0;
      cumulativeActual += monthActual;
      cumulativePlanned += monthlyPlannedBaseline;

      return {
        monthKey: m.key,
        month: m.label,
        actual: monthActual,
        planned: monthlyPlannedBaseline,
        cumulativeActual,
        cumulativePlanned,
        formattedActual: formatINR(monthActual),
        formattedPlanned: formatINR(monthlyPlannedBaseline),
        formattedCumulativeActual: formatINR(cumulativeActual)
      };
    });

    return trends;
  }

  /**
   * CATEGORY DISTRIBUTION (Pie/Donut Chart data)
   */
  getCategoryDistribution(departmentId = null, user = null) {
    if (departmentId !== null && user) {
      this.assertDepartmentAccess(user, departmentId);
    } else if (departmentId === null && user && user.role !== "COLLEGE_ADMIN") {
      const err = new Error("403 Forbidden: Only College Admin can view college-wide category distribution.");
      err.status = 403;
      throw err;
    }

    const deptId = departmentId !== null ? Number(departmentId) : null;

    const filteredExpenses = deptId !== null
      ? this.expenses.filter(e => e.department_id === deptId && e.approval_status === "APPROVED")
      : this.expenses.filter(e => e.approval_status === "APPROVED");

    const totalSpent = filteredExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    const catSpend = {};
    filteredExpenses.forEach(e => {
      const cat = e.category || "Miscellaneous";
      catSpend[cat] = (catSpend[cat] || 0) + (Number(e.amount) || 0);
    });

    const distribution = Object.entries(catSpend).map(([category, amount]) => {
      const percentage = totalSpent > 0 ? Math.round((amount / totalSpent) * 1000) / 10 : 0;
      return {
        name: category,
        value: amount,
        percentage,
        color: CATEGORY_COLORS[category] || "#64748B",
        formattedValue: formatINR(amount)
      };
    }).sort((a, b) => b.value - a.value);

    return {
      totalSpent,
      formattedTotalSpent: formatINR(totalSpent),
      distribution
    };
  }

  /**
   * OVERSPENDING & UTILISATION ALERTS SYSTEM
   * Implements Section 9 status rules and triggers specific warnings
   */
  getOverspendingAlerts(departmentId = null, user = null) {
    if (departmentId !== null && user) {
      this.assertDepartmentAccess(user, departmentId);
    }

    const alerts = [];
    const deptsToCheck = departmentId !== null
      ? this.departments.filter(d => d.id === Number(departmentId))
      : this.departments;

    deptsToCheck.forEach(dept => {
      const deptBudgets = this.budgets.filter(b => b.department_id === dept.id && b.status === "ACTIVE");
      const allocated = deptBudgets.reduce((sum, b) => sum + (Number(b.allocated_amount) || 0), 0);
      const planned = deptBudgets.reduce((sum, b) => sum + (Number(b.planned_amount) || 0), 0);

      const deptExpenses = this.expenses.filter(e => e.department_id === dept.id && e.approval_status === "APPROVED");
      const spent = deptExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

      const utilisation = calculateUtilisation(spent, allocated);
      const overspentAmount = spent - allocated;

      // 🔴 Overspent (> 100%)
      if (utilisation > 100) {
        alerts.push({
          id: `alert-overspent-${dept.id}`,
          departmentId: dept.id,
          departmentCode: dept.code,
          departmentName: dept.name,
          type: "BUDGET_OVERSPENT",
          severity: "CRITICAL",
          statusBadge: STATUS_CONFIG.OVERSPENT,
          title: "🔴 BUDGET OVERSPENT",
          allocated,
          spent,
          overspentAmount,
          utilisation,
          formattedAllocated: formatINR(allocated),
          formattedSpent: formatINR(spent),
          formattedOverspent: formatINR(overspentAmount),
          message: `Department ${dept.name} has exceeded allocated budget by ${formatINR(overspentAmount)} (${formatPercent(utilisation)} utilised).`,
          recommendedAction: "Review non-essential expenditure and submit a budget adjustment request immediately."
        });
      }
      // 🟠 Warning (85% - 100%)
      else if (utilisation >= 85) {
        const remaining = allocated - spent;
        alerts.push({
          id: `alert-warning-${dept.id}`,
          departmentId: dept.id,
          departmentCode: dept.code,
          departmentName: dept.name,
          type: "BUDGET_WARNING",
          severity: "WARNING",
          statusBadge: STATUS_CONFIG.WARNING,
          title: "🟠 BUDGET WARNING",
          allocated,
          spent,
          remaining,
          utilisation,
          formattedAllocated: formatINR(allocated),
          formattedSpent: formatINR(spent),
          formattedRemaining: formatINR(remaining),
          message: `${formatPercent(utilisation)} of the allocated budget has already been utilised. Remaining funds: ${formatINR(remaining)}.`,
          recommendedAction: "Freeze discretionary expenses and prioritize mandatory academic and laboratory needs."
        });
      }
      // 🟡 Attention (70% - 85%)
      else if (utilisation >= 70) {
        alerts.push({
          id: `alert-attention-${dept.id}`,
          departmentId: dept.id,
          departmentCode: dept.code,
          departmentName: dept.name,
          type: "BUDGET_ATTENTION",
          severity: "ATTENTION",
          statusBadge: STATUS_CONFIG.ATTENTION,
          title: "🟡 BUDGET ATTENTION",
          allocated,
          spent,
          utilisation,
          formattedAllocated: formatINR(allocated),
          formattedSpent: formatINR(spent),
          message: `Budget utilisation is at ${formatPercent(utilisation)}. Expenditure rate is progressing ahead of median expectations.`,
          recommendedAction: "Monitor month-end procurement batches and track variance against category caps."
        });
      }

      // Check for High Category Spending Rate
      const catAnalysis = this.getPlannedVsActualAnalysis(dept.id, null);
      catAnalysis.forEach(cat => {
        if (cat.difference > 0 && cat.variancePercentage >= 20) {
          alerts.push({
            id: `alert-cat-spike-${dept.id}-${cat.category.toLowerCase()}`,
            departmentId: dept.id,
            departmentCode: dept.code,
            departmentName: dept.name,
            category: cat.category,
            type: "CATEGORY_OVERRUN",
            severity: "HIGH",
            title: "🔵 UNUSUAL SPENDING DETECTED",
            message: `A significant increase in expenditure was detected in the ${cat.category} category (+${formatPercent(cat.variancePercentage)} vs planned).`,
            formattedDifference: formatINR(cat.difference),
            recommendedAction: `Perform vendor rate card audit for ${cat.category} and require pre-approval for transactions over ₹25,000.`
          });
        }
      });
    });

    return alerts;
  }
}

export const analyticsService = new AnalyticsService();
