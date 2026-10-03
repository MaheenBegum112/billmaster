import React from 'react';
import {
  HelpCircle,
  Shield,
  Layers,
  Cpu,
  Database,
  CheckCircle2,
  XCircle,
  FileText,
  Boxes,
  ShoppingCart,
  TrendingUp,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const InAppAboutPage = () => {
  const { user, isAdmin } = useAuth();

  const permissions = [
    { module: 'Point of Sale (POS) Checkout', admin: true, cashier: true, desc: 'Real-time barcode scanning, cart management, instant stock validation, receipt printing' },
    { module: 'Bill History & Invoicing', admin: true, cashier: true, desc: 'View transactions (cashiers view their own, admins view all), reprint thermal invoices' },
    { module: 'Product Catalog Management', admin: true, cashier: false, desc: 'Add new items, edit pricing/categories, manage barcodes, perform soft-deletions' },
    { module: 'Inventory & Stock Restocking', admin: true, cashier: false, desc: 'Monitor live stock levels, low-stock alerts, out-of-stock items, quick replenishment' },
    { module: 'Business Intelligence & Reports', admin: true, cashier: false, desc: 'Daily revenue trends, monthly sales performance, category revenue breakdown, top products' },
    { module: 'Smart Restock AI Engine', admin: true, cashier: false, desc: 'Empirical daily sales burn rate calculation and dynamic lead-horizon restock recommendations' },
    { module: 'Sales Anomaly AI Engine', admin: true, cashier: false, desc: 'Gaussian Z-score outlier detection for scanning irregularities, fraud, or bulk hoarding' },
    { module: 'Demand Forecasting AI Engine', admin: true, cashier: false, desc: 'Weighted moving average and linear regression slope projections for future inventory demand' },
    { module: 'User Accounts & Access Control', admin: true, cashier: false, desc: 'Provision cashier staff accounts, activate or deactivate user logins' },
    { module: 'System & Tax Configuration', admin: true, cashier: false, desc: 'Update store identity, receipt headers, currency, sales tax, and AI hyperparameters' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.2rem 0.65rem',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            color: 'var(--primary)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 700
          }}>
            v1.0.0 Enterprise Production
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
            Logged in as <strong>{user?.name}</strong> ({user?.role})
          </span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em', margin: 0 }}>
          About BillMaster Supermarket System
        </h1>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem', marginTop: '0.35rem', margin: 0 }}>
          Architecture reference, security specifications, and role-based authorization matrix
        </p>
      </div>

      {/* Architecture Highlights */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Database size={22} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
            ACID Relational Backend
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: 1.6, margin: 0 }}>
            Powered by Spring Boot 3.3.4 and MySQL 8.0. Every POS checkout is executed within an atomic database transaction
            ensuring zero inventory discrepancies or negative stock allocations.
          </p>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={22} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
            Stateless Security &amp; RBAC
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: 1.6, margin: 0 }}>
            Stateless JWT tokens cryptographically signed by Spring Security filters. Strict role segregation guarantees
            cashiers cannot invoke managerial endpoints or access administrative reports.
          </p>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            color: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={22} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
            Empirical AI Foundations
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: 1.6, margin: 0 }}>
            All AI insights originate from verifiable mathematical principles (Z-score standard deviation, weighted moving averages,
            and linear regression slope). Zero generative hallucinations.
          </p>
        </div>
      </div>

      {/* Role & Permissions Matrix */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-color)',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
            Dual-Role Access Control Matrix
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', margin: '0.25rem 0 0 0' }}>
            System capabilities enforced authoritatively by Spring Boot Method Security (`@PreAuthorize`)
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }}>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--slate-700)' }}>System Module &amp; Scope</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--slate-700)', textAlign: 'center', width: '120px' }}>ADMIN</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--slate-700)', textAlign: 'center', width: '120px' }}>CASHIER</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((p, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{p.module}</div>
                    <div style={{ fontSize: '0.785rem', color: 'var(--slate-500)', marginTop: '0.15rem' }}>{p.desc}</div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                    {p.admin ? (
                      <span style={{ color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700, fontSize: '0.8rem' }}>
                        <CheckCircle2 size={16} /> Allowed
                      </span>
                    ) : (
                      <span style={{ color: 'var(--danger)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700, fontSize: '0.8rem' }}>
                        <XCircle size={16} /> Blocked
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                    {p.cashier ? (
                      <span style={{ color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700, fontSize: '0.8rem' }}>
                        <CheckCircle2 size={16} /> Allowed
                      </span>
                    ) : (
                      <span style={{ color: 'var(--danger)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700, fontSize: '0.8rem' }}>
                        <XCircle size={16} /> Blocked
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InAppAboutPage;
