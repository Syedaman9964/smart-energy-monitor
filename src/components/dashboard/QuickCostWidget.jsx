import React from 'react';
import { IndianRupee, ArrowRight, TrendingUp, Calendar, Zap, AlertCircle } from 'lucide-react';
import { useEnergy } from '../../context/EnergyContext';
import AnimatedNumber from '../common/AnimatedNumber';

export default function QuickCostWidget() {
  const { costSummary, setActivePage } = useEnergy();
  const {
    todayUnits,
    todayCost,
    weeklyCost,
    projectedMonthlyBill,
    tariffRate,
    peakRate,
    currency
  } = costSummary;

  const dailyBudgetKwh = 16.0;
  const progressPercent = Math.min(100, Math.round((todayUnits / dailyBudgetKwh) * 100));

  return (
    <div className="dashboard-card cost-card">
      <div className="card-heading" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IndianRupee size={17} className="text-gold" />
          <h3 className="card-title">Energy & Cost Overview</h3>
        </div>
        <button
          className="tariff-pill-btn"
          onClick={() => setActivePage('tariff')}
          title="Open Tariff Calculator"
        >
          <span>{currency}{tariffRate.toFixed(2)}/kWh</span>
          <ArrowRight size={12} />
        </button>
      </div>

      {/* Hero Cost Box */}
      <div className="cost-hero-box">
        <span className="cost-hero-label">Today's Estimated Cost</span>
        <div className="cost-hero-amount font-mono">
          {currency}<AnimatedNumber value={todayCost} decimals={2} />
        </div>
        <div className="cost-hero-sub font-mono">
          Based on <strong><AnimatedNumber value={todayUnits} decimals={2} /> kWh</strong> units consumed today
        </div>

        {/* Progress against daily target */}
        <div style={{ marginTop: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            <span>Daily Budget Target</span>
            <span className="font-mono" style={{ fontWeight: 600 }}>{progressPercent}% of {dailyBudgetKwh} kWh</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'var(--bg-surface-secondary)', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: progressPercent > 85 ? 'var(--color-warning)' : 'var(--color-gold)',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>
      </div>

      {/* Breakdown Rows */}
      <div className="cost-breakdown-list" style={{ marginTop: '0.75rem' }}>
        <div className="cost-row">
          <span className="cost-row-label">This Week's Cost</span>
          <span className="cost-row-val font-mono">{currency}{weeklyCost.toFixed(2)}</span>
        </div>

        <div className="cost-row">
          <span className="cost-row-label">Projected Monthly Bill</span>
          <span className="cost-row-val font-mono text-gold">
            ~{currency}{projectedMonthlyBill.toFixed(2)}
          </span>
        </div>

        <div className="cost-row">
          <span className="cost-row-label">Peak Tariff (6 PM - 10 PM)</span>
          <span className="cost-row-val font-mono" style={{ color: 'var(--color-warning)' }}>
            {currency}{peakRate.toFixed(2)} / kWh
          </span>
        </div>
      </div>

      <button
        className="btn-secondary"
        style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', marginTop: '6px' }}
        onClick={() => setActivePage('tariff')}
      >
        <span>Customize Billing Rates & Slabs</span>
        <ArrowRight size={13} />
      </button>
    </div>
  );
}
