import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Barcode,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  DollarSign,
  CreditCard,
  Smartphone,
  AlertCircle,
  Loader2,
  Receipt
} from 'lucide-react';
import { productsApi, billsApi, settingsApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import InvoiceModal from '../components/InvoiceModal';

const POSPage = () => {
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [loading, setLoading] = useState(true);

  // Cart State
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Completed Bill for Receipt Modal
  const [completedBill, setCompletedBill] = useState(null);
  const [currency, setCurrency] = useState('$');

  const barcodeInputRef = useRef(null);

  const fetchCatalog = async () => {
    try {
      const [prodRes, catRes, setRes] = await Promise.all([
        productsApi.getAll(),
        productsApi.getCategories(),
        settingsApi.get().catch(() => ({ data: null }))
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
      if (setRes.data?.currency) {
        setCurrency(setRes.data.currency);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load products from database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  // Filter products by search query and category
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      p.name.toLowerCase().includes(q) ||
      p.barcode.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  // Fast Barcode Lookup on Enter
  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    const code = barcodeInput.trim();
    if (!code) return;

    const matched = products.find((p) => p.barcode === code);
    if (matched) {
      addToCart(matched);
      setBarcodeInput('');
    } else {
      showToast(`No active product found with barcode: ${code}`, 'warning');
    }
  };

  // Add product to cart
  const addToCart = (product) => {
    if (product.quantityInStock <= 0) {
      showToast(`'${product.name}' is Out of Stock!`, 'error');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.quantityInStock) {
          showToast(`Only ${product.quantityInStock} units in stock for '${product.name}'`, 'warning');
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  // Adjust quantity
  const updateQuantity = (productId, delta) => {
    setCart((prev) => {
      return prev.map((item) => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > item.product.quantityInStock) {
            showToast(`Only ${item.product.quantityInStock} units in stock`, 'warning');
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean);
    });
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setCustomerName('');
    setCustomerPhone('');
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const discountAmount = Math.min(Math.max(0, Number(discount) || 0), subtotal);
  const grandTotal = Math.max(0, subtotal - discountAmount);

  // Checkout and create bill
  const handleCheckout = async () => {
    if (cart.length === 0) {
      showToast('Cannot checkout: cart is empty', 'warning');
      return;
    }

    setCheckoutLoading(true);

    const billData = {
      items: cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity
      })),
      discount: discountAmount,
      customerName: customerName.trim() || 'Walk-in Customer',
      customerPhone: customerPhone.trim(),
      paymentMethod: paymentMethod
    };

    try {
      const response = await billsApi.create(billData);
      const generatedBill = response.data;

      showToast(`Bill ${generatedBill.billNumber} created successfully!`, 'success');
      setCompletedBill(generatedBill);
      clearCart();

      // Refresh product stock in catalog
      fetchCatalog();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Transaction rejected. Check product stock.';
      showToast(errMsg, 'error');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading POS Product Catalog..." minHeight="60vh" />;
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1.6fr) minmax(360px, 1fr)',
      gap: '1.75rem',
      alignItems: 'start'
    }}>
      {/* ---------------- LEFT: PRODUCT CATALOG ---------------- */}
      <div>
        {/* Top Controls: Barcode & Keyword Search */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
            {/* Live Search */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name or category..."
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

            {/* Barcode Scanner Input */}
            <form onSubmit={handleBarcodeSubmit} style={{ position: 'relative' }}>
              <input
                ref={barcodeInputRef}
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="Scan barcode & press Enter..."
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--primary-border)',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  outline: 'none'
                }}
              />
              <Barcode size={18} color="var(--primary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </form>
          </div>

          {/* Category Chips */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '2px' }}>
            <button
              onClick={() => setSelectedCategory('ALL')}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                backgroundColor: selectedCategory === 'ALL' ? 'var(--primary)' : 'var(--slate-100)',
                color: selectedCategory === 'ALL' ? '#ffffff' : 'var(--slate-700)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              All Items ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  backgroundColor: selectedCategory === cat ? 'var(--primary)' : 'var(--slate-100)',
                  color: selectedCategory === cat ? '#ffffff' : 'var(--slate-700)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {filteredProducts.map((p) => {
              const isOut = p.quantityInStock <= 0;
              const isLow = p.quantityInStock > 0 && p.quantityInStock <= p.minimumStock;

              return (
                <div
                  key={p.id}
                  onClick={() => !isOut && addToCart(p)}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${isOut ? 'var(--danger-border)' : 'var(--border-color)'}`,
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: isOut ? 'not-allowed' : 'pointer',
                    opacity: isOut ? 0.6 : 1,
                    transition: 'all var(--transition-fast)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isOut) {
                      e.currentTarget.style.borderColor = 'var(--primary)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isOut) {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {p.category}
                      </span>
                      <StatusBadge status={p.status} size="sm" />
                    </div>

                    <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--slate-800)', lineHeight: 1.35, marginBottom: '0.5rem' }}>
                      {p.name}
                    </h4>

                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--slate-400)', display: 'block', marginBottom: '0.75rem' }}>
                      {p.barcode}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--slate-100)' }}>
                    <div>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                        {currency}{Number(p.price).toFixed(2)}
                      </span>
                      <span style={{ display: 'block', fontSize: '0.72rem', color: isLow ? 'var(--warning)' : 'var(--slate-500)' }}>
                        Stock: {p.quantityInStock}
                      </span>
                    </div>

                    <button
                      disabled={isOut}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: isOut ? 'var(--slate-200)' : 'var(--primary)',
                        color: '#ffffff',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: isOut ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No Products Match"
            message={`No items found matching '${searchQuery}'. Try another search query or category.`}
          />
        )}
      </div>

      {/* ---------------- RIGHT: SHOPPING CART & CHECKOUT ---------------- */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: '84px',
        maxHeight: 'calc(100vh - 100px)'
      }}>
        {/* Cart Header */}
        <div style={{
          padding: '1.15rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingCart size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              Current Cart ({cart.reduce((a, b) => a + b.quantity, 0)})
            </h3>
          </div>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--danger)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Trash2 size={14} /> Clear
            </button>
          )}
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {cart.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.65rem 0',
                    borderBottom: '1px dotted var(--slate-200)'
                  }}
                >
                  <div style={{ flex: 1, marginRight: '0.75rem' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                      {item.product.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                      {currency}{Number(item.product.price).toFixed(2)} &times; {item.quantity}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '4px 6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          color: 'var(--slate-600)'
                        }}
                      >
                        <Minus size={13} />
                      </button>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, padding: '0 6px', minWidth: '20px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '4px 6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          color: 'var(--slate-600)'
                        }}
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <div style={{ minWidth: '55px', textAlign: 'right', fontWeight: 700, fontSize: '0.9rem', color: 'var(--slate-900)' }}>
                      {currency}{(item.product.price * item.quantity).toFixed(2)}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--slate-400)',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--slate-400)')}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--slate-400)' }}>
              <ShoppingCart size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
              <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                Shopping cart is empty
              </p>
              <span style={{ fontSize: '0.78rem' }}>
                Select items from catalog or scan barcode to add
              </span>
            </div>
          )}
        </div>

        {/* Customer & Payment Section */}
        <div style={{
          padding: '1.25rem 1.5rem',
          backgroundColor: 'var(--slate-50)',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          {/* Customer Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer Name (optional)"
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                fontSize: '0.8rem',
                outline: 'none',
                backgroundColor: '#ffffff'
              }}
            />
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Phone (optional)"
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                fontSize: '0.8rem',
                outline: 'none',
                backgroundColor: '#ffffff'
              }}
            />
          </div>

          {/* Payment Method Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem' }}>
            {['CASH', 'CARD', 'UPI'].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                style={{
                  padding: '0.45rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${paymentMethod === method ? 'var(--primary)' : 'var(--border-color)'}`,
                  backgroundColor: paymentMethod === method ? 'var(--primary-light)' : '#ffffff',
                  color: paymentMethod === method ? 'var(--primary)' : 'var(--slate-700)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                {method === 'CASH' && <DollarSign size={13} />}
                {method === 'CARD' && <CreditCard size={13} />}
                {method === 'UPI' && <Smartphone size={13} />}
                {method}
              </button>
            ))}
          </div>

          {/* Subtotal, Discount, Grand Total */}
          <div style={{
            paddingTop: '0.5rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            fontSize: '0.85rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--slate-600)' }}>
              <span>Subtotal:</span>
              <span style={{ fontWeight: 600 }}>{currency}{subtotal.toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--slate-600)' }}>Discount:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{currency}</span>
                <input
                  type="number"
                  min="0"
                  max={subtotal}
                  step="0.5"
                  value={discount}
                  onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                  style={{
                    width: '70px',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.85rem',
                    textAlign: 'right',
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--slate-900)',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '0.5rem',
              marginTop: '0.2rem'
            }}>
              <span>Grand Total:</span>
              <span style={{ color: 'var(--primary)' }}>
                {currency}{grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || checkoutLoading}
            style={{
              width: '100%',
              padding: '0.85rem',
              backgroundColor: 'var(--success)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: cart.length === 0 || checkoutLoading ? 'not-allowed' : 'pointer',
              opacity: cart.length === 0 || checkoutLoading ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: 'var(--shadow-md)',
              marginTop: '0.25rem'
            }}
          >
            {checkoutLoading ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Verifying Stock &amp; Generating Bill...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                <span>Complete Bill &amp; Print ({currency}{grandTotal.toFixed(2)})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Invoice Receipt Modal */}
      {completedBill && (
        <InvoiceModal
          isOpen={!!completedBill}
          onClose={() => setCompletedBill(null)}
          bill={completedBill}
          currency={currency}
        />
      )}
    </div>
  );
};

export default POSPage;
