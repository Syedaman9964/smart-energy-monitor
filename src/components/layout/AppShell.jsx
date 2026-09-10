import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileNav from './MobileNav';
import SearchModal from '../common/SearchModal';
import { useEnergy } from '../../context/EnergyContext';

export default function AppShell({ children }) {
  const { isSidebarCollapsed, activePage } = useEnergy();

  return (
    <div className="app-layout">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main viewport */}
      <div className={`app-main-wrapper ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <TopBar />
        <main className="app-content-area">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 8, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.995 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: '100%' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile bottom nav drawer */}
      <MobileNav />

      {/* Global Command Palette */}
      <SearchModal />
    </div>
  );
}
