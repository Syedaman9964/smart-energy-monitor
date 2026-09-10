import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EnergyProvider, useEnergy } from './context/EnergyContext';
import AppShell from './components/layout/AppShell';
import { WattVisionLogo } from './assets/logo';

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
import LoginPage from './pages/LoginPage';

// Global CSS Architecture
import './styles/variables.css';
import './styles/global.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/dashboard.css';
import './styles/pages.css';
import './styles/login.css';

/**
 * Main Dynamic Page Router with Enterprise Authentication Barrier
 */
function MainRouter() {
  const { isAuthenticated, isLoading } = useAuth();
  const { activePage, setActivePage } = useEnergy();
  const [returnTarget, setReturnTarget] = useState(null);

  // Remember attempted protected destination when unauthenticated
  useEffect(() => {
    if (!isAuthenticated && activePage !== 'login' && activePage !== 'presentation' && activePage !== 'landing') {
      setReturnTarget(activePage);
    }
  }, [activePage, isAuthenticated]);

  // If authenticated user visits /login, redirect to target or dashboard
  useEffect(() => {
    if (isAuthenticated && activePage === 'login') {
      setActivePage(returnTarget || 'dashboard');
    }
  }, [isAuthenticated, activePage, returnTarget, setActivePage]);

  // Presentation Keynote is ALWAYS public and UNTOUCHED
  if (activePage === 'presentation') {
    return <PresentationPage />;
  }

  // Public Landing Page
  if (activePage === 'landing') {
    return <LandingPage />;
  }

  // Initial Auth Session Restoration Screen
  if (isLoading) {
    return (
      <main
        style={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          backgroundColor: 'var(--bg-app, #121519)',
          color: 'var(--text-primary, #f8fafc)'
        }}
      >
        <WattVisionLogo size={46} showText={true} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--color-gold, #d4af37)',
            fontSize: '0.82rem',
            fontWeight: 500,
            letterSpacing: '0.02em'
          }}
        >
          <span className="login-spinner" style={{ width: '13px', height: '13px' }} />
          <span>Restoring Secure Gateway Session...</span>
        </div>
      </main>
    );
  }

  // Unauthenticated Barrier: All protected routes redirect to Login
  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={() => {
          const target = returnTarget || 'dashboard';
          setReturnTarget(null);
          setActivePage(target);
        }}
      />
    );
  }

  // Authenticated Dynamic Page Renderer
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
      <AuthProvider>
        <EnergyProvider>
          <MainRouter />
        </EnergyProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
