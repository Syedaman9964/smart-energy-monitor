import React from 'react';
import { LayoutDashboard, Activity, GitBranch, BarChart3, Tv, Cpu, Bell } from 'lucide-react';
import { useEnergy } from '../../context/EnergyContext';

export default function MobileNav() {
  const { activePage, setActivePage, alerts } = useEnergy();

  const mobileItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'live', label: 'Live', icon: Activity },
    { id: 'flow', label: 'Flow', icon: GitBranch },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'appliances', label: 'Loads', icon: Tv },
    { id: 'devices', label: 'IoT', icon: Cpu },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: alerts.filter(a => !a.read).length }
  ];

  return (
    <nav className="mobile-bottom-nav">
      {mobileItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
            onClick={() => setActivePage(item.id)}
          >
            <div style={{ position: 'relative' }}>
              <Icon size={20} />
              {item.badge > 0 && <span className="mobile-notif-dot" />}
            </div>
            <span style={{ fontSize: '0.65rem', marginTop: '2px', fontWeight: isActive ? 600 : 400 }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
