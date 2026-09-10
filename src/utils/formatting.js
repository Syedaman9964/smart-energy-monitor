/**
 * ============================================================================
 * WATT VISION - GENERAL FORMATTING & TIMEZONE UTILITY
 * ============================================================================
 * Standard date, time, duration, and electrical unit precision formatters.
 * Includes Indian Standard Time (IST - UTC+05:30) helper functions.
 */

/**
 * Formats a Date object or ISO string to 12-hour IST time with seconds (e.g. 10:45:30 PM).
 * 
 * @param {Date|string|number} dateInput - Date to format
 * @returns {string} 12-hour time string
 */
export function formatTimeIST(dateInput = new Date()) {
  const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '--:--:--';

  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

/**
 * Formats date into readable format (e.g. 17 Aug 2026).
 * 
 * @param {Date|string|number} dateInput - Date to format
 * @returns {string} Date string
 */
export function formatDateIST(dateInput = new Date()) {
  const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '--/--/----';

  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Formats active power intelligently with Watts (W) or Kilowatts (kW).
 * 
 * @param {number} watts - Active power in Watts
 * @returns {string} e.g. "1,245 W" or "3.45 kW"
 */
export function formatPower(watts) {
  const w = Number(watts);
  if (isNaN(w)) return '0 W';
  if (w >= 1000) {
    return `${(w / 1000).toFixed(2)} kW`;
  }
  return `${Math.round(w)} W`;
}

/**
 * Formats energy units (kWh) with precision.
 * 
 * @param {number} kwh - Energy units
 * @param {number} [decimals=2] - Decimals
 * @returns {string} e.g. "148.35 kWh"
 */
export function formatEnergy(kwh, decimals = 2) {
  const num = Number(kwh);
  if (isNaN(num)) return '0.00 kWh';
  return `${num.toFixed(decimals)} kWh`;
}

/**
 * Formats uptime duration from minutes into readable hours/days string.
 * 
 * @param {number} uptimeMinutes - Total minutes
 * @returns {string} e.g. "4d 6h 32m"
 */
export function formatUptime(uptimeMinutes) {
  const mins = Math.floor(Number(uptimeMinutes) || 0);
  const days = Math.floor(mins / (24 * 60));
  const hours = Math.floor((mins % (24 * 60)) / 60);
  const remMins = mins % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${remMins}m`;
  }
  if (hours > 0) {
    return `${hours}h ${remMins}m`;
  }
  return `${remMins}m`;
}
