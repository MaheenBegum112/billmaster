import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Calendar,
  DollarSign,
  TrendingUp,
  Package,
  Layers,
  FileSpreadsheet
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
  Cell,
  Legend
} from 'recharts';
import { reportsApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const PIE_COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'];

const ReportsPage = () => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('DAILY'); // DAILY, MONTHLY
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [dailyRes, monthlyRes, topRes, catRes] = await Promise.all([
        reportsApi.getDaily(14),
        reportsApi.getMonthly(6),
        reportsApi.getTopProducts(8),
        reportsApi.getCategories()
      ]);

      setDailyData(dailyRes.data || []);
      setMonthlyData(monthlyRes.data || []);
      setTopProducts(topRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load business reports', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Aggregating Historical Sales Reports..." minHeight="60vh" />;
  }

  const currentTimelineData = activeTab === 'DAILY' ? dailyData : monthlyData;
  const totalPeriodRevenue = currentTimelineData.reduce((acc, p) => acc + p.revenue, 0);
  const totalPeriodUnits = currentTimelineData.reduce((acc, p) => acc + p.unitsSold, 0);
  const totalPeriodBills = currentTimelineData.reduce((acc, p) => acc + p.billsCount, 0);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Supermarket Business Analytics &amp; Reports
          </h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
            Empirical historical sales aggregations, category breakdowns, and revenue velocity
          </p>
        </div>

        {/* View Granularity Selector */}
        <div style={{
          display: 'flex',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          padding: '4px'
        }}>
          <button
            onClick={() => setActiveTab('DAILY')}
            style={{
              padding: '0.45rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: activeTab === 'DAILY' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'DAILY' ? '#ffffff' : 'var(--slate-700)',
              fontSize: '0.825rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Last 14 Days
          </button>
          <button
            onClick={() => setActiveTab('MONTHLY')}
            style={{
              padding: '0.45rem 1.25rem',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: activeTab === 'MONTHLY' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'MONTHLY' ? '#ffffff' : 'var(--slate-700)',
              fontSize: '0.825rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Last 6 Months
          </button>
        </div>
      </div>

      {/* Aggregate KPI Summary for Selected Period */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-500)' }}>PERIOD REVENUE</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '0.25rem' }}>
            ${totalPeriodRevenue.toFixed(2)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Aggregated gross revenue</span>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-500)' }}>TRANSACTIONS COUNT</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '0.25rem' }}>
            {totalPeriodBills}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Total completed bills</span>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-500)' }}>UNITS SOLD</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>
            {totalPeriodUnits}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Catalog items purchased</span>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-500)' }}>AVERAGE BASKET SIZE</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '0.25rem' }}>
            ${totalPeriodBills > 0 ? (totalPeriodRevenue / totalPeriodBills).toFixed(2) : '0.00'}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Average ticket value</span>
        </div>
      </div>

      {/* Main Timeline Chart */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '1.75rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '2rem'
      }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1.5rem' }}>
          Revenue &amp; Transaction Velocity Over Time ({activeTab === 'DAILY' ? 'Daily' : 'Monthly'})
        </h3>

        <div style={{ width: '100%', height: '320px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentTimelineData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="reportRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(val, name) => [name === 'revenue' ? `$${Number(val).toFixed(2)}` : val, name === 'revenue' ? 'Revenue' : 'Units Sold']} />
              <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#reportRevGrad)" name="revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Section: Category Distribution & Top Selling Products */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: '2rem'
      }}>
        {/* Category Revenue Breakdown */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '1.75rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1rem' }}>
            Category Revenue Share
          </h3>

          {categories.length > 0 ? (
            <div style={{ width: '100%', height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="revenue"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => [`$${Number(val).toFixed(2)}`, 'Revenue']} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slate-400)' }}>
              No category sales records recorded
            </div>
          )}
        </div>

        {/* Top Products Table */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '1.75rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1.25rem' }}>
            Top Revenue Contributing Products
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {topProducts.map((p, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0',
                  borderBottom: '1px solid var(--slate-100)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: idx === 0 ? 'var(--primary-light)' : 'var(--slate-100)',
                    color: idx === 0 ? 'var(--primary)' : 'var(--slate-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    {idx + 1}
                  </span>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--slate-800)' }}>
                      {p.productName}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                      {p.unitsSold} units sold
                    </span>
                  </div>
                </div>

                <strong style={{ fontSize: '0.95rem', color: 'var(--slate-900)' }}>
                  ${Number(p.revenue).toFixed(2)}
                </strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
