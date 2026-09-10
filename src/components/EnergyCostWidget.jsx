import React from 'react';
import { DollarSign, Zap, Settings, TrendingUp } from 'lucide-react';

/**
 * EnergyCostWidget - Displays today's consumption, estimated electricity bill, and tariff breakdown
 * 
 * @param {Object} costData - { todayKwh, tariffRate, currency, todayCost, projectedMonthlyCost, projectedMonthlyKwh }
 * @param {Function} onOpenTariffModal - Callback to trigger tariff editing modal
 */
export default function EnergyCostWidget({ costData, onOpenTariffModal }) {
  const {
    todayKwh = 0,
    tariffRate = 0.15,
    currency = '$',
    todayCost = 0,
    projectedMonthlyCost = 0,
    projectedMonthlyKwh = 0
  } = costData || {};

  // Example daily reference target for progress visualization (18 kWh baseline)
  const dailyTargetKwh = 18.0;
  const progressPercent = Math.min(100, Math.round((todayKwh / dailyTargetKwh) * 100));

  return (
    <div className="dashboard-card cost-card">
      <div className="card-heading">
        <h3 className="card-title">
          <DollarSign size={18} style={{ color: '#10b981' }} />
          Energy & Cost
        </h3>
        <button 
          className="tariff-pill-btn"
          onClick={onOpenTariffModal}
          title="Configure billing tariff"
        >
          <Settings size={13} />
          <span>{currency}{tariffRate.toFixed(2)}/kWh</span>
        </button>
      </div>

      {/* Hero Cost Box */}
      <div className="cost-hero-box">
        <span className="cost-hero-label">Today's Estimated Cost</span>
        <div className="cost-hero-amount font-mono">
          {currency}{todayCost.toFixed(2)}
        </div>
        <div className="cost-hero-sub font-mono">
          Based on <strong>{todayKwh.toFixed(2)} kWh</strong> units consumed today
        </div>

        {/* Consumption Progress Bar */}
        <div style={{ marginTop: '0.4rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            marginBottom: '4px'
          }}>
            <span>Daily Consumption Budget</span>
            <span className="font-mono">{progressPercent}% of {dailyTargetKwh} kWh</span>
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            background: 'var(--bg-surface-tertiary)',
            borderRadius: '999px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: progressPercent > 80 ? 'var(--color-warning)' : 'var(--color-energy)',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Monthly Forecast Breakdown */}
      <div className="cost-breakdown-list">
        <div className="cost-row">
          <span className="cost-row-label">Projected Monthly Units</span>
          <span className="cost-row-val font-mono">~{projectedMonthlyKwh} kWh</span>
        </div>

        <div className="cost-row">
          <span className="cost-row-label">Projected Monthly Bill</span>
          <span className="cost-row-val font-mono" style={{ color: '#34d399' }}>
            ~{currency}{projectedMonthlyCost.toFixed(2)}
          </span>
        </div>

        <div className="cost-row">
          <span className="cost-row-label">Active Tariff Rate</span>
          <span className="cost-row-val font-mono">
            {currency}{tariffRate.toFixed(2)} / kWh
          </span>
        </div>
      </div>
    </div>
  );
}
