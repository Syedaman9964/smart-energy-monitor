import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Leaf,
  Globe,
  Trees,
  CloudRain,
  Sun,
  Zap,
  Info,
  Sliders
} from 'lucide-react';

export default function Slide12Carbon() {
  const [kwh, setKwh] = useState(125);
  const emissionFactor = 0.82; // Central Electricity Authority (CEA) India baseline
  const treeAbsorptionPerYear = 21.77; // Average adult tree CO2 absorption in kg

  const co2Kg = Number((kwh * emissionFactor).toFixed(1));
  const treesNeeded = Number((co2Kg / (treeAbsorptionPerYear / 12)).toFixed(1)); // monthly tree absorption

  return (
    <div className="pres-content-wrapper">
      <div className="pres-slide-badge" style={{ borderColor: 'rgba(16, 185, 129, 0.35)', color: '#34d399', background: 'rgba(16, 185, 129, 0.1)' }}>
        <Leaf size={14} />
        <span>Environmental Sustainability</span>
      </div>

      <h2 className="pres-slide-title">
        Carbon Footprint & CEA Grid Analytics
      </h2>

      <p className="pres-slide-subtitle">
        Translating invisible kilowatt-hours into concrete ecological impact based on the Central Electricity Authority (CEA) of India standard baseline factor.
      </p>

      {/* Energy to Carbon Formula Banner */}
      <div className="pres-glass-card" style={{
        padding: '1.25rem',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Globe size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--pres-text-muted)', textTransform: 'uppercase' }}>
              Standard Grid Emission Equation
            </div>
            <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
              CO₂ (kg) = Energy (kWh) × 0.82 kg CO₂/kWh
            </div>
          </div>
        </div>

        {/* Interactive Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--pres-text-secondary)' }}>Test Load:</span>
          <input
            type="range"
            min="25"
            max="500"
            step="25"
            value={kwh}
            onChange={(e) => setKwh(Number(e.target.value))}
            style={{ width: '140px', accentColor: '#10b981' }}
          />
          <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', minWidth: '60px' }}>
            {kwh} kWh
          </span>
        </div>
      </div>

      {/* Carbon Metrics Trio */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem'
      }}>
        <div className="pres-glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #38bdf8' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--pres-text-muted)', fontWeight: 600 }}>
              Energy Consumed
            </span>
            <Zap size={18} style={{ color: '#38bdf8' }} />
          </div>
          <div className="font-mono" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#38bdf8' }}>
            {kwh} <span style={{ fontSize: '1.1rem' }}>kWh</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.4rem' }}>
            Metered cumulative active consumption
          </p>
        </div>

        <div className="pres-glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--pres-text-muted)', fontWeight: 600 }}>
              Estimated Carbon Footprint
            </span>
            <CloudRain size={18} style={{ color: '#f59e0b' }} />
          </div>
          <div className="font-mono" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f59e0b' }}>
            {co2Kg} <span style={{ fontSize: '1.1rem' }}>kg CO₂</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.4rem' }}>
            Released into atmosphere at {emissionFactor} kg/kWh
          </p>
        </div>

        <div className="pres-glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--pres-text-muted)', fontWeight: 600 }}>
              Ecological Offset Demand
            </span>
            <Trees size={18} style={{ color: '#10b981' }} />
          </div>
          <div className="font-mono" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#10b981' }}>
            {treesNeeded} <span style={{ fontSize: '1.1rem' }}>Trees</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.4rem' }}>
            Monthly sequestration trees needed to neutralize
          </p>
        </div>
      </div>

      {/* Reference Compliance Notice */}
      <div style={{
        marginTop: '1.25rem',
        padding: '0.75rem 1.25rem',
        background: 'rgba(16, 185, 129, 0.06)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        borderRadius: '8px',
        fontSize: '0.76rem',
        color: '#94a3b8',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Info size={15} style={{ color: '#10b981', flexShrink: 0 }} />
        <span>
          <strong>Benchmark Reference:</strong> The baseline grid emission coefficient is modeled after the Central Electricity Authority (CEA) of India CO₂ Baseline Database (Version 19). The factor is user-configurable in settings.
        </span>
      </div>
    </div>
  );
}
