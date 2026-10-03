import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  Info,
  TrendingUp,
  TrendingDown,
  ShieldAlert
} from 'lucide-react';
import { aiApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const AnomalyDetectionPage = () => {
  const { showToast } = useToast();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const fetchAnomalies = async () => {
    setLoading(true);
    try {
      const response = await aiApi.getAnomalies();
      setSummary(response.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to calculate statistical anomalies', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnomalies();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Scanning Daily Variance &amp; Standard Deviations..." minHeight="60vh" />;
  }

  const anomalies = summary?.anomalies || [];

  const filteredAnomalies = anomalies.filter((a) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      a.productName.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.date.toLowerCase().includes(q);

    const matchesSeverity = severityFilter === 'ALL' || a.severity === severityFilter;
    const matchesType = typeFilter === 'ALL' || a.anomalyType === typeFilter;

    return matchesSearch && matchesSeverity && matchesType;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Statistical Sales Anomaly Detection
          </h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
            Empirical standard deviation analysis flagging abnormal sales surges or sudden drops
          </p>
        </div>

        <button
          onClick={fetchAnomalies}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.25rem',
            backgroundColor: '#ffffff',
            color: 'var(--slate-700)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={15} /> Re-Scan Transactions
        </button>
      </div>

      {/* KPI Cards */}
      {summary && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-500)' }}>TOTAL ANOMALIES</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '0.25rem' }}>
              {summary.totalAnomalies}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Detected variance events</span>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--danger)' }}>HIGH SEVERITY</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#991b1b', marginTop: '0.25rem' }}>
              {summary.highSeverityCount}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>|Z| &ge; 3.0 or &gt; 200% swing</span>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--warning)' }}>MEDIUM SEVERITY</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#92400e', marginTop: '0.25rem' }}>
              {summary.mediumSeverityCount}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>|Z| &ge; 2.0 or &gt; 100% swing</span>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-500)' }}>ACTIVE THRESHOLD</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>
              {summary.thresholdSigma}&sigma;
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Standard deviations trigger</span>
          </div>
        </div>
      )}

      {/* Disclosures Alert */}
      <div style={{
        backgroundColor: '#fffbeb',
        border: '1px solid var(--warning-border)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem'
      }}>
        <Info size={18} color="var(--warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.85rem', color: '#92400e', lineHeight: 1.5 }}>
          <strong>Analytical Disclosure:</strong> An anomaly indicates that observed daily sales volume deviated significantly from the product's historical mean baseline (&mu;). It often represents promotions, sudden supplier shortages, or bulk holiday orders. In accordance with ethical data practices, anomalies are never automatically attributed to fraud, theft, or suspicious conduct.
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '1.25rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '1.5rem',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name, category, or date..."
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem 0.65rem 2.4rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              fontSize: '0.875rem',
              outline: 'none'
            }}
          />
          <Search size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          style={{
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            fontSize: '0.875rem',
            color: 'var(--slate-700)',
            outline: 'none',
            backgroundColor: '#ffffff',
            cursor: 'pointer'
          }}
        >
          <option value="ALL">All Severities</option>
          <option value="HIGH">High Severity (|Z| &ge; 3.0)</option>
          <option value="MEDIUM">Medium Severity (|Z| &ge; 2.0)</option>
          <option value="LOW">Low Severity</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            fontSize: '0.875rem',
            color: 'var(--slate-700)',
            outline: 'none',
            backgroundColor: '#ffffff',
            cursor: 'pointer'
          }}
        >
          <option value="ALL">All Types</option>
          <option value="SPIKE">Sales Spikes</option>
          <option value="DROP">Sales Drops</option>
        </select>
      </div>

      {/* Anomalies Table */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden'
      }}>
        {filteredAnomalies.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--slate-50)', color: 'var(--slate-600)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Date</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Product</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Pattern</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Observed Sales</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Expected Mean (&mu;)</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Deviation %</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Z-Score</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Severity</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Statistical Explanation</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnomalies.map((a, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                    <td style={{ padding: '0.85rem 1.25rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--slate-800)', whiteSpace: 'nowrap' }}>
                      {a.date}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: 'var(--slate-900)' }}>
                      {a.productName}
                      <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--slate-400)' }}>
                        {a.category}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: a.anomalyType === 'SPIKE' ? 'var(--danger)' : '#1e40af'
                      }}>
                        {a.anomalyType === 'SPIKE' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {a.anomalyType}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                      {a.actualSales} units
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-600)' }}>
                      {a.expectedSales} units
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: a.deviationPercentage > 0 ? 'var(--danger)' : '#1e40af' }}>
                      {a.deviationPercentage > 0 ? `+${a.deviationPercentage}%` : `${a.deviationPercentage}%`}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontFamily: 'var(--font-mono)', color: 'var(--slate-600)' }}>
                      {a.zScore > 0 ? `+${a.zScore}` : a.zScore}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <StatusBadge status={a.severity} />
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.8rem', color: 'var(--slate-600)', maxWidth: '320px', lineHeight: 1.4 }}>
                      {a.explanation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No Statistical Anomalies Detected"
            message="All transaction volume points currently align smoothly within expected statistical standard deviation baselines."
          />
        )}
      </div>
    </div>
  );
};

export default AnomalyDetectionPage;
