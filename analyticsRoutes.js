/**
 * Analytics Routes
 * Mounts endpoints for College Admin and Department Admin.
 * Strictly guards multi-tenant isolation via authMiddleware.
 */

import express from "express";
import { analyticsController } from "../controllers/analyticsController.js";
import {
  authenticateUser,
  requireCollegeAdmin,
  requireDepartmentAccess
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply base authentication to all analytics endpoints
router.use(authenticateUser);

// =========================================================================
// COLLEGE ADMIN ROUTES (College-wide)
// =========================================================================
router.get("/college/overview", requireCollegeAdmin, analyticsController.getCollegeOverview);
router.get("/college/department-comparison", requireCollegeAdmin, analyticsController.getDepartmentComparison);
router.get("/college/category-distribution", requireCollegeAdmin, analyticsController.getCollegeCategoryDistribution);
router.get("/college/monthly-trends", requireCollegeAdmin, analyticsController.getCollegeMonthlyTrends);
router.get("/college/planned-vs-actual", requireCollegeAdmin, analyticsController.getCollegePlannedVsActual);
router.get("/college/alerts", requireCollegeAdmin, analyticsController.getCollegeAlerts);
router.get("/college/optimisation-insights", requireCollegeAdmin, analyticsController.getCollegeOptimisationInsights);

// =========================================================================
// DEPARTMENT ADMIN ROUTES (Strictly isolated by :departmentId)
// =========================================================================
router.get("/department/:departmentId/overview", requireDepartmentAccess, analyticsController.getDepartmentOverview);
router.get("/department/:departmentId/planned-vs-actual", requireDepartmentAccess, analyticsController.getDepartmentPlannedVsActual);
router.get("/department/:departmentId/monthly-trends", requireDepartmentAccess, analyticsController.getDepartmentMonthlyTrends);
router.get("/department/:departmentId/category-distribution", requireDepartmentAccess, analyticsController.getDepartmentCategoryDistribution);
router.get("/department/:departmentId/alerts", requireDepartmentAccess, analyticsController.getDepartmentAlerts);
router.get("/department/:departmentId/optimisation-insights", requireDepartmentAccess, analyticsController.getDepartmentOptimisationInsights);

export default router;
