import React, { useState, useMemo } from 'react';
import {
  History,
  Download,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileCode,
  Flame,
  Check
} from 'lucide-react';
import { useEnergy } from '../context/EnergyContext';
import { useToast } from '../context/ToastContext';
import { exportToCSV, exportToJSON } from '../services/exportService';

export default function HistoryPage() {
  const { historyLogs } = useEnergy();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const filteredLogs = useMemo(() => {
    return historyLogs.filter((row) => {
      const matchesSearch = row.formattedDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            row.formattedTime.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            row.status.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = filterMode === 'ALL' ||
                            (filterMode === 'PEAK' && row.isPeak) ||
                            (filterMode === 'NORMAL' && !row.isPeak);

      return matchesSearch && matchesFilter;
    });
  }, [historyLogs, searchQuery, filterMode]);

  const totalPages = Math.ceil(filteredLogs.length / rowsPerPage) || 1;
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleExportCSV = () => {
    exportToCSV(filteredLogs, `wattvision_telemetry_history_${Date.now()}.csv`);
    addToast({
      type: 'success',
      title: 'CSV Export Downloaded',
      message: `Exported ${filteredLogs.length} historical telemetry records.`
    });
  };

  const handleExportJSON = () => {
    exportToJSON(filteredLogs, `wattvision_telemetry_history_${Date.now()}.json`);
    addToast({
      type: 'success',
      title: 'JSON Export Downloaded',
      message: `Exported ${filteredLogs.length} historical records to JSON format.`
    });
  };

  return (
    <div className="dashboard-content-grid">
      {/* Top Banner */}
      <section className="page-header">
        <div className="page-header-main">
          <div className="page-header-title-row">
            <h1 className="page-title">Historical Energy Telemetry</h1>
          </div>
          <p className="page-subtitle">
            Searchable log archive of electrical measurements, power factor, energy meter increments, and utility cost records.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="page-header-actions">
          <button className="btn-secondary" onClick={handleExportCSV} title="Export CSV Spreadsheet">
            <FileSpreadsheet size={16} style={{ color: 'var(--color-success)' }} />
            <span>Export CSV</span>
          </button>
          <button className="btn-secondary" onClick={handleExportJSON} title="Export Raw JSON">
            <FileCode size={16} style={{ color: 'var(--color-gold)' }} />
            <span>Export JSON</span>
          </button>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="dashboard-card" style={{ padding: '1rem', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '240px', flex: 1 }}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by date, time, or status..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="form-input"
            style={{ width: '100%', padding: '6px 12px', fontSize: '0.85rem' }}
          />
        </div>

        <div className="tab-button-group">
          {['ALL', 'PEAK', 'NORMAL'].map((mode) => (
            <button
              key={mode}
              className={`tab-btn ${filterMode === mode ? 'active' : ''}`}
              onClick={() => {
                setFilterMode(mode);
                setCurrentPage(1);
              }}
            >
              {mode} ({mode === 'ALL' ? historyLogs.length : historyLogs.filter(h => mode === 'PEAK' ? h.isPeak : !h.isPeak).length})
            </button>
          ))}
        </div>
      </section>

      {/* Historical Data Table */}
      <section className="dashboard-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table className="usage-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Voltage (V)</th>
                <th>Current (A)</th>
                <th>Power (W)</th>
                <th>Cumulative (kWh)</th>
                <th>Freq (Hz)</th>
                <th>PF (cos φ)</th>
                <th>Cost (₹)</th>
                <th>Load Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.map((row) => (
                <tr key={row.id}>
                  <td style={{ fontWeight: 500 }}>
                    <div>{row.formattedTime}</div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{row.formattedDate}</span>
                  </td>
                  <td className="font-mono">{row.voltage} V</td>
                  <td className="font-mono">{row.current} A</td>
                  <td className="font-mono" style={{ fontWeight: 700, color: row.power > 2500 ? 'var(--color-warning)' : 'inherit' }}>
                    {row.power} W
                  </td>
                  <td className="font-mono" style={{ color: 'var(--color-gold)', fontWeight: 600 }}>
                    {row.energy} kWh
                  </td>
                  <td className="font-mono">{row.frequency} Hz</td>
                  <td className="font-mono">{row.powerFactor}</td>
                  <td className="font-mono">₹{row.cost}</td>
                  <td>
                    {row.isPeak ? (
                      <span className="peak-tag">
                        <Flame size={11} />
                        {row.status}
                      </span>
                    ) : (
                      <span className="normal-tag">
                        <Check size={11} />
                        {row.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Showing page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredLogs.length} total rows)
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className="btn-icon"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              style={{ opacity: currentPage <= 1 ? 0.4 : 1, cursor: currentPage <= 1 ? 'not-allowed' : 'pointer' }}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-mono" style={{ fontSize: '0.85rem', padding: '0 8px' }}>
              {currentPage} / {totalPages}
            </span>
            <button
              className="btn-icon"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              style={{ opacity: currentPage >= totalPages ? 0.4 : 1, cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
