import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AccessDeniedPage = () => {
  const { user } = useAuth();

  return (
    <div style={{
      minHeight: '75vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '500px',
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        padding: '3rem 2rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--danger-bg)',
          color: 'var(--danger)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <ShieldAlert size={36} />
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.75rem' }}>
          403 Forbidden: Access Denied
        </h1>

        <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Your active account role is <strong>{user?.role || 'GUEST'}</strong>. This section is restricted to <strong>Store Administrators</strong>. Authoritative Spring Boot backend security rules prevent unauthorized access.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.25rem',
              backgroundColor: 'var(--slate-800)',
              color: '#ffffff',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.875rem'
            }}
          >
            <ArrowLeft size={16} /> Return to Dashboard
          </Link>

          <Link
            to="/pos"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.25rem',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.875rem'
            }}
          >
            <ShoppingCart size={16} /> Go to POS Terminal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedPage;
