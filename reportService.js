/**
 * Report Service
 * 
 * Compiles comprehensive financial reports for College and Department levels.
 * Generates export payloads for JSON, CSV, Excel, and Printable PDF HTML.
 * Enforces strict role-based access control.
 */

import { analyticsService } from "./analyticsService.js";
import { costOptimisationEngine } from "./costOptimisationEngine.js";
import {
  generateCsv,
  generateExcelHtml,
  generatePrintableHtml
} from "../utils/exportGenerators.js";

import {
  formatINR,
  formatPercent
} from "../utils/currencyFormatter.js";

export class ReportService {
  constructor(analytics = analyticsService, optimisation = costOptimisationEngine) {
    this.analytics = analytics;
    this.optimisation = optimisation;
  }

  /**
   * COLLEGE REPORT: Generates full college-level financial report
   * @param {object} user - Authenticated user context
   * @param {string} format - "json" | "csv" | "excel" | "pdf" | "html"
   */
  generateCollegeReport(user, format = "json") {
    if (user && user.role !== "COLLEGE_ADMIN") {
      const err = new Error("403 Forbidden: Only College Admin can generate college-wide reports.");
      err.status = 403;
      throw err;
    }

    const overview = this.analytics.getCollegeOverview(user);
    const departments = this.analytics.getDepartmentComparisonMatrix(user);
    const plannedVsActual = this.analytics.getPlannedVsActualAnalysis(null, user);
    const alerts = this.analytics.getOverspendingAlerts(null, user);
    const optResult = this.optimisation.generateRecommendations(null, user);

    const reportData = {
      type: "COLLEGE_REPORT",
      title: `${overview.college.name} - Annual Financial Budget Report`,
      subtitle: `Comprehensive College-Wide Financial Utilisation & Optimisation Audit`,
      financialYear: overview.college.financialYear,
      generatedAt: new Date().toISOString(),
      generatedAtFormatted: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      kpis: {
        allocated: overview.formatted.totalBudget,
        planned: overview.formatted.totalPlanned,
        spent: overview.formatted.totalExpenditure,
        remaining: overview.formatted.remainingBudget,
        remainingRaw: overview.kpi.remainingBudget,
        utilisation: overview.formatted.overallUtilisation,
        status: overview.kpi.status.label,
        departmentsTotal: overview.kpi.departmentCount,
        nearLimitCount: overview.kpi.nearLimitCount,
        overspentCount: overview.kpi.overspentCount
      },
      departments,
      plannedVsActual,
      alerts,
      recommendations: optResult.recommendations
    };

    if (format === "csv") {
      // Export department summary as main CSV
      const columns = [
        { key: "code", label: "Department Code" },
        { key: "name", label: "Department Name" },
        { key: "head", label: "Head of Dept" },
        { key: "allocatedINR", label: "Allocated (INR)" },
        { key: "spentINR", label: "Actual Spent (INR)" },
        { key: "remainingINR", label: "Remaining (INR)" },
        { key: "utilisationPct", label: "Utilisation %" },
        { key: "status", label: "Status" }
      ];

      const rows = departments.map(d => ({
        code: d.code,
        name: d.name,
        head: d.head,
        allocatedINR: d.allocated,
        spentINR: d.spent,
        remainingINR: d.remaining,
        utilisationPct: `${d.utilisation}%`,
        status: d.status
      }));

      return {
        filename: `college_budget_report_${Date.now()}.csv`,
        mimeType: "text/csv",
        content: generateCsv(rows, columns)
      };
    }

    if (format === "excel") {
      const sections = [
        {
          title: "1. Department Budget Allocations & Utilisation",
          columns: [
            { key: "code", label: "Dept Code" },
            { key: "name", label: "Department" },
            { key: "allocated", label: "Allocated Budget" },
            { key: "spent", label: "Actual Spent" },
            { key: "remaining", label: "Remaining Budget" },
            { key: "utilisation", label: "Utilisation %" },
            { key: "status", label: "Status" }
          ],
          rows: departments.map(d => ({
            code: d.code,
            name: d.name,
            allocated: d.formatted.allocated,
            spent: d.formatted.spent,
            remaining: d.formatted.remaining,
            utilisation: d.formatted.utilisation,
            status: d.status
          }))
        },
        {
          title: "2. Planned vs Actual Category Variance",
          columns: [
            { key: "category", label: "Category" },
            { key: "planned", label: "Planned Amount" },
            { key: "actual", label: "Actual Spent" },
            { key: "difference", label: "Variance" },
            { key: "variancePercentage", label: "Variance %" },
            { key: "status", label: "Status" }
          ],
          rows: plannedVsActual.map(p => ({
            category: p.category,
            planned: p.formatted.planned,
            actual: p.formatted.actual,
            difference: p.formatted.difference,
            variancePercentage: p.formatted.variancePercentage,
            status: p.status
          }))
        },
        {
          title: "3. Cost Optimisation Recommendations",
          columns: [
            { key: "severity", label: "Severity" },
            { key: "department", label: "Target" },
            { key: "title", label: "Finding" },
            { key: "recommendation", label: "Action Plan" }
          ],
          rows: optResult.recommendations.map(r => ({
            severity: r.severity,
            department: r.departmentCode || "COLLEGE",
            title: r.title,
            recommendation: r.actionableRecommendation
          }))
        }
      ];

      return {
        filename: `college_budget_report_${Date.now()}.xls`,
        mimeType: "application/vnd.ms-excel",
        content: generateExcelHtml(sections, reportData.title)
      };
    }

    if (format === "pdf" || format === "html") {
      return {
        filename: `college_budget_report_${Date.now()}.html`,
        mimeType: "text/html",
        content: generatePrintableHtml(reportData)
      };
    }

    // Default JSON
    return reportData;
  }

