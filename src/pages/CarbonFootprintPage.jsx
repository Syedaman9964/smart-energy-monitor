import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import {
  Leaf,
  TreePine,
  CloudRain,
  Award,
  Sparkles,
  ArrowDown,
  Info
} from 'lucide-react';
import { useEnergy } from '../context/EnergyContext';
import telemetryService from '../services/telemetryService';
import AnimatedNumber from '../components/common/AnimatedNumber';

export default function CarbonFootprintPage() {
  const { carbonSummary, telemetry } = useEnergy();
  const annualData = telemetryService.getHistoricalData('12m');

  const {
    todayCo2Kg,
    monthlyCo2Kg,
    yearlyCo2Kg,
    treesNeeded,
    emissionFactor,
    efficiencyGrade
  } = carbonSummary;

  return (
    <div className="dashboard-content-grid">
      {/* Top Banner */}
      <section className="page-header">
        <div className="page-header-main">
          <div className="page-header-title-row">
            <h1 className="page-title">Carbon Footprint & Sustainability</h1>
            <span className="status-pill status-online font-mono">ESG Grade {efficiencyGrade}</span>
          </div>
          <p className="page-subtitle">
            Real-time CO₂ greenhouse emission estimations derived from grid electrical consumption.
          </p>
        </div>
      </section>

      {/* Carbon KPI Hero Cards */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {/* Today's Carbon */}
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-label">Today's CO₂ Emissions</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={18} />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value font-mono" style={{ color: 'var(--color-success)' }}>
              <AnimatedNumber value={todayCo2Kg} decimals={2} />
            </span>
            <span className="metric-unit">kg CO₂e</span>
          </div>
          <div className="metric-subtext">
            Based on {telemetry.energyToday.toFixed(2)} kWh consumed today
          </div>
        </div>

        {/* Trees to Offset */}
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-label">Trees Required to Offset</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(212, 175, 55, 0.12)', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TreePine size={18} />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value font-mono text-gold">
              <AnimatedNumber value={treesNeeded} decimals={1} />
            </span>
            <span className="metric-unit">Mature Trees</span>
          </div>
          <div className="metric-subtext">
            Annual carbon sequestration equivalency
          </div>
        </div>

        {/* Projected Monthly Carbon */}
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-label">Monthly Projected CO₂</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.12)', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CloudRain size={18} />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value font-mono" style={{ color: 'var(--color-warning)' }}>
              <AnimatedNumber value={monthlyCo2Kg} decimals={1} />
            </span>
            <span className="metric-unit">kg CO₂e</span>
          </div>
          <div className="metric-subtext">
            Target budget: 150.0 kg / month
          </div>
        </div>

        {/* Grid Carbon Intensity */}
        <div className="metric-card">
          <div className="metric-card-header">
            <span className="metric-label">Grid Carbon Intensity</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(212, 175, 55, 0.12)', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={18} />
            </div>
          </div>
          <div className="metric-value-row">
            <span className="metric-value font-mono">
              {(emissionFactor * 1000).toFixed(0)}
            </span>
            <span className="metric-unit">g CO₂ / kWh</span>
          </div>
          <div className="metric-subtext">
            Standard national grid average mix
          </div>
        </div>
      </section>

      {/* Annual Monthly CO2 Chart */}
      <section className="dashboard-card" style={{ padding: '1.5rem', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 className="card-title">
              <Leaf size={18} style={{ color: 'var(--color-gold)' }} />
              Annual Carbon Emission Profile (2026)
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Monthly greenhouse gas emissions calculated from energy meter totals
            </p>
          </div>
        </div>

        <div style={{ width: '100%', height: '280px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={annualData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}kg`} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--shadow-card)'
                }}
              />
              <Bar dataKey="co2" name="CO₂ Emissions (kg)" fill="var(--color-gold)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
