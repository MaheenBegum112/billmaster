import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading data...', minHeight = '240px' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: minHeight,
      gap: '0.75rem',
      color: 'var(--slate-500)',
      width: '100%'
    }}>
      <Loader2
        size={32}
        color="var(--primary)"
        style={{ animation: 'spin 1s linear infinite' }}
      />
      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
        {message}
      </span>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
