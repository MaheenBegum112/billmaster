import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, addProduct, deleteProduct } from '../services/api';
import '../styles/auth.css';
import '../styles/admin.css';

function AdminPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '', category: '', price: '', quantityInStock: '', barcode: ''
  });
  const navigate = useNavigate();

  const loadProducts = () => {
    getProducts().then(res => setProducts(res.data));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddProduct = async () => {
    if (!form.name || !form.price) {
      alert('Name and price are required');
      return;
    }
    try {
      await addProduct({
        name: form.name,
        category: form.category,
        price: parseFloat(form.price),
        quantityInStock: parseInt(form.quantityInStock) || 0,
        barcode: form.barcode
      });
      setForm({ name: '', category: '', price: '', quantityInStock: '', barcode: '' });
      loadProducts();
    } catch {
      alert('Failed to add product');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await deleteProduct(id);
    loadProducts();
  };

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <div className="admin-page">
      <div className="admin-topbar">
        <div className="till-logo">BillMaster<span>.</span></div>
        <div className="admin-topbar-actions">
          <button className="till-btn secondary" onClick={() => navigate('/billing')}>Billing</button>
          <button className="till-btn primary" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="admin-content">
        <h2>INVENTORY</h2>
        <div className="admin-subtitle">{products.length} products tracked</div>

        <div className="admin-card">
          <h3>ADD NEW PRODUCT</h3>
          <div className="admin-form-grid">
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
            <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
            <input name="price" placeholder="Price" type="number" value={form.price} onChange={handleChange} />
            <input name="quantityInStock" placeholder="Stock" type="number" value={form.quantityInStock} onChange={handleChange} />
            <input name="barcode" placeholder="Barcode" value={form.barcode} onChange={handleChange} />
          </div>
          <div style={{ marginTop: '14px' }}>
            <button className="till-btn primary" onClick={handleAddProduct}>+ Add product</button>
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th><th>NAME</th><th>CATEGORY</th><th>PRICE</th><th>STOCK</th><th>BARCODE</th><th></th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>₹{p.price}</td>
                  <td>
                    <span className={`stock-badge ${p.quantityInStock < 5 ? 'low' : 'ok'}`}>
                      {p.quantityInStock} {p.quantityInStock < 5 ? 'LOW' : 'IN STOCK'}
                    </span>
                  </td>
                  <td>{p.barcode}</td>
                  <td><button className="row-delete" onClick={() => handleDelete(p.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <div className="admin-empty">No products yet — add your first one above.</div>}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;