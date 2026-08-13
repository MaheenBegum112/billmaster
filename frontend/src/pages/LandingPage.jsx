import { useNavigate } from 'react-router-dom';
import '../styles/landing.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="grocery-page">
      
      <div className="grocery-nav">
  <div className="grocery-logo">
      BillMaster<span className="dot">.</span>
  </div>

  <div className="nav-links">
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </div>

  <button 
    className="nav-login"
    onClick={() => navigate('/login')}
  >
    Sign in
  </button>
</div>

      <div className="grocery-hero-section">
        <div className="grocery-hero">
          <div className="sticker s1"><span className="emoji">🍅</span>₹40</div>
          <div className="sticker s2"><span className="emoji">🥦</span>₹60</div>
          <div className="sticker s3"><span className="emoji">🍞</span>₹35</div>
          <div className="sticker s4"><span className="emoji">🥛</span>₹55</div>
          <div className="sticker s5"><span className="emoji">🍎</span>₹90</div>

          <h1>Billing that's as <span className="accent">fresh</span> as your shelves.</h1>
          <p>
            Ring up customers, track stock, and keep your store running —
            all from one simple counter.
          </p>

          <div className="grocery-actions">
            <button className="pill-btn outline" onClick={() => navigate('/signup')}>
              Create account
            </button>
            <button className="pill-btn fill" onClick={() => navigate('/login')}>
              Sign in
            </button>
          </div>
        </div>
      </div>

      <div className="grocery-features">
        <div className="feature-card fc1">
          <div className="ficon">🧾</div>
          <h3>One-click checkout</h3>
          <p>Add items to the cart and generate a bill in seconds — no calculator needed.</p>
        </div>
        <div className="feature-card fc2">
          <div className="ficon">📦</div>
          <h3>Live stock sync</h3>
          <p>Every sale updates inventory automatically, so you always know what's left.</p>
        </div>
        <div className="feature-card fc3">
          <div className="ficon">🔐</div>
          <h3>Role-based access</h3>
          <p>Admins manage products and stock. Cashiers just bill — nothing gets mixed up.</p>
        </div>
      </div>

      <div className="grocery-footer">
        <div className="grocery-logo">BillMaster<span className="dot">.</span></div>
        <span>Built for small stores, by small teams.</span>
      </div>
    </div>
  );
}

export default LandingPage;