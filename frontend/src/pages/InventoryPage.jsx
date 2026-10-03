import React, { useState, useEffect } from 'react';
import {
  Boxes,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  RefreshCw,
  Plus,
  Search,
  DollarSign,
  TrendingUp,
  Filter
} from 'lucide-react';
import { inventoryApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const InventoryPage = () => {
  const { showToast } = useToast();

  const [summary, setSummary] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Quick Restock Modal
  const [restockItem, setRestockItem] = useState(null);
  const [addQty, setAddQty] = useState('20');
  const [restockSubmitting, setRestockSubmitting] = useState(false);

  const fetchInventory = async () => {
    try {
      const [sumRes, itemsRes] = await Promise.all([
        inventoryApi.getSummary(),
        inventoryApi.getItems()
      ]);
      setSummary(sumRes.data);
      setItems(itemsRes.data || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch inventory analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    const qty = parseInt(addQty);
    if (!qty || qty <= 0) {
      showToast('Please enter a valid quantity greater than zero', 'warning');
      return;
    }

    setRestockSubmitting(true);
    try {
      await inventoryApi.restock({
        productId: restockItem.id,
        quantity: qty
      });
      showToast(`Added ${qty} units to '${restockItem.name}' stock!`, 'success');
      setRestockItem(null);
      fetchInventory();
    } catch (err) {
      showToast('Failed to update product stock', 'error');
    } finally {
      setRestockSubmitting(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q ||
      item.name.toLowerCase().includes(q) ||
      item.barcode.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);

    let matchesStatus = true;
    if (filterStatus === 'HEALTHY') {
      matchesStatus = item.status === 'IN STOCK';
    } else if (filterStatus === 'LOW STOCK') {
      matchesStatus = item.status === 'LOW STOCK';
    } else if (filterStatus === 'OUT OF STOCK') {
      matchesStatus = item.status === 'OUT OF STOCK';
    }

    return matchesQuery && matchesStatus;
  });

  if (loading) {
    return <LoadingSpinner message="Calculating Inventory &amp; Stock Velocity..." minHeight="60vh" />;
  }

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>
          Inventory Health &amp; Stock Velocity
        </h1>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
          Real-time stock ledger, total valuation, and empirical sales velocity per product
        </p>
      </div>

      {/* Summary KPI Cards */}
      {summary && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          {/* Total Products */}
          <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-500)' }}>TOTAL PRODUCTS</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '0.25rem' }}>
              {summary.totalProducts}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Tracked items</span>
          </div>

          {/* In Stock */}
          <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--success)' }}>IN STOCK</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#065f46', marginTop: '0.25rem' }}>
              {summary.inStockCount}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Healthy inventory</span>
          </div>

          {/* Low Stock */}
          <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--warning)' }}>LOW STOCK</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#92400e', marginTop: '0.25rem' }}>
              {summary.lowStockCount}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>&le; minimum buffer</span>
          </div>

          {/* Out of Stock */}
          <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--danger)' }}>OUT OF STOCK</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#991b1b', marginTop: '0.25rem' }}>
              {summary.outOfStockCount}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Zero units remaining</span>
          </div>

          {/* Total Units */}
          <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-500)' }}>TOTAL UNITS</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '0.25rem' }}>
              {summary.totalStockUnits}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Units on warehouse shelves</span>
          </div>

          {/* Total Value */}
          <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)' }}>INVENTORY VALUE</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '0.25rem' }}>
              ${Number(summary.totalInventoryValue || 0).toFixed(2)}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Retail asset valuation</span>
          </div>
        </div>
      )}

      {/* Filter and Tab Section */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '1.25rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { id: 'ALL', label: 'All Items' },
            { id: 'HEALTHY', label: 'Healthy Stock' },
            { id: 'LOW STOCK', label: 'Low Stock' },
            { id: 'OUT OF STOCK', label: 'Out of Stock' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                backgroundColor: filterStatus === tab.id ? 'var(--primary)' : 'var(--slate-100)',
                color: filterStatus === tab.id ? '#ffffff' : 'var(--slate-700)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '280px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inventory items..."
            style={{
              width: '100%',
              padding: '0.55rem 0.85rem 0.55rem 2.2rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
          <Search size={15} color="var(--slate-400)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      {/* Inventory Table */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden'
      }}>
        {filteredItems.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--slate-50)', color: 'var(--slate-600)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Product Name</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Category</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Current Stock</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Min Safety Buffer</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Total Sold</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Sales Velocity</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Health Status</th>
                  <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Replenish</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: 'var(--slate-900)' }}>
                      {item.name}
                      <span style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--slate-400)' }}>
                        {item.barcode}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-600)' }}>
                      {item.category}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, fontSize: '0.95rem', color: item.currentStock <= item.minimumStock ? 'var(--warning)' : 'var(--slate-900)' }}>
                      {item.currentStock} units
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-500)' }}>
                      {item.minimumStock} units
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-700)', fontWeight: 600 }}>
                      {item.totalUnitsSold}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--primary)', fontWeight: 600 }}>
                      {item.salesVelocityDaily} units/day
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <StatusBadge status={item.status} />
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                      <button
                        onClick={() => setRestockItem(item)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '0.35rem 0.85rem',
                          backgroundColor: 'var(--primary-light)',
                          color: 'var(--primary)',
                          border: '1px solid var(--primary-border)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        <Plus size={14} /> Quick Restock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No Inventory Items Match"
            message="No products match the selected stock status or search keyword."
          />
        )}
      </div>

      {/* Quick Restock Modal */}
      {restockItem && (
        <Modal
          isOpen={!!restockItem}
          onClose={() => setRestockItem(null)}
          title={`Restock: ${restockItem.name}`}
        >
          <form onSubmit={handleRestockSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', marginBottom: '1rem' }}>
                Current shelf stock: <strong>{restockItem.currentStock} units</strong>. How many units were delivered from warehouse?
              </p>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
                Additional Quantity to Add
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={addQty}
                onChange={(e) => setAddQty(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setRestockItem(null)}
                style={{ padding: '0.6rem 1.25rem', backgroundColor: 'var(--slate-100)', color: 'var(--slate-700)', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={restockSubmitting}
                style={{
                  padding: '0.6rem 1.5rem',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {restockSubmitting ? 'Updating Database...' : `Add +${addQty || 0} Units`}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default InventoryPage;
