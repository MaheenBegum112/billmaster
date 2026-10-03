import React from 'react';
import { AlertCircle, Inbox, RefreshCw } from 'lucide-react';

const EmptyState = ({
  isError = false,
  title,
  message,
  onRetry = null,
  actionButton = null,
  minHeight = '280px'
}) => {
  const defaultTitle = isError ? 'Unable to Load Data' : 'No Records Found';
  const defaultMessage = isError
    ? 'A network or server communication error occurred. Please check your connection and retry.'
    : 'There are currently no items available to display.';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: minHeight,
      padding: '2.5rem 1.5rem',
      textAlign: 'center',
      backgroundColor: '#ffffff',
      borderRadius: 'var(--radius-lg)',
      border: '1px dashed var(--border-color)',
      margin: '1rem 0'
    }}>
      <div style={{
        width: '52px',
        height: '52px',
        borderRadius: 'var(--radius-full)',
        backgroundColor: isError ? 'var(--danger-bg)' : 'var(--slate-100)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem'
      }}>
        {isError ? (
          <AlertCircle size={26} color="var(--danger)" />
        ) : (
          <Inbox size={26} color="var(--slate-400)" />
        )}
      </div>

      <h4 style={{
        fontSize: '1.05rem',
        fontWeight: 700,
        color: isError ? 'var(--danger)' : 'var(--slate-800)',
        marginBottom: '0.4rem'
      }}>
        {title || defaultTitle}
      </h4>

      <p style={{
        fontSize: '0.875rem',
        color: 'var(--slate-500)',
        maxWidth: '420px',
        lineHeight: 1.5,
        marginBottom: onRetry || actionButton ? '1.25rem' : 0
      }}>
        {message || defaultMessage}
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1.25rem',
              backgroundColor: 'var(--slate-800)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} /> Retry Request
          </button>
        )}
        {actionButton}
      </div>
    </div>
  );
};

export default EmptyState;
