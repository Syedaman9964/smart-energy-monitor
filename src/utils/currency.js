/**
 * ============================================================================
 * WATT VISION - INDIAN CURRENCY FORMATTING UTILITY (INR ₹)
 * ============================================================================
 * Handles localized currency formatting for the Indian financial context
 * (Lakhs and Crores system, standard 2-decimal precision, and symbol prefixing).
 */

export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_CODE = 'INR';

/**
 * Formats a numerical value as Indian Rupee currency (₹).
 * Uses standard Indian numbering comma separation (e.g. ₹1,42,850.50).
 * 
 * @param {number|string} amount - Monetary value
 * @param {number} [decimalPlaces=2] - Precision
 * @returns {string} Formatted INR string with ₹ symbol
 */
export function formatINR(amount, decimalPlaces = 2) {
  const num = Number(amount);
  if (isNaN(num)) return `${CURRENCY_SYMBOL}0.00`;

  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    }).format(num);
  } catch {
    return `${CURRENCY_SYMBOL}${num.toFixed(decimalPlaces)}`;
  }
}

/**
 * Formats large amounts into compact Indian denominations (e.g. ₹1.25 L, ₹2.40 Cr, ₹45.2 K).
 * 
 * @param {number} amount - Monetary value
 * @returns {string} Compact formatted string
 */
export function formatCompactINR(amount) {
  const num = Number(amount);
  if (isNaN(num)) return `${CURRENCY_SYMBOL}0`;

  if (num >= 10000000) {
    return `${CURRENCY_SYMBOL}${(num / 10000000).toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    return `${CURRENCY_SYMBOL}${(num / 100000).toFixed(2)} Lakh`;
  }
  if (num >= 1000) {
    return `${CURRENCY_SYMBOL}${(num / 1000).toFixed(1)} K`;
  }
  return `${CURRENCY_SYMBOL}${num.toFixed(2)}`;
}

/**
 * Formats tariff rate with unit label (e.g. ₹8.00/kWh).
 * 
 * @param {number} rate - Tariff per kWh
 * @returns {string} Formatted rate string
 */
export function formatTariffRate(rate) {
  return `${CURRENCY_SYMBOL}${Number(rate).toFixed(2)}/kWh`;
}
