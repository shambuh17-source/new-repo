import React, { useState } from "react";
import { analyticsApi } from "../../services/analyticsApi.js";

/**
 * Financial Report Export Modal Component
 * Supports PDF, Excel, and CSV download streams
 */
export default function FinancialReportExportModal({
  isOpen = false,
  onClose = () => {},
  departmentId = null, // null for college report, deptId for department report
  departmentName = ""
}) {
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const isCollege = departmentId === null;
  const title = isCollege
    ? "Export College Financial Report"
    : `Export ${departmentName || "Department"} Report`;

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      const url = isCollege
        ? analyticsApi.getCollegeReportDownloadUrl(selectedFormat)
        : analyticsApi.getDepartmentReportDownloadUrl(departmentId, selectedFormat);

      // Open in new window or trigger download
      window.open(url, "_blank");
      setTimeout(() => {
        setIsDownloading(false);
        onClose();
      }, 800);
    } catch (err) {
      console.error("Export failed:", err);
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Select your preferred export document format</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg text-lg"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* Option: PDF */}
          <label
            className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
              selectedFormat === "pdf"
                ? "border-blue-500 bg-blue-50/50 text-blue-950"
                : "border-slate-200 hover:bg-slate-50 text-slate-700"
            }`}
          >
            <input
              type="radio"
              name="reportFormat"
              value="pdf"
              checked={selectedFormat === "pdf"}
              onChange={() => setSelectedFormat("pdf")}
              className="mt-1"
            />
            <div>
              <div className="font-semibold text-sm flex items-center gap-2">
                <span>📄 Printable PDF Report</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">Recommended</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Executive styled document with KPI cards, variance tables, and cost optimisation findings.
              </p>
            </div>
          </label>

          {/* Option: Excel */}
          <label
            className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
              selectedFormat === "excel"
                ? "border-emerald-500 bg-emerald-50/50 text-emerald-950"
                : "border-slate-200 hover:bg-slate-50 text-slate-700"
            }`}
          >
            <input
              type="radio"
              name="reportFormat"
              value="excel"
              checked={selectedFormat === "excel"}
              onChange={() => setSelectedFormat("excel")}
              className="mt-1"
            />
            <div>
              <div className="font-semibold text-sm">📊 Excel Spreadsheet (.xls)</div>
              <p className="text-xs text-slate-500 mt-0.5">
                Multi-section formatted spreadsheet compatible with Microsoft Excel and Google Sheets.
              </p>
            </div>
          </label>

          {/* Option: CSV */}
          <label
            className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
              selectedFormat === "csv"
                ? "border-slate-500 bg-slate-50 text-slate-950"
                : "border-slate-200 hover:bg-slate-50 text-slate-700"
            }`}
          >
            <input
              type="radio"
              name="reportFormat"
              value="csv"
              checked={selectedFormat === "csv"}
              onChange={() => setSelectedFormat("csv")}
              className="mt-1"
            />
            <div>
              <div className="font-semibold text-sm">📑 Plain CSV Data (.csv)</div>
              <p className="text-xs text-slate-500 mt-0.5">
                Standard RFC 4180 comma-separated format for quick data processing.
              </p>
            </div>
          </label>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition disabled:opacity-50"
          >
            {isDownloading ? "Generating..." : "Download Report"}
          </button>
        </div>
      </div>
    </div>
  );
}
