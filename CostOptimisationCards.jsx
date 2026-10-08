import React, { useState } from "react";

function formatINR(val) {
  if (val === undefined || val === null) return "₹0";
  return `₹${Number(val).toLocaleString("en-IN")}`;
}

const SEVERITY_BADGES = {
  CRITICAL: "bg-red-100 text-red-800 border-red-300",
  HIGH: "bg-orange-100 text-orange-800 border-orange-300",
  WARNING: "bg-amber-100 text-amber-800 border-amber-300",
  MEDIUM: "bg-blue-100 text-blue-800 border-blue-300",
  INFO: "bg-slate-100 text-slate-700 border-slate-300"
};

/**
 * Cost Optimisation Engine Interactive Component
 * Displays actionable rules and read-only AI enhancements
 */
export default function CostOptimisationCards({
  optimisationData = null,
  onApplyAction = null
}) {
  const [filterSeverity, setFilterSeverity] = useState("ALL");
  const [showAiAdvisory, setShowAiAdvisory] = useState(true);

  if (!optimisationData || !optimisationData.recommendations) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-slate-500 text-sm">
        No optimisation findings currently detected. Department spending is aligned with budgetary guidelines.
      </div>
    );
  }

  const { summary, recommendations, aiAdvisory } = optimisationData;

  const filteredRecs = filterSeverity === "ALL"
    ? recommendations
    : recommendations.filter(r => r.severity === filterSeverity);

  return (
    <div className="space-y-5">
      {/* Engine Header & Summary Stats */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">💡</span>
              <h3 className="text-lg font-bold">Cost Optimisation & Financial Intelligence</h3>
            </div>
            <p className="text-xs text-blue-200 mt-1">
              Deterministic rule-based expenditure analysis detecting procurement redundancies and savings opportunities
            </p>
          </div>
          {summary.estimatedPotentialSavings > 0 && (
            <div className="bg-emerald-500/20 border border-emerald-400/30 px-4 py-2.5 rounded-lg flex items-center gap-3">
              <span className="text-2xl">💰</span>
              <div>
                <div className="text-[11px] uppercase font-semibold text-emerald-200 tracking-wider">
                  Estimated Identifiable Savings
                </div>
                <div className="text-xl font-extrabold text-emerald-300">
                  {summary.formattedPotentialSavings}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-blue-800/60 overflow-x-auto text-xs">
          <span className="text-blue-300 font-medium mr-1">Filter Findings:</span>
          {["ALL", "CRITICAL", "HIGH", "WARNING", "MEDIUM", "INFO"].map(sev => (
            <button
              key={sev}
              type="button"
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1 rounded-full font-medium transition ${
                filterSeverity === sev
                  ? "bg-white text-blue-950 font-bold shadow-sm"
                  : "bg-blue-800/40 text-blue-200 hover:bg-blue-800"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* AI Advisory Callout (Read-Only) */}
      {aiAdvisory && showAiAdvisory && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4.5 text-xs text-indigo-950">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-base">✨</span>
              <h4 className="font-bold text-sm text-indigo-900">
                AI Strategic Executive Summary
              </h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-200 text-indigo-800">
                Read-Only Advisory
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowAiAdvisory(false)}
              className="text-slate-400 hover:text-slate-600 text-sm"
              title="Dismiss"
            >
              ×
            </button>
          </div>
          <p className="mt-2 text-indigo-900/90 leading-relaxed font-normal">
            {aiAdvisory.executiveSummary}
          </p>
          <div className="mt-3 pt-2 border-t border-indigo-200/60 flex items-center justify-between text-[11px] text-indigo-600">
            <span>🛡️ Guardrail: {aiAdvisory.guardrailNotice}</span>
            <span className="font-medium text-slate-400">{aiAdvisory.aiModel}</span>
          </div>
        </div>
      )}

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecs.map(rec => (
          <div
            key={rec.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${SEVERITY_BADGES[rec.severity]}`}>
                  {rec.severity}
                </span>
                {rec.potentialSavingsAmount > 0 && (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Save ~{formatINR(rec.potentialSavingsAmount)}
                  </span>
                )}
              </div>

              <h4 className="font-semibold text-slate-900 text-sm mb-1.5">{rec.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">{rec.insight}</p>

              <div className="bg-emerald-50/70 border-l-3 border-emerald-500 p-2.5 rounded-r-md text-xs text-emerald-900">
                <div className="font-semibold text-emerald-800 mb-0.5">Actionable Recommendation:</div>
                <div className="leading-snug">{rec.actionableRecommendation}</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-medium text-slate-400">Rule: {rec.ruleCode}</span>
              {onApplyAction && (
                <button
                  type="button"
                  onClick={() => onApplyAction(rec)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
                >
                  Initiate Review →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