  /**
   * DEPARTMENT REPORT: Generates department-specific report
   * Strictly verifies tenant permissions
   */
  generateDepartmentReport(departmentId, user, format = "json") {
    const deptId = Number(departmentId);
    if (user) {
      this.analytics.assertDepartmentAccess(user, deptId);
    }

    const overview = this.analytics.getDepartmentOverview(deptId, user);
    const plannedVsActual = this.analytics.getPlannedVsActualAnalysis(deptId, user);
    const monthlyTrends = this.analytics.getMonthlySpendingTrends(deptId, user);
    const alerts = this.analytics.getOverspendingAlerts(deptId, user);
    const optResult = this.optimisation.generateRecommendations(deptId, user);

    const reportData = {
      type: "DEPARTMENT_REPORT",
      departmentId: deptId,
      departmentCode: overview.department.code,
      departmentName: overview.department.name,
      title: `${overview.department.name} - Departmental Budget Report`,
      subtitle: `Financial Performance, Variance Tracking & Expenditure Optimisation`,
      financialYear: "2024-2025",
      generatedAt: new Date().toISOString(),
      generatedAtFormatted: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      kpis: {
        allocated: overview.formatted.allocatedBudget,
        planned: overview.formatted.plannedExpenditure,
        spent: overview.formatted.actualExpenditure,
        remaining: overview.formatted.remainingBudget,
        remainingRaw: overview.kpi.remainingBudget,
        utilisation: overview.formatted.utilisation,
        status: overview.kpi.statusLabel,
        variance: overview.formatted.variance
      },
      plannedVsActual,
      monthlyTrends,
      alerts,
      recommendations: optResult.recommendations
    };

    if (format === "csv") {
      const columns = [
        { key: "category", label: "Category" },
        { key: "planned", label: "Planned (INR)" },
        { key: "actual", label: "Actual (INR)" },
        { key: "variance", label: "Variance (INR)" },
        { key: "variancePct", label: "Variance %" },
        { key: "status", label: "Status" }
      ];

      const rows = plannedVsActual.map(p => ({
        category: p.category,
        planned: p.planned,
        actual: p.actual,
        variance: p.difference,
        variancePct: `${p.variancePercentage}%`,
        status: p.status
      }));

      return {
        filename: `${overview.department.code.toLowerCase()}_budget_report_${Date.now()}.csv`,
        mimeType: "text/csv",
        content: generateCsv(rows, columns)
      };
    }

    if (format === "excel") {
      const sections = [
        {
          title: "1. Planned vs Actual Category Breakdown",
          columns: [
            { key: "category", label: "Category" },
            { key: "planned", label: "Planned Amount" },
            { key: "actual", label: "Actual Spent" },
            { key: "difference", label: "Variance" },
            { key: "variancePercentage", label: "Variance %" },
            { key: "status", label: "Status" }
          ],
          rows: plannedVsActual.map(p => ({
            category: p.category,
            planned: p.formatted.planned,
            actual: p.formatted.actual,
            difference: p.formatted.difference,
            variancePercentage: p.formatted.variancePercentage,
            status: p.status
          }))
        },
        {
          title: "2. Monthly Expenditure Progression",
          columns: [
            { key: "month", label: "Month" },
            { key: "actual", label: "Actual Spent" },
            { key: "planned", label: "Baseline Planned" },
            { key: "cumulativeActual", label: "Cumulative Actual" }
          ],
          rows: monthlyTrends.map(m => ({
            month: m.month,
            actual: m.formattedActual,
            planned: m.formattedPlanned,
            cumulativeActual: m.formattedCumulativeActual
          }))
        },
        {
          title: "3. Actionable Cost Optimisation Recommendations",
          columns: [
            { key: "severity", label: "Severity" },
            { key: "category", label: "Category" },
            { key: "title", label: "Recommendation" },
            { key: "action", label: "Action Item" }
          ],
          rows: optResult.recommendations.map(r => ({
            severity: r.severity,
            category: r.category,
            title: r.title,
            action: r.actionableRecommendation
          }))
        }
      ];

      return {
        filename: `${overview.department.code.toLowerCase()}_budget_report_${Date.now()}.xls`,
        mimeType: "application/vnd.ms-excel",
        content: generateExcelHtml(sections, reportData.title)
      };
    }

    if (format === "pdf" || format === "html") {
      return {
        filename: `${overview.department.code.toLowerCase()}_budget_report_${Date.now()}.html`,
        mimeType: "text/html",
        content: generatePrintableHtml(reportData)
      };
    }

    return reportData;
  }
}

export const reportService = new ReportService();
