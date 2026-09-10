import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  Layers,
  Building,
  CheckCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export default function Slide10Billing() {
  const [units, setUnits] = useState(200);
  const [selectedDiscom, setSelectedDiscom] = useState('bescom');

  const discoms = {
    bescom: {
      name: 'BESCOM (Karnataka)',
      state: 'Bangalore Electricity Supply Company',
      fixed: 110,
      facRate: 0.43,
      dutyRate: 0.09,
      slabs: [
        { limit: 50, rate: 4.15, label: '0 – 50 Units' },
        { limit: 100, rate: 5.60, label: '51 – 100 Units' },
        { limit: 200, rate: 7.15, label: '101 – 200 Units' },
        { limit: Infinity, rate: 8.20, label: '> 200 Units' }
      ]
    },
    tangedco: {
      name: 'TANGEDCO (Tamil Nadu)',
      state: 'Tamil Nadu Generation and Distribution Corp',
      fixed: 75,
      facRate: 0.35,
      dutyRate: 0.05,
      slabs: [
        { limit: 100, rate: 0.00, label: '0 – 100 Units (Free)' },
        { limit: 200, rate: 4.50, label: '101 – 200 Units' },
        { limit: 500, rate: 6.50, label: '201 – 500 Units' },
        { limit: Infinity, rate: 8.00, label: '> 500 Units' }
      ]
    },
    msedcl: {
      name: 'MSEDCL (Maharashtra)',
      state: 'Maharashtra State Electricity Distribution',
      fixed: 128,
      facRate: 0.65,
      dutyRate: 0.16,
      slabs: [
        { limit: 100, rate: 5.88, label: '0 – 100 Units' },
        { limit: 300, rate: 11.26, label: '101 – 300 Units' },
        { limit: 500, rate: 15.72, label: '301 – 500 Units' },
        { limit: Infinity, rate: 17.81, label: '> 500 Units' }
      ]
    },
    bses: {
      name: 'BSES Rajdhani (Delhi)',
      state: 'BSES Yamuna & Rajdhani Power Limited',
      fixed: 90,
      facRate: 0.40,
      dutyRate: 0.05,
      slabs: [
        { limit: 200, rate: 3.00, label: '0 – 200 Units (Subsidized)' },
        { limit: 400, rate: 4.50, label: '201 – 400 Units' },
        { limit: 800, rate: 6.50, label: '401 – 800 Units' },
        { limit: Infinity, rate: 8.00, label: '> 800 Units' }
      ]
    },
    uppcl: {
      name: 'UPPCL (Uttar Pradesh)',
      state: 'Uttar Pradesh Power Corporation Ltd',
      fixed: 110,
      facRate: 0.50,
      dutyRate: 0.05,
      slabs: [
        { limit: 100, rate: 5.50, label: '0 – 100 Units' },
        { limit: 150, rate: 6.00, label: '101 – 150 Units' },
        { limit: 300, rate: 6.50, label: '151 – 300 Units' },
        { limit: Infinity, rate: 7.00, label: '> 300 Units' }
      ]
    }
  };

  const currentDiscom = discoms[selectedDiscom];

  // Progressive calculation
  let remaining = units;
  let prevLimit = 0;
  let energyCharge = 0;
  const slabBreakdown = [];

  for (const slab of currentDiscom.slabs) {
    const slabSpan = slab.limit === Infinity ? remaining : slab.limit - prevLimit;
    const unitsInThisSlab = Math.max(0, Math.min(remaining, slabSpan));
    const cost = unitsInThisSlab * slab.rate;
    energyCharge += cost;

    slabBreakdown.push({
      label: slab.label,
      rate: slab.rate,
      units: unitsInThisSlab,
      cost
    });

    remaining -= unitsInThisSlab;
    if (slab.limit !== Infinity) prevLimit = slab.limit;
    if (remaining <= 0) break;
  }

  const fixedCharge = currentDiscom.fixed;
  const facCharge = units * currentDiscom.facRate;
  const duty = (energyCharge + fixedCharge + facCharge) * currentDiscom.dutyRate;
  const totalBill = Math.round(energyCharge + fixedCharge + facCharge + duty);

  return (
    <div className="pres-content-wrapper">
      <div className="pres-slide-badge" style={{ borderColor: 'rgba(16, 185, 129, 0.35)', color: '#34d399', background: 'rgba(16, 185, 129, 0.1)' }}>
        <DollarSign size={14} />
        <span>Indian Utility Billing Engine</span>
      </div>

      <h2 className="pres-slide-title">
        Progressive Multi-Slab Tariff Mathematics
      </h2>

      <p className="pres-slide-subtitle">
        Unlike linear flat-rate calculators, WattVision accurately simulates state-specific tiered slab structures, fixed capacity demand charges, FAC, and state electricity duties.
      </p>

      {/* DISCOM & Units Selectors */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        {/* DISCOM presets buttons */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {Object.entries(discoms).map(([key, disc]) => (
            <button
              key={key}
              onClick={() => setSelectedDiscom(key)}
              className="pres-btn-nav"
              style={{
                fontSize: '0.75rem',
                padding: '0.35rem 0.75rem',
                background: selectedDiscom === key ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                borderColor: selectedDiscom === key ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                color: selectedDiscom === key ? '#34d399' : 'var(--pres-text-secondary)'
              }}
            >
              {key.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Units Step Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--pres-text-muted)' }}>Consumption:</span>
          {[50, 100, 200, 300].map((u) => (
            <button
              key={u}
              onClick={() => setUnits(u)}
              className="pres-btn-nav font-mono"
              style={{
                fontSize: '0.78rem',
                padding: '0.3rem 0.65rem',
                background: units === u ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                borderColor: units === u ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)',
                color: units === u ? '#38bdf8' : 'var(--pres-text-secondary)'
              }}
            >
              {u} Units
            </button>
          ))}
        </div>
      </div>

      {/* Main Billing Calculation Visualizer */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Slabs breakdown card */}
        <div className="pres-glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9' }}>
              {currentDiscom.name} Slabs
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--pres-text-muted)' }}>
              {units} Total kWh Units
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {slabBreakdown.map((s, idx) => (
              <div
                key={idx}
                style={{
                  background: s.units > 0 ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${s.units > 0 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.04)'}`,
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.82rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: s.units > 0 ? '#f8fafc' : '#64748b' }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                    Rate: ₹{s.rate.toFixed(2)}/unit × {s.units} units
                  </div>
                </div>

                <div className="font-mono" style={{ fontWeight: 700, color: s.units > 0 ? '#34d399' : '#64748b' }}>
                  ₹{s.cost.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bill invoice card */}
        <div className="pres-glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.75rem' }}>
              Itemized Utility Invoice Breakdown
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--pres-text-secondary)' }}>Energy Charges (Slabs):</span>
                <span className="font-mono" style={{ color: '#f1f5f9' }}>₹{energyCharge.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--pres-text-secondary)' }}>Fixed Monthly Demand Charge:</span>
                <span className="font-mono" style={{ color: '#f1f5f9' }}>₹{fixedCharge.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--pres-text-secondary)' }}>Fuel Adjustment Charge (FAC):</span>
                <span className="font-mono" style={{ color: '#f1f5f9' }}>₹{facCharge.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--pres-text-secondary)' }}>Electricity Duty ({(currentDiscom.dutyRate * 100).toFixed(0)}%):</span>
                <span className="font-mono" style={{ color: '#f1f5f9' }}>₹{duty.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--pres-text-muted)', textTransform: 'uppercase' }}>
                Total Estimated Bill
              </div>
              <div style={{ fontSize: '0.7rem', color: '#38bdf8' }}>
                {currentDiscom.state}
              </div>
            </div>

            <div className="font-mono" style={{ fontSize: '1.85rem', fontWeight: 800, color: '#10b981' }}>
              ₹ {totalBill.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Regulatory Reference Disclaimer */}
      <div style={{
        marginTop: '1rem',
        padding: '0.65rem 1rem',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '8px',
        fontSize: '0.74rem',
        color: '#94a3b8',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <AlertCircle size={14} style={{ color: '#f59e0b', flexShrink: 0 }} />
        <span>
          <strong>Regulatory Notice:</strong> Tariff slabs reflect sample configured benchmarks modeled after state electricity regulatory commission (SERC) tariff schedules. Exact rates are dynamically configurable in the dashboard.
        </span>
      </div>
    </div>
  );
}
