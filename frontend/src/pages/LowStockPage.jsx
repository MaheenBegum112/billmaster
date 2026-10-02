import { useEffect, useState } from "react";
import { getProducts } from "../services/api";

const LOW_STOCK_THRESHOLD = 5;

function LowStockPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    getProducts()
      .then((res) => {
        const lowStock = (res.data || [])
          .filter((p) => p.quantityInStock < LOW_STOCK_THRESHOLD)
          .sort((a, b) => a.quantityInStock - b.quantityInStock);
        setProducts(lowStock);
      })
      .catch(() => {
        setError("Could not load low-stock products. Check that the server is running and try again.");
        setProducts([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h2 className="page-title">Low Stock</h2>
          <p className="page-subtitle">
            Products with fewer than {LOW_STOCK_THRESHOLD} units in inventory
            {!loading && !error ? ` · ${products.length} item${products.length === 1 ? "" : "s"}` : ""}
          </p>
        </div>
      </div>

      {error && (
        <div
          className="success-banner"
          style={{ background: "#fceae7", color: "#E8503A", borderColor: "#E8503A" }}
        >
          {error}{" "}
          <button
            className="dash-action-btn"
            onClick={load}
            style={{ marginLeft: "8px", padding: "6px 14px", fontSize: "12px" }}
          >
            Retry
          </button>
        </div>
      )}

      <div className="table-card">
        {loading ? (
          <div className="table-empty">Loading low-stock products…</div>
        ) : !error && products.length === 0 ? (
          <div className="table-empty">
            All products are sufficiently stocked. Nothing is below {LOW_STOCK_THRESHOLD} units.
          </div>
        ) : !error ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="td-name">{p.name}</td>
                  <td>
                    <span className="category-tag">{p.category || "—"}</span>
                  </td>
                  <td>
                    <span className="stock-pill low">
                      ⚠ {p.quantityInStock} LOW
                    </span>
                  </td>
                  <td className="td-price">₹{Number(p.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="table-empty">Low-stock data is unavailable until the request succeeds.</div>
        )}
      </div>
    </div>
  );
}

export default LowStockPage;
