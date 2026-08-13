import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSummary, getRecentBills } from "../services/api";

function DashboardPage() {
  const [summary, setSummary] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    totalBills: 0,
    todayRevenue: 0
  });
  const [recentBills, setRecentBills] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getSummary().then(res => setSummary(res.data));
    getRecentBills().then(res => setRecentBills(res.data));
  }, []);

  const cards = [
    { label: "Total Products", value: summary.totalProducts, color: "#3FA34D", bg: "#e7f2ec", icon: "📦" },
    { label: "Low Stock Items", value: summary.lowStockCount, color: "#E8503A", bg: "#fceae7", icon: "⚠️" },
    { label: "Total Bills", value: summary.totalBills, color: "#F4A340", bg: "#fef3e2", icon: "🧾" },
    { label: "Today's Revenue", value: `₹${summary.todayRevenue.toFixed(2)}`, color: "#1E2433", bg: "#eef0f5", icon: "💰" }
  ];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h2 className="page-title">Dashboard</h2>
          <p className="page-subtitle">Welcome back, {localStorage.getItem("username") || "Admin"}</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="dash-action-btn green" onClick={() => navigate("/admin/add-product")}>
            + Add Product
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="stats-grid">
        {cards.map((card, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: card.bg }}>
              {card.icon}
            </div>
            <div className="stat-info">
              <div className="stat-label">{card.label}</div>
              <div className="stat-value" style={{ color: card.color }}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-bottom">
        {/* RECENT BILLS */}
        <div className="dash-section">
          <h3 className="section-title">Recent Bills</h3>
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Bill ID</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Discount</th>
                  <th>Grand Total</th>
                </tr>
              </thead>
              <tbody>
                {recentBills.map(bill => (
                  <tr key={bill.id}>
                    <td className="td-id">#{bill.id}</td>
                    <td style={{ fontSize: "13px", color: "#8C8676" }}>
                      {new Date(bill.billDate).toLocaleString()}
                    </td>
                    <td className="td-price">₹{bill.totalAmount?.toFixed(2)}</td>
                    <td style={{ color: "#E8503A" }}>-₹{bill.discount?.toFixed(2)}</td>
                    <td className="td-price">₹{bill.grandTotal?.toFixed(2)}</td>
                  </tr>
                ))}
                {recentBills.length === 0 && (
                  <tr>
                    <td colSpan="5" className="table-empty">No bills yet — go to Billing to generate one.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="dash-section">
          <h3 className="section-title">Quick Actions</h3>
          <div className="quick-actions">
            <button className="quick-btn" onClick={() => navigate("/admin/add-product")}>
              <span className="quick-icon">📦</span>
              <span>Add Product</span>
            </button>
            <button className="quick-btn" onClick={() => navigate("/admin/products")}>
              <span className="quick-icon">📋</span>
              <span>View Products</span>
            </button>
            <button className="quick-btn" onClick={() => navigate("/billing")}>
              <span className="quick-icon">🧾</span>
              <span>Start Billing</span>
            </button>
            <button className="quick-btn" onClick={() => navigate("/admin/low-stock")}>
              <span className="quick-icon">⚠️</span>
              <span>Low Stock</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;