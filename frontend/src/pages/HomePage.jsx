import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  Boxes,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Cpu
} from 'lucide-react';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section style={{
        padding: '5rem 2rem 4rem',
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
        borderBottom: '1px solid var(--border-color)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 1rem',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1.75rem',
            border: '1px solid var(--primary-border)'
          }}>
            <Cpu size={15} />
            <span>Next-Generation Retail Decision Intelligence</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            color: 'var(--slate-900)',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem'
          }}>
            AI-Powered Supermarket Billing &amp; Inventory Management
          </h1>

          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.25rem)',
            color: 'var(--slate-600)',
            lineHeight: 1.6,
            maxWidth: '720px',
            margin: '0 auto 2.5rem'
          }}>
            Streamline high-speed cashier checkout, eliminate stockouts with empirical restock models, and identify sales patterns with zero-hallucination statistical AI.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 2rem',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '1rem',
                boxShadow: 'var(--shadow-md)',
                transition: 'transform var(--transition-fast)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              Launch Supermarket Terminal <ArrowRight size={18} />
            </Link>

            <Link
              to="/about"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 1.75rem',
                backgroundColor: '#ffffff',
                color: 'var(--slate-700)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              Explore AI Architecture
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section style={{ padding: '5rem 2rem', maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Engineered for High-Volume Supermarkets
          </h2>
          <p style={{ color: 'var(--slate-500)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Every component connects directly to real-time MySQL database transactions with strict mathematical integrity.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {/* Feature 1 */}
          <div style={{
            backgroundColor: '#ffffff',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              marginBottom: '1.25rem'
            }}>
              <ShoppingCart size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
              Rapid POS Billing
            </h3>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.925rem', lineHeight: 1.6 }}>
              Barcode lookup, live stock verification, atomic database deduction, discount application, and print-ready thermal receipt generation.
            </p>
          </div>

          {/* Feature 2 */}
          <div style={{
            backgroundColor: '#ffffff',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--success)',
              marginBottom: '1.25rem'
            }}>
              <Boxes size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
              Catalog &amp; Safe Inventory
            </h3>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.925rem', lineHeight: 1.6 }}>
              Maintain product catalogs safely. Soft-deletion ensures historical invoice records are never corrupted or rendered unreadable.
            </p>
          </div>

          {/* Feature 3 */}
          <div style={{
            backgroundColor: '#ffffff',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1e40af',
              marginBottom: '1.25rem'
            }}>
              <BarChart3 size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
              Real-Time Sales Reports
            </h3>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.925rem', lineHeight: 1.6 }}>
              Real-time daily, weekly, and monthly revenue metrics, top-selling volume charts, and cashier throughput tracking.
            </p>
          </div>

          {/* Feature 4 */}
          <div style={{
            backgroundColor: '#ffffff',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#fffbeb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--warning)',
              marginBottom: '1.25rem'
            }}>
              <RefreshCw size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
              Smart Restock Model
            </h3>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.925rem', lineHeight: 1.6 }}>
              Dynamic lead-time buffer analysis calculated directly from historical daily sales velocity to prevent costly stockouts.
            </p>
          </div>

          {/* Feature 5 */}
          <div style={{
            backgroundColor: '#ffffff',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--danger)',
              marginBottom: '1.25rem'
            }}>
              <AlertTriangle size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
              Statistical Anomaly Detection
            </h3>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.925rem', lineHeight: 1.6 }}>
              Detects significant sales spikes and dips using Z-scores and empirical standard deviation thresholds with clear scientific rationale.
            </p>
          </div>

          {/* Feature 6 */}
          <div style={{
            backgroundColor: '#ffffff',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#fdf4ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#a21caf',
              marginBottom: '1.25rem'
            }}>
              <TrendingUp size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
              Predictive Demand Forecast
            </h3>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.925rem', lineHeight: 1.6 }}>
              Projects future 7, 14, and 30-day demand curves using weighted moving averages and linear trend regression with confidence scores.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{
        padding: '5rem 2rem',
        backgroundColor: 'var(--slate-50)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.75rem' }}>
            How BillMaster Works
          </h2>
          <p style={{ color: 'var(--slate-500)', fontSize: '1.05rem', marginBottom: '3.5rem' }}>
            A unified pipeline from checkout counter to executive decision support
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem',
            textAlign: 'left'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              padding: '2rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-15px',
                left: '20px',
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.9rem'
              }}>
                1
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                POS Transaction
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                Cashiers scan or search items, verify live database stock, apply discounts, and generate instant printable tax invoices.
              </p>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              padding: '2rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-15px',
                left: '20px',
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--accent)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.9rem'
              }}>
                2
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                Atomic Ledger &amp; Sync
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                Stock decrements atomically inside database transactions, updating inventory health badges and catalog velocity.
              </p>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              padding: '2rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-15px',
                left: '20px',
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--success)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.9rem'
              }}>
                3
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                Statistical AI Synthesis
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
                Historical sales records feed transparent statistical algorithms computing restock priorities, anomaly alerts, and future demand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{
          maxWidth: '850px',
          margin: '0 auto',
          background: 'linear-gradient(135deg, var(--slate-900) 0%, var(--slate-800) 100%)',
          padding: '3.5rem 2rem',
          borderRadius: 'var(--radius-xl)',
          color: '#ffffff',
          boxShadow: 'var(--shadow-xl)'
        }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Ready to Upgrade Your Retail Supermarket Operations?
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--slate-300)', maxWidth: '560px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
            Experience fast checkout, zero-compromise security, and real data-backed AI insights today.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/signup"
              style={{
                padding: '0.85rem 2rem',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '1rem'
              }}
            >
              Create  Account
            </Link>
            <Link
              to="/login"
              style={{
                padding: '0.85rem 2rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              Sign In 
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
