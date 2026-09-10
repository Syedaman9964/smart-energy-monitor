import React, { useState, useMemo } from 'react';
import {
  Tv,
  Wind,
  Refrigerator,
  Monitor,
  Lightbulb,
  Coffee,
  Zap,
  Search,
  Plus,
  Power
} from 'lucide-react';
import { useEnergy } from '../context/EnergyContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';

export default function AppliancesPage() {
  const { appliances, toggleApplianceDemo } = useEnergy();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('power');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const categories = ['ALL', 'HVAC', 'Kitchen', 'Electronics', 'Entertainment', 'Lighting', 'Laundry', 'General'];

  const iconMap = {
    Wind,
    Refrigerator,
    Monitor,
    Tv,
    Lightbulb,
    Coffee,
    Zap
  };

  const filteredAppliances = useMemo(() => {
    return appliances
      .filter((app) => {
        const matchesCategory = selectedCategory === 'ALL' || app.category === selectedCategory;
        const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              app.room.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'power') return b.power - a.power;
        if (sortBy === 'energy') return b.energyToday - a.energyToday;
        if (sortBy === 'cost') return b.costToday - a.costToday;
        return a.name.localeCompare(b.name);
      });
  }, [appliances, searchQuery, selectedCategory, sortBy]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setIsAddModalOpen(false);
    addToast({
      type: 'info',
      title: 'Appliance Added to Registry',
      message: 'New load registered for telemetry sub-circuit mapping.'
    });
  };

  return (
    <div className="dashboard-content-grid">
      {/* Top Banner */}
      <section className="page-header">
        <div className="page-header-main">
          <div className="page-header-title-row">
            <h1 className="page-title">Appliance Load Inventory</h1>
          </div>
          <p className="page-subtitle">
            Real-time telemetry and energy disaggregation per individual branch circuit and load.
          </p>
        </div>

        <div className="page-header-actions">
          <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={15} />
            <span>Register Appliance</span>
          </button>
        </div>
      </section>

      {/* Controls & Filter Bar */}
      <section className="dashboard-card" style={{ padding: '1rem', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '240px', flex: 1 }}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search appliance by name or room..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ width: '100%', padding: '6px 12px', fontSize: '0.84rem' }}
          />
        </div>

        {/* Category Filter Pills */}
        <div className="tab-button-group" style={{ overflowX: 'auto', maxWidth: '100%' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`tab-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="metric-label" style={{ textTransform: 'none' }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-input"
            style={{ padding: '6px 10px', fontSize: '0.82rem' }}
          >
            <option value="power">Active Power (Watts)</option>
            <option value="energy">Energy Today (kWh)</option>
            <option value="cost">Estimated Cost (₹)</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </section>

      {/* Appliances Grid Cards */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filteredAppliances.map((app) => {
          const Icon = iconMap[app.iconName] || Zap;
          const isActive = app.status === 'ON';

          return (
            <div key={app.id} className="dashboard-card" style={{ gap: '1rem', padding: '1.25rem' }}>
              {/* Top Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      background: isActive ? 'var(--color-gold-surface)' : 'var(--bg-surface-secondary)',
                      color: isActive ? 'var(--color-gold)' : 'var(--text-muted)',
                      border: `1px solid ${isActive ? 'var(--color-gold-border)' : 'var(--border-subtle)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 className="card-title">{app.name}</h4>
                    <span className="metric-subtext">
                      {app.room} · {app.category}
                    </span>
                  </div>
                </div>

                {/* Status Toggle (Demo with notice) */}
                <button
                  onClick={() => toggleApplianceDemo(app.id)}
                  title="Demo control switch (Hardware integration pending)"
                  style={{
                    padding: '3px 9px',
                    borderRadius: '999px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: isActive ? 'var(--color-gold-surface)' : 'var(--bg-surface-secondary)',
                    color: isActive ? 'var(--color-gold)' : 'var(--text-muted)',
                    border: `1px solid ${isActive ? 'var(--color-gold-border)' : 'var(--border-subtle)'}`
                  }}
                >
                  <Power size={11} />
                  <span>{isActive ? 'ACTIVE' : 'STANDBY'}</span>
                </button>
              </div>

              {/* Power & Energy Figures */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', background: 'var(--bg-surface-secondary)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <span className="metric-label">Active Power</span>
                  <div className="metric-value-row" style={{ marginTop: '2px' }}>
                    <span className="font-mono" style={{ fontSize: '1rem', fontWeight: 700, color: isActive ? 'var(--color-gold)' : 'var(--text-muted)' }}>
                      {app.power}
                    </span>
                    <span className="metric-unit" style={{ fontSize: '0.75rem' }}>W</span>
                  </div>
                </div>
                <div>
                  <span className="metric-label">Energy Today</span>
                  <div className="metric-value-row" style={{ marginTop: '2px' }}>
                    <span className="font-mono" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {app.energyToday}
                    </span>
                    <span className="metric-unit" style={{ fontSize: '0.75rem' }}>kWh</span>
                  </div>
                </div>
                <div>
                  <span className="metric-label">Est. Cost</span>
                  <div className="metric-value-row" style={{ marginTop: '2px' }}>
                    <span className="font-mono" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      ₹{app.costToday}
                    </span>
                  </div>
                </div>
              </div>

              {/* Consumption Share Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <span>Total Load Share</span>
                  <span className="font-mono" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{app.usagePercentage}%</span>
                </div>
                <div style={{ width: '100%', height: '5px', background: 'var(--bg-surface-tertiary)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${app.usagePercentage}%`,
                      height: '100%',
                      background: 'var(--color-gold)'
                    }}
                  />
                </div>
              </div>

              {/* Footer info */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
                <span>{app.lastActive}</span>
                <span className="metric-range-badge">Priority {app.priority}</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Add Appliance Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Appliance"
        subtitle="Configure sub-circuit and nominal power rating"
        icon={Tv}
      >
        <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Appliance / Load Name</label>
            <input type="text" className="form-input" placeholder="e.g. Electric Vehicle Charger" required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input">
                <option value="HVAC">HVAC</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Electronics">Electronics</option>
                <option value="Lighting">Lighting</option>
                <option value="EV">EV & Charging</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Rated Power (Watts)</label>
              <input type="number" className="form-input font-mono" placeholder="1500" required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Room / Location</label>
            <input type="text" className="form-input" placeholder="e.g. Garage" />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save to Registry
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
