import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Cpu, Database, Activity } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: 'var(--slate-900)',
      color: 'var(--slate-300)',
      padding: '4rem 2rem 2rem',
      borderTop: '1px solid var(--slate-800)',
      marginTop: 'auto'
    }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <ShoppingBag size={18} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                Bill<span style={{ color: 'var(--accent)' }}>Master</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-400)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Next-generation supermarket POS, inventory control, and data-driven statistical AI analytics for modern retail operations.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', background: 'var(--slate-800)', padding: '4px 8px', borderRadius: '4px', color: 'var(--slate-300)' }}>
                <Cpu size={12} color="var(--accent)" /> Real-Time Analytics
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', background: 'var(--slate-800)', padding: '4px 8px', borderRadius: '4px', color: 'var(--slate-300)' }}>
                <Database size={12} color="var(--success)" /> MySQL Persistence
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', background: 'var(--slate-800)', padding: '4px 8px', borderRadius: '4px', color: 'var(--slate-300)' }}>
                <ShieldCheck size={12} color="var(--primary)" /> Role-Based Security
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <li><Link to="/" style={{ color: 'var(--slate-400)', transition: 'color 0.2s' }}>Home</Link></li>
              <li><Link to="/about" style={{ color: 'var(--slate-400)', transition: 'color 0.2s' }}>About Platform</Link></li>
              <li><Link to="/contact" style={{ color: 'var(--slate-400)', transition: 'color 0.2s' }}>Contact Support</Link></li>
              <li><Link to="/login" style={{ color: 'var(--slate-400)', transition: 'color 0.2s' }}>Cashier & Admin Login</Link></li>
              <li><Link to="/signup" style={{ color: 'var(--slate-400)', transition: 'color 0.2s' }}>New Account Sign Up</Link></li>
            </ul>
          </div>

          {/* Core Modules */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Platform Modules
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--slate-400)' }}>
              <li>Point of Sale (POS) Billing</li>
              <li>Catalog & Inventory Management</li>
              <li>Executive Sales Reports</li>
              <li>Smart Restock Recommendations</li>
              <li>Sales Anomaly Detection</li>
              <li>Statistical Demand Forecasting</li>
            </ul>
          </div>

          {/* System Info */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Architecture
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-400)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              Engineered with Spring Boot 3.3.4, Hibernate JPA, React 18, and MySQL 8.0.
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-400)', lineHeight: 1.6 }}>
              AI insights derive transparently from empirical transaction frequency and standard statistical variances.
            </p>
          </div>
        </div>

        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid var(--slate-800)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--slate-500)'
        }}>
          <div>
            &copy; {new Date().getFullYear()} BillMaster Supermarket Systems. All rights reserved.
          </div>
          <div>
            Authoritative Server Validation &bull; Zero Hallucinated AI &bull; Production Ready
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
