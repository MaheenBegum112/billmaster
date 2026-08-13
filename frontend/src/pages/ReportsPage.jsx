import { useEffect, useState } from "react";
import {
  getSummary, getRecentBills, getDailySales,
  getMonthlySales, getTopProducts, getYearlySales, getWeeklyTrend
} from "../services/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell, Legend, ComposedChart
} from "recharts";

const COLORS = ["#3FA34D", "#F4A340", "#E8503A", "#1E2433", "#F2C14E"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "white", border: "1px solid #ece5d3",
        borderRadius: "10px", padding: "12px 16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: "13px"
      }}>
        <p style={{ fontWeight: 600, marginBottom: "6px", color: "#1E2433" }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, margin: "2px 0" }}>
            {p.name}: {typeof p.value === "number" && p.name !== "Bills"
              ? `₹${p.value.toFixed(2)}` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function ReportsPage() {
  const [summary, setSummary] = useState({
    totalProducts: 0, lowStockCount: 0,
    totalBills: 0, todayRevenue: 0,
    totalRevenue: 0, totalDiscount: 0
  });
  const [recentBills, setRecentBills] = useState([]);
  const [dailySales, setDailySales] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [yearlySales, setYearlySales] = useState([]);
  const [weeklyTrend, setWeeklyTrend] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    getSummary().then(res => setSummary(res.data));
    getRecentBills().then(res => setRecentBills(res.data));
    getDailySales().then(res => setDailySales(res.data));
    getMonthlySales().then(res => setMonthlySales(res.data));
    getYearlySales().then(res => setYearlySales(res.data));
    getWeeklyTrend().then(res => setWeeklyTrend(res.data));
    getTopProducts().then(res => setTopProducts(res.data));
  }, []);

  const tabs = [
    { key: "overview", label: "📊 Overview" },
    { key: "trends", label: "📈 Trends" },
    { key: "monthly", label: "📅 Monthly" },
    { key: "yearly", label: "📆 Yearly" },
    { key: "products", label: "🏆 Top Products" },
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h2 className="page-title">Sales Report</h2>
          <p className="page-subtitle">Monthly, yearly trends and profit analytics</p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "28px" }}>
        {[
          { label: "Total Bills", value: summary.totalBills, color: "#3FA34D", bg: "#e7f2ec", icon: "🧾" },
          { label: "Total Revenue", value: `₹${(summary.totalRevenue || 0).toFixed(2)}`, color: "#1E2433", bg: "#eef0f5", icon: "💰" },
          { label: "Today's Revenue", value: `₹${(summary.todayRevenue || 0).toFixed(2)}`, color: "#F4A340", bg: "#fef3e2", icon: "📅" },
          { label: "Total Discounts Given", value: `₹${(summary.totalDiscount || 0).toFixed(2)}`, color: "#E8503A", bg: "#fceae7", icon: "🏷️" },
          { label: "Avg Bill Value", value: summary.totalBills > 0 ? `₹${(summary.totalRevenue / summary.totalBills).toFixed(2)}` : "₹0.00", color: "#3FA34D", bg: "#e7f2ec", icon: "📊" },
          { label: "Low Stock Items", value: summary.lowStockCount, color: "#E8503A", bg: "#fceae7", icon: "⚠️" },
        ].map((card, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: card.bg }}>{card.icon}</div>
            <div className="stat-info">
              <div className="stat-label">{card.label}</div>
              <div className="stat-value" style={{ color: card.color, fontSize: "20px" }}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div className="report-tabs" style={{ marginBottom: "24px" }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`report-tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div>
          <div className="charts-row">
            <div className="chart-card">
              <h3 className="chart-title">Revenue per Bill</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={recentBills.map(b => ({ name: `#${b.id}`, Revenue: b.grandTotal })).reverse()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#8C8676" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#8C8676" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="Revenue" fill="#3FA34D" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3 className="chart-title">Revenue Trend (Recent Bills)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={recentBills.map(b => ({ name: `#${b.id}`, Revenue: b.grandTotal })).reverse()}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F4A340" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F4A340" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#8C8676" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#8C8676" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="Revenue" stroke="#F4A340" strokeWidth={2.5} fill="url(#colorRev)" dot={{ r: 5, fill: "#F4A340" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card" style={{ marginTop: "24px" }}>
            <h3 className="chart-title">Recent Bills</h3>
            <table className="data-table">
              <thead>
                <tr><th>Bill ID</th><th>Date</th><th>Gross Total</th><th>Discount</th><th>Grand Total</th></tr>
              </thead>
              <tbody>
                {recentBills.map(bill => (
                  <tr key={bill.id}>
                    <td className="td-id">#{bill.id}</td>
                    <td style={{ fontSize: "13px", color: "#8C8676" }}>
                      {new Date(bill.billDate).toLocaleString()}
                    </td>
                    <td style={{ fontFamily: "JetBrains Mono, monospace" }}>₹{bill.totalAmount?.toFixed(2)}</td>
                    <td style={{ color: "#E8503A" }}>-₹{bill.discount?.toFixed(2)}</td>
                    <td className="td-price">₹{bill.grandTotal?.toFixed(2)}</td>
                  </tr>
                ))}
                {recentBills.length === 0 && (
                  <tr><td colSpan="5" className="table-empty">No bills yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TRENDS TAB */}
      {activeTab === "trends" && (
        <div>
          <div className="chart-card" style={{ marginBottom: "24px" }}>
            <h3 className="chart-title">Weekly Revenue Trend (Last 4 Weeks)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={weeklyTrend.map(w => ({
                name: w.weekLabel,
                Revenue: parseFloat(w.revenue),
                Bills: parseInt(w.billCount)
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#8C8676" }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12, fill: "#8C8676" }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: "#8C8676" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar yAxisId="left" dataKey="Revenue" fill="#3FA34D" radius={[6, 6, 0, 0]} opacity={0.85} />
                <Line yAxisId="right" type="monotone" dataKey="Bills" stroke="#E8503A" strokeWidth={2.5} dot={{ r: 5 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Daily Revenue (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={dailySales.map(d => ({
                date: d.date,
                Revenue: parseFloat(d.revenue),
                Bills: parseInt(d.billCount)
              }))}>
                <defs>
                  <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3FA34D" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3FA34D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#8C8676" }} />
                <YAxis tick={{ fontSize: 12, fill: "#8C8676" }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Revenue" stroke="#3FA34D" strokeWidth={2.5} fill="url(#colorDaily)" dot={{ r: 5, fill: "#3FA34D" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* MONTHLY TAB */}
      {activeTab === "monthly" && (
        <div>
          <div className="chart-card" style={{ marginBottom: "24px" }}>
            <h3 className="chart-title">Monthly Revenue vs Discounts (Last 12 Months)</h3>
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={monthlySales.map(m => ({
                name: m.monthLabel,
                Revenue: parseFloat(m.revenue),
                Discounts: parseFloat(m.totalDiscount),
                Bills: parseInt(m.billCount)
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#8C8676" }} />
                <YAxis tick={{ fontSize: 12, fill: "#8C8676" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="Revenue" fill="#3FA34D" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Discounts" fill="#E8503A" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="Bills" stroke="#F4A340" strokeWidth={2.5} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Monthly Breakdown</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Bills</th>
                  <th>Gross Revenue</th>
                  <th>Discounts</th>
                  <th>Net Revenue</th>
                  <th>Avg Bill</th>
                </tr>
              </thead>
              <tbody>
                {monthlySales.map((m, i) => {
                  const revenue = parseFloat(m.revenue);
                  const bills = parseInt(m.billCount);
                  const discount = parseFloat(m.totalDiscount);
                  return (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{m.monthLabel}</td>
                      <td>{bills}</td>
                      <td style={{ fontFamily: "JetBrains Mono, monospace" }}>₹{parseFloat(m.grossAmount).toFixed(2)}</td>
                      <td style={{ color: "#E8503A" }}>-₹{discount.toFixed(2)}</td>
                      <td className="td-price">₹{revenue.toFixed(2)}</td>
                      <td style={{ color: "#8C8676", fontFamily: "JetBrains Mono, monospace" }}>
                        ₹{bills > 0 ? (revenue / bills).toFixed(2) : "0.00"}
                      </td>
                    </tr>
                  );
                })}
                {monthlySales.length === 0 && (
                  <tr><td colSpan="6" className="table-empty">No monthly data yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* YEARLY TAB */}
      {activeTab === "yearly" && (
        <div>
          <div className="charts-row" style={{ marginBottom: "24px" }}>
            <div className="chart-card">
              <h3 className="chart-title">Yearly Revenue Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={yearlySales.map(y => ({
                  year: y.year,
                  Revenue: parseFloat(y.revenue),
                  Discounts: parseFloat(y.totalDiscount)
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe0" />
                  <XAxis dataKey="year" tick={{ fontSize: 13, fill: "#8C8676" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#8C8676" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="Revenue" fill="#1E2433" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Discounts" fill="#E8503A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3 className="chart-title">Yearly Bills Generated</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={yearlySales.map(y => ({
                  year: y.year,
                  Bills: parseInt(y.billCount)
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe0" />
                  <XAxis dataKey="year" tick={{ fontSize: 13, fill: "#8C8676" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#8C8676" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="Bills" fill="#F4A340" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Yearly Summary</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Total Bills</th>
                  <th>Gross Revenue</th>
                  <th>Discounts Given</th>
                  <th>Net Revenue</th>
                  <th>Avg Bill Value</th>
                </tr>
              </thead>
              <tbody>
                {yearlySales.map((y, i) => {
                  const revenue = parseFloat(y.revenue);
                  const bills = parseInt(y.billCount);
                  const discount = parseFloat(y.totalDiscount);
                  return (
                    <tr key={i}>
                      <td style={{ fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>{y.year}</td>
                      <td>{bills}</td>
                      <td style={{ fontFamily: "JetBrains Mono, monospace" }}>₹{parseFloat(y.grossAmount).toFixed(2)}</td>
                      <td style={{ color: "#E8503A" }}>-₹{discount.toFixed(2)}</td>
                      <td className="td-price">₹{revenue.toFixed(2)}</td>
                      <td style={{ color: "#8C8676", fontFamily: "JetBrains Mono, monospace" }}>
                        ₹{bills > 0 ? (revenue / bills).toFixed(2) : "0.00"}
                      </td>
                    </tr>
                  );
                })}
                {yearlySales.length === 0 && (
                  <tr><td colSpan="6" className="table-empty">No yearly data yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TOP PRODUCTS TAB */}
      {activeTab === "products" && (
        <div>
          <div className="charts-row" style={{ marginBottom: "24px" }}>
            <div className="chart-card">
              <h3 className="chart-title">Top Products by Units Sold</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={topProducts.map(p => ({ name: p.name, Sold: parseInt(p.totalSold) }))}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe0" />
                  <XAxis type="number" tick={{ fontSize: 12, fill: "#8C8676" }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: "#8C8676" }} width={110} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="Sold" fill="#3FA34D" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3 className="chart-title">Revenue Share by Product</h3>
              {topProducts.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={topProducts.map(p => ({ name: p.name, value: parseFloat(p.totalRevenue) }))}
                      cx="50%" cy="50%"
                      innerRadius={65} outerRadius={100}
                      paddingAngle={4} dataKey="value"
                    >
                      {topProducts.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`₹${v.toFixed(2)}`]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="chart-empty">No product data yet</div>
              )}
            </div>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Top Products Breakdown</h3>
            <table className="data-table">
              <thead>
                <tr><th>Rank</th><th>Product</th><th>Units Sold</th><th>Revenue Generated</th><th>Avg Price</th></tr>
              </thead>
              <tbody>
                {topProducts.map((p, i) => {
                  const sold = parseInt(p.totalSold);
                  const rev = parseFloat(p.totalRevenue);
                  return (
                    <tr key={i}>
                      <td className="td-id">#{i + 1}</td>
                      <td className="td-name">{p.name}</td>
                      <td>{sold}</td>
                      <td className="td-price">₹{rev.toFixed(2)}</td>
                      <td style={{ color: "#8C8676", fontFamily: "JetBrains Mono, monospace" }}>
                        ₹{sold > 0 ? (rev / sold).toFixed(2) : "0.00"}
                      </td>
                    </tr>
                  );
                })}
                {topProducts.length === 0 && (
                  <tr><td colSpan="5" className="table-empty">No product sales data yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportsPage;