import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  XCircle,
  Receipt,
  Tag,
  ArrowRight,
  TrendingUp,
  Brain,
  RefreshCw,
  Eye,
  CheckCircle2
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { reportsApi, billsApi, aiApi, inventoryApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import InvoiceModal from '../components/InvoiceModal';

const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

const DashboardPage = () => {
  const { user, isAdmin } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminSummary, setAdminSummary] = useState(null);
  const [cashierSummary, setCashierSummary] = useState(null);
  const [dailySales, setDailySales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recentBills, setRecentBills] = useState([]);
  const [aiSummary, setAiSummary] = useState(null);
  const [inventorySummary, setInventorySummary] = useState(null);

  // Selected bill for viewing modal
  const [selectedBill, setSelectedBill] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      if (isAdmin) {
        const [sumRes, dailyRes, topRes, catRes, billsRes, aiRes, invRes] = await Promise.all([
          reportsApi.getAdminSummary().catch(e => { console.error('reportsApi.getAdminSummary error:', e); return { data: null }; }),
          reportsApi.getDaily(7).catch(e => { console.error('reportsApi.getDaily error:', e); return { data: [] }; }),
          reportsApi.getTopProducts(5).catch(e => { console.error('reportsApi.getTopProducts error:', e); return { data: [] }; }),
          reportsApi.getCategories().catch(e => { console.error('reportsApi.getCategories error:', e); return { data: [] }; }),
          billsApi.getAll().catch(e => { console.error('billsApi.getAll error:', e); return { data: [] }; }),
          aiApi.getSummary().catch(() => ({ data: null })),
          inventoryApi.getSummary().catch(() => ({ data: null }))
        ]);

        if (!sumRes.data) {
          setError('Failed to load live dashboard metrics from database. Please verify your authentication session or backend connection.');
        } else {
          setAdminSummary(sumRes.data);
          setDailySales(dailyRes.data || []);
          setTopProducts(topRes.data || []);
          setCategories(catRes.data || []);
          setRecentBills((billsRes.data || []).slice(0, 6));
          setAiSummary(aiRes.data);
          setInventorySummary(invRes.data);
        }
      } else {
        const [cashierRes, billsRes, invRes] = await Promise.all([
          reportsApi.getCashierSummary().catch(e => { console.error('reportsApi.getCashierSummary error:', e); return { data: null }; }),
          billsApi.getAll().catch(e => { console.error('billsApi.getAll error:', e); return { data: [] }; }),
          inventoryApi.getSummary().catch(() => ({ data: null }))
        ]);

        if (!cashierRes.data) {
          setError('Failed to load cashier terminal metrics from database. Please check session credentials.');
        } else {
          setCashierSummary(cashierRes.data);
          setRecentBills((billsRes.data || []).slice(0, 6));
          setInventorySummary(invRes.data);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load live dashboard metrics from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [isAdmin]);

  if (loading) {
    return <LoadingSpinner message="Calculating real-time database metrics..." minHeight="60vh" />;
  }

  if (error) {
    return <EmptyState isError title="Dashboard Unavailable" message={error} onRetry={fetchDashboardData} />;
  }

  return (
    <div>
      {/* Page Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            {isAdmin ? 'Supermarket Executive Dashboard' : 'Cashier Terminal Dashboard'}
          </h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Empirical data loaded directly from <code>supermarket_db</code> MySQL instance
          </p>
        </div>

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
            fontSize: '0.9rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <ShoppingCart size={17} /> Open POS Terminal
        </Link>
      </div>

      {/* ---------------- ADMIN DASHBOARD VIEW ---------------- */}
      {isAdmin && adminSummary && (
        <>
          {/* Top Metric Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem'
          }}>
            {/* Today Revenue */}
            <div style={{
              backgroundColor: '#ffffff',
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)' }}>TODAY'S REVENUE</span>
                <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-md)', backgroundColor: '#ecfdf5', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarSign size={18} />
                </div>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                ${Number(adminSummary.todayRevenue || 0).toFixed(2)}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                {adminSummary.todayBillsCount || 0} bills completed today
              </span>
            </div>

            {/* Total Revenue */}
            <div style={{
              backgroundColor: '#ffffff',
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)' }}>TOTAL REVENUE</span>
                <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={18} />
                </div>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                ${Number(adminSummary.totalRevenue || 0).toFixed(2)}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                All-time cumulative store revenue
              </span>
            </div>

            {/* Total Bills */}
            <div style={{
              backgroundColor: '#ffffff',
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)' }}>TOTAL TRANSACTIONS</span>
                <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-md)', backgroundColor: '#eff6ff', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Receipt size={18} />
                </div>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                {adminSummary.totalBills}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                Saved customer receipts
              </span>
            </div>

            {/* Total Products */}
            <div style={{
              backgroundColor: '#ffffff',
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)' }}>ACTIVE PRODUCTS</span>
                <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-md)', backgroundColor: '#fdf4ff', color: '#a21caf', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={18} />
                </div>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                {adminSummary.totalProducts}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                Active in retail catalog
              </span>
            </div>

            {/* Low Stock Alert */}
            <div style={{
              backgroundColor: '#ffffff',
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)' }}>LOW STOCK ITEMS</span>
                <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-md)', backgroundColor: '#fffbeb', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle size={18} />
                </div>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: adminSummary.lowStockCount > 0 ? 'var(--warning)' : 'var(--slate-900)' }}>
                {adminSummary.lowStockCount}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                &le; minimum safety threshold
              </span>
            </div>

            {/* Out of Stock Alert */}
            <div style={{
              backgroundColor: '#ffffff',
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)' }}>OUT OF STOCK</span>
                <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <XCircle size={18} />
                </div>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: adminSummary.outOfStockCount > 0 ? 'var(--danger)' : 'var(--slate-900)' }}>
                {adminSummary.outOfStockCount}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                0 inventory units available
              </span>
            </div>
          </div>

          {/* AI Insights Quick-Glance Widget (Section 64) */}
          {aiSummary && (
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--primary-border)',
              padding: '1.5rem 1.75rem',
              marginBottom: '2rem',
              boxShadow: 'var(--shadow-sm)',
              background: 'linear-gradient(to right, #ffffff, var(--primary-light))'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Brain size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                      AI Retail Decision Intelligence
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--slate-600)' }}>
                      Empirical statistical synthesis across {aiSummary.productsAnalyzed} products and {aiSummary.salesRecordsAnalyzed} sales records
                    </span>
                  </div>
                </div>

                <Link
                  to="/ai"
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  Open AI Center <ArrowRight size={14} />
                </Link>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1rem'
              }}>
                {/* Restock Insight */}
                <Link to="/ai/smart-restock" style={{
                  backgroundColor: '#ffffff',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}>
                  <div style={{ padding: '6px', backgroundColor: '#fffbeb', borderRadius: 'var(--radius-sm)', color: 'var(--warning)' }}>
                    <RefreshCw size={18} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--slate-900)', display: 'block' }}>Smart Restock</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--slate-600)', lineHeight: 1.4 }}>
                      {aiSummary.restockInsightText}
                    </span>
                  </div>
                </Link>

                {/* Anomaly Insight */}
                <Link to="/ai/anomalies" style={{
                  backgroundColor: '#ffffff',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}>
                  <div style={{ padding: '6px', backgroundColor: 'var(--danger-bg)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)' }}>
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--slate-900)', display: 'block' }}>Anomaly Detection</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--slate-600)', lineHeight: 1.4 }}>
                      {aiSummary.anomalyInsightText}
                    </span>
                  </div>
                </Link>

                {/* Forecast Insight */}
                <Link to="/ai/forecast" style={{
                  backgroundColor: '#ffffff',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}>
                  <div style={{ padding: '6px', backgroundColor: '#eff6ff', borderRadius: 'var(--radius-sm)', color: '#1e40af' }}>
                    <TrendingUp size={18} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--slate-900)', display: 'block' }}>Demand Forecast</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--slate-600)', lineHeight: 1.4 }}>
                      {aiSummary.forecastInsightText}
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          )}

          {/* Charts Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {/* Daily Revenue Curve */}
            <div style={{
              backgroundColor: '#ffffff',
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                  7-Day Sales Revenue Trend
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Daily Granularity</span>
              </div>

              {dailySales.length > 0 ? (
                <div style={{ width: '100%', height: '260px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailySales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                      <Tooltip formatter={(val) => [`$${Number(val).toFixed(2)}`, 'Revenue']} />
                      <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slate-400)' }}>
                  No historical sales data points recorded
                </div>
              )}
            </div>

            {/* Top Selling Products */}
            <div style={{
              backgroundColor: '#ffffff',
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                  Top Selling Products (Units)
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Volume Volume</span>
              </div>

              {topProducts.length > 0 ? (
                <div style={{ width: '100%', height: '260px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis dataKey="productName" type="category" tick={{ fontSize: 11, fill: '#334155' }} axisLine={false} tickLine={false} width={130} />
                      <Tooltip formatter={(val) => [`${val} units`, 'Sold']} />
                      <Bar dataKey="unitsSold" fill="var(--accent)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div style={{ height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slate-400)' }}>
                  No top selling product metrics available
                </div>
              )}
            </div>
          </div>

          {/* Recent Bills Table */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1.25rem 1.75rem',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                Recent Supermarket Invoices
              </h3>
              <Link to="/bills" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
                View All Bills &rarr;
              </Link>
            </div>

            {recentBills.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--slate-50)', color: 'var(--slate-600)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '0.75rem 1.25rem' }}>Invoice #</th>
                      <th style={{ padding: '0.75rem 1.25rem' }}>Date &amp; Time</th>
                      <th style={{ padding: '0.75rem 1.25rem' }}>Cashier</th>
                      <th style={{ padding: '0.75rem 1.25rem' }}>Items</th>
                      <th style={{ padding: '0.75rem 1.25rem' }}>Total</th>
                      <th style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBills.map((b) => (
                      <tr key={b.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                        <td style={{ padding: '0.75rem 1.25rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                          {b.billNumber}
                        </td>
                        <td style={{ padding: '0.75rem 1.25rem', color: 'var(--slate-600)' }}>
                          {new Date(b.billDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td style={{ padding: '0.75rem 1.25rem', color: 'var(--slate-700)' }}>
                          {b.cashierName}
                        </td>
                        <td style={{ padding: '0.75rem 1.25rem', color: 'var(--slate-600)' }}>
                          {b.items?.length || 0} product(s)
                        </td>
                        <td style={{ padding: '0.75rem 1.25rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                          ${Number(b.grandTotal).toFixed(2)}
                        </td>
                        <td style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>
                          <button
                            onClick={() => setSelectedBill(b)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '0.35rem 0.75rem',
                              backgroundColor: 'var(--slate-100)',
                              color: 'var(--slate-700)',
                              border: 'none',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            <Eye size={14} /> Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-400)' }}>
                No bills recorded yet. Create transactions in POS terminal.
              </div>
            )}
          </div>
        </>
      )}

      {/* ---------------- CASHIER DASHBOARD VIEW ---------------- */}
      {!isAdmin && cashierSummary && (
        <>
          {/* Cashier Metric Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)' }}>YOUR SALES TODAY</span>
                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', backgroundColor: '#ecfdf5', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarSign size={20} />
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                ${Number(cashierSummary.todayRevenue || 0).toFixed(2)}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>
                {cashierSummary.todayBillsCount || 0} bills completed today
              </span>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)' }}>YOUR ALL-TIME SALES</span>
                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Receipt size={20} />
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                ${Number(cashierSummary.totalRevenue || 0).toFixed(2)}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>
                {cashierSummary.totalBillsCount || 0} lifetime transactions handled
              </span>
            </div>

            {/* Quick POS Launch Card */}
            <div style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
              color: '#ffffff',
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                  Ready to Bill?
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.4 }}>
                  Scan barcode, add items to cart, and generate instant customer receipt.
                </p>
              </div>

              <Link
                to="/pos"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.25rem',
                  backgroundColor: '#ffffff',
                  color: 'var(--primary)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  marginTop: '1rem',
                  width: 'fit-content'
                }}
              >
                <ShoppingCart size={16} /> Open POS Checkout &rarr;
              </Link>
            </div>
          </div>

          {/* Cashier Recent Bills */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1.25rem 1.75rem',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                Your Recent Transactions
              </h3>
              <Link to="/bills" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
                View All My Bills &rarr;
              </Link>
            </div>

            {cashierSummary.recentBills && cashierSummary.recentBills.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--slate-50)', color: 'var(--slate-600)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '0.75rem 1.25rem' }}>Invoice #</th>
                      <th style={{ padding: '0.75rem 1.25rem' }}>Date &amp; Time</th>
                      <th style={{ padding: '0.75rem 1.25rem' }}>Customer</th>
                      <th style={{ padding: '0.75rem 1.25rem' }}>Payment</th>
                      <th style={{ padding: '0.75rem 1.25rem' }}>Amount</th>
                      <th style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cashierSummary.recentBills.map((b) => (
                      <tr key={b.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                        <td style={{ padding: '0.75rem 1.25rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                          {b.billNumber}
                        </td>
                        <td style={{ padding: '0.75rem 1.25rem', color: 'var(--slate-600)' }}>
                          {new Date(b.billDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td style={{ padding: '0.75rem 1.25rem', color: 'var(--slate-700)' }}>
                          {b.customerName || 'Walk-in Customer'}
                        </td>
                        <td style={{ padding: '0.75rem 1.25rem', color: 'var(--slate-600)' }}>
                          {b.paymentMethod}
                        </td>
                        <td style={{ padding: '0.75rem 1.25rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                          ${Number(b.grandTotal).toFixed(2)}
                        </td>
                        <td style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>
                          <button
                            onClick={() => setSelectedBill(b)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '0.35rem 0.75rem',
                              backgroundColor: 'var(--slate-100)',
                              color: 'var(--slate-700)',
                              border: 'none',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            <Eye size={14} /> Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-400)' }}>
                You have not created any bills yet today. Click "Open POS Checkout" to start billing.
              </div>
            )}
          </div>
        </>
      )}

      {/* Invoice Details Modal */}
      {selectedBill && (
        <InvoiceModal
          isOpen={!!selectedBill}
          onClose={() => setSelectedBill(null)}
          bill={selectedBill}
        />
      )}
    </div>
  );
};

export default DashboardPage;
