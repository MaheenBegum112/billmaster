import { useEffect, useState } from 'react';
import { getProducts, createBill } from '../services/api';
import { useCart } from '../context/CartContext';

function BillingPage() {
  const [products, setProducts] = useState([]);
  const { cart, addToCart, removeFromCart, clearCart, subtotal } = useCart();

  useEffect(() => {
    getProducts().then(res => setProducts(res.data));
  }, []);

  const handleCheckout = async () => {
    if (cart.length === 0) return alert('Cart is empty');

    const payload = {
      items: cart.map(item => ({ productId: item.productId, quantity: item.quantity })),
      discount: 0
    };

    try {
      const res = await createBill(payload);
      alert(`Bill #${res.data.id} generated! Grand Total: ₹${res.data.grandTotal}`);
      clearCart();
      getProducts().then(r => setProducts(r.data)); // refresh stock
    } catch (err) {
      alert('Checkout failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Billing</h2>

      <div style={{ marginBottom: '20px' }}>
        <h3>Products</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {products.map(p => (
            <button key={p.id} onClick={() => addToCart(p)} style={{ padding: '10px' }}>
              {p.name} — ₹{p.price} ({p.quantityInStock} left)
            </button>
          ))}
        </div>
      </div>

      <h3>Cart</h3>
      <table border="1" cellPadding="8" style={{ width: '100%', marginBottom: '20px' }}>
        <thead>
          <tr><th>Item</th><th>Qty</th><th>Price</th><th>Subtotal</th><th></th></tr>
        </thead>
        <tbody>
          {cart.map(item => (
            <tr key={item.productId}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>₹{item.price}</td>
              <td>₹{(item.price * item.quantity).toFixed(2)}</td>
              <td><button onClick={() => removeFromCart(item.productId)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Subtotal: ₹{subtotal.toFixed(2)}</h3>
      <button onClick={handleCheckout} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Checkout
      </button>
    </div>
  );
}

export default BillingPage;