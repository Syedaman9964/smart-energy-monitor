import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, LayoutDashboard, Activity, GitBranch, BarChart3, Tv, Cpu, Bell, History, FileText, DollarSign, Leaf, Settings, ArrowRight, Zap, BookOpen } from 'lucide-react';
import { useEnergy } from '../../context/EnergyContext';

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, setActivePage, appliances, alerts } = useEnergy();
  const [query, setQuery] = useState('');

  const pages = [
    { id: 'dashboard', title: 'Dashboard Overview', icon: LayoutDashboard, category: 'Navigation', desc: 'Main energy KPI summary and active power' },
    { id: 'live', title: 'Live Control Center', icon: Activity, category: 'Navigation', desc: 'Oscilloscope waveforms & real-time meters' },
    { id: 'flow', title: 'Energy Flow Map', icon: GitBranch, category: 'Navigation', desc: 'Particle power distribution diagram' },
    { id: 'analytics', title: 'Deep Analytics', icon: BarChart3, category: 'Navigation', desc: 'Load profiles, PF trends & weekly comparisons' },
    { id: 'prediction', title: 'AI Energy Prediction', icon: Zap, category: 'AI & Forecasting', desc: '24-hour predictive curves and What-If simulator' },
    { id: 'appliances', title: 'Appliance Inventory', icon: Tv, category: 'Navigation', desc: 'AC, fridge, lights and hardware loads' },
    { id: 'devices', title: 'IoT Device Fleet (ESP32)', icon: Cpu, category: 'Hardware', desc: 'PZEM-004T link, telemetry diagnostics' },
    { id: 'alerts', title: 'Alerts & Anomalies', icon: Bell, category: 'Monitoring', desc: 'Grid sags, voltage spikes and power alerts' },
    { id: 'history', title: 'Historical Logs', icon: History, category: 'Data', desc: 'Tabular logs with CSV & JSON exports' },
    { id: 'reports', title: 'Executive Reports', icon: FileText, category: 'Data', desc: 'Daily, weekly and monthly energy audits' },
    { id: 'tariff', title: 'Tariff & Cost Calculator', icon: DollarSign, category: 'Billing', desc: 'Multi-tier $/kWh rates and monthly bill forecast' },
    { id: 'carbon', title: 'Carbon & Sustainability', icon: Leaf, category: 'Eco', desc: 'CO2 emissions and tree offsets' },
    { id: 'docs', title: 'Developer Documentation', icon: BookOpen, category: 'Documentation', desc: 'System architecture, API, and Viva defense' },
    { id: 'settings', title: 'System Settings', icon: Settings, category: 'Config', desc: 'Sampling rates, MQTT placeholders & thresholds' },
  ];

  const filteredResults = useMemo(() => {
    if (!query.trim()) return pages.slice(0, 6);
    const q = query.toLowerCase();

    const matchedPages = pages.filter(p => 
      p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );

    const matchedAppliances = appliances.filter(a => 
      a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)
    ).map(a => ({
      id: 'appliances',
      title: a.name,
      icon: Tv,
      category: 'Appliance',
      desc: `${a.power}W active load · ${a.room}`
    }));

    const matchedAlerts = alerts.filter(al =>
      al.title.toLowerCase().includes(q) || al.description.toLowerCase().includes(q)
    ).map(al => ({
      id: 'alerts',
      title: al.title,
      icon: Bell,
      category: 'Alert',
      desc: al.description
    }));

    return [...matchedPages, ...matchedAppliances, ...matchedAlerts];
  }, [query, appliances, alerts]);

  if (!isSearchOpen) return null;

  const handleSelect = (pageId) => {
    setActivePage(pageId);
    setIsSearchOpen(false);
    setQuery('');
  };

  return (
    <div className="modal-overlay" onClick={() => setIsSearchOpen(false)}>
      <motion.div
        className="modal-dialog"
        style={{ maxWidth: '600px', padding: 0, overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      >
        {/* Search Input Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface-secondary)'
        }}>
          <Search size={19} className="text-gold" />
          <input
            autoFocus
            type="text"
            placeholder="Search pages, appliances, alerts, or hardware telemetry... (ESC to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.96rem',
              fontFamily: 'inherit'
            }}
          />
          <span style={{
            fontSize: '0.7rem',
            padding: '2px 6px',
            borderRadius: '4px',
            background: 'var(--bg-surface-tertiary)',
            color: 'var(--text-muted)'
          }}>
            ESC
          </span>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '8px' }}>
          {filteredResults.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No results found for "{query}".
            </div>
          ) : (
            filteredResults.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={`${item.id}-${idx}`}
                  onClick={() => handleSelect(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    marginBottom: '3px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface-secondary)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      background: 'var(--color-gold-surface)',
                      color: 'var(--color-gold)',
                      border: '1px solid var(--color-gold-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '0.68rem',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: 'var(--bg-surface-tertiary)',
                      color: 'var(--text-muted)'
                    }}>
                      {item.category}
                    </span>
                    <ArrowRight size={13} style={{ color: 'var(--text-muted)' }} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
}
