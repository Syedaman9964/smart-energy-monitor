import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import {
  BarChart3,
  Zap,
  Activity,
  Percent,
  Sparkles
} from 'lucide-react';
import telemetryService from '../services/telemetryService';

export default function AnalyticsPage() {
  const [viewTab, setViewTab] = useState('daily');

  const hourlyData = telemetryService.getHistoricalData('24h');
  const weeklyData = telemetryService.getHistoricalData('7d');
  const monthlyData = telemetryService.getHistoricalData('30d');
  const annualData = telemetryService.getHistoricalData('12m');

  const getActiveChartData = () => {
    switch (viewTab) {
      case 'hourly': return hourlyData;
      case 'daily': return weeklyData;
      case 'weekly': return monthlyData;
      case 'monthly': return annualData;
      default: return weeklyData;
    }
  };

  return (
    <div className="dashboard-content-grid">
      {/* Top Banner */}
      <section className="page-header">
        <div className="page-header-main">
          <div className="page-header-title-row">
            <h1 className="page-title">Energy Analytics & Insights</h1>
          </div>
          <p className="page-subtitle">
            Deep historical consumption breakdown, peak demand load profiling, and comparative utility analytics.
          </p>
        </div>

        {/* View Switcher */}
        <div className="page-header-actions">
          <div className="tab-button-group">
            {[
              { id: 'hourly', label: 'Hourly (24H)' },
              { id: 'daily', label: 'Daily (7D)' },
              { id: 'weekly', label: 'Weekly (30D)' },
              { id: 'monthly', label: 'Monthly (12M)' }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${viewTab === tab.id ? 'active' : ''}`}
                onClick={() => setViewTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* AI Energy Intelligence & Actionable Insights */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
        <div className="dashboard-card" style={{ borderLeft: '3px solid var(--color-gold)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles size={17} className="text-gold" />
            <h4 className="card-title">Comparative Usage Trend</h4>
          </div>
          <p className="metric-subtext" style={{ fontSize: '0.84rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
            Your energy consumption today is <strong style={{ color: 'var(--color-success)' }}>12.4% lower</strong> than yesterday. Morning baseline optimization reduced standby draw by ~180 Watts.
          </p>
        </div>

        <div className="dashboard-card" style={{ borderLeft: '3px solid var(--color-warning)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Zap size={17} style={{ color: 'var(--color-warning)' }} />
            <h4 className="card-title">Peak Demand Window</h4>
          </div>
          <p className="metric-subtext" style={{ fontSize: '0.84rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
            Peak load occurred between <strong className="text-gold">7:15 PM and 8:45 PM (3,120 W)</strong> due to concurrent AC and kitchen induction usage during peak tariff hours (₹12.00/kWh).
          </p>
        </div>

        <div className="dashboard-card" style={{ borderLeft: '3px solid var(--color-voltage)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Activity size={17} style={{ color: 'var(--color-voltage)' }} />
            <h4 className="card-title">Grid Power Quality</h4>
          </div>
          <p className="metric-subtext" style={{ fontSize: '0.84rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
            Average Power Factor was <strong className="text-gold">0.95</strong> and Grid Voltage remained strictly within nominal limits (224.5V - 236.2V) with zero brownouts.
          </p>
        </div>
      </section>

      {/* Main Bar / Trend Analytics Chart */}
      <section className="dashboard-card" style={{ padding: '1.5rem', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 className="card-title">
              <BarChart3 size={18} className="text-gold" />
              Consumption & Cost Analysis
            </h3>
            <p className="metric-subtext" style={{ marginTop: '2px' }}>
              Units consumed (kWh) and associated electricity costs
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.78rem' }}>
            <span style={{ color: 'var(--color-gold)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--color-gold)' }} />
              Energy (kWh)
            </span>
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--text-secondary)' }} />
              Estimated Cost (₹)
            </span>
          </div>
        </div>

        <div style={{ width: '100%', height: '320px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getActiveChartData()} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey={viewTab === 'hourly' ? 'time' : viewTab === 'daily' ? 'day' : viewTab === 'weekly' ? 'date' : 'month'} stroke="var(--text-muted)" fontSize={11} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}`} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '0.84rem',
                  boxShadow: 'var(--shadow-md)'
                }}
              />
              <Bar dataKey="kwh" name="Energy (kWh)" fill="var(--color-gold, #d4af37)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cost" name="Cost (₹)" fill="var(--text-secondary, #94a3b8)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Secondary Row: Power Factor Distribution & Voltage Stability */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '1.5rem' }}>
        {/* Power Factor Trend Line */}
        <div className="dashboard-card" style={{ padding: '1.5rem', gap: '1rem' }}>
          <h3 className="card-title">
            <Percent size={18} className="text-gold" />
            Power Factor (cos φ) Quality Trend
          </h3>
          <div style={{ width: '100%', height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                <YAxis domain={[0.8, 1.0]} stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                <Line type="monotone" dataKey="powerFactor" stroke="var(--color-gold, #d4af37)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Voltage Stability Trend */}
        <div className="dashboard-card" style={{ padding: '1.5rem', gap: '1rem' }}>
          <h3 className="card-title">
            <Zap size={18} style={{ color: 'var(--color-voltage)' }} />
            Grid Voltage Stability (230V Reference)
          </h3>
          <div style={{ width: '100%', height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                <YAxis domain={[215, 245]} stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                <Area type="monotone" dataKey="voltage" stroke="var(--color-voltage)" fill="var(--color-voltage-glow)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
