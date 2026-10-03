import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  RefreshCw,
  Boxes,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Database,
  Cpu,
  Activity,
  CheckCircle2,
  Clock,
  Info
} from 'lucide-react';
import { aiApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';

const AIDashboardPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAISummary = async () => {
    setLoading(true);
    try {
      const res = await aiApi.getSummary();
      setSummary(res.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch AI Intelligence summary', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAISummary();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Querying Empirical AI Engines &amp; Sales Statistics..." minHeight="60vh" />;
  }

  const productsAnalyzed = summary?.productsAnalyzed || 0;
  const salesAnalyzed = summary?.salesRecordsAnalyzed || 0;
  const restockCount = summary?.restockNeededCount || 0;
  const anomaliesCount = summary?.anomaliesDetectedCount || 0;
  const increasingCount = summary?.increasingDemandCount || 0;
  const decreasingCount = summary?.decreasingDemandCount || 0;
  const dataQuality = summary?.overallDataQuality || 'SUFFICIENT';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Banner / Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Subtle background glow */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '780px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.85rem',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '1rem',
            color: '#e0e7ff'
          }}>
            <Sparkles size={14} color="#818cf8" /> Supermarket Intelligence Core
          </div>

          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 0.75rem 0', lineHeight: 1.2 }}>
            Empirical AI &amp; Predictive Analytics
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#c7d2fe', lineHeight: 1.6, margin: 0 }}>
            Mathematical models applied directly to real-time MySQL sales transactions.
            Zero hallucinated data, zero arbitrary numbers — 100% deterministic retail statistics.
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#e0e7ff' }}>
              <Database size={16} color="#38bdf8" />
              <span><strong>{productsAnalyzed}</strong> Catalog Products</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#e0e7ff' }}>
              <Activity size={16} color="#4ade80" />
              <span><strong>{salesAnalyzed}</strong> Transaction Records</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#e0e7ff' }}>
              <CheckCircle2 size={16} color="#fbbf24" />
              <span>Data Quality: <strong>{dataQuality}</strong></span>
            </div>
          </div>
        </div>

        {/* Action button inside hero */}
        <button
          onClick={fetchAISummary}
          disabled={loading}
          style={{
            position: 'absolute',
            top: '2.5rem',
            right: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.2rem',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: 'var(--radius-md)',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
        >
          <RefreshCw size={15} className={loading ? 'spin' : ''} />
          Sync Analytics
        </button>
      </div>

      {/* KPI Overview Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem'
      }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
            Restock Required
          </span>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: restockCount > 0 ? 'var(--danger)' : 'var(--success)' }}>
            {restockCount}
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
            {summary?.restockInsightText || 'Healthy inventory across all lines'}
          </span>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>
            Sales Anomalies (Z &gt; 2σ)
          </span>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#f59e0b' }}>
            {anomaliesCount}
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
            {summary?.anomalyInsightText || 'Zero statistical outliers detected'}
          </span>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase' }}>
            Rising Demand Items
          </span>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--success)' }}>
            {increasingCount}
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
            Products with accelerating purchase velocity
          </span>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
            Database Integrity
          </span>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)' }}>
            {dataQuality}
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
            Derived from {salesAnalyzed} real sales records
          </span>
        </div>
      </div>

      {/* 3 Dedicated Module Navigation Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Module 1: Smart Restock */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '1.5rem',
          transition: 'all 0.2s ease',
          boxShadow: 'var(--shadow-sm)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--primary)';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-color)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        }}
        >
          <div>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Boxes size={24} />
            </div>

            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Module 1: Velocity Horizon
            </span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--slate-900)', margin: '0.35rem 0 0.5rem 0' }}>
              Smart Restock Alerts
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: 1.5, margin: 0 }}>
              Calculates empirical daily sales burn rate and dynamic lead-time replenishment horizons.
              Know precisely which products will run out before stockouts impact customer checkout.
            </p>

            <div style={{
              marginTop: '1.25rem',
              padding: '0.85rem 1rem',
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '3px solid var(--danger)',
              fontSize: '0.85rem',
              color: 'var(--slate-700)'
            }}>
              <strong>Live Status:</strong> {summary?.restockInsightText}
            </div>
          </div>

          <button
            onClick={() => navigate('/ai/restock')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.85rem 1.25rem',
              backgroundColor: 'var(--danger)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.925rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
          >
            Launch Smart Restock <ArrowRight size={16} />
          </button>
        </div>

        {/* Module 2: Anomaly Detection */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '1.5rem',
          transition: 'all 0.2s ease',
          boxShadow: 'var(--shadow-sm)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#f59e0b';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-color)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        }}
        >
          <div>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <AlertTriangle size={24} />
            </div>

            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Module 2: Z-Score Statistical Variance
            </span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--slate-900)', margin: '0.35rem 0 0.5rem 0' }}>
              Sales Anomaly Detection
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: 1.5, margin: 0 }}>
              Computes Z-scores and population standard deviations (σ) on unit purchase volumes and transaction baskets.
              Instantly spots cashier scanning errors, fraudulent discounts, or bulk hoarding.
            </p>

            <div style={{
              marginTop: '1.25rem',
              padding: '0.85rem 1rem',
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '3px solid #f59e0b',
              fontSize: '0.85rem',
              color: 'var(--slate-700)'
            }}>
              <strong>Live Status:</strong> {summary?.anomalyInsightText}
            </div>
          </div>

          <button
            onClick={() => navigate('/ai/anomalies')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.85rem 1.25rem',
              backgroundColor: '#f59e0b',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.925rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
          >
            Launch Anomaly Engine <ArrowRight size={16} />
          </button>
        </div>

        {/* Module 3: Demand Forecasting */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '1.5rem',
          transition: 'all 0.2s ease',
          boxShadow: 'var(--shadow-sm)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--primary)';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-color)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        }}
        >
          <div>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <TrendingUp size={24} />
            </div>

            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Module 3: Linear Regression
            </span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--slate-900)', margin: '0.35rem 0 0.5rem 0' }}>
              Demand Forecasting
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: 1.5, margin: 0 }}>
              Plots weighted moving averages and trend slopes across 7, 14, and 30-day horizons.
              Recommends dynamic safety stock levels to minimize holding costs while securing replenishment.
            </p>

            <div style={{
              marginTop: '1.25rem',
              padding: '0.85rem 1rem',
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '3px solid var(--primary)',
              fontSize: '0.85rem',
              color: 'var(--slate-700)'
            }}>
              <strong>Live Status:</strong> {summary?.forecastInsightText}
            </div>
          </div>

          <button
            onClick={() => navigate('/ai/forecast')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.85rem 1.25rem',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.925rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
          >
            Launch Forecasting <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Verification & Architecture Note */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-color)',
        padding: '1.75rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem'
      }}>
        <ShieldCheck size={26} color="var(--primary)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
            Auditability &amp; Regulatory Compliance
          </h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.6, margin: '0.35rem 0 0 0' }}>
            BillMaster's intelligence tier is architected for regulatory defensibility. All mathematical models operate as
            deterministic Spring Boot services calculating directly from persistent MySQL rows. Every alert, Z-score, and forecast
            can be mathematically re-derived by external auditors using standard scientific formulas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIDashboardPage;
