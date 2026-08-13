import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import '../styles/auth.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await login({ username, password });
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', res.data.username);
      navigate(res.data.role === 'admin' ? '/admin' : '/billing');
    } catch {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="till-page">
      <div className="till-nav">
        <div className="till-logo">Bill Master<span>.</span></div>
      </div>

      <div className="form-card">
        <h2>SIGN IN</h2>
        {error && <div className="form-error">{error}</div>}
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />
        <button className="till-btn primary" onClick={handleLogin}>Sign in</button>
        <div className="form-switch">
          New here? <Link to="/signup">Create an account</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;