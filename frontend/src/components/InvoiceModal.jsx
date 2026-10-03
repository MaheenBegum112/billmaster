import React from 'react';
import { Printer, CheckCircle, X, ShoppingBag } from 'lucide-react';
import Modal from './Modal';

const InvoiceModal = ({ isOpen, onClose, bill, currency = '$' }) => {
  if (!bill) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tax Invoice Receipt" maxWidth="600px">
      <div id="printable-invoice">
        {/* Invoice Header */}
        <div style={{
          textAlign: 'center',
          paddingBottom: '1.25rem',
          borderBottom: '1px dashed var(--border-color)',
          marginBottom: '1.25rem'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            color: '#ffffff',
            marginBottom: '0.5rem'
          }}>
            <ShoppingBag size={22} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Bill<span style={{ color: 'var(--primary)' }}>Master</span> Supermarket
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            100 Market Boulevard, Metro City &bull; Phone: (800) 555-BILL
          </p>
          <div style={{
            marginTop: '0.75rem',
            display: 'inline-block',
            padding: '3px 12px',
            backgroundColor: '#ecfdf5',
            color: '#065f46',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 700
          }}>
            PAID &bull; {bill.paymentMethod || 'CASH'}
          </div>
        </div>

        {/* Invoice Metadata */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.75rem',
          fontSize: '0.825rem',
          marginBottom: '1.25rem'
        }}>
          <div>
            <span style={{ color: 'var(--slate-500)', display: 'block' }}>Invoice No:</span>
            <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--slate-800)' }}>
              {bill.billNumber}
            </strong>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: 'var(--slate-500)', display: 'block' }}>Date & Time:</span>
            <strong style={{ color: 'var(--slate-800)' }}>
              {formatDate(bill.billDate)}
            </strong>
          </div>
          <div>
            <span style={{ color: 'var(--slate-500)', display: 'block' }}>Cashier:</span>
            <strong style={{ color: 'var(--slate-800)' }}>{bill.cashierName || 'Terminal'}</strong>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: 'var(--slate-500)', display: 'block' }}>Customer:</span>
            <strong style={{ color: 'var(--slate-800)' }}>{bill.customerName || 'Walk-in Customer'}</strong>
          </div>
        </div>

        {/* Item Table */}
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.825rem',
          marginBottom: '1.25rem'
        }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--slate-500)', textAlign: 'left' }}>
              <th style={{ padding: '6px 0', fontWeight: 600 }}>Item</th>
              <th style={{ padding: '6px 0', textAlign: 'center', fontWeight: 600 }}>Qty</th>
              <th style={{ padding: '6px 0', textAlign: 'right', fontWeight: 600 }}>Price</th>
              <th style={{ padding: '6px 0', textAlign: 'right', fontWeight: 600 }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {bill.items?.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px dotted var(--slate-200)' }}>
                <td style={{ padding: '7px 0', fontWeight: 500, color: 'var(--slate-800)' }}>
                  {item.productName}
                </td>
                <td style={{ padding: '7px 0', textAlign: 'center', color: 'var(--slate-600)' }}>
                  {item.quantity}
                </td>
                <td style={{ padding: '7px 0', textAlign: 'right', color: 'var(--slate-600)' }}>
                  {currency}{Number(item.priceAtSale).toFixed(2)}
                </td>
                <td style={{ padding: '7px 0', textAlign: 'right', fontWeight: 600, color: 'var(--slate-900)' }}>
                  {currency}{Number(item.total).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Summary */}
        <div style={{
          borderTop: '1px dashed var(--border-color)',
          paddingTop: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
          fontSize: '0.875rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--slate-600)' }}>
            <span>Subtotal:</span>
            <span>{currency}{Number(bill.subtotal).toFixed(2)}</span>
          </div>
          {bill.discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--danger)' }}>
              <span>Discount Applied:</span>
              <span>-{currency}{Number(bill.discount).toFixed(2)}</span>
            </div>
          )}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '1.15rem',
            fontWeight: 800,
            color: 'var(--slate-900)',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '0.5rem',
            marginTop: '0.25rem'
          }}>
            <span>Grand Total:</span>
            <span style={{ color: 'var(--primary)' }}>
              {currency}{Number(bill.grandTotal).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Footer Note */}
        <p style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--slate-400)',
          marginTop: '1.5rem',
          lineHeight: 1.4
        }}>
          Thank you for shopping at BillMaster Supermarket!<br />
          Items once sold can be exchanged within 7 days with this original receipt.
        </p>
      </div>

      {/* Action Buttons (Excluded from print) */}
      <div className="no-print" style={{
        marginTop: '1.75rem',
        display: 'flex',
        gap: '0.75rem',
        justifyContent: 'flex-end',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '1.25rem'
      }}>
        <button
          onClick={onClose}
          style={{
            padding: '0.6rem 1.25rem',
            backgroundColor: 'var(--slate-100)',
            color: 'var(--slate-700)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Close
        </button>
        <button
          onClick={handlePrint}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1.5rem',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Printer size={16} /> Print Receipt
        </button>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </Modal>
  );
};

export default InvoiceModal;
