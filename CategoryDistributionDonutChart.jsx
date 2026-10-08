import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function formatINR(val) {
  if (val === undefined || val === null) return "₹0";
  return `₹${Number(val).toLocaleString("en-IN")}`;
}

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-xl border border-slate-700 text-xs">
        <div className="font-semibold text-slate-200">{data.name}</div>
        <div className="text-emerald-400 font-mono mt-1">{formatINR(data.value)}</div>
        <div className="text-slate-400 text-[11px] mt-0.5">{data.percentage}% of total expenditure</div>
      </div>
    );
  }
  return null;
};

/**
 * Category Distribution Donut Chart Component
 * @param {Array<{ name: string, value: number, percentage: number, color: string }>} data
 * @param {string} totalFormatted - Pre-formatted total amount
 * @param {number} height
 */
export default function CategoryDistributionDonutChart({ data = [], totalFormatted = "", height = 300 }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
        No category expenditure data available.
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-slate-800 text-base">Category-Wise Expenditure</h3>
          {totalFormatted && (
            <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-700 rounded-md">
              Total: {totalFormatted}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 mb-4">Proportionate breakdown across major college expenditure categories</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
        <div className="md:col-span-7 relative" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || "#64748b"} stroke="#ffffff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend List */}
        <div className="md:col-span-5 max-h-56 overflow-y-auto pr-1 space-y-2 text-xs">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition">
              <div className="flex items-center gap-2 truncate pr-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-700 font-medium truncate">{item.name}</span>
              </div>
              <div className="text-right shrink-0">
                <div className="font-semibold text-slate-800">{formatINR(item.value)}</div>
                <div className="text-[10px] text-slate-400">{item.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
