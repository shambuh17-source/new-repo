import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell
} from "recharts";

function formatINR(val) {
  if (val === undefined || val === null) return "₹0";
  return `₹${Number(val).toLocaleString("en-IN")}`;
}

const CustomDeptTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs">
        <div className="flex items-center justify-between gap-4 mb-2 border-b border-slate-800 pb-1">
          <span className="font-semibold text-slate-200">{data.name} ({data.code})</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase" style={{ backgroundColor: data.statusColor, color: "#fff" }}>
            {data.status}
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Allocated Budget:</span>
            <span className="font-mono text-slate-200">{formatINR(data.allocated)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Actual Spent:</span>
            <span className="font-mono text-emerald-400">{formatINR(data.spent)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Remaining:</span>
            <span className={`font-mono ${data.remaining < 0 ? "text-red-400" : "text-slate-200"}`}>
              {formatINR(data.remaining)}
            </span>
          </div>
          <div className="flex justify-between gap-4 pt-1 border-t border-slate-800 font-medium">
            <span className="text-slate-300">Utilisation:</span>
            <span className="font-mono font-bold" style={{ color: data.statusColor }}>
              {data.utilisation}%
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * Department Utilisation Comparison Bar Chart
 * College Admin only
 * @param {Array<object>} departments
 * @param {number} height
 */
export default function DepartmentUtilisationBarChart({ departments = [], height = 300 }) {
  if (!departments || departments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
        No department data available.
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="font-semibold text-slate-800 text-base">Department Budget Utilisation</h3>
          <p className="text-xs text-slate-500">Compare department utilisation against warning (85%) & limit (100%) thresholds</p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-700">🟢 Healthy (&lt;70%)</span>
          <span className="flex items-center gap-1 text-yellow-700">🟡 Attention (70-85%)</span>
          <span className="flex items-center gap-1 text-orange-700">🟠 Warning (85-100%)</span>
          <span className="flex items-center gap-1 text-red-700">🔴 Overspent (&gt;100%)</span>
        </div>
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={departments}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 120]}
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickFormatter={v => `${v}%`}
            />
            <YAxis
              dataKey="code"
              type="category"
              tick={{ fill: "#334155", fontSize: 12, fontWeight: 600 }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
            />
            <Tooltip content={<CustomDeptTooltip />} />
            {/* Reference Threshold Lines */}
            <ReferenceLine x={85} stroke="#f97316" strokeDasharray="3 3" label={{ value: "Warning 85%", fill: "#f97316", fontSize: 10, position: "top" }} />
            <ReferenceLine x={100} stroke="#ef4444" strokeWidth={1.5} label={{ value: "Limit 100%", fill: "#ef4444", fontSize: 10, position: "top" }} />
            <Bar dataKey="utilisation" radius={[0, 4, 4, 0]} maxBarSize={28}>
              {departments.map((entry, index) => {
                let fill = "#10b981"; // Healthy
                if (entry.utilisation > 100) fill = "#ef4444"; // Overspent
                else if (entry.utilisation >= 85) fill = "#f97316"; // Warning
                else if (entry.utilisation >= 70) fill = "#eab308"; // Attention
                return <Cell key={`cell-${index}`} fill={fill} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
