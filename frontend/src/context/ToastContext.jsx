import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '420px',
        width: '100%',
        pointerEvents: 'none'
      }}>
        {toasts.map((toast) => {
          let bg = '#ffffff';
          let border = 'var(--border-color)';
          let color = 'var(--slate-800)';
          let icon = <Info size={18} color="var(--primary)" />;

          if (toast.type === 'success') {
            bg = '#ecfdf5';
            border = 'var(--success-border)';
            color = '#065f46';
            icon = <CheckCircle2 size={18} color="var(--success)" />;
          } else if (toast.type === 'error') {
            bg = '#fef2f2';
            border = 'var(--danger-border)';
            color = '#991b1b';
            icon = <AlertCircle size={18} color="var(--danger)" />;
          } else if (toast.type === 'warning') {
            bg = '#fffbeb';
            border = 'var(--warning-border)';
            color = '#92400e';
            icon = <AlertTriangle size={18} color="var(--warning)" />;
          }

          return (
            <div
              key={toast.id}
              style={{
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: bg,
                border: `1px solid ${border}`,
                boxShadow: 'var(--shadow-lg)',
                color: color,
                fontSize: '0.9rem',
                fontWeight: 500,
                lineHeight: 1.4,
                animation: 'slideUp 0.25s ease-out'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {icon}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'inherit',
                  opacity: 0.7,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px'
                }}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
