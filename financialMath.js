/**
 * Pure Mathematical Financial Calculations & Status Classification
 * Follows Hackathon Rules & Section 9 Status System:
 * 🟢 0–70%   : HEALTHY
 * 🟡 70–85%  : ATTENTION
 * 🟠 85–100% : WARNING
 * 🔴 >100%   : OVERSPENT
 */

export const STATUS_CONFIG = {
  HEALTHY: {
    code: "HEALTHY",
    label: "Healthy",
    icon: "🟢",
    color: "#10B981", // Emerald 500
    bgClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    description: "Spending is well within planned parameters (0% - 70%)."
  },
  ATTENTION: {
    code: "ATTENTION",
    label: "Attention",
    icon: "🟡",
    color: "#EAB308", // Yellow 500
    bgClass: "bg-yellow-50 text-yellow-700 border-yellow-200",
    description: "Utilisation is entering high band (70% - 85%). Monitor non-essentials."
  },
  WARNING: {
    code: "WARNING",
    label: "Warning",
    icon: "🟠",
    color: "#F97316", // Orange 500
    bgClass: "bg-orange-50 text-orange-700 border-orange-200",
    description: "Budget nearly exhausted (85% - 100%). Discretionary spend should pause."
  },
  OVERSPENT: {
    code: "OVERSPENT",
    label: "Overspent",
    icon: "🔴",
    color: "#EF4444", // Red 500
    bgClass: "bg-red-50 text-red-700 border-red-200",
    description: "Expenditure exceeds allocated funds (> 100%). Requires immediate reallocation."
  }
};

/**
 * Calculates remaining budget: Allocated - Actual
 * Negative indicates overspent deficit
 */
export function calculateRemainingBudget(allocated, actual) {
  const alloc = Number(allocated) || 0;
  const act = Number(actual) || 0;
  return alloc - act;
}

/**
 * Calculates budget utilisation percentage: (Actual / Allocated) * 100
 */
export function calculateUtilisation(actual, allocated) {
  const alloc = Number(allocated) || 0;
  const act = Number(actual) || 0;
  if (alloc <= 0) return 0;
  const pct = (act / alloc) * 100;
  return Math.round(pct * 10) / 10; // 1 decimal place
}

/**
 * Calculates spending variance: Actual - Planned
 * Positive indicates spending above planned (overrun)
 * Negative indicates spending below planned (savings)
 */
export function calculateVariance(actual, planned) {
  const act = Number(actual) || 0;
  const plan = Number(planned) || 0;
  return act - plan;
}

/**
 * Calculates variance percentage relative to planned
 */
export function calculateVariancePercentage(actual, planned) {
  const act = Number(actual) || 0;
  const plan = Number(planned) || 0;
  if (plan <= 0) return 0;
  const diff = act - plan;
  return Math.round((diff / plan) * 1000) / 10;
}

/**
 * Categorize financial status based on utilisation percentage
 * @param {number} utilisationPct
 * @returns {object} Status metadata
 */
export function getUtilisationStatus(utilisationPct) {
  const pct = Number(utilisationPct) || 0;
  if (pct > 100) {
    return STATUS_CONFIG.OVERSPENT;
  }
  if (pct >= 85) {
    return STATUS_CONFIG.WARNING;
  }
  if (pct >= 70) {
    return STATUS_CONFIG.ATTENTION;
  }
  return STATUS_CONFIG.HEALTHY;
}
