import React, { useState } from 'react';
import {
  Zap,
  Activity,
  Gauge,
  BatteryCharging,
  TrendingUp,
  Cpu,
  IndianRupee,
  Leaf,
  ArrowUpRight
} from 'lucide-react';
import { useEnergy } from '../context/EnergyContext';
import MetricCard from '../components/dashboard/MetricCard';
import LivePowerChart from '../components/dashboard/LivePowerChart';
import EnergyFlowDiagram from '../components/dashboard/EnergyFlowDiagram';
import QuickCostWidget from '../components/dashboard/QuickCostWidget';
import StatusBadge from '../components/common/StatusBadge';
import AnimatedNumber from '../components/common/AnimatedNumber';
import Sparkline from '../components/common/Sparkline';
import telemetryService from '../services/telemetryService';

export default function DashboardPage() {
  const {
    telemetry,
    hardware,
    livePoints,
    isLive,
    unitMode,
    setUnitMode,
    setActivePage,
    alerts,
    costSummary,
    carbonSummary,
    isBackendOnline
  } = useEnergy();

  const [dateRange, setDateRange] = useState('today');
  const [chartRange, setChartRange] = useState('live');
  const [chartData, setChartData] = useState(() => telemetryService.getHistoricalData('live'));

  const handleChartRangeChange = (newRange) => {
    setChartRange(newRange);
    setChartData(telemetryService.getHistoricalData(newRange));
  };

  // Sparkline data buffers
  const voltageSpark = livePoints.slice(-12).map(p => p.voltage);
  const currentSpark = livePoints.slice(-12).map(p => p.current);
  const powerSpark = livePoints.slice(-12).map(p => p.power);
  const freqSpark = livePoints.slice(-12).map(p => p.frequency);

  const isKw = unitMode === 'kW';
  const displayPowerVal = isKw ? telemetry.powerKw : telemetry.power;
  const powerUnit = isKw ? 'kW' : 'W';

  // Compute average power from live points
  const recentPowers = livePoints.map(p => p.power).filter(p => p > 0);
  const avgPower = recentPowers.length ? Math.round(recentPowers.reduce((a, b) => a + b, 0) / recentPowers.length) : telemetry.power;

  const unreadAlertsCount = alerts.filter(a => !a.read).length;

  return (
    <div className="dashboard-content-grid">
      {/* 1. Header & Quick Date Controls */}
      <section className="page-header">
        <div className="page-header-main">
          <div className="page-header-title-row">
            <h1 className="page-title">Energy Overview</h1>
            <StatusBadge status={isLive ? 'live' : 'standby'} text={isLive ? 'Live Sampling' : 'Paused'} />
          </div>
          <p className="page-subtitle">
            Continuous real-time visibility into AC parameters, active load demand, and utility economics.
          </p>
        </div>

        {/* Date Filter Tabs */}
        <div className="page-header-actions">
          <div className="tab-button-group">
            {['Today', 'Yesterday', '7 Days', '30 Days'].map((tab) => {
              const id = tab.toLowerCase().replace(' ', '');
              return (
                <button
                  key={id}
                  className={`tab-btn ${dateRange === id ? 'active' : ''}`}
                  onClick={() => setDateRange(id)}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. First Viewport Executive Situation Strip (Contained Status Panel) */}
      <section className="executive-situation-strip">
        <div className="strip-item">
          <div className="strip-header-row">
            <span className="strip-dot online" />
            <span className="strip-label">Grid Condition</span>
          </div>
          <span className="strip-val font-mono">Normal ({telemetry.voltage.toFixed(1)} V · {telemetry.frequency.toFixed(1)} Hz)</span>
        </div>

        <div className="strip-item">
          <div className="strip-header-row">
            <span className="strip-label">Demand Level</span>
          </div>
          <span className={`strip-pill ${telemetry.power > 3000 ? 'warning' : 'normal'}`}>
            {telemetry.power > 3500 ? 'High Demand' : telemetry.power > 1500 ? 'Moderate Demand' : 'Normal Demand'}
          </span>
        </div>

        <div className="strip-item">
          <div className="strip-header-row">
            <span className="strip-label">Active Tariff</span>
          </div>
          <span className="strip-pill tariff font-mono">
            DISCOM Slab (₹{costSummary.tariffRate.toFixed(2)}/kWh)
          </span>
        </div>

        <div className="strip-item">
          <div className="strip-header-row">
            <span className="strip-label">IoT Node Link</span>
          </div>
          <span className="strip-val font-mono">
            {isBackendOnline ? 'Real ESP32 Gateway' : 'Precision Simulation (0.5 Hz)'}
          </span>
        </div>

        <div className="strip-item" style={{ cursor: 'pointer' }} onClick={() => setActivePage('alerts')}>
          <div className="strip-header-row">
            <span className="strip-label">System Health</span>
          </div>
          <span className={`strip-pill ${unreadAlertsCount > 0 ? 'warning' : 'alert-clean'}`}>
            {unreadAlertsCount > 0 ? `${unreadAlertsCount} Active Notification` : '0 Critical Alerts · Nominal'}
          </span>
        </div>
      </section>

      {/* 3. Primary Hero: Active Real Power Card */}
      <section className="hero-power-card">
        {/* Card Header */}
        <div className="hero-power-header">
          <div className="hero-power-title-wrap">
            <div className="hero-power-icon">
              <Gauge size={22} />
            </div>
            <div>
              <h2 className="card-title">Active Real Power</h2>
              <span className="metric-subtext">
                Work-performing active electrical load (P = V · I · cos φ)
              </span>
            </div>
          </div>

          {/* In-Card Unit Switcher */}
          <div className="unit-toggle-wrap">
            <button
              className={`unit-toggle-btn ${unitMode === 'W' ? 'active' : ''}`}
              onClick={() => setUnitMode('W')}
            >
              Watts (W)
            </button>
            <button
              className={`unit-toggle-btn ${unitMode === 'kW' ? 'active' : ''}`}
              onClick={() => setUnitMode('kW')}
            >
              kW
            </button>
          </div>
        </div>

        {/* Main Number + Sparkline */}
        <div className="hero-power-main-row">
          <div>
            <div className="hero-power-value-box">
              <span className="hero-power-number font-mono">
                <AnimatedNumber value={displayPowerVal} decimals={isKw ? 3 : 1} />
              </span>
              <span className="hero-power-unit">{powerUnit}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
              <span className="strip-pill normal font-mono">
                ✓ Within 5.0 kW Service Limit
              </span>
              <span className="metric-subtext">
                PZEM-004T Optically Isolated CT Sensor
              </span>
            </div>
          </div>

          {powerSpark.length > 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
              <Sparkline
                data={powerSpark}
                width={160}
                height={42}
                color="var(--color-gold, #d4af37)"
                strokeWidth={2.4}
              />
              <span className="metric-subtext font-mono">Live Trend (last 24s)</span>
            </div>
          )}
        </div>

        {/* 3 Comparative Baselines Bar */}
        <div className="hero-power-baselines">
          <div className="hero-baseline-item">
            <span className="hero-baseline-label">Minimum Baseline</span>
            <span className="hero-baseline-val font-mono" style={{ color: 'var(--color-success)' }}>
              {isKw ? +(telemetry.powerMin / 1000).toFixed(2) : telemetry.powerMin} {powerUnit}
            </span>
          </div>
          <div className="hero-baseline-item">
            <span className="hero-baseline-label">Average Demand</span>
            <span className="hero-baseline-val font-mono">
              {isKw ? +(avgPower / 1000).toFixed(2) : avgPower} {powerUnit}
            </span>
          </div>
          <div className="hero-baseline-item">
            <span className="hero-baseline-label">Peak Recorded</span>
            <span className="hero-baseline-val font-mono" style={{ color: 'var(--color-danger)' }}>
              {isKw ? +(telemetry.powerMax / 1000).toFixed(2) : telemetry.powerMax} {powerUnit}
            </span>
          </div>
        </div>
      </section>

      {/* 4. Electrical Metrics Row (4-Card Grid) */}
      <section className="electrical-metrics-grid">
        {/* Voltage */}
        <MetricCard
          type="voltage"
          title="Grid Voltage"
          value={telemetry.voltage}
          unit="V"
          decimals={1}
          trend={telemetry.voltage > 235 ? 'up' : telemetry.voltage < 225 ? 'down' : 'stable'}
          subtext="220 - 240V Nominal RMS"
          minVal={telemetry.voltageMin}
          maxVal={telemetry.voltageMax}
          sparklineData={voltageSpark}
          tooltip="AC mains root-mean-square voltage delivered by the utility grid."
        />

        {/* Current */}
        <MetricCard
          type="current"
          title="Current Load"
          value={telemetry.current}
          unit="A"
          decimals={2}
          trend={telemetry.current > 15 ? 'up' : 'stable'}
          subtext="0 - 100A CT Sensor"
          minVal={telemetry.currentMin}
          maxVal={telemetry.currentMax}
          sparklineData={currentSpark}
          tooltip="Total alternating current measured by PZEM-004T current transformer."
        />

        {/* Frequency */}
        <MetricCard
          type="frequency"
          title="Grid Frequency"
          value={telemetry.frequency}
          unit="Hz"
          decimals={2}
          trend="stable"
          subtext="49.5 - 50.5 Hz Stable"
          minVal={telemetry.frequencyMin}
          maxVal={telemetry.frequencyMax}
          sparklineData={freqSpark}
          tooltip="AC grid supply alternating frequency standard nominal 50.0 Hz."
        />

        {/* Power Factor */}
        <MetricCard
          type="powerFactor"
          title="Power Factor"
          value={telemetry.powerFactor}
          unit="PF"
          decimals={2}
          trend={telemetry.powerFactor < 0.88 ? 'down' : 'stable'}
          subtext="cos φ (0.85 - 1.00 Optimal)"
          tooltip="Ratio of active real power to apparent power in the building circuit."
        />
      </section>

      {/* 5. Supporting Metrics Row: Energy, Cost, Forecast & Carbon (4-Card Grid) */}
      <section className="supporting-metrics-grid">
        <div className="supporting-card">
          <div className="supporting-header">
            <span className="metric-label">Today's Total Energy</span>
            <BatteryCharging size={17} className="text-gold" />
          </div>
          <div className="metric-value-row">
            <span className="supporting-value font-mono">
              <AnimatedNumber value={costSummary.todayUnits} decimals={2} />
            </span>
            <span className="metric-unit">kWh</span>
          </div>
          <span className="supporting-sub">Cumulative PZEM-004T register</span>
        </div>

        <div className="supporting-card">
          <div className="supporting-header">
            <span className="metric-label">Today's Energy Cost</span>
            <IndianRupee size={17} className="text-gold" />
          </div>
          <div className="metric-value-row">
            <span className="supporting-value font-mono text-gold">
              ₹<AnimatedNumber value={costSummary.todayCost} decimals={2} />
            </span>
          </div>
          <span className="supporting-sub">DISCOM progressive slab</span>
        </div>

        <div className="supporting-card">
          <div className="supporting-header">
            <span className="metric-label">Projected Monthly Bill</span>
            <TrendingUp size={17} className="text-gold" />
          </div>
          <div className="metric-value-row">
            <span className="supporting-value font-mono">
              ~₹<AnimatedNumber value={costSummary.projectedMonthlyBill} decimals={2} />
            </span>
          </div>
          <span className="supporting-sub">Holt-Winters diurnal forecast</span>
        </div>

        <div className="supporting-card">
          <div className="supporting-header">
            <span className="metric-label">Carbon Footprint</span>
            <Leaf size={17} style={{ color: 'var(--color-success)' }} />
          </div>
          <div className="metric-value-row">
            <span className="supporting-value font-mono" style={{ color: 'var(--color-success)' }}>
              <AnimatedNumber value={carbonSummary.todayKgCo2} decimals={2} />
            </span>
            <span className="metric-unit">kg CO₂</span>
          </div>
          <span className="supporting-sub">CEA Grid benchmark: 0.82 kg/kWh</span>
        </div>
      </section>

      {/* 6. Interactive Analytics & Cost Widget (Split 8-col + 4-col) */}
      <section className="analytics-grid">
        {/* Left: Real-Time Power Consumption Graph */}
        <div className="analytics-main">
          <LivePowerChart
            data={chartRange === 'live' ? livePoints : chartData}
            activeRange={chartRange}
            onRangeChange={handleChartRangeChange}
            isLive={isLive}
            unitMode={unitMode}
          />
        </div>

        {/* Right: Energy Cost Widget & Telemetry Node */}
        <div className="analytics-sidebar">
          <QuickCostWidget />

          {/* Quick Hardware Diagnostic Card */}
          <div className="dashboard-card" style={{ gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={17} className="text-gold" />
                <h3 className="card-title">IoT Telemetry Node</h3>
              </div>
              <span className="strip-pill normal">
                {isBackendOnline ? 'ONLINE' : 'BENCHTOP SIM'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.78rem' }}>
              <div className="telemetry-item">
                <span className="telemetry-label">MCU Architecture</span>
                <span className="telemetry-value font-mono">ESP32-WROOM</span>
              </div>
              <div className="telemetry-item">
                <span className="telemetry-label">AC Sensor</span>
                <span className="telemetry-value font-mono">PZEM-004T v3</span>
              </div>
              <div className="telemetry-item">
                <span className="telemetry-label">Core Temp</span>
                <span className="telemetry-value font-mono">{hardware.cpuTemp}°C</span>
              </div>
              <div className="telemetry-item">
                <span className="telemetry-label">Sampling Rate</span>
                <span className="telemetry-value font-mono">2.0s (0.5 Hz)</span>
              </div>
            </div>

            <button
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.78rem', marginTop: '2px' }}
              onClick={() => setActivePage('devices')}
            >
              <span>Inspect IoT Fleet Health</span>
              <ArrowUpRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* 7. Energy Flow Distribution Map */}
      <section>
        <EnergyFlowDiagram />
      </section>
    </div>
  );
}
