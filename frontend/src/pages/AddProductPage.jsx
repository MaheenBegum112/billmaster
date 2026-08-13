import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../services/api";

function AddProductPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantityInStock: "",
    barcode: "",
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async () => {
    if (!form.name || !form.price) {
      alert("Name and Price are required");
      return;
    }
    try {
      await addProduct({
        name: form.name,
        category: form.category,
        price: parseFloat(form.price),
        quantityInStock: parseInt(form.quantityInStock) || 0,
        barcode: form.barcode,
      });
      setSuccess(true);
      setForm({ name: "", category: "", price: "", quantityInStock: "", barcode: "" });
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      alert("Failed to add product");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h2 className="page-title">Add Product</h2>
          <p className="page-subtitle">Fill in the details to add a new product to inventory</p>
        </div>
        <button className="dash-action-btn dark" onClick={() => navigate("/admin/products")}>
          View All Products
        </button>
      </div>

      {success && (
        <div className="success-banner">
          ✓ Product added successfully!
        </div>
      )}

      <div className="add-product-card">
        <div className="add-product-grid">

          <div className="form-group">
            <label>Product Name *</label>
            <input
              name="name"
              placeholder="e.g. Maggi Noodles"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              name="category"
              placeholder="e.g. Food, Grocery, Dairy"
              value={form.category}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Price (₹) *</label>
            <div className="input-prefix-wrap">
              <span className="input-prefix">₹</span>
              <input
                type="number"
                name="price"
                placeholder="0.00"
                value={form.price}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Stock Quantity</label>
            <input
              type="number"
              name="quantityInStock"
              placeholder="e.g. 50"
              value={form.quantityInStock}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label>Barcode</label>
            <input
              name="barcode"
              placeholder="e.g. 1001"
              value={form.barcode}
              onChange={handleChange}
            />
          </div>

        </div>

        <div className="add-product-actions">
          <button
            className="dash-action-btn green"
            onClick={handleAddProduct}
            style={{ padding: "12px 32px", fontSize: "14px" }}
          >
            + Add Product
          </button>
          <button
            className="dash-action-btn"
            style={{ background: "#f0ebe0", color: "#2B2417", padding: "12px 24px", fontSize: "14px" }}
            onClick={() => setForm({ name: "", category: "", price: "", quantityInStock: "", barcode: "" })}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="tips-card">
        <h4>💡 Tips</h4>
        <ul>
          <li>Name and Price are required fields</li>
          <li>Use a unique barcode for each product for easy scanning</li>
          <li>Products with stock below 5 will show as Low Stock alerts</li>
          <li>You can delete products anytime from the Products page</li>
        </ul>
      </div>
    </div>
  );
}

export default AddProductPage;