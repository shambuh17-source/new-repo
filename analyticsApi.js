/**
 * Frontend Analytics API Client
 * Used by Member 1 (Frontend) to consume analytics and report endpoints.
 * Handles Indian currency formatting, auth headers, and response parsing.
 */

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || "/api";

export const analyticsApi = {
  // =========================================================================
  // COLLEGE ADMIN ANALYTICS
  // =========================================================================

  async getCollegeOverview() {
    const res = await fetch(`${API_BASE_URL}/analytics/college/overview`, { credentials: "include" });
    if (!res.ok) throw new Error(`Failed to fetch college overview: ${res.statusText}`);
    const json = await res.json();
    return json.data;
  },

  async getDepartmentComparison() {
    const res = await fetch(`${API_BASE_URL}/analytics/college/department-comparison`, { credentials: "include" });
    if (!res.ok) throw new Error(`Failed to fetch department comparison: ${res.statusText}`);
    const json = await res.json();
    return json.data;
  },

  async getCollegeCategoryDistribution() {
    const res = await fetch(`${API_BASE_URL}/analytics/college/category-distribution`, { credentials: "include" });
    if (!res.ok) throw new Error(`Failed to fetch college category distribution: ${res.statusText}`);
    const json = await res.json();
    return json.data;
  },

  async getCollegeMonthlyTrends() {
    const res = await fetch(`${API_BASE_URL}/analytics/college/monthly-trends`, { credentials: "include" });
    if (!res.ok) throw new Error(`Failed to fetch monthly trends: ${res.statusText}`);
    const json = await res.json();
    return json.data;
  },

  async getCollegePlannedVsActual() {
    const res = await fetch(`${API_BASE_URL}/analytics/college/planned-vs-actual`, { credentials: "include" });
    if (!res.ok) throw new Error(`Failed to fetch college planned vs actual: ${res.statusText}`);
    const json = await res.json();
    return json.data;
  },

  async getCollegeAlerts() {
    const res = await fetch(`${API_BASE_URL}/analytics/college/alerts`, { credentials: "include" });
    if (!res.ok) throw new Error(`Failed to fetch college alerts: ${res.statusText}`);
    const json = await res.json();
    return json.data;
  },

  async getCollegeOptimisationInsights() {
    const res = await fetch(`${API_BASE_URL}/analytics/college/optimisation-insights`, { credentials: "include" });
    if (!res.ok) throw new Error(`Failed to fetch optimisation insights: ${res.statusText}`);
    const json = await res.json();
    return json.data;
  },

  // =========================================================================
  // DEPARTMENT ADMIN ANALYTICS (Isolated by departmentId)
  // =========================================================================

  async getDepartmentOverview(deptId) {
    const res = await fetch(`${API_BASE_URL}/analytics/department/${deptId}/overview`, { credentials: "include" });
    if (!res.ok) {
      if (res.status === 403) throw new Error("403 Forbidden: You do not have permission to view another department.");
      throw new Error(`Failed to fetch department overview: ${res.statusText}`);
    }
    const json = await res.json();
    return json.data;
  },

  async getDepartmentPlannedVsActual(deptId) {
    const res = await fetch(`${API_BASE_URL}/analytics/department/${deptId}/planned-vs-actual`, { credentials: "include" });
    if (!res.ok) throw new Error(`Failed to fetch planned vs actual: ${res.statusText}`);
    const json = await res.json();
    return json.data;
  },

  async getDepartmentMonthlyTrends(deptId) {
    const res = await fetch(`${API_BASE_URL}/analytics/department/${deptId}/monthly-trends`, { credentials: "include" });
    if (!res.ok) throw new Error(`Failed to fetch department monthly trends: ${res.statusText}`);
    const json = await res.json();
    return json.data;
  },

  async getDepartmentCategoryDistribution(deptId) {
    const res = await fetch(`${API_BASE_URL}/analytics/department/${deptId}/category-distribution`, { credentials: "include" });
    if (!res.ok) throw new Error(`Failed to fetch category distribution: ${res.statusText}`);
    const json = await res.json();
    return json.data;
  },

  async getDepartmentAlerts(deptId) {
    const res = await fetch(`${API_BASE_URL}/analytics/department/${deptId}/alerts`, { credentials: "include" });
    if (!res.ok) throw new Error(`Failed to fetch department alerts: ${res.statusText}`);
    const json = await res.json();
    return json.data;
  },

  async getDepartmentOptimisationInsights(deptId) {
    const res = await fetch(`${API_BASE_URL}/analytics/department/${deptId}/optimisation-insights`, { credentials: "include" });
    if (!res.ok) throw new Error(`Failed to fetch optimisation insights: ${res.statusText}`);
    const json = await res.json();
    return json.data;
  },

  // =========================================================================
  // REPORT EXPORT TRIGGERS
  // =========================================================================

  getCollegeReportDownloadUrl(format = "pdf") {
    return `${API_BASE_URL}/reports/college/export?format=${format}`;
  },

  getDepartmentReportDownloadUrl(deptId, format = "pdf") {
    return `${API_BASE_URL}/reports/department/${deptId}/export?format=${format}`;
  }
};
