import React, { useState, useEffect } from 'react';
import {
  Receipt,
  Search,
  Calendar,
  Printer,
  Eye,
  DollarSign,
  User,
  ShoppingBag
} from 'lucide-react';
import { billsApi, settingsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import InvoiceModal from '../components/InvoiceModal';

const BillsPage = () => {
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState('$');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Selected Bill for modal
  const [selectedBill, setSelectedBill] = useState(null);

  const fetchBills = async () => {
    try {
      const [billsRes, setRes] = useState ? await Promise.all([
        billsApi.getAll(),
        settingsApi.get().catch(() => ({ data: null }))
      ]) : [];

      setBills(billsRes.data || []);
      if (setRes.data?.currency) setCurrency(setRes.data.currency);
    } catch (err) {
      console.error(err);
      showToast('Failed to load transaction history', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const filteredBills = bills.filter((b) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      b.billNumber.toLowerCase().includes(q) ||
      (b.customerName && b.customerName.toLowerCase().includes(q)) ||
      (b.cashierName && b.cashierName.toLowerCase().includes(q));

    let matchesDate = true;
    if (selectedDate) {
      const bDate = b.billDate ? b.billDate.substring(0, 10) : '';
      matchesDate = bDate === selectedDate;
    }

    return matchesSearch && matchesDate;
  });

  const totalRevenue = filteredBills.reduce((acc, b) => acc + (b.grandTotal || 0), 0);

  if (loading) {
    return <LoadingSpinner message="Loading Invoice Archives..." minHeight="60vh" />;
  }

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            {isAdmin ? 'Supermarket Transaction Archives' : 'My Cashier Transaction Records'}
          </h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
            {isAdmin
              ? 'Complete historical ledger of all supermarket bills with immutable line item details'
              : 'Audit history of invoices created under your cashier terminal session'}
          </p>
        </div>

        {/* Quick summary box */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '0.65rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          fontSize: '0.85rem'
        }}>
          <div>
            <span style={{ color: 'var(--slate-500)', display: 'block', fontSize: '0.72rem' }}>MATCHING BILLS</span>
            <strong style={{ color: 'var(--slate-900)', fontSize: '1rem' }}>{filteredBills.length}</strong>
          </div>
          <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
            <span style={{ color: 'var(--slate-500)', display: 'block', fontSize: '0.72rem' }}>TOTAL VOLUME</span>
            <strong style={{ color: 'var(--primary)', fontSize: '1rem' }}>{currency}{totalRevenue.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
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
        {/* Search Input */}
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by bill #, customer, or cashier..."
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

        {/* Date Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={16} color="var(--slate-400)" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '0.6rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              fontSize: '0.85rem',
              outline: 'none',
              color: 'var(--slate-700)'
            }}
          />
          {selectedDate && (
            <button
              onClick={() => setSelectedDate('')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--slate-500)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Clear Date
            </button>
          )}
        </div>
      </div>

      {/* Bills Table */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden'
      }}>
        {filteredBills.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--slate-50)', color: 'var(--slate-600)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Invoice #</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Date &amp; Time</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Cashier</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Customer</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Items Sold</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Payment</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Discount</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Grand Total</th>
                  <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--slate-800)' }}>
                      {b.billNumber}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-600)' }}>
                      {new Date(b.billDate).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-800)', fontWeight: 500 }}>
                      {b.cashierName}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-600)' }}>
                      {b.customerName || 'Walk-in Customer'}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--slate-600)' }}>
                      {b.items?.length || 0} item(s)
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--slate-100)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: 'var(--slate-700)'
                      }}>
                        {b.paymentMethod || 'CASH'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', color: b.discount > 0 ? 'var(--danger)' : 'var(--slate-400)' }}>
                      {b.discount > 0 ? `-${currency}${Number(b.discount).toFixed(2)}` : '$0.00'}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 800, color: 'var(--slate-900)', fontSize: '0.95rem' }}>
                      {currency}{Number(b.grandTotal).toFixed(2)}
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedBill(b)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '0.4rem 0.85rem',
                          backgroundColor: 'var(--primary-light)',
                          color: 'var(--primary)',
                          border: '1px solid var(--primary-border)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        <Printer size={14} /> Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No Invoices Found"
            message="No billing transactions match your search filter criteria."
          />
        )}
      </div>

      {/* Invoice Viewer Modal */}
      {selectedBill && (
        <InvoiceModal
          isOpen={!!selectedBill}
          onClose={() => setSelectedBill(null)}
          bill={selectedBill}
          currency={currency}
        />
      )}
    </div>
  );
};

export default BillsPage;
