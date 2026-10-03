import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Search,
  Plus,
  Info,
  Clock,
  HelpCircle,
  TrendingDown
} from 'lucide-react';
import { aiApi, inventoryApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const SmartRestockPage = () => {
  const { showToast } = useToast();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Quick Restock Modal
  const [selectedItem, setSelectedItem] = useState(null);
  const [restockQty, setRestockQty] = useState('20');
  const [restockSubmitting, setRestockSubmitting] = useState(false);

  const fetchRestockData = async () => {
    setLoading(true);
    try {
      const response = await aiApi.getSmartRestock();
      setSummary(response.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to calculate Smart Restock recommendations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestockData();
  }, []);

  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    const qty = parseInt(restockQty);
    if (!qty || qty <= 0) {
      showToast('Please enter a valid quantity &gt; 0', 'warning');
      return;
    }

    setRestockSubmitting(true);
    try {
      await inventoryApi.restock({
        productId: selectedItem.productId,
        quantity: qty
      });
      showToast(`Added ${qty} units to '${selectedItem.productName}'.`, 'success');
      setSelectedItem(null);
      fetchRestockData();
    } catch (err) {
      showToast('Failed to execute stock update', 'error');
    } finally {
      setRestockSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Calculating Sales Velocity &amp; Dynamic Lead Horizons..." minHeight="60vh" />;
  }

  const items = summary?.items || [];
  const categories = [...new Set(items.map((i) => i.category))];

  const filteredItems = items.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      item.productName.toLowerCase().includes(q) ||
      item.barcode.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            AI Smart Restock Replenishment Model
          </h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
            Lead-time buffer modeling based on empirical daily sales velocity over a {summary?.configuredRestockHorizonDays || 3}-day horizon
          </p>
        </div>

        <button
          onClick={fetchRestockData}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.25rem',
            backgroundColor: '#ffffff',
            color: 'var(--slate-700)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={15} /> Re-Calculate
        </button>
      </div>

      {/* Summary KPI Cards */}
      {summary && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-500)' }}>PRODUCTS ANALYZED</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '0.25rem' }}>
              {summary.productsAnalyzed}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>100% of retail catalog</span>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--warning)' }}>NEED RESTOCKING</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#92400e', marginTop: '0.25rem' }}>
              {summary.needRestockCount}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Below target horizon buffer</span>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--danger)' }}>CRITICAL RISK</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#991b1b', marginTop: '0.25rem' }}>
              {summary.criticalCount}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>&le; 2 days remaining</span>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-700)' }}>OUT OF STOCK</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '0.25rem' }}>
              {summary.outOfStockCount}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Empty warehouse shelves</span>
          </div>
        </div>
      )}

      {/* Explanation Banner */}
      <div style={{
        backgroundColor: 'var(--primary-light)',
        border: '1px solid var(--primary-border)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem'
      }}>
        <Info size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.85rem', color: 'var(--slate-700)', lineHeight: 1.5 }}>
          <strong>Mathematical Formula:</strong> <em>Average Daily Sales = Total Units Sold / Number of Recorded Sales Days</em>.
          Target Smart Restock Level = <em>Average Daily Sales &times; {summary?.configuredRestockHorizonDays || 3} Days</em>.
          Recommended Restock = <em>ceil(max(0, Smart Restock Level - Current Stock))</em>. If zero sales history exists, safety buffers default strictly to static minimum stock thresholds.
        </div>
      </div>

      {/* Filters Bar */}
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
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items by product or barcode..."
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

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
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
          <option value="ALL">All Statuses</option>
          <option value="CRITICAL">Critical (&le; 2 Days)</option>
          <option value="RESTOCK SOON">Restock Soon</option>
          <option value="OUT OF STOCK">Out of Stock</option>
          <option value="HEALTHY">Healthy</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
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
      </div>

      {/* Restock Table */}
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
                  <th style={{ padding: '0.85rem 1.25rem' }}>Product</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Current Stock</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Avg Sales / Day</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Est. Days Remaining</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Restock Target</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Recommended Order</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Risk Status</th>
                  <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Replenish</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.productId} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 600, color: 'var(--slate-900)' }}>
                      {item.productName}
                      <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--slate-400)', fontFamily: 'var(--font-mono)' }}>
                        {item.category} &bull; {item.barcode}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: item.currentStock <= item.minimumStock ? 'var(--warning)' : 'var(--slate-800)' }}>
                      {item.currentStock} units
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-700)' }}>
                      {item.hasSalesHistory ? `${item.averageDailySales} units` : <span style={{ color: 'var(--slate-400)', fontStyle: 'italic' }}>No sales history</span>}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: item.daysRemaining !== null && item.daysRemaining <= 2 ? 'var(--danger)' : 'var(--slate-800)' }}>
                      {item.daysRemaining !== null ? `${item.daysRemaining} days` : 'N/A'}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-600)' }}>
                      {item.smartRestockLevel} units
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 800, color: item.recommendedRestockQuantity > 0 ? 'var(--primary)' : 'var(--slate-400)' }}>
                      {item.recommendedRestockQuantity > 0 ? `+${item.recommendedRestockQuantity} units` : '0 units'}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <StatusBadge status={item.status} />
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setRestockQty(item.recommendedRestockQuantity > 0 ? item.recommendedRestockQuantity.toString() : '20');
                        }}
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
                        <Plus size={14} /> Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No Products Need Restocking"
            message="All products currently meet the configured lead-time replenishment safety horizon."
          />
        )}
      </div>

      {/* Restock Confirmation Modal */}
      {selectedItem && (
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={`Order Stock: ${selectedItem.productName}`}
        >
          <form onSubmit={handleRestockSubmit}>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '1rem', lineHeight: 1.5 }}>
              {selectedItem.explanation}
            </p>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
                Units to Restock
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={restockQty}
                onChange={(e) => setRestockQty(e.target.value)}
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
                onClick={() => setSelectedItem(null)}
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
                {restockSubmitting ? 'Updating Database...' : `Confirm +${restockQty} Units`}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default SmartRestockPage;
