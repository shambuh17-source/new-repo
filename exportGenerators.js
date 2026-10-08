/**
 * Export Generators Utility
 * Supports:
 * 1. RFC 4180 Compliant CSV Generation
 * 2. Formatted Multi-Section Excel (.xls / HTML-table based spreadsheet)
 * 3. Executive-Ready Printable HTML (Browser Print-to-PDF ready)
 */

/**
 * Escapes a cell for CSV formatting
 */
function escapeCsvCell(val) {
  if (val === null || val === undefined) return '""';
  let str = String(val);
  // If string contains commas, quotes, or newlines, escape quotes and wrap in quotes
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    str = `"${str.replace(/"/g, '""')}"`;
  } else {
    str = `"${str}"`;
  }
  return str;
}

/**
 * Generates CSV string from tabular data
 * @param {Array<object>} rows
 * @param {Array<{ key: string, label: string }>} columns
 * @returns {string} CSV content
 */
export function generateCsv(rows, columns) {
  const headerLine = columns.map(c => escapeCsvCell(c.label)).join(",");
  const dataLines = rows.map(row => {
    return columns.map(c => escapeCsvCell(row[c.key])).join(",");
  });
  return [headerLine, ...dataLines].join("\r\n");
}

/**
 * Generates styled Excel-compatible HTML spreadsheet
 * @param {Array<{ title: string, columns: Array<{ key: string, label: string }>, rows: Array<object> }>} sections
 * @param {string} reportTitle
 * @returns {string} HTML string for Excel
 */
export function generateExcelHtml(sections, reportTitle) {
  let html = `
  <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Financial Report</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
    <style>
      body { font-family: 'Segoe UI', Calibri, Arial, sans-serif; font-size: 11pt; color: #1e293b; }
      .header-title { font-size: 18pt; font-weight: bold; color: #1e3a8a; text-align: left; }
      .sub-title { font-size: 10pt; color: #64748b; margin-bottom: 20px; }
      .section-title { font-size: 13pt; font-weight: bold; color: #0f172a; margin-top: 25px; margin-bottom: 8px; border-bottom: 2px solid #3b82f6; }
      table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
      th { background-color: #1e3a8a; color: #ffffff; font-weight: bold; text-align: left; padding: 10px 8px; border: 1px solid #cbd5e1; }
      td { padding: 8px; border: 1px solid #e2e8f0; vertical-align: top; }
      tr:nth-child(even) { background-color: #f8fafc; }
      .num { text-align: right; }
      .badge-healthy { color: #065f46; font-weight: bold; }
      .badge-warning { color: #9a3412; font-weight: bold; }
      .badge-overspent { color: #991b1b; font-weight: bold; }
    </style>
  </head>
  <body>
    <div class="header-title">${reportTitle}</div>
    <div class="sub-title">Generated: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} | Currency: Indian Rupee (INR)</div>
  `;

  sections.forEach(sec => {
    html += `<div class="section-title">${sec.title}</div>`;
    html += `<table><thead><tr>`;
    sec.columns.forEach(col => {
      html += `<th>${col.label}</th>`;
    });
    html += `</tr></thead><tbody>`;

    sec.rows.forEach(row => {
      html += `<tr>`;
      sec.columns.forEach(col => {
        const val = row[col.key] !== undefined && row[col.key] !== null ? row[col.key] : "";
        const isNum = typeof val === "number" || (typeof val === "string" && (val.startsWith("₹") || val.endsWith("%")));
        html += `<td class="${isNum ? "num" : ""}">${val}</td>`;
      });
      html += `</tr>`;
    });

    html += `</tbody></table>`;
  });

  html += `</body></html>`;
  return html;
}

/**
 * Generates an executive-ready HTML document for PDF printing
 */
