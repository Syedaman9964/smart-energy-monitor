import React from 'react';
import { History, ArrowUpRight, Flame, Check } from 'lucide-react';

/**
 * RecentUsageTable - Tabular log of recent energy consumption intervals
 * 
 * @param {Array} logs - Array of recent consumption records
 */
export default function RecentUsageTable({ logs = [] }) {
  return (
    <div className="dashboard-card table-card">
      <div className="table-header-row">
        <div>
          <h3 className="card-title">
            <History size={18} style={{ color: '#a855f7' }} />
            Recent Energy Usage History
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Interval breakdown of power and estimated costs
          </p>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="usage-table">
          <thead>
            <tr>
              <th>Time Window</th>
              <th>Avg Power</th>
              <th>Peak Load</th>
              <th>Energy Consumed</th>
              <th>Estimated Cost</th>
              <th>Load Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td style={{ fontWeight: 500 }}>{log.timeWindow}</td>
                <td className="font-mono">{log.avgPower}</td>
                <td className="font-mono" style={{ color: log.isPeak ? '#f59e0b' : 'inherit' }}>
                  {log.peakPower}
                </td>
                <td className="font-mono" style={{ color: '#10b981', fontWeight: 600 }}>
                  {log.energyConsumed}
                </td>
                <td className="font-mono">{log.cost}</td>
                <td>
                  {log.isPeak ? (
                    <span className="peak-tag">
                      <Flame size={11} />
                      Peak Demand
                    </span>
                  ) : (
                    <span className="normal-tag">
                      <Check size={11} />
                      Normal
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
