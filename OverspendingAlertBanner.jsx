import React from "react";

/**
 * Overspending & Utilisation Alert Banner
 * Warns users when budget approaches 85% or crosses 100%
 */
export default function OverspendingAlertBanner({
  alerts = [],
  onRequestAdjustment = null,
  onViewDetails = null
}) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {alerts.map(alert => {
        const isCritical = alert.severity === "CRITICAL" || alert.type === "BUDGET_OVERSPENT";
        const isWarning = alert.severity === "WARNING" || alert.type === "BUDGET_WARNING";

        const bgClass = isCritical
          ? "bg-red-50 border-red-300 text-red-950"
          : isWarning
          ? "bg-orange-50 border-orange-300 text-orange-950"
          : "bg-blue-50 border-blue-300 text-blue-950";

        const icon = isCritical ? "🔴" : isWarning ? "🟠" : "🔵";

        return (
          <div
            key={alert.id}
            className={`border rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition ${bgClass}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0 mt-0.5">{icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm">{alert.title}</h4>
                  {alert.departmentCode && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/80 border border-slate-300">
                      {alert.departmentCode}
                    </span>
                  )}
                </div>
                <p className="text-xs mt-1 leading-relaxed">{alert.message}</p>
                <div className="text-xs font-semibold mt-1 opacity-90">
                  ⚡ Recommended Action: {alert.recommendedAction}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              {onRequestAdjustment && (isCritical || isWarning) && (
                <button
                  type="button"
                  onClick={() => onRequestAdjustment(alert)}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                >
                  Request Funds
                </button>
              )}
              {onViewDetails && (
                <button
                  type="button"
                  onClick={() => onViewDetails(alert)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-medium transition"
                >
                  View Breakdown
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
