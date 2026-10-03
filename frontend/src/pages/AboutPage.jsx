import React from 'react';
import {
  ShieldCheck,
  Cpu,
  Database,
  BarChart,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  Layers,
  Lock,
  Server
} from 'lucide-react';

const AboutPage = () => {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem 5rem' }}>
      {/* Title Header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <span style={{
          display: 'inline-block',
          padding: '0.35rem 1rem',
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary)',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.825rem',
          fontWeight: 700,
          marginBottom: '1rem',
          border: '1px solid var(--primary-border)'
        }}>
          System Mission &amp; Architectural Transparency
        </span>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
          About BillMaster
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--slate-600)', maxWidth: '720px', margin: '0 auto', lineHeight: 1.6 }}>
          An enterprise full-stack supermarket point-of-sale, inventory control, and retail decision intelligence system designed for precision and operational velocity.
        </p>
      </div>

      {/* Core Mission */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '2.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '3rem'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1rem' }}>
          The Purpose of BillMaster
        </h2>
        <p style={{ color: 'var(--slate-600)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          Modern supermarkets and grocery chains face two persistent challenges: long checkout queues caused by clumsy point-of-sale systems and stockouts caused by disconnected inventory records. BillMaster was engineered from the ground up to solve both problems simultaneously.
        </p>
        <p style={{ color: 'var(--slate-600)', lineHeight: 1.7 }}>
          By establishing atomic transactional consistency between the cashier POS interface and MySQL inventory tables, every purchase updates available stock immediately. On top of this real-time ledger, BillMaster layers empirical statistical algorithms that calculate restock needs, detect demand shifts, and identify statistical outliers without artificial hallucinations.
        </p>
      </div>

      {/* Data-Driven AI Explanation Section */}
      <div style={{
        backgroundColor: 'var(--slate-900)',
        color: '#ffffff',
        padding: '3rem 2.5rem',
        borderRadius: 'var(--radius-xl)',
        marginBottom: '3.5rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(79, 70, 229, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent)'
          }}>
            <Cpu size={22} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            Empirical Data-Driven AI vs. Hallucinated Outputs
          </h2>
        </div>

        <p style={{ fontSize: '1.05rem', color: 'var(--slate-300)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          In mission-critical retail environments, business decisions cannot rely on unverified generative AI models that invent numbers. In BillMaster, <strong>every AI insight is purely derived from actual database sales, timestamp records, and verified product inventory</strong>.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <h4 style={{ color: 'var(--warning)', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <RefreshCw size={16} /> Smart Restock
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-300)', lineHeight: 1.5 }}>
              Calculates daily sales velocity (<em>Total Units Sold / Number of Sales Days</em>) against configurable lead-time horizons to recommend exact restock quantities. If a product has no sales history, it clearly reports "No sales history" rather than pretending demand exists.
            </p>
          </div>

          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <h4 style={{ color: 'var(--danger)', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={16} /> Anomaly Detection
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-300)', lineHeight: 1.5 }}>
              Measures daily variance using statistical Z-scores (&mu; and &sigma;). Flags statistically significant spikes or sudden drops. Critically, anomalies are identified as unusual baseline variances—never falsely labeled as theft or crime without cause.
            </p>
          </div>

          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <h4 style={{ color: 'var(--accent)', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={16} /> Demand Forecasting
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-300)', lineHeight: 1.5 }}>
              Combines Weighted Moving Averages (weighting recent days higher) with least-squares linear slope regression to forecast 7, 14, and 30-day demand curves alongside explicit data quality and confidence ratings.
            </p>
          </div>
        </div>
      </div>

      {/* Technology Stack Breakdown */}
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1.5rem', textAlign: 'center' }}>
          Robust Full-Stack Technology Stack
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Tech 1 */}
          <div style={{ backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
              <Layers size={20} />
              <span>React 18 &amp; Vite</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
              Blazing fast Single Page Application built with modular JSX, React Router v6, Recharts for data visualization, and Vanilla CSS design tokens.
            </p>
          </div>

          {/* Tech 2 */}
          <div style={{ backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--success)', fontWeight: 700 }}>
              <Server size={20} />
              <span>Spring Boot 3.3 &amp; JPA</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
              High-performance Java backend with Spring Web REST controllers, Hibernate ORM, transactional stock locking, and service-layer separation.
            </p>
          </div>

          {/* Tech 3 */}
          <div style={{ backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--accent)', fontWeight: 700 }}>
              <Lock size={20} />
              <span>Spring Security &amp; JWT</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
              Authoritative backend role authorization (`ADMIN` and `CASHIER`), BCrypt password hashing, and stateless JJWT token verification.
            </p>
          </div>

          {/* Tech 4 */}
          <div style={{ backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#1e40af', fontWeight: 700 }}>
              <Database size={20} />
              <span>MySQL 8.0 Engine</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
              ACID-compliant relational database (`supermarket_db`) ensuring historical bill records remain immutable even when catalog products evolve.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
