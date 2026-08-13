import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "../services/api";

function ProductPage() {
  const [products, setProducts] = useState([]);

  const load = () => getProducts().then(res => setProducts(res.data));

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(id);
    load();
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h2 className="page-title">Products</h2>
          <p className="page-subtitle">{products.length} products in inventory</p>
        </div>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Barcode</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td className="td-id">#{p.id}</td>
                <td className="td-name">{p.name}</td>
                <td><span className="category-tag">{p.category}</span></td>
                <td className="td-price">₹{p.price}</td>
                <td>
                  <span className={`stock-pill ${p.quantityInStock < 5 ? "low" : p.quantityInStock < 20 ? "medium" : "ok"}`}>
                    {p.quantityInStock < 5 ? "⚠ " : ""}{p.quantityInStock} {p.quantityInStock < 5 ? "LOW" : "in stock"}
                  </span>
                </td>
                <td className="td-barcode">{p.barcode}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(p.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="table-empty">No products yet — add your first one.</div>
        )}
      </div>
    </div>
  );
}

export default ProductPage;