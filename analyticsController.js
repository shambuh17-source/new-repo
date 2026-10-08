/**
 * Analytics Controller
 * 
 * Exposes financial intelligence APIs for:
 * - College Admin Dashboard
 * - Department Admin Dashboard
 * - Variance Analysis
 * - Monthly Trends
 * - Category Breakdown
 * - Overspending Alerts
 * - Cost Optimisation Engine
 */

import { analyticsService } from "../services/analyticsService.js";
import { costOptimisationEngine } from "../services/costOptimisationEngine.js";

export const analyticsController = {
  // =========================================================================
  // COLLEGE ADMIN ENDPOINTS
  // =========================================================================

  /**
   * GET /api/analytics/college/overview
   * College-wide KPIs, budgets, expenditure, utilisation, alert counts
   */
  getCollegeOverview(req, res) {
    try {
      const data = analyticsService.getCollegeOverview(req.user);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(err.status || 500).json({ success: false, error: err.message });
    }
  },

  /**
   * GET /api/analytics/college/department-comparison
   * Department comparison table / matrix
   */
  getDepartmentComparison(req, res) {
    try {
      const data = analyticsService.getDepartmentComparisonMatrix(req.user);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(err.status || 500).json({ success: false, error: err.message });
    }
  },

  /**
   * GET /api/analytics/college/category-distribution
   * College-wide category expenditure breakdown (Pie/Donut chart)
   */
  getCollegeCategoryDistribution(req, res) {
    try {
      const data = analyticsService.getCategoryDistribution(null, req.user);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(err.status || 500).json({ success: false, error: err.message });
    }
  },

  /**
   * GET /api/analytics/college/monthly-trends
   * College-wide monthly expenditure trends (Line chart)
   */
  getCollegeMonthlyTrends(req, res) {
    try {
      const data = analyticsService.getMonthlySpendingTrends(null, req.user);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(err.status || 500).json({ success: false, error: err.message });
    }
  },

  /**
   * GET /api/analytics/college/planned-vs-actual
   * College-wide planned vs actual category variance
   */
  getCollegePlannedVsActual(req, res) {
    try {
      const data = analyticsService.getPlannedVsActualAnalysis(null, req.user);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(err.status || 500).json({ success: false, error: err.message });
    }
  },

  /**
   * GET /api/analytics/college/alerts
   * College-wide overspending and high-rate alerts
   */
  getCollegeAlerts(req, res) {
    try {
      const data = analyticsService.getOverspendingAlerts(null, req.user);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(err.status || 500).json({ success: false, error: err.message });
    }
  },

  /**
   * GET /api/analytics/college/optimisation-insights
   * College-wide cost optimisation recommendations & multi-dept synergies
   */
  getCollegeOptimisationInsights(req, res) {
    try {
      const data = costOptimisationEngine.generateRecommendations(null, req.user);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(err.status || 500).json({ success: false, error: err.message });
    }
  },

  // =========================================================================
  // DEPARTMENT ADMIN ENDPOINTS (Strictly Isolated by departmentId)
  // =========================================================================

  /**
   * GET /api/analytics/department/:departmentId/overview
   * Department KPIs, budgets, expenditure, utilisation, status
   */
  getDepartmentOverview(req, res) {
    try {
      const { departmentId } = req.params;
      const data = analyticsService.getDepartmentOverview(departmentId, req.user);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(err.status || 500).json({ success: false, error: err.message });
    }
  },

  /**
   * GET /api/analytics/department/:departmentId/planned-vs-actual
   * Planned vs actual category variance for this department
   */
  getDepartmentPlannedVsActual(req, res) {
    try {
      const { departmentId } = req.params;
      const data = analyticsService.getPlannedVsActualAnalysis(departmentId, req.user);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(err.status || 500).json({ success: false, error: err.message });
    }
  },

  /**
   * GET /api/analytics/department/:departmentId/monthly-trends
   * Department monthly spending trends & progression
   */
  getDepartmentMonthlyTrends(req, res) {
    try {
      const { departmentId } = req.params;
      const data = analyticsService.getMonthlySpendingTrends(departmentId, req.user);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(err.status || 500).json({ success: false, error: err.message });
    }
  },

  /**
   * GET /api/analytics/department/:departmentId/category-distribution
   * Department category breakdown (Pie/Donut chart)
   */
  getDepartmentCategoryDistribution(req, res) {
    try {
      const { departmentId } = req.params;
      const data = analyticsService.getCategoryDistribution(departmentId, req.user);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(err.status || 500).json({ success: false, error: err.message });
    }
  },

  /**
   * GET /api/analytics/department/:departmentId/alerts
   * Department-specific alerts (Warning, Overspent, Spike)
   */
  getDepartmentAlerts(req, res) {
    try {
      const { departmentId } = req.params;
      const data = analyticsService.getOverspendingAlerts(departmentId, req.user);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(err.status || 500).json({ success: false, error: err.message });
    }
  },

  /**
   * GET /api/analytics/department/:departmentId/optimisation-insights
   * Department-specific cost optimisation suggestions
   */
  getDepartmentOptimisationInsights(req, res) {
    try {
      const { departmentId } = req.params;
      const data = costOptimisationEngine.generateRecommendations(departmentId, req.user);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      return res.status(err.status || 500).json({ success: false, error: err.message });
    }
  }
};
