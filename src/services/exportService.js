/**
 * ============================================================================
 * WATTVISION - EXPORT SERVICE UTILITY
 * ============================================================================
 * Generates and triggers browser downloads for CSV and JSON format datasets.
 */

/**
 * Triggers a file download in the browser
 * @param {string} content - File string content
 * @param {string} filename - Desired filename
 * @param {string} mimeType - File MIME type
 */
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export array of records to CSV
 * @param {Array<Object>} data 
 * @param {string} filename 
 */
export function exportToCSV(data, filename = 'wattvision_energy_telemetry.csv') {
  if (!data || !data.length) return;

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // 1. Add headers row
  csvRows.push(headers.map(h => `"${h}"`).join(','));

  // 2. Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      if (val === null || val === undefined) return '""';
      return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : `"${val}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\r\n');
  downloadFile(csvString, filename, 'text/csv;charset=utf-8;');
}

/**
 * Export array of records or object to JSON
 * @param {Object|Array} data 
 * @param {string} filename 
 */
export function exportToJSON(data, filename = 'wattvision_export.json') {
  if (!data) return;
  const jsonString = JSON.stringify(data, null, 2);
  downloadFile(jsonString, filename, 'application/json;charset=utf-8;');
}
