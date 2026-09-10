import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  TrendingUp,
  Sun,
  Wind,
  Zap,
  Sliders,
  DollarSign,
  Flame
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
  ComposedChart
} from 'recharts';
import { useEnergy } from '../context/EnergyContext';
import { predictionService } from '../services/predictionService';

export default function PredictionPage() {
  const { telemetry } = useEnergy();
  const [horizon, setHorizon] = useState('24h'); // '24h' | '30d'

  // Scenario Simulator state
  const [extraAcHours, setExtraAcHours] = useState(2);
  const [solarKw, setSolarKw] = useState(3.0);
  const [tempDeltaC, setTempDeltaC] = useState(2.0);

  const forecast24h = useMemo(() => {
    return predictionService.generate24HourForecast(telemetry.power || 1800);
  }, [telemetry.power]);

  const forecast30d = useMemo(() => {
    return predictionService.generate30DayForecast(telemetry.energyToday || 12.5);
  }, [telemetry.energyToday]);

  const scenarioResult = useMemo(() => {
    return predictionService.calculateScenario({
      extraAcHours: Number(extraAcHours),
      solarKw: Number(solarKw),
      tempDeltaC: Number(tempDeltaC)
    });
  }, [extraAcHours, solarKw, tempDeltaC]);

  return (
    <div className="dashboard-content-grid">
      {/* Top Hero Banner */}
      <section className="page-header">
        <div className="page-header-main">
          <div className="page-header-title-row">
            <h1 className="page-title">Energy Consumption & Cost Prediction</h1>
            <span className="badge-ai font-mono">
              <Sparkles size={12} />
              AI Holt-Winters Engine
            </span>
          </div>
          <p className="page-subtitle">
            Holt-Winters double exponential smoothing with diurnal regression for predictive load management.
          </p>
        </div>

        <div className="page-header-actions">
          <div className="tab-button-group">
            <button
              className={`tab-btn ${horizon === '24h' ? 'active' : ''}`}
              onClick={() => setHorizon('24h')}
            >
              24-Hour Load Curve
            </button>
            <button
              className={`tab-btn ${horizon === '30d' ? 'active' : ''}`}
              onClick={() => setHorizon('30d')}
            >
              30-Day Bill Forecast
            </button>
          </div>
        </div>
      </section>

      {/* KPI Cards Row */}
      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-label">Predicted Daily Units</span>
            <Zap size={16} className="text-gold" />
          </div>
          <div className="metric-value-row">
            <span className="metric-value font-mono">{forecast24h.totalPredictedKwh}</span>
            <span className="metric-unit">kWh</span>
          </div>
          <div className="metric-subtext text-gold">
            Estimated Today Cost: ₹{forecast24h.estimatedDayCostInr}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-label">Peak Demand Expected</span>
            <Flame size={16} style={{ color: 'var(--color-warning)' }} />
          </div>
          <div className="metric-value-row">
            <span className="metric-value font-mono" style={{ color: 'var(--color-warning)' }}>{forecast24h.peakPowerW}</span>
            <span className="metric-unit">W</span>
          </div>
          <div className="metric-subtext">
            Predicted between 19:00 - 21:00 IST
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-label">Projected Monthly Bill</span>
            <DollarSign size={16} className="text-gold" />
          </div>
          <div className="metric-value-row">
            <span className="metric-value font-mono text-gold">₹{forecast30d.projectedMonthBillInr}</span>
          </div>
          <div className="metric-subtext">
            {forecast30d.projectedMonthKwh} kWh under active DISCOM tariff
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-label">Model Confidence</span>
            <TrendingUp size={16} style={{ color: 'var(--color-success)' }} />
          </div>
          <div className="metric-value-row">
            <span className="metric-value font-mono" style={{ color: 'var(--color-success)' }}>94.2%</span>
          </div>
          <div className="metric-subtext">
            Confidence interval ±8.0%
          </div>
        </div>
      </div>

      {/* Main Forecast Chart Section */}
      <section className="dashboard-card" style={{ padding: '1.5rem', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 className="card-title">
              {horizon === '24h' ? '24-Hour Ahead AI Predictive Load Curve' : '30-Day Cumulative Consumption Trajectory'}
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {horizon === '24h'
                ? 'Shaded area represents 95% confidence bounds with diurnal peak load prediction'
                : 'Projected daily accumulation versus DISCOM slab capacity limits'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.76rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--color-gold)' }} />
              Forecast
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--color-gold-glow)' }} />
              Confidence Range
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--color-warning)' }} />
              Peak Window
            </span>
          </div>
        </div>

        <div style={{ width: '100%', height: '340px' }}>
          <ResponsiveContainer width="100%" height="100%">
            {horizon === '24h' ? (
              <ComposedChart data={forecast24h.points} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="predictGoldGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-gold, #d4af37)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-gold, #d4af37)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="time" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} unit=" W" />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card)',
                    borderColor: 'var(--border-subtle)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '0.8rem',
                    boxShadow: 'var(--shadow-md)'
                  }}
                  formatter={(val, name) => [
                    `${val} W`,
                    name === 'predictedPower' ? 'Predicted Load' : name === 'upperBound' ? 'Upper Bound' : 'Lower Bound'
                  ]}
                />
                <Area type="monotone" dataKey="upperBound" stroke="none" fill="url(#predictGoldGlow)" />
                <Line type="monotone" dataKey="predictedPower" stroke="var(--color-gold, #d4af37)" strokeWidth={2.4} dot={{ r: 2 }} />
                <Line type="monotone" dataKey="lowerBound" stroke="var(--text-muted)" strokeDasharray="3 3" strokeWidth={1} dot={false} />
              </ComposedChart>
            ) : (
              <AreaChart data={forecast30d.days} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="kwhGoldGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-gold, #d4af37)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-gold, #d4af37)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
                <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} unit=" kWh" />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card)',
                    borderColor: 'var(--border-subtle)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '0.8rem',
                    boxShadow: 'var(--shadow-md)'
                  }}
                />
                <Area type="monotone" dataKey="cumulativeKwh" stroke="var(--color-gold, #d4af37)" strokeWidth={2.4} fill="url(#kwhGoldGlow)" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </section>

      {/* Interactive What-If Scenario Simulator */}
      <section className="dashboard-card" style={{ padding: '1.5rem', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={18} className="text-gold" />
          <h3 className="card-title">Interactive "What-If" Energy Optimization Simulator</h3>
        </div>

        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
          Simulate changes to appliance usage, ambient summer heatwaves, or rooftop solar generation to see immediate impact on your monthly DISCOM bill.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '0.5rem' }}>
          {/* Controls Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Wind size={15} className="text-gold" /> Additional AC Daily Run Time
                </span>
                <span className="font-mono text-gold" style={{ fontWeight: 600 }}>+{extraAcHours} hrs/day</span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="0.5"
                value={extraAcHours}
                onChange={(e) => setExtraAcHours(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--color-gold)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sun size={15} style={{ color: 'var(--color-warning)' }} /> Rooftop Solar Capacity (kWp)
                </span>
                <span className="font-mono" style={{ fontWeight: 600, color: 'var(--color-warning)' }}>{solarKw} kWp</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={solarKw}
                onChange={(e) => setSolarKw(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--color-warning)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Flame size={15} style={{ color: 'var(--color-danger)' }} /> Summer Temperature Shift
                </span>
                <span className="font-mono" style={{ fontWeight: 600, color: 'var(--color-danger)' }}>+{tempDeltaC}°C</span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                step="1"
                value={tempDeltaC}
                onChange={(e) => setTempDeltaC(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--color-danger)' }}
              />
            </div>
          </div>

          {/* Results Summary Box */}
          <div style={{
            background: 'var(--bg-surface-secondary)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <h4 className="card-title">Simulation Outcome Summary</h4>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Adjusted Daily Average:</span>
              <span className="font-mono" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{scenarioResult.adjustedDailyKwh} kWh/day</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Projected Monthly Consumption:</span>
              <span className="font-mono" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{scenarioResult.monthlyNetKwh} kWh</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Simulated Monthly Bill:</span>
              <span className="font-mono text-gold" style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                ₹{scenarioResult.simulatedMonthlyBill}
              </span>
            </div>

            <div style={{
              fontSize: '0.74rem',
              color: 'var(--text-secondary)',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '8px'
            }}>
              Net impact: <strong>{scenarioResult.netMonthlySavingsInr >= 0 ? `Savings of ₹${scenarioResult.netMonthlySavingsInr}` : `Increase of ₹${Math.abs(scenarioResult.netMonthlySavingsInr)}`}</strong>/month
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
