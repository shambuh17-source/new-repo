import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

/**
 * Format number into Indian Rupee string
 */
function formatINR(val) {
  if (val === undefined || val === null) return "₹0";
  return `₹${Number(val).toLocaleString("en-IN")}`;
}

/**
 * Custom Tooltip for Planned vs Actual Bar Chart
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const planned = payload.find(p => p.dataKey === "planned")?.value || 0;
    const actual = payload.find(p => p.dataKey === "actual")?.value || 0;
    const diff = actual - planned;
    const isOverrun = diff > 0;

    return (
      <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs">
        <p className="font-semibold text-slate-200 mb-2 border-b border-slate-800 pb-1">{label}</p>
        <div className="space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Planned Budget:</span>
            <span className="font-mono text-blue-400">{formatINR(planned)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Actual Spent:</span>
            <span className="font-mono text-emerald-400">{formatINR(actual)}</span>
          </div>
          <div className="flex justify-between gap-4 pt-1 border-t border-slate-800 font-medium">
            <span className="text-slate-300">Variance:</span>
            <span className={`font-mono ${isOverrun ? "text-red-400" : "text-emerald-400"}`}>
              {isOverrun ? `+${formatINR(diff)} (Overrun)` : `${formatINR(diff)} (Savings)`}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * Budget vs Actual Bar Chart Component
 * @param {Array<{ category: string, planned: number, actual: number, difference: number, status: string }>} data
 * @param {number} height - Chart height in pixels
 */
export default function BudgetVsActualBarChart({ data = [], height = 320 }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
        No budget comparison data available.
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-800 text-base">Planned vs Actual Expenditure</h3>
          <p className="text-xs text-slate-500">Compare allocated plan against actual department disbursements</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block"></span>
            <span className="text-slate-600">Planned</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block"></span>
            <span className="text-slate-600">Actual</span>
          </div>
        </div>
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="category"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
              interval={0}
              angle={-20}
              textAnchor="end"
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={val => `₹${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="planned" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={36} />
            <Bar dataKey="actual" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
