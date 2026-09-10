import React, { useState } from 'react';
import {
  IndianRupee,
  Calculator,
  Sliders,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useEnergy } from '../context/EnergyContext';
import AnimatedNumber from '../components/common/AnimatedNumber';

export default function TariffPage() {
  const { tariffConfig, updateTariff, costSummary } = useEnergy();

  // Form states
  const [currency, setCurrency] = useState(tariffConfig.currency || '₹');
  const [baseRate, setBaseRate] = useState(tariffConfig.baseRatePerKwh.toString());
  const [peakRate, setPeakRate] = useState(tariffConfig.peakRatePerKwh.toString());
  const [offPeakRate, setOffPeakRate] = useState(tariffConfig.offPeakRatePerKwh.toString());
  const [fixedCharge, setFixedCharge] = useState(tariffConfig.fixedMonthlyCharge.toString());
  const [taxRate, setTaxRate] = useState(tariffConfig.taxRatePercent.toString());

  // Interactive Slider for Bill Estimator
  const [simulatorUnits, setSimulatorUnits] = useState(380); // kWh / month

  const handleSave = (e) => {
    e.preventDefault();
    updateTariff({
      currency,
      baseRatePerKwh: parseFloat(baseRate) || 8.00,
      peakRatePerKwh: parseFloat(peakRate) || 12.00,
      offPeakRatePerKwh: parseFloat(offPeakRate) || 5.00,
      fixedMonthlyCharge: parseFloat(fixedCharge) || 150.0,
      taxRatePercent: parseFloat(taxRate) || 18.0
    });
  };

  // Real-time calculation on simulated units
  const numBase = parseFloat(baseRate) || 8.00;
  const numFixed = parseFloat(fixedCharge) || 150.0;
  const numTax = parseFloat(taxRate) || 18.0;

  const energyCost = simulatorUnits * numBase;
  const subtotal = energyCost + numFixed;
  const calculatedTax = subtotal * (numTax / 100);
  const estimatedMonthlyBill = subtotal + calculatedTax;
  const estimatedAnnualBill = estimatedMonthlyBill * 12;

  return (
    <div className="dashboard-content-grid">
      {/* Top Banner */}
      <section className="page-header">
        <div className="page-header-main">
          <div className="page-header-title-row">
            <h1 className="page-title">Tariff & Electricity Cost Management</h1>
          </div>
          <p className="page-subtitle">
            Configure utility rate structures, time-of-use peak tiers, and simulate monthly billing forecasts.
          </p>
        </div>
      </section>

      {/* Grid: Tariff Form + Dynamic Bill Estimator */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        {/* 1. Tariff Configuration Form */}
        <div className="dashboard-card" style={{ padding: '1.5rem', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IndianRupee size={20} style={{ color: 'var(--color-gold)' }} />
            <h3 className="card-title">Utility Rate Structure</h3>
          </div>

          {/* Quick DISCOM Presets */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', padding: '8px 12px', background: 'var(--bg-surface-secondary)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>DISCOM Presets:</span>
            {[
              { label: 'BESCOM (Karnataka)', base: '7.15', fixed: '110', tax: '9.0' },
              { label: 'TANGEDCO (Tamil Nadu)', base: '4.50', fixed: '50', tax: '5.0' },
              { label: 'MSEDCL (Maharashtra)', base: '11.26', fixed: '138', tax: '16.0' }
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                className="btn-secondary"
                style={{ padding: '3px 8px', fontSize: '0.72rem', borderRadius: '6px' }}
                onClick={() => {
                  setBaseRate(p.base);
                  setFixedCharge(p.fixed);
                  setTaxRate(p.tax);
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Currency Symbol</label>
                <input
                  type="text"
                  className="form-input font-mono"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  maxLength={3}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Base Rate ({currency}/kWh)</label>
                <input
                  type="number"
                  step="0.001"
                  className="form-input font-mono"
                  value={baseRate}
                  onChange={(e) => setBaseRate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Peak Tier Rate (6 PM - 10 PM)</label>
                <input
                  type="number"
                  step="0.001"
                  className="form-input font-mono"
                  value={peakRate}
                  onChange={(e) => setPeakRate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Off-Peak Rate (11 PM - 6 AM)</label>
                <input
                  type="number"
                  step="0.001"
                  className="form-input font-mono"
                  value={offPeakRate}
                  onChange={(e) => setOffPeakRate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Fixed Monthly Charge ({currency})</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input font-mono"
                  value={fixedCharge}
                  onChange={(e) => setFixedCharge(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Electricity Sales Tax (%)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input font-mono"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button type="submit" className="btn-primary" style={{ padding: '8px 18px' }}>
                <CheckCircle size={16} />
                <span>Save Tariff Structure</span>
              </button>
            </div>
          </form>
        </div>

        {/* 2. Interactive Dynamic Bill Estimator */}
        <div className="dashboard-card" style={{ padding: '1.5rem', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calculator size={20} style={{ color: 'var(--color-gold)' }} />
            <h3 className="card-title">Dynamic Electricity Bill Estimator</h3>
          </div>

          {/* Slider */}
          <div style={{ background: 'var(--bg-surface-secondary)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Monthly Energy Consumption:</span>
              <strong className="font-mono" style={{ fontSize: '1.1rem', color: 'var(--color-gold)' }}>
                {simulatorUnits} kWh
              </strong>
            </div>

            <input
              type="range"
              min="50"
              max="1500"
              step="10"
              value={simulatorUnits}
              onChange={(e) => setSimulatorUnits(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-gold)', cursor: 'pointer' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>50 kWh (Low)</span>
              <span>380 kWh (Avg Household)</span>
              <span>1500 kWh (Heavy Load)</span>
            </div>
          </div>

          {/* Estimated Totals Display */}
          <div className="cost-hero-box">
            <span className="cost-hero-label">Estimated Monthly Utility Bill</span>
            <div className="cost-hero-amount font-mono">
              {currency}{estimatedMonthlyBill.toFixed(2)}
            </div>
            <div className="cost-hero-sub font-mono">
              Projected Annual Total: <strong>{currency}{estimatedAnnualBill.toFixed(2)} / year</strong>
            </div>
          </div>

          {/* Itemized Calculation Breakdown */}
          <div className="cost-breakdown-list" style={{ fontSize: '0.85rem' }}>
            <div className="cost-row">
              <span className="cost-row-label">Base Energy Charge ({simulatorUnits} kWh × {currency}{numBase})</span>
              <span className="cost-row-val font-mono">{currency}{energyCost.toFixed(2)}</span>
            </div>

            <div className="cost-row">
              <span className="cost-row-label">Fixed Grid Access Charge</span>
              <span className="cost-row-val font-mono">{currency}{numFixed.toFixed(2)}</span>
            </div>

            <div className="cost-row">
              <span className="cost-row-label">Utility Taxes ({numTax}%)</span>
              <span className="cost-row-val font-mono">{currency}{calculatedTax.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