export function generatePrintableHtml(report) {
  const isCollege = report.type === "COLLEGE_REPORT";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${report.title}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #0f172a; line-height: 1.4; margin: 0; padding: 20px; }
    .header { border-bottom: 3px solid #2563eb; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
    .header h1 { margin: 0; font-size: 22px; color: #1e3a8a; }
    .header .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
    .header .meta { text-align: right; font-size: 11px; color: #64748b; }
    
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
    .kpi-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; background: #f8fafc; }
    .kpi-card .label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; }
    .kpi-card .value { font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 4px; }
    .kpi-card .sub { font-size: 11px; margin-top: 2px; }

    .section { margin-bottom: 24px; page-break-inside: avoid; }
    .section-title { font-size: 15px; font-weight: 700; color: #1e293b; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid #cbd5e1; }
    
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 10px; }
    th { background: #f1f5f9; color: #334155; font-weight: 600; text-align: left; padding: 8px; border: 1px solid #e2e8f0; }
    td { padding: 8px; border: 1px solid #e2e8f0; vertical-align: top; }
    .num { text-align: right; }
    
    .status-badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
    .status-healthy { background: #dcfce7; color: #166534; }
    .status-warning { background: #ffedd5; color: #9a3412; }
    .status-attention { background: #fef9c3; color: #854d0e; }
    .status-overspent { background: #fee2e2; color: #991b1b; }

    .alert-box { border-left: 4px solid #ef4444; background: #fef2f2; padding: 10px 12px; margin-bottom: 8px; border-radius: 0 6px 6px 0; font-size: 11px; }
    .alert-box.warning { border-color: #f97316; background: #fff7ed; }
    .alert-box .title { font-weight: 700; color: #991b1b; }
    .alert-box.warning .title { color: #9a3412; }

    .rec-card { border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; margin-bottom: 8px; background: #fafafa; font-size: 11px; }
    .rec-card .title { font-weight: 700; color: #1e3a8a; }
    .rec-card .rec { color: #047857; margin-top: 4px; font-weight: 500; }

    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>${report.title}</h1>
      <div class="subtitle">${report.subtitle} | Financial Year: ${report.financialYear}</div>
    </div>
    <div class="meta">
      <div>Report ID: MIT-REP-${Date.now().toString().slice(-6)}</div>
      <div>Generated: ${report.generatedAtFormatted}</div>
      <div>Confidential: Internal College Management</div>
    </div>
  </div>

  <!-- KPI SUMMARY -->
  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="label">Total Allocated</div>
      <div class="value">${report.kpis.allocated}</div>
      <div class="sub">Planned: ${report.kpis.planned}</div>
    </div>
    <div class="kpi-card">
      <div class="label">Actual Expenditure</div>
      <div class="value" style="color: #2563eb;">${report.kpis.spent}</div>
      <div class="sub">Approved expenses</div>
    </div>
    <div class="kpi-card">
      <div class="label">Remaining Budget</div>
      <div class="value" style="color: ${report.kpis.remainingRaw < 0 ? '#ef4444' : '#10b981'};">${report.kpis.remaining}</div>
      <div class="sub">${report.kpis.remainingRaw < 0 ? 'Deficit overspend' : 'Available balance'}</div>
    </div>
    <div class="kpi-card">
      <div class="label">Utilisation & Status</div>
      <div class="value">${report.kpis.utilisation}</div>
      <div class="sub">
        <span class="status-badge status-${report.kpis.status.toLowerCase()}">${report.kpis.status}</span>
      </div>
    </div>
  </div>

  <!-- DEPARTMENT COMPARISON (College Only) -->
  ${isCollege ? `
  <div class="section">
    <div class="section-title">Department Budget Utilisation Summary</div>
    <table>
      <thead>
        <tr>
          <th>Department</th>
          <th>Head of Dept</th>
          <th class="num">Allocated</th>
          <th class="num">Spent</th>
          <th class="num">Remaining</th>
          <th class="num">Utilisation</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${report.departments.map(d => `
          <tr>
            <td><strong>${d.code}</strong> - ${d.name}</td>
            <td>${d.head}</td>
            <td class="num">${d.formatted.allocated}</td>
            <td class="num">${d.formatted.spent}</td>
            <td class="num">${d.formatted.remaining}</td>
            <td class="num"><strong>${d.formatted.utilisation}</strong></td>
            <td><span class="status-badge status-${d.status.toLowerCase()}">${d.status}</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}

  <!-- PLANNED VS ACTUAL -->
  <div class="section">
    <div class="section-title">Planned vs Actual Category Variance</div>
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th class="num">Planned Budget</th>
          <th class="num">Actual Spending</th>
          <th class="num">Variance (Actual - Planned)</th>
          <th class="num">Variance %</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${report.plannedVsActual.map(p => `
          <tr>
            <td><strong>${p.category}</strong></td>
            <td class="num">${p.formatted.planned}</td>
            <td class="num">${p.formatted.actual}</td>
            <td class="num" style="color: ${p.difference > 0 ? '#dc2626' : '#16a34a'}; font-weight: 600;">
              ${p.formatted.difference}
            </td>
            <td class="num">${p.formatted.variancePercentage}</td>
            <td><span class="status-badge ${p.status === 'High' ? 'status-overspent' : p.status === 'Attention' ? 'status-attention' : 'status-healthy'}">${p.status}</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <!-- ALERTS / OVERSPENDING -->
  ${report.alerts && report.alerts.length > 0 ? `
  <div class="section">
    <div class="section-title">Overspending & Critical Alerts (${report.alerts.length})</div>
    ${report.alerts.map(a => `
      <div class="alert-box ${a.severity === 'WARNING' ? 'warning' : ''}">
        <div class="title">${a.title} - ${a.departmentName || a.category}</div>
        <div>${a.message}</div>
        <div style="margin-top: 4px; font-weight: 600;">Action Required: ${a.recommendedAction}</div>
      </div>
    `).join('')}
  </div>
  ` : ''}

  <!-- COST OPTIMISATION RECOMMENDATIONS -->
  <div class="section">
    <div class="section-title">Cost Optimisation Engine Recommendations</div>
    ${report.recommendations.map(r => `
      <div class="rec-card">
        <div class="title">[${r.severity}] ${r.title}</div>
        <div>${r.insight}</div>
        <div class="rec">💡 Recommendation: ${r.actionableRecommendation}</div>
      </div>
    `).join('')}
  </div>

  <div style="margin-top: 30px; border-top: 1px solid #cbd5e1; padding-top: 10px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between;">
    <div>Smart College Department Budget Management System • Hackathon 2024</div>
    <div>Strictly Confidential • System Generated Report</div>
  </div>
</body>
</html>`;
}
