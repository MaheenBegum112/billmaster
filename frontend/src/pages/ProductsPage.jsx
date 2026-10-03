import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  X,
  Filter
} from 'lucide-react';
import { productsApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const ProductsPage = () => {
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    barcode: '',
    category: '',
    price: '',
    quantityInStock: '',
    minimumStock: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        productsApi.getAll(),
        productsApi.getCategories()
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load products from database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Product name is required';
    if (!formData.barcode.trim()) errs.barcode = 'Barcode is required';
    if (!formData.category.trim()) errs.category = 'Category is required';
    if (formData.price === '' || isNaN(formData.price) || parseFloat(formData.price) < 0) {
      errs.price = 'Valid price &ge; 0 is required';
    }
    if (formData.quantityInStock === '' || isNaN(formData.quantityInStock) || parseInt(formData.quantityInStock) < 0) {
      errs.quantityInStock = 'Valid stock &ge; 0 is required';
    }
    if (formData.minimumStock === '' || isNaN(formData.minimumStock) || parseInt(formData.minimumStock) < 0) {
      errs.minimumStock = 'Valid minimum stock &ge; 0 is required';
    }
    return errs;
  };

  const openAddModal = () => {
    setFormData({
      name: '',
      barcode: '',
      category: '',
      price: '',
      quantityInStock: '',
      minimumStock: '10'
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  const openEditModal = (p) => {
    setCurrentProduct(p);
    setFormData({
      name: p.name,
      barcode: p.barcode,
      category: p.category,
      price: p.price.toString(),
      quantityInStock: p.quantityInStock.toString(),
      minimumStock: p.minimumStock.toString()
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (p) => {
    setCurrentProduct(p);
    setIsDeleteModalOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      await productsApi.create({
        name: formData.name.trim(),
        barcode: formData.barcode.trim(),
        category: formData.category.trim(),
        price: parseFloat(formData.price),
        quantityInStock: parseInt(formData.quantityInStock),
        minimumStock: parseInt(formData.minimumStock)
      });
      showToast('Product added successfully to catalog!', 'success');
      setIsAddModalOpen(false);
      fetchProducts();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add product. Verify barcode is unique.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      await productsApi.update(currentProduct.id, {
        name: formData.name.trim(),
        barcode: formData.barcode.trim(),
        category: formData.category.trim(),
        price: parseFloat(formData.price),
        quantityInStock: parseInt(formData.quantityInStock),
        minimumStock: parseInt(formData.minimumStock)
      });
      showToast('Product updated successfully!', 'success');
      setIsEditModalOpen(false);
      fetchProducts();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update product.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!currentProduct) return;
    setSubmitting(true);
    try {
      await productsApi.delete(currentProduct.id);
      showToast('Product safely removed from catalog. Historical bills preserved.', 'success');
      setIsDeleteModalOpen(false);
      fetchProducts();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete product.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      p.name.toLowerCase().includes(q) ||
      p.barcode.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);

    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || p.status === selectedStatus;

    return matchesSearch && matchesCat && matchesStatus;
  });

  if (loading) {
    return <LoadingSpinner message="Loading Product Catalog..." minHeight="60vh" />;
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Product Catalog Management
          </h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
            Maintain supermarket products, pricing, barcodes, and minimum stock buffers
          </p>
        </div>

        <button
          onClick={openAddModal}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.25rem',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* Filter and Search Bar */}
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
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, barcode, or category..."
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

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
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
          <option value="ALL">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Stock Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
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
          <option value="ALL">All Stock Statuses</option>
          <option value="IN STOCK">In Stock</option>
          <option value="LOW STOCK">Low Stock</option>
          <option value="OUT OF STOCK">Out of Stock</option>
        </select>
      </div>

      {/* Products Table */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden'
      }}>
        {filteredProducts.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--slate-50)', color: 'var(--slate-600)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Barcode</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Product Name</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Category</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Price</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Stock</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Min Stock</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Status</th>
                  <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                    <td style={{ padding: '0.85rem 1.25rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--slate-700)' }}>
                      {p.barcode}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: 'var(--slate-900)' }}>
                      {p.name}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-600)' }}>
                      {p.category}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                      ${Number(p.price).toFixed(2)}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: p.quantityInStock <= p.minimumStock ? 'var(--warning)' : 'var(--slate-800)' }}>
                      {p.quantityInStock}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-500)' }}>
                      {p.minimumStock}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <StatusBadge status={p.status} />
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => openEditModal(p)}
                          title="Edit Product"
                          style={{
                            padding: '6px',
                            backgroundColor: 'var(--slate-100)',
                            color: 'var(--slate-700)',
                            border: 'none',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer'
                          }}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(p)}
                          title="Safe Delete"
                          style={{
                            padding: '6px',
                            backgroundColor: 'var(--danger-bg)',
                            color: 'var(--danger)',
                            border: 'none',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No Products Found"
            message="No products match your filter criteria. Try resetting search filters or add a new product."
            actionButton={
              <button
                onClick={openAddModal}
                style={{
                  padding: '0.55rem 1.25rem',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Add First Product
              </button>
            }
          />
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <Modal
          isOpen={isAddModalOpen || isEditModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
          }}
          title={isAddModalOpen ? 'Add New Supermarket Product' : 'Edit Product Details'}
        >
          <form onSubmit={isAddModalOpen ? handleAddSubmit : handleEditSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Whole Milk 1L"
                  style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: `1px solid ${formErrors.name ? 'var(--danger)' : 'var(--border-color)'}` }}
                />
                {formErrors.name && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{formErrors.name}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Barcode *
                  </label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    placeholder="e.g. 890103000002"
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: `1px solid ${formErrors.barcode ? 'var(--danger)' : 'var(--border-color)'}`, fontFamily: 'var(--font-mono)' }}
                  />
                  {formErrors.barcode && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{formErrors.barcode}</span>}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Category *
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Dairy, Produce, Bakery"
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: `1px solid ${formErrors.category ? 'var(--danger)' : 'var(--border-color)'}` }}
                  />
                  {formErrors.category && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{formErrors.category}</span>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="2.50"
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: `1px solid ${formErrors.price ? 'var(--danger)' : 'var(--border-color)'}` }}
                  />
                  {formErrors.price && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{formErrors.price}</span>}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Current Stock *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.quantityInStock}
                    onChange={(e) => setFormData({ ...formData, quantityInStock: e.target.value })}
                    placeholder="50"
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: `1px solid ${formErrors.quantityInStock ? 'var(--danger)' : 'var(--border-color)'}` }}
                  />
                  {formErrors.quantityInStock && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{formErrors.quantityInStock}</span>}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Min Stock *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minimumStock}
                    onChange={(e) => setFormData({ ...formData, minimumStock: e.target.value })}
                    placeholder="10"
                    style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: `1px solid ${formErrors.minimumStock ? 'var(--danger)' : 'var(--border-color)'}` }}
                  />
                  {formErrors.minimumStock && <span style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{formErrors.minimumStock}</span>}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  style={{ padding: '0.6rem 1.25rem', backgroundColor: 'var(--slate-100)', color: 'var(--slate-700)', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ padding: '0.6rem 1.5rem', backgroundColor: 'var(--primary)', color: '#ffffff', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 700, cursor: 'pointer' }}
                >
                  {submitting ? 'Saving...' : isAddModalOpen ? 'Save Product' : 'Update Changes'}
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* Safe Delete Confirmation Modal */}
      {isDeleteModalOpen && currentProduct && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirm Safe Product Deletion"
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--danger)', marginBottom: '1rem' }}>
              <AlertTriangle size={24} />
              <strong style={{ fontSize: '1.05rem' }}>
                Remove '{currentProduct.name}' from Catalog?
              </strong>
            </div>

            <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              BillMaster utilizes a <strong>safe soft-deletion policy</strong>. This product will be immediately removed from checkout search and inventory listings, but all historical bills, customer receipts, and sales reports will remain 100% intact and readable.
            </p>

            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--slate-50)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              fontSize: '0.8rem',
              color: 'var(--slate-700)',
              marginBottom: '1.5rem'
            }}>
              Barcode: <code>{currentProduct.barcode}</code> &bull; Current Stock: {currentProduct.quantityInStock} units
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                style={{ padding: '0.6rem 1.25rem', backgroundColor: 'var(--slate-100)', color: 'var(--slate-700)', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}
              >
                Keep Product
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={submitting}
                style={{ padding: '0.6rem 1.5rem', backgroundColor: 'var(--danger)', color: '#ffffff', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 700, cursor: 'pointer' }}
              >
                {submitting ? 'Removing...' : 'Safely Delete Product'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProductsPage;
