import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Activity,
  GitBranch,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  ArrowRight,
  Sparkles,
  LayoutDashboard,
  Play,
  Layers,
  DollarSign,
  Leaf,
  BookOpen,
  Server,
  Tv,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Globe,
  Radio,
  FileCode
} from 'lucide-react';
import { WattVisionLogo } from '../assets/logo';
import { useEnergy } from '../context/EnergyContext';

export default function LandingPage() {
  const { setActivePage, telemetry, tariffConfig } = useEnergy();
  const [livePower, setLivePower] = useState(1820);

  // Gentle live fluctuation for the hero teaser
  useEffect(() => {
    const timer = setInterval(() => {
      setLivePower(Math.round(1800 + (Math.random() - 0.48) * 85));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#05080f',
      color: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Background radial gradient lighting */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '1400px',
        height: '650px',
        background: 'radial-gradient(ellipse at 50% 10%, rgba(6, 182, 212, 0.15) 0%, rgba(16, 185, 129, 0.05) 45%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* 1. Sticky Navigation Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        backgroundColor: 'rgba(5, 8, 15, 0.85)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '0.85rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <WattVisionLogo size={32} showText={true} />
        </div>

        {/* Center Nav Anchors */}
        <nav style={{ display: 'flex', gap: '1.5rem', fontSize: '0.88rem' }} className="pres-hide-mobile">
          <button onClick={() => scrollToSection('problem')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontWeight: 500 }}>
            Problem
          </button>
          <button onClick={() => scrollToSection('solution')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontWeight: 500 }}>
            Solution
          </button>
          <button onClick={() => scrollToSection('hardware')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontWeight: 500 }}>
            Hardware
          </button>
          <button onClick={() => scrollToSection('architecture')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontWeight: 500 }}>
            Architecture
          </button>
          <button onClick={() => scrollToSection('billing')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontWeight: 500 }}>
            DISCOM Slabs
          </button>
          <button onClick={() => setActivePage('docs')} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontWeight: 600 }}>
            Docs & Viva
          </button>
        </nav>

        {/* Right CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setActivePage('presentation')}
            className="pres-btn-nav"
            style={{
              background: 'rgba(6, 182, 212, 0.15)',
              borderColor: 'rgba(6, 182, 212, 0.4)',
              color: '#38bdf8'
            }}
          >
            <Sparkles size={14} />
            <span>Keynote</span>
          </button>

          <button
            onClick={() => setActivePage('dashboard')}
            className="btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
          >
            <LayoutDashboard size={15} />
            <span>Launch App</span>
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '5rem 2rem 4rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 14px',
            borderRadius: '999px',
            background: 'rgba(6, 182, 212, 0.1)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            color: '#38bdf8',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            marginBottom: '1.25rem'
          }}
        >
          <Zap size={14} />
          <span>COMMERCIAL-GRADE IOT ENERGY INTELLIGENCE</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.035em',
            color: '#ffffff',
            maxWidth: '960px',
            marginBottom: '1.25rem'
          }}
        >
          See Energy. Understand Energy.{' '}
          <span style={{
            background: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Predict Energy.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          style={{
            fontSize: 'clamp(1rem, 1.4vw, 1.25rem)',
            color: '#94a3b8',
            maxWidth: '820px',
            lineHeight: 1.6,
            marginBottom: '2.5rem'
          }}
        >
          Bridging physical 230V AC conductors with sub-second ESP32 edge telemetry, optical galvanic isolation, Indian DISCOM multi-slab tariff intelligence, and control-room analytics.
        </motion.p>

        {/* 3 Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '3.5rem'
          }}
        >
          <button
            onClick={() => setActivePage('dashboard')}
            className="btn-primary"
            style={{
              padding: '12px 28px',
              fontSize: '1rem',
              boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <LayoutDashboard size={18} />
            <span>Launch Dashboard</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => setActivePage('presentation')}
            className="btn-secondary"
            style={{
              padding: '12px 24px',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderColor: 'rgba(6, 182, 212, 0.4)',
              color: '#38bdf8'
            }}
          >
            <Sparkles size={18} />
            <span>View Presentation</span>
          </button>

          <button
            onClick={() => scrollToSection('architecture')}
            className="btn-secondary"
            style={{
              padding: '12px 24px',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <GitBranch size={18} style={{ color: '#f59e0b' }} />
            <span>Explore Architecture</span>
          </button>
        </motion.div>

        {/* Live Hero Telemetry Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            width: '100%',
            maxWidth: '1080px',
            background: 'rgba(13, 20, 36, 0.75)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '16px',
            backdropFilter: 'blur(16px)',
            padding: '1.75rem',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '1rem',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
                LIVE BENCHTOP TELEMETRY FEED
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--pres-text-muted)' }}>
                (PZEM-004T UART @ 9600 Baud)
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '0.72rem',
                color: '#34d399',
                background: 'rgba(16, 185, 129, 0.12)',
                padding: '3px 10px',
                borderRadius: '6px',
                fontWeight: 600
              }}>
                1.0 Hz SUB-SECOND SAMPLING
              </span>
            </div>
          </div>

          {/* 5 Real-Time KPIs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '10px', textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Grid Voltage</div>
              <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
                230.4 V
              </div>
              <div style={{ fontSize: '0.7rem', color: '#10b981', marginTop: '2px' }}>Single-Phase RMS</div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '10px', textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Load Current</div>
              <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#06b6d4', marginTop: '4px' }}>
                7.92 A
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>100A CT Secondary</div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '10px', textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Active Power</div>
              <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
                {livePower} W
              </div>
              <div style={{ fontSize: '0.7rem', color: '#10b981', marginTop: '2px' }}>P = V × I × cos φ</div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '10px', textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Grid Frequency</div>
              <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
                50.01 Hz
              </div>
              <div style={{ fontSize: '0.7rem', color: '#f59e0b', marginTop: '2px' }}>National Grid 50Hz</div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '10px', textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Power Factor</div>
              <div className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#a855f7', marginTop: '4px' }}>
                0.96 PF
              </div>
              <div style={{ fontSize: '0.7rem', color: '#34d399', marginTop: '2px' }}>High Efficiency</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. Problem Section */}
      <section id="problem" style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '4rem 2rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ef4444', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            The Industry Problem
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.4rem', color: '#ffffff' }}>
            The Hidden Cost of Blind Energy Consumption
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '680px', margin: '0.5rem auto 0 auto', lineHeight: 1.5 }}>
            Traditional utility meters are backward-looking cash registers that log cumulative units 30 days late, giving consumers zero actionable intelligence.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {[
            {
              title: '30-Day Billing Latency',
              desc: 'Consumers only learn of high electricity usage weeks after appliances have already wasted power, making proactive intervention impossible.',
              color: '#ef4444'
            },
            {
              title: 'Phantom Standby Current',
              desc: 'Continuous vampire draw from inverters, set-top boxes, and idle chargers quietly consumes 8–12% of total household power unnoticed.',
              color: '#f59e0b'
            },
            {
              title: 'Unnoticed Power Factor Drops',
              desc: 'Inductive motor loads degrade power factor below 0.85, drawing excessive reactive current that heats domestic cables without doing useful work.',
              color: '#f97316'
            },
            {
              title: 'Silent Voltage Degradation',
              desc: 'Voltage surges (>255V) and sags (<195V) pass undetected, shortening the lifespan of sensitive inverter ACs and compressors.',
              color: '#ec4899'
            }
          ].map((item) => (
            <div
              key={item.title}
              style={{
                background: 'rgba(13, 20, 36, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderLeft: `4px solid ${item.color}`,
                borderRadius: '12px',
                padding: '1.5rem'
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Solution Section */}
      <section id="solution" style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '4rem 2rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            The WattVision Solution
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.4rem', color: '#ffffff' }}>
            Edge Sensing Meets Cloud Analytics
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '680px', margin: '0.5rem auto 0 auto', lineHeight: 1.5 }}>
            A four-tier integrated ecosystem providing sub-second electrical parameter sampling, Indian DISCOM tariff calculation, and predictive insights.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {[
            {
              icon: Zap,
              color: '#f59e0b',
              title: '0.5% High-Precision Sensing',
              desc: 'Dedicated SD3004 energy metering ASIC with 3.75 kV optical galvanic isolation from dangerous 230V AC mains.'
            },
            {
              icon: Cpu,
              color: '#38bdf8',
              title: 'Dual-Core FreeRTOS Edge',
              desc: 'ESP32 microcontroller running deterministic Modbus-RTU queries on Core 0 and Wi-Fi / I2C LCD transport on Core 1.'
            },
            {
              icon: Radio,
              color: '#a855f7',
              title: 'Sub-Second WebSockets',
              desc: 'Full-duplex real-time pipe continuously streaming 6 electrical parameters at 1.0 Hz with automated anomaly detection.'
            },
            {
              icon: DollarSign,
              color: '#10b981',
              title: 'Indian DISCOM Slab Engine',
              desc: 'Tiered tariff calculation modeling BESCOM, TANGEDCO, MSEDCL, BSES, and UPPCL with fixed demand charges and FAC.'
            }
          ].map((sol) => {
            const Icon = sol.icon;
            return (
              <div
                key={sol.title}
                style={{
                  background: 'rgba(13, 20, 36, 0.6)',
                  border: '1px solid rgba(56, 189, 248, 0.18)',
                  borderRadius: '14px',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: `${sol.color}1a`,
                  color: sol.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={22} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                  {sol.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.55 }}>
                  {sol.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Hardware Engineering Section */}
      <section id="hardware" style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '4rem 2rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Benchtop Hardware
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.4rem', color: '#ffffff' }}>
            Engineered for High-Voltage Safety
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '680px', margin: '0.5rem auto 0 auto', lineHeight: 1.5 }}>
            Designed with non-invasive 100A current transformer clamps and dual PC817 optocouplers to isolate low-voltage digital electronics.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {[
            {
              tag: 'MICROCONTROLLER',
              title: 'ESP32-WROOM-32',
              spec: 'Xtensa 32-bit Dual-Core LX6 @ 240 MHz',
              desc: 'Handles Modbus CRC verification, Wi-Fi auto-reconnect, and LCD display cycling via FreeRTOS multitasking.',
              color: '#38bdf8'
            },
            {
              tag: 'METERING SENSOR',
              title: 'PZEM-004T v3.0',
              spec: 'Dedicated SD3004 Energy Metering ASIC',
              desc: 'Features True RMS AC measurement, integrated shunt calibration, and 3.75 kV galvanic optical isolation.',
              color: '#06b6d4'
            },
            {
              tag: 'CURRENT INDUCTION',
              title: '100A Split-Core CT',
              spec: '100A : 50mA Secondary Induction Ratio',
              desc: 'Clamps around phase conductor without severing or stripping high-voltage wiring, ensuring non-invasive installation.',
              color: '#f59e0b'
            },
            {
              tag: 'LOCAL READOUT',
              title: '16x2 Character LCD',
              spec: 'PCF8574 I2C Backpack Interface',
              desc: 'Provides continuous local electrical metrics even in remote areas where Wi-Fi or internet connection drops.',
              color: '#10b981'
            }
          ].map((h) => (
            <div
              key={h.title}
              style={{
                background: 'rgba(13, 20, 36, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderTop: `3px solid ${h.color}`,
                borderRadius: '12px',
                padding: '1.5rem'
              }}
            >
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: h.color, letterSpacing: '0.06em' }}>
                {h.tag}
              </span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', margin: '0.4rem 0 0.2rem 0' }}>
                {h.title}
              </h3>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.75rem' }}>
                {h.spec}
              </div>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                {h.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Safety Disclaimer Banner */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem 1.5rem',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <ShieldAlert size={22} style={{ color: '#ef4444', flexShrink: 0 }} />
          <div style={{ fontSize: '0.82rem', color: '#fca5a5', lineHeight: 1.45 }}>
            <strong>High-Voltage Safety Notice:</strong> 230V AC mains electricity carries severe electric shock and fire hazards. Physical installation requires qualified electrical supervision and strict galvanic benchtop isolation.
          </div>
        </div>
      </section>

      {/* 6. Architecture Section */}
      <section id="architecture" style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '4rem 2rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a855f7', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            System Architecture
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.4rem', color: '#ffffff' }}>
            Data Flow Pipeline: Grid to Dashboard
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '680px', margin: '0.5rem auto 0 auto', lineHeight: 1.5 }}>
            Sub-second telemetry dispatched across TTL UART, local Wi-Fi, Node.js Express, and full-duplex WebSockets.
          </p>
        </div>

        <div style={{
          background: 'rgba(13, 20, 36, 0.7)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: '16px',
          padding: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          textAlign: 'center'
        }}>
          {[
            { step: '01', title: '230V AC Mains', desc: 'Phase current inducted via 100A CT clamp' },
            { step: '02', title: 'PZEM-004T', desc: 'True RMS sampling via dedicated ASIC' },
            { step: '03', title: 'ESP32 MCU', desc: 'FreeRTOS Core 0 Modbus-RTU UART query' },
            { step: '04', title: 'Node.js Gateway', desc: 'Express REST & WebSocket broadcast pipe' },
            { step: '05', title: 'React 19 App', desc: 'Live Recharts SVG area graphs & DISCOM slabs' }
          ].map((st, idx) => (
            <div
              key={st.step}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '1.25rem 1rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div className="font-mono" style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 800, marginBottom: '0.4rem' }}>
                STEP {st.step}
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.4rem' }}>
                {st.title}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
                {st.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Indian DISCOM Billing Section */}
      <section id="billing" style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '4rem 2rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Tariff Engine
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.4rem', color: '#ffffff' }}>
            Indian DISCOM Progressive Slab Mathematics
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '680px', margin: '0.5rem auto 0 auto', lineHeight: 1.5 }}>
            Accurate billing calculation modeling state-specific tiered slabs, fixed connection demand charges, FAC, and state electricity duty in Indian Rupees (₹).
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {[
            { discom: 'BESCOM', state: 'Karnataka', base: '₹4.15 – ₹8.20 / unit', fixed: '₹110 / kW' },
            { discom: 'TANGEDCO', state: 'Tamil Nadu', base: '0 – 100 Free Slabs', fixed: '₹75 / kW' },
            { discom: 'MSEDCL', state: 'Maharashtra', base: '₹5.88 – ₹17.81 / unit', fixed: '₹128 / kW' },
            { discom: 'BSES', state: 'Delhi', base: 'Subsidized Tiered Slabs', fixed: '₹90 / kW' },
            { discom: 'UPPCL', state: 'Uttar Pradesh', base: '₹5.50 – ₹7.00 / unit', fixed: '₹110 / kW' }
          ].map((d) => (
            <div
              key={d.discom}
              style={{
                background: 'rgba(13, 20, 36, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '1.25rem',
                borderRadius: '12px'
              }}
            >
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>{d.discom}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.6rem' }}>{d.state}</div>
              <div style={{ fontSize: '0.8rem', color: '#f1f5f9', fontWeight: 600 }}>{d.base}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--pres-text-muted)', marginTop: '2px' }}>Fixed: {d.fixed}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Call to Action / Pitch Banner */}
      <section style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '5rem 2rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        textAlign: 'center'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(16, 185, 129, 0.12) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '20px',
          padding: '3.5rem 2rem',
          maxWidth: '920px',
          margin: '0 auto'
        }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
            Ready to Experience WattVision Live?
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
            Explore the live 13-page executive control room dashboard or view the full 15-slide keynote product presentation.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActivePage('dashboard')}
              className="btn-primary"
              style={{ padding: '12px 28px', fontSize: '1rem' }}
            >
              <LayoutDashboard size={18} />
              <span>Launch Live Dashboard</span>
            </button>

            <button
              onClick={() => setActivePage('presentation')}
              className="btn-secondary"
              style={{ padding: '12px 24px', fontSize: '1rem', color: '#38bdf8', borderColor: 'rgba(6, 182, 212, 0.5)' }}
            >
              <Sparkles size={18} />
              <span>Launch Keynote Presentation</span>
            </button>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '2.5rem 2rem',
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        fontSize: '0.82rem',
        color: '#64748b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <WattVisionLogo size={24} showText={true} />
          <span>• IoT Energy Intelligence & Analytics</span>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <button onClick={() => setActivePage('dashboard')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            Dashboard
          </button>
          <button onClick={() => setActivePage('presentation')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            Presentation
          </button>
          <button onClick={() => setActivePage('docs')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            Viva Voce Guide
          </button>
        </div>

        <div>
          © 2026 WattVision Platform. Built with React 19, Vite, Node.js & ESP32.
        </div>
      </footer>
    </div>
  );
}
