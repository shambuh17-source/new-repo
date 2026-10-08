import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

function formatINR(val) {
  if (val === undefined || val === null) return "₹0";
  return `₹${Number(val).toLocaleString("en-IN")}`;
}

const CustomLineTooltip = ({ active, payload, label, isCumulative }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs">
        <p className="font-semibold text-slate-200 mb-2 border-b border-slate-800 pb-1">{label}</p>
        <div className="space-y-1">
          {payload.map((entry, idx) => (
            <div key={idx} className="flex justify-between gap-4">
              <span style={{ color: entry.color }}>{entry.name}:</span>
              <span className="font-mono text-white font-semibold">{formatINR(entry.value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

/**
 * Monthly Expenditure Line Chart Component
 * @param {Array<{ month: string, actual: number, planned: number, cumulativeActual: number, cumulativePlanned: number }>} data
 * @param {number} height
 */
export default function MonthlyExpenditureLineChart({ data = [], height = 320 }) {
  const [viewMode, setViewMode] = useState("monthly"); // "monthly" | "cumulative"

  const actualKey = viewMode === "monthly" ? "actual" : "cumulativeActual";
  const plannedKey = viewMode === "monthly" ? "planned" : "cumulativePlanned";

  return (
    <div className="w-full bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-semibold text-slate-800 text-base">Monthly Spending Trends</h3>
          <p className="text-xs text-slate-500">Track expenditure velocity across the academic financial year</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setViewMode("monthly")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition ${
              viewMode === "monthly"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setViewMode("cumulative")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition ${
              viewMode === "cumulative"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Cumulative
          </button>
        </div>
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 15, left: 10, bottom: 15 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={val => `₹${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomLineTooltip isCumulative={viewMode === "cumulative"} />} />
            <Line
              type="monotone"
              dataKey={actualKey}
              name={viewMode === "monthly" ? "Actual Spent" : "Cumulative Actual"}
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#2563eb", strokeWidth: 1, stroke: "#fff" }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey={plannedKey}
              name={viewMode === "monthly" ? "Planned Target" : "Cumulative Target"}
              stroke="#94a3b8"
              strokeDasharray="4 4"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
