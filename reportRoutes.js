/**
 * Report Routes
 * Exports college and departmental reports in CSV, Excel, PDF, and JSON.
 */

import express from "express";
import { reportController } from "../controllers/reportController.js";
import {
  authenticateUser,
  requireCollegeAdmin,
  requireDepartmentAccess
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateUser);

// College Admin Report Export
router.get("/college/export", requireCollegeAdmin, reportController.exportCollegeReport);

// Department Report Export
router.get("/department/:departmentId/export", requireDepartmentAccess, reportController.exportDepartmentReport);

export default router;
