import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/api';
import '../styles/auth.css';

function SignupPage() {
  const [form, setForm] = useState({ username: '', password: '', role: 'cashier' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async () => {
    if (!form.username || !form.password) {
      setError('Username and password are required');
      return;
    }
    try {
      await signup(form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create account');
    }
  };

  return (
    <div className="till-page">
      <div className="till-nav">
        <div className="till-logo">TILL<span>.</span></div>
      </div>

      <div className="form-card">
        <h2>CREATE ACCOUNT</h2>
        {error && <div className="form-error">{error}</div>}
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="cashier">Cashier</option>
          <option value="admin">Admin</option>
        </select>
        <button className="till-btn primary" onClick={handleSignup}>Create account</button>
        <div className="form-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;