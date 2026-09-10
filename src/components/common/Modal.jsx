import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Reusable Accessible Modal Component
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  iconColor = '#10b981',
  children,
  maxWidth = '520px'
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose}>
          <motion.div
            className="modal-dialog"
            style={{ maxWidth }}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.93, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {Icon && (
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: iconColor
                    }}
                  >
                    <Icon size={20} />
                  </div>
                )}
                <div>
                  <h3 className="modal-title">{title}</h3>
                  {subtitle && (
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>

              <button className="btn-icon" onClick={onClose} aria-label="Close modal">
                <X size={18} />
              </button>
            </div>

            <div style={{ marginTop: '0.5rem' }}>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
