import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast = { id, type, title, message };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} style={{ color: '#10b981' }} />;
      case 'warning':
        return <AlertTriangle size={18} style={{ color: '#f59e0b' }} />;
      case 'error':
        return <XCircle size={18} style={{ color: '#ef4444' }} />;
      default:
        return <Info size={18} style={{ color: '#38bdf8' }} />;
    }
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Fixed Toast Container */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '380px',
          width: 'calc(100% - 48px)',
          pointerEvents: 'none'
        }}
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              style={{
                pointerEvents: 'auto',
                background: '#111827',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '12px 16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                color: '#f3f4f6'
              }}
            >
              <div style={{ marginTop: '2px', flexShrink: 0 }}>
                {getIcon(toast.type)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {toast.title && (
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '2px' }}>
                    {toast.title}
                  </div>
                )}
                {toast.message && (
                  <div style={{ fontSize: '0.8rem', color: '#9ca3af', lineHeight: 1.4 }}>
                    {toast.message}
                  </div>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  color: '#6b7280',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
