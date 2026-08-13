function SummaryCards() {
  const summary = [
    {
      title: "Revenue",
      value: "₹52,400",
      icon: "💰",
      color: "#16a34a",
    },
    {
      title: "Bills",
      value: "120",
      icon: "🧾",
      color: "#2563eb",
    },
    {
      title: "Products Sold",
      value: "860",
      icon: "📦",
      color: "#f59e0b",
    },
    {
      title: "Low Stock",
      value: "5",
      icon: "⚠️",
      color: "#dc2626",
    },
  ];

  return (
    <div className="summary-grid">
      {summary.map((item, index) => (
        <div className="summary-card" key={index}>
          <div className="summary-icon">{item.icon}</div>

          <div>
            <p>{item.title}</p>
            <h2 style={{ color: item.color }}>{item.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;