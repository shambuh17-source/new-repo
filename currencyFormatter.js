/**
 * Currency Formatter Utility for Indian Rupee (INR) Formatting
 * Supports standard Indian comma separation:
 * e.g., 1000000 -> ₹10,00,000
 * e.g., 75000   -> ₹75,000
 * e.g., -30000  -> -₹30,000
 * Also supports compact Lakhs / Crores notation (₹10.0L, ₹1.5Cr)
 */

/**
 * Format a number as Indian Currency string
 * @param {number} amount - Numeric value
 * @param {boolean} includeSymbol - Whether to prepend ₹ (default: true)
 * @returns {string} Formatted Indian Rupee string
 */
export function formatINR(amount, includeSymbol = true) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return includeSymbol ? "₹0" : "0";
  }

  const num = Math.round(Number(amount));
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  const numStr = absNum.toString();
  let result = "";

  if (numStr.length <= 3) {
    result = numStr;
  } else {
    // Last 3 digits
    const lastThree = numStr.substring(numStr.length - 3);
    // Remaining digits grouped in pairs of 2
    const remaining = numStr.substring(0, numStr.length - 3);
    const withCommas = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    result = `${withCommas},${lastThree}`;
  }

  const symbol = includeSymbol ? "₹" : "";
  return isNegative ? `-${symbol}${result}` : `${symbol}${result}`;
}

/**
 * Format large Indian amounts into compact human-readable representation
 * e.g., 1000000 -> "₹10.0L", 15000000 -> "₹1.5Cr", 50000 -> "₹50K"
 * @param {number} amount
 * @param {boolean} includeSymbol
 * @returns {string}
 */
export function formatINRCompact(amount, includeSymbol = true) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return includeSymbol ? "₹0" : "0";
  }

  const num = Number(amount);
  const isNegative = num < 0;
  const abs = Math.abs(num);
  const symbol = includeSymbol ? "₹" : "";
  let formatted = "";

  if (abs >= 10000000) {
    // Crores
    formatted = `${(abs / 10000000).toFixed(2)}Cr`;
  } else if (abs >= 100000) {
    // Lakhs
    formatted = `${(abs / 100000).toFixed(1)}L`;
  } else if (abs >= 1000) {
    // Thousands
    formatted = `${(abs / 1000).toFixed(0)}K`;
  } else {
    formatted = abs.toString();
  }

  return isNegative ? `-${symbol}${formatted}` : `${symbol}${formatted}`;
}

/**
 * Format percentage with 1 or 2 decimals
 * @param {number} percent
 * @param {number} decimals
 * @returns {string} e.g. "93.8%"
 */
export function formatPercent(percent, decimals = 1) {
  if (percent === undefined || percent === null || isNaN(percent)) return "0.0%";
  return `${Number(percent).toFixed(decimals)}%`;
}
