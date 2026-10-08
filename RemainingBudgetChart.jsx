import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

function formatINR(val) {
  if (val === undefined || val === null) return "₹0";
  return `₹${Number(val).toLocaleString("en-IN")}`;
}

/**
 * Remaining Budget Gauge / Donut Card Component
 * @param {object} props
 * @param {number} props.allocated
 * @param {number} props.spent
 * @param {number} props.remaining
 * @param {number} props.utilisation
 * @param {string} props.status - "HEALTHY" | "ATTENTION" | "WARNING" | "OVERSPENT"
 */
export default function RemainingBudgetChart({
  allocated = 0,
  spent = 0,
  remaining = 0,
  utilisation = 0,
  status = "HEALTHY"
}) {
  const isOverspent = utilisation > 100;
  
  // Data for Donut: Spent portion and Remaining portion
  const chartData = [
    { name: "Spent", value: Math.min(spent, allocated) },
    { name: "Remaining", value: Math.max(0, remaining) }
  ];

  let statusColor = "#10b981";
  let statusBadgeClass = "bg-emerald-100 text-emerald-800 border-emerald-300";

  if (isOverspent) {
    statusColor = "#ef4444";
    statusBadgeClass = "bg-red-100 text-red-800 border-red-300";
  } else if (utilisation >= 85) {
    statusColor = "#f97316";
    statusBadgeClass = "bg-orange-100 text-orange-800 border-orange-300";
  } else if (utilisation >= 70) {
    statusColor = "#eab308";
    statusBadgeClass = "bg-yellow-100 text-yellow-800 border-yellow-300";
  }

  return (
    <div className="w-full bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-slate-800 text-base">Budget Utilisation Gauge</h3>
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border uppercase ${statusBadgeClass}`}>
          {status}
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-2">Proportion of allocated funds consumed to date</p>

      {/* Center Dial */}
      <div className="relative w-full h-48 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={0}
              innerRadius={70}
              outerRadius={95}
              paddingAngle={2}
              dataKey="value"
            >
              <Cell fill={statusColor} stroke="#ffffff" strokeWidth={2} />
              <Cell fill="#e2e8f0" stroke="#ffffff" strokeWidth={2} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute text-center mt-6">
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {utilisation}%
          </div>
          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            Utilised
          </div>
        </div>
      </div>

      {/* KPI Footer Breakdown */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
        <div>
          <div className="text-[10px] uppercase font-semibold text-slate-400">Allocated</div>
          <div className="text-xs font-bold text-slate-800 mt-0.5">{formatINR(allocated)}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase font-semibold text-slate-400">Spent</div>
          <div className="text-xs font-bold text-blue-600 mt-0.5">{formatINR(spent)}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase font-semibold text-slate-400">Remaining</div>
          <div className={`text-xs font-bold mt-0.5 ${remaining < 0 ? "text-red-600" : "text-emerald-600"}`}>
            {formatINR(remaining)}
          </div>
        </div>
      </div>
    </div>
  );
}
