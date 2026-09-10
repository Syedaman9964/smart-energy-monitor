import React from 'react';
import { ToastProvider } from './context/ToastContext';
import { EnergyProvider, useEnergy } from './context/EnergyContext';
import AppShell from './components/layout/AppShell';

// Specialized Feature Pages
import DashboardPage from './pages/DashboardPage';
import LiveMonitoringPage from './pages/LiveMonitoringPage';
import EnergyFlowPage from './pages/EnergyFlowPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AppliancesPage from './pages/AppliancesPage';
import DevicesPage from './pages/DevicesPage';
import AlertsPage from './pages/AlertsPage';
import HistoryPage from './pages/HistoryPage';
import ReportsPage from './pages/ReportsPage';
import TariffPage from './pages/TariffPage';
import CarbonFootprintPage from './pages/CarbonFootprintPage';
import PredictionPage from './pages/PredictionPage';
import SettingsPage from './pages/SettingsPage';
import DocumentationPage from './pages/DocumentationPage';
import LandingPage from './pages/LandingPage';
import PresentationPage from './pages/PresentationPage';

// Global CSS Architecture
import './styles/variables.css';
import './styles/global.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/dashboard.css';
import './styles/pages.css';

/**
 * Main Dynamic Page Router
 */
function MainRouter() {
  const { activePage } = useEnergy();

  if (activePage === 'presentation') {
    return <PresentationPage />;
  }

  if (activePage === 'landing') {
    return <LandingPage />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'live':
        return <LiveMonitoringPage />;
      case 'flow':
        return <EnergyFlowPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'prediction':
        return <PredictionPage />;
      case 'appliances':
        return <AppliancesPage />;
      case 'devices':
        return <DevicesPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'history':
        return <HistoryPage />;
      case 'reports':
        return <ReportsPage />;
      case 'tariff':
        return <TariffPage />;
      case 'carbon':
        return <CarbonFootprintPage />;
      case 'settings':
        return <SettingsPage />;
      case 'docs':
        return <DocumentationPage />;
      default:
        return <DashboardPage />;
    }
  };

  return <AppShell>{renderPage()}</AppShell>;
}

/**
 * App Root with Context Providers
 */
export default function App() {
  return (
    <ToastProvider>
      <EnergyProvider>
        <MainRouter />
      </EnergyProvider>
    </ToastProvider>
  );
}
