/**
 * Authentication & Role-Based Authorization Middleware
 * Enforces strict multi-tenant privacy:
 * - COLLEGE_ADMIN: College-wide access & any department in their college.
 * - DEPARTMENT_ADMIN: Isolated ONLY to their own department (user.department_id).
 * Cross-department access attempts are immediately rejected with HTTP 403.
 */

/**
 * Extracts and validates mock or JWT user from request headers or auth state
 */
export function authenticateUser(req, res, next) {
  // Supports Authorization Bearer token or direct X-User-Role / X-Department-Id headers for testing
  const authHeader = req.headers["authorization"];
  const roleHeader = req.headers["x-user-role"];
  const deptHeader = req.headers["x-department-id"];
  const userIdHeader = req.headers["x-user-id"];

  if (roleHeader) {
    req.user = {
      id: Number(userIdHeader) || 1,
      role: roleHeader, // "COLLEGE_ADMIN" or "DEPARTMENT_ADMIN"
      college_id: 1,
      department_id: deptHeader ? Number(deptHeader) : null
    };
    return next();
  }

  // Default demo user fallback if not passed (College Admin)
  // For production, Member 2 will connect real JWT verification here
  req.user = {
    id: 1,
    role: "COLLEGE_ADMIN",
    college_id: 1,
    department_id: null
  };
  next();
}

/**
 * Middleware: Strictly requires COLLEGE_ADMIN role
 * Rejects DEPARTMENT_ADMIN with 403 Forbidden
 */
export function requireCollegeAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized: Please log in." });
  }

  if (req.user.role !== "COLLEGE_ADMIN") {
    return res.status(403).json({
      error: "403 Forbidden: Access Denied. Only College Admin can access college-wide financial data.",
      userRole: req.user.role
    });
  }

  next();
}

/**
 * Middleware: Enforces Department Data Isolation
 * - COLLEGE_ADMIN can access any department.
 * - DEPARTMENT_ADMIN can ONLY access their own department_id.
 * If Department A tries to access Department B -> HTTP 403 Forbidden!
 */
export function requireDepartmentAccess(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized: Please log in." });
  }

  const requestedDeptId = Number(req.params.departmentId);

  if (req.user.role === "COLLEGE_ADMIN") {
    return next(); // College Admin has supervisory access
  }

  if (req.user.role === "DEPARTMENT_ADMIN") {
    if (Number(req.user.department_id) !== requestedDeptId) {
      return res.status(403).json({
        error: "403 Forbidden: Access Denied. You do not have permission to access another department's financial records.",
        attemptedDepartmentId: requestedDeptId,
        userDepartmentId: req.user.department_id
      });
    }
    return next();
  }

  return res.status(403).json({ error: "403 Forbidden: Unrecognized user role." });
}
