/**
 * Report Controller
 * Handles report generation and streaming downloads in JSON, CSV, Excel, and PDF HTML.
 */

import { reportService } from "../services/reportService.js";

export const reportController = {
  /**
   * GET /api/reports/college/export?format=csv|excel|pdf|json
   * College-wide financial report
   */
  exportCollegeReport(req, res) {
    try {
      const format = (req.query.format || "json").toLowerCase();
      const result = reportService.generateCollegeReport(req.user, format);

      if (format === "json") {
        return res.status(200).json({ success: true, report: result });
      }

      // Downloadable file responses
      res.setHeader("Content-Disposition", `attachment; filename="${result.filename}"`);
      res.setHeader("Content-Type", result.mimeType);
      return res.status(200).send(result.content);
    } catch (err) {
      return res.status(err.status || 500).json({ success: false, error: err.message });
    }
  },

  /**
   * GET /api/reports/department/:departmentId/export?format=csv|excel|pdf|json
   * Department-specific financial report
   */
  exportDepartmentReport(req, res) {
    try {
      const { departmentId } = req.params;
      const format = (req.query.format || "json").toLowerCase();
      const result = reportService.generateDepartmentReport(departmentId, req.user, format);

      if (format === "json") {
        return res.status(200).json({ success: true, report: result });
      }

      res.setHeader("Content-Disposition", `attachment; filename="${result.filename}"`);
      res.setHeader("Content-Type", result.mimeType);
      return res.status(200).send(result.content);
    } catch (err) {
      return res.status(err.status || 500).json({ success: false, error: err.message });
    }
  }
};
