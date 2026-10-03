import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Lock,
  Mail,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Sparkles,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Active Role Tab: 'CASHIER' or 'ADMIN'
  const [activeRole, setActiveRole] = useState('CASHIER');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Handle switching role tabs
  const handleRoleTabChange = (role) => {
    setActiveRole(role);
    setServerError('');
    setErrors({});
    if (role === 'ADMIN') {
      setEmail('admin@billmaster.com');
      setPassword('admin123');
    } else {
      setEmail('cashier@billmaster.com');
      setPassword('cashier123');
    }
  };

  // Smart detect role if user types manually
  const handleEmailChange = (val) => {
    setEmail(val);
    if (val.toLowerCase().includes('admin') && activeRole !== 'ADMIN') {
      setActiveRole('ADMIN');
    }
  };

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Invalid email format';
    }
    if (!password) {
      errs.password = 'Password is required';
    }
    return errs;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      const userData = await login(email.trim(), password);
      showToast(`Welcome back, ${userData.name}! Logged in as ${userData.role}.`, 'success');

      // Direct to destination or dashboard
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password. Please verify your credentials.';
      setServerError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const isCashier = activeRole === 'CASHIER';

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      backgroundColor: 'var(--bg-main)'
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        border: `2px solid ${isCashier ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
        boxShadow: isCashier
          ? '0 10px 25px -5px rgba(16, 185, 129, 0.1), 0 8px 10px -6px rgba(16, 185, 129, 0.1)'
          : '0 10px 25px -5px rgba(99, 102, 241, 0.15), 0 8px 10px -6px rgba(99, 102, 241, 0.1)',
        padding: '2.25rem',
        transition: 'all 0.25s ease'
      }}>
        {/* Role Selector Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          backgroundColor: 'var(--slate-100)',
          padding: '0.35rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '1.75rem'
        }}>
          <button
            type="button"
            onClick={() => handleRoleTabChange('CASHIER')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              padding: '0.65rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 700,
              backgroundColor: isCashier ? '#ffffff' : 'transparent',
              color: isCashier ? 'var(--success)' : 'var(--slate-600)',
              boxShadow: isCashier ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <UserCheck size={16} /> Cashier Terminal
          </button>

          <button
            type="button"
            onClick={() => handleRoleTabChange('ADMIN')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              padding: '0.65rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 700,
              backgroundColor: !isCashier ? '#ffffff' : 'transparent',
              color: !isCashier ? 'var(--primary)' : 'var(--slate-600)',
              boxShadow: !isCashier ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <ShieldCheck size={16} /> Administrator
          </button>
        </div>

        {/* Dynamic Header based on active role */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: isCashier
              ? 'linear-gradient(135deg, #10b981 0%, #0d9488 100%)'
              : 'linear-gradient(135deg, var(--primary) 0%, #312e81 100%)',
            borderRadius: 'var(--radius-lg)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            marginBottom: '0.85rem',
            boxShadow: isCashier
              ? '0 4px 12px rgba(16, 185, 129, 0.3)'
              : '0 4px 12px rgba(99, 102, 241, 0.3)'
          }}>
            {isCashier ? <ShoppingBag size={24} /> : <ShieldCheck size={26} />}
          </div>

          <div style={{ marginBottom: '0.4rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.2rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.725rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              backgroundColor: isCashier ? 'rgba(16, 185, 129, 0.12)' : 'rgba(99, 102, 241, 0.12)',
              color: isCashier ? 'var(--success)' : 'var(--primary)'
            }}>
              {isCashier ? <UserCheck size={12} /> : <ShieldCheck size={12} />}
              {isCashier ? 'Cashier POS Terminal Mode' : 'Store Administrator Portal Mode'}
            </span>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em', margin: 0 }}>
            {isCashier ? 'Cashier Sign In' : 'Administrator Sign In'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.35rem', margin: 0 }}>
            {isCashier
              ? 'Checkout lane point-of-sale, item scanning & invoice receipt printer'
              : 'Executive dashboard, catalog CRUD, sales reports & empirical AI engine'}
          </p>
        </div>

        {serverError && (
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            color: 'var(--danger)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={18} />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)' }}>
                {isCashier ? 'Cashier Account Email' : 'Administrator Email'}
              </label>
              <span style={{ fontSize: '0.75rem', color: isCashier ? 'var(--success)' : 'var(--primary)', fontWeight: 600 }}>
                {isCashier ? 'Staff Login' : 'Admin Authority'}
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder={isCashier ? 'cashier@billmaster.com' : 'admin@billmaster.com'}
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem 0.7rem 2.4rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${errors.email ? 'var(--danger)' : 'var(--border-color)'}`,
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <Mail size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            {errors.email && (
              <span style={{ fontSize: '0.75rem', color: 'var(--danger)', display: 'block', marginTop: '0.25rem' }}>
                {errors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.7rem 0.9rem 0.7rem 2.4rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${errors.password ? 'var(--danger)' : 'var(--border-color)'}`,
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <Lock size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            {errors.password && (
              <span style={{ fontSize: '0.75rem', color: 'var(--danger)', display: 'block', marginTop: '0.25rem' }}>
                {errors.password}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.85rem',
              backgroundColor: isCashier ? 'var(--success)' : 'var(--primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.75 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: 'var(--shadow-sm)',
              transition: 'background-color 0.2s ease'
            }}
          >
            {loading ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Authenticating Credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In as {isCashier ? 'Cashier' : 'Administrator'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Demo Fill Selector */}
        <div style={{
          marginTop: '1.75rem',
          padding: '1rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--slate-50)',
          border: '1px solid var(--border-color)'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--slate-500)', display: 'block', marginBottom: '0.65rem' }}>
            Instant One-Click Demo Credentials:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleRoleTabChange('CASHIER')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.65rem',
                backgroundColor: isCashier ? 'rgba(16, 185, 129, 0.1)' : '#ffffff',
                border: `1px solid ${isCashier ? 'var(--success)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-md)',
                fontSize: '0.775rem',
                fontWeight: 700,
                color: 'var(--success)',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <UserCheck size={14} /> Fill Cashier
            </button>

            <button
              type="button"
              onClick={() => handleRoleTabChange('ADMIN')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.65rem',
                backgroundColor: !isCashier ? 'rgba(99, 102, 241, 0.1)' : '#ffffff',
                border: `1px solid ${!isCashier ? 'var(--primary)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-md)',
                fontSize: '0.775rem',
                fontWeight: 700,
                color: 'var(--primary)',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <ShieldCheck size={14} /> Fill Admin
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--slate-500)' }}>
          Don't have an account yet?{' '}
          <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Register new account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
