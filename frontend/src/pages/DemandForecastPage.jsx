import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Calendar,
  Search,
  Sparkles,
  Info,
  ShieldCheck,
  ChevronRight,
  BarChart2,
  Package
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { aiApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';

const DemandForecastPage = () => {
  const { showToast } = useToast();

  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [horizonDays, setHorizonDays] = useState(7);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null);

  const fetchForecasts = async (days = horizonDays) => {
    setLoading(true);
    try {
      const response = await aiApi.getForecasts(days);
      const data = response.data || [];
      setForecasts(data);

      // Default select the first product if none selected or current selection is not in list
      if (data.length > 0 && (!selectedProductId || !data.some(p => p.productId === selectedProductId))) {
        setSelectedProductId(data[0].productId);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to compute empirical demand forecasts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecasts(horizonDays);
  }, [horizonDays]);

  const handleHorizonChange = (days) => {
    setHorizonDays(days);
  };

  const selectedProduct = forecasts.find(f => f.productId === selectedProductId);

  // Filtered list for the summary table
  const filteredForecasts = forecasts.filter(f => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return f.productName.toLowerCase().includes(q) || f.category.toLowerCase().includes(q);
  });

  // Aggregate stats
  const totalAnalyzed = forecasts.length;
  const increasingCount = forecasts.filter(f => f.trend === 'INCREASING').length;
  const decreasingCount = forecasts.filter(f => f.trend === 'DECREASING').length;
  const avgConfidence = totalAnalyzed > 0
    ? Math.round(forecasts.reduce((acc, f) => acc + (f.confidence || 0), 0) / totalAnalyzed)
    : 0;

  if (loading && forecasts.length === 0) {
    return <LoadingSpinner message="Calculating Empirical Demand Projections &amp; Linear Regressions..." minHeight="60vh" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.25rem 0.75rem',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              color: '#4f46e5',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <Sparkles size={13} /> Empirical AI Engine
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
              Deterministic Regression &amp; Moving Average
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em', margin: 0 }}>
            Demand Forecasting
          </h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem', marginTop: '0.35rem', margin: 0 }}>
            Anticipate inventory needs with zero guesswork. Sales velocity and regression slopes project exact future demand.
          </p>
        </div>

        {/* Horizon selector + Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '0.25rem'
          }}>
            {[7, 14, 30].map(days => (
              <button
                key={days}
                onClick={() => handleHorizonChange(days)}
                style={{
                  padding: '0.45rem 0.9rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  backgroundColor: horizonDays === days ? 'var(--primary)' : 'transparent',
                  color: horizonDays === days ? '#ffffff' : 'var(--slate-600)',
                  transition: 'all 0.15s ease'
                }}
              >
                {days} Days
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchForecasts(horizonDays)}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1rem',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--slate-700)',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            Recalculate
          </button>
        </div>
      </div>

      {/* Aggregate KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem'
      }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          border: '1px solid var(--border-color)'
        }}>
          <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
            Products Analyzed
          </span>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '0.35rem' }}>
            {totalAnalyzed}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            Active catalog items scanned
          </span>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          border: '1px solid var(--border-color)'
        }}>
          <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--success)', textTransform: 'uppercase' }}>
            Rising Demand
          </span>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.35rem' }}>
            {increasingCount}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            Positive trend slope (β &gt; 0.15)
          </span>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          border: '1px solid var(--border-color)'
        }}>
          <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#f59e0b', textTransform: 'uppercase' }}>
            Declining Demand
          </span>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.35rem' }}>
            {decreasingCount}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            Negative slope (β &lt; -0.15)
          </span>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          border: '1px solid var(--border-color)'
        }}>
          <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase' }}>
            Average Confidence
          </span>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.35rem' }}>
            {avgConfidence}%
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            Empirical historical fit
          </span>
        </div>
      </div>

      {/* Focus Product Forecast Inspector */}
      {selectedProduct ? (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {/* Header of Inspector */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                  {selectedProduct.productName}
                </h2>
                <span style={{
                  padding: '0.25rem 0.65rem',
                  backgroundColor: 'var(--slate-100)',
                  color: 'var(--slate-600)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  {selectedProduct.category}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--slate-500)' }}>
                {selectedProduct.reason}
              </p>
            </div>

            {/* Product Switcher Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-600)' }}>Inspect Product:</span>
              <select
                value={selectedProductId || ''}
                onChange={(e) => setSelectedProductId(Number(e.target.value))}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-main)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--slate-800)',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {forecasts.map(p => (
                  <option key={p.productId} value={p.productId}>
                    {p.productName} ({p.trend})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Detail Metric Pills */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            padding: '1.25rem',
            backgroundColor: 'var(--bg-main)',
            borderRadius: 'var(--radius-lg)'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                Projected {horizonDays}-Day Demand
              </span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>
                {selectedProduct.forecastQuantity} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--slate-500)' }}>units</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                Historical Daily Velocity
              </span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-800)', marginTop: '0.25rem' }}>
                {selectedProduct.historicalDailyAvg} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--slate-500)' }}>units/day</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                Recent Daily Velocity
              </span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-800)', marginTop: '0.25rem' }}>
                {selectedProduct.recentDailyAvg} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--slate-500)' }}>units/day</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                Recommended Safety Stock
              </span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.25rem' }}>
                {selectedProduct.recommendedSafetyStock} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--slate-500)' }}>units</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                Trend Trajectory
              </span>
              <div style={{ marginTop: '0.35rem' }}>
                {selectedProduct.trend === 'INCREASING' && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.3rem 0.65rem',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    color: 'var(--success)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    fontWeight: 700
                  }}>
                    <TrendingUp size={14} /> Increasing
                  </span>
                )}
                {selectedProduct.trend === 'DECREASING' && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.3rem 0.65rem',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    color: '#f59e0b',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    fontWeight: 700
                  }}>
                    <TrendingDown size={14} /> Decreasing
                  </span>
                )}
                {selectedProduct.trend === 'STABLE' && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.3rem 0.65rem',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    color: '#3b82f6',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    fontWeight: 700
                  }}>
                    <Minus size={14} /> Stable
                  </span>
                )}
                {selectedProduct.trend === 'INSUFFICIENT DATA' && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.3rem 0.65rem',
                    backgroundColor: 'var(--slate-200)',
                    color: 'var(--slate-600)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    fontWeight: 700
                  }}>
                    Insufficient Data
                  </span>
                )}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                Statistical Confidence
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginTop: '0.35rem' }}>
                <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--slate-200)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${selectedProduct.confidence}%`,
                    height: '100%',
                    backgroundColor: selectedProduct.confidence >= 80 ? 'var(--success)' : (selectedProduct.confidence >= 60 ? '#f59e0b' : 'var(--danger)'),
                    borderRadius: '4px'
                  }} />
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--slate-800)' }}>
                  {selectedProduct.confidence}%
                </span>
              </div>
            </div>
          </div>

          {/* Timeline Chart */}
          <div style={{ marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--slate-800)' }}>
                Empirical Sales History vs. Projected Future Demand Curve
              </span>
              <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem', color: 'var(--slate-600)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '12px', height: '3px', backgroundColor: '#0d9488', borderRadius: '2px' }} />
                  Actual Historical Sales
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '12px', height: '3px', backgroundColor: '#6366f1', borderRadius: '2px', borderBottom: '2px dashed #6366f1' }} />
                  Projected Demand ({horizonDays}d)
                </span>
              </div>
            </div>

            <div style={{ height: '320px', width: '100%' }}>
              {selectedProduct.timeline && selectedProduct.timeline.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedProduct.timeline} margin={{ top: 10, right: 20, left: 0, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: 'var(--slate-500)' }}
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: 'var(--slate-500)' }}
                      tickLine={false}
                      dx={-5}
                      allowDecimals={false}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div style={{
                              backgroundColor: 'rgba(15, 23, 42, 0.95)',
                              color: '#ffffff',
                              padding: '0.75rem 1rem',
                              borderRadius: 'var(--radius-md)',
                              boxShadow: 'var(--shadow-lg)',
                              fontSize: '0.85rem'
                            }}>
                              <div style={{ fontWeight: 700, marginBottom: '0.35rem', color: '#94a3b8' }}>{label}</div>
                              {payload.map((entry, idx) => (
                                entry.value != null && (
                                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: entry.color, fontWeight: 600 }}>
                                    <span>{entry.name}:</span>
                                    <span>{entry.value} units</span>
                                  </div>
                                )
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="historicalDemand"
                      name="Actual Historical"
                      stroke="#0d9488"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#0d9488' }}
                      activeDot={{ r: 6 }}
                      connectNulls={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="projectedDemand"
                      name="Projected Demand"
                      stroke="#6366f1"
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      dot={{ r: 4, fill: '#6366f1' }}
                      activeDot={{ r: 6 }}
                      connectNulls={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState
                  title="No Timeline Data"
                  description="Not enough transactions to plot a historical vs. projected curve for this item."
                  icon={BarChart2}
                />
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* Catalog Forecast Table */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-color)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
              Catalog Demand Forecast Breakdown
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', margin: '0.2rem 0 0 0' }}>
              Projected demand parameters for all items over the selected {horizonDays}-day horizon
            </p>
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
            <input
              type="text"
              placeholder="Search product or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.875rem 0.55rem 2.4rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-main)',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }}>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--slate-700)' }}>Product</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--slate-700)' }}>Category</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--slate-700)', textAlign: 'right' }}>Historical Avg</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--slate-700)', textAlign: 'right' }}>Recent Avg</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--slate-700)', textAlign: 'right' }}>{horizonDays}d Projected</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--slate-700)', textAlign: 'right' }}>Safety Buffer</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--slate-700)', textAlign: 'center' }}>Trend</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--slate-700)', textAlign: 'center' }}>Quality</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--slate-700)', textAlign: 'center' }}>Confidence</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--slate-700)', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredForecasts.length > 0 ? (
                filteredForecasts.map((f) => {
                  const isSelected = f.productId === selectedProductId;
                  return (
                    <tr
                      key={f.productId}
                      onClick={() => setSelectedProductId(f.productId)}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--bg-main)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                        {f.productName}
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--slate-600)' }}>
                        <span style={{
                          padding: '0.2rem 0.5rem',
                          backgroundColor: 'var(--slate-100)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.775rem'
                        }}>
                          {f.category}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--slate-700)' }}>
                        {f.historicalDailyAvg} <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>u/d</span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--slate-700)' }}>
                        {f.recentDailyAvg} <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>u/d</span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 800, color: 'var(--primary)' }}>
                        {f.forecastQuantity} <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>units</span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: '#f59e0b' }}>
                        +{f.recommendedSafetyStock}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        {f.trend === 'INCREASING' && (
                          <span style={{ color: 'var(--success)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                            <TrendingUp size={14} /> Rising
                          </span>
                        )}
                        {f.trend === 'DECREASING' && (
                          <span style={{ color: '#f59e0b', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                            <TrendingDown size={14} /> Falling
                          </span>
                        )}
                        {f.trend === 'STABLE' && (
                          <span style={{ color: '#3b82f6', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                            <Minus size={14} /> Stable
                          </span>
                        )}
                        {f.trend === 'INSUFFICIENT DATA' && (
                          <span style={{ color: 'var(--slate-400)', fontSize: '0.8rem' }}>
                            N/A
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span style={{
                          padding: '0.2rem 0.5rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: f.dataQuality === 'SUFFICIENT' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                          color: f.dataQuality === 'SUFFICIENT' ? 'var(--success)' : '#f59e0b'
                        }}>
                          {f.dataQuality}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 700 }}>
                        {f.confidence}%
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProductId(f.productId);
                            window.scrollTo({ top: 120, behavior: 'smooth' });
                          }}
                          style={{
                            padding: '0.35rem 0.75rem',
                            backgroundColor: isSelected ? 'var(--primary)' : 'var(--bg-main)',
                            color: isSelected ? '#ffffff' : 'var(--primary)',
                            border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}`,
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          Inspect <ChevronRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} style={{ padding: '3rem', textAlign: 'center' }}>
                    <EmptyState
                      title="No Products Match"
                      description="Try adjusting your search criteria."
                      icon={Package}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scientific Transparency & Methodology Card */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-color)',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <ShieldCheck size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
            Mathematical Transparency &amp; Deterministic Principles
          </h3>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.6, margin: 0 }}>
          Unlike generative AI systems prone to hallucinating inventory forecasts, BillMaster computes deterministic
          demand projections rooted in classical statistical analysis directly executed on MySQL historical transaction ledgers:
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          marginTop: '0.5rem'
        }}>
          <div style={{
            padding: '1rem',
            backgroundColor: 'var(--bg-main)',
            borderRadius: 'var(--radius-md)',
            borderLeft: '4px solid #0d9488'
          }}>
            <strong style={{ fontSize: '0.85rem', color: 'var(--slate-800)', display: 'block', marginBottom: '0.25rem' }}>
              1. Weighted Moving Average (WMA)
            </strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-600)', fontFamily: 'monospace' }}>
              WMA = (0.60 * Recent_3d_Avg) + (0.40 * Historical_Avg)
            </span>
            <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', margin: '0.5rem 0 0 0' }}>
              Gives higher relevance to recent sales spikes while dampening sudden outlier variance.
            </p>
          </div>

          <div style={{
            padding: '1rem',
            backgroundColor: 'var(--bg-main)',
            borderRadius: 'var(--radius-md)',
            borderLeft: '4px solid #6366f1'
          }}>
            <strong style={{ fontSize: '0.85rem', color: 'var(--slate-800)', display: 'block', marginBottom: '0.25rem' }}>
              2. Linear Regression Slope (β)
            </strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-600)', fontFamily: 'monospace' }}>
              β = Cov(X, Y) / Var(X)
            </span>
            <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', margin: '0.5rem 0 0 0' }}>
              Quantifies whether consumer demand trajectory is statistically accelerating (β &gt; 0.15) or slowing down.
            </p>
          </div>

          <div style={{
            padding: '1rem',
            backgroundColor: 'var(--bg-main)',
            borderRadius: 'var(--radius-md)',
            borderLeft: '4px solid #f59e0b'
          }}>
            <strong style={{ fontSize: '0.85rem', color: 'var(--slate-800)', display: 'block', marginBottom: '0.25rem' }}>
              3. Dynamic Safety Buffer
            </strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-600)', fontFamily: 'monospace' }}>
              Safety_Stock = ⌈Weighted_Daily_Demand * 2.0⌉
            </span>
            <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', margin: '0.5rem 0 0 0' }}>
              Guarantees a 48-hour operational buffer preventing stockouts during unforeseen logistics delays.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemandForecastPage;
