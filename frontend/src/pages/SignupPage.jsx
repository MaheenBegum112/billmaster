import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Lock,
  Mail,
  User,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  KeyRound,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const SignupPage = () => {
  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Selected Role: 'CASHIER' or 'ADMIN'
  const [selectedRole, setSelectedRole] = useState('CASHIER');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminSecretKey: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const isCashier = selectedRole === 'CASHIER';

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Full name is required';
    }
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Invalid email format';
    }
    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    if (selectedRole === 'ADMIN' && !formData.adminSecretKey.trim()) {
      errs.adminSecretKey = 'Administrator Master Key is required to create an Admin account';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: selectedRole,
        adminSecretKey: selectedRole === 'ADMIN' ? formData.adminSecretKey.trim() : null
      };

      const response = await signup(payload);
      showToast(response.message || 'Account registered successfully! Please log in.', 'success');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please check your information.';
      setServerError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

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
        maxWidth: '540px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        border: `2px solid ${isCashier ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
        boxShadow: isCashier
          ? '0 10px 25px -5px rgba(16, 185, 129, 0.1), 0 8px 10px -6px rgba(16, 185, 129, 0.1)'
          : '0 10px 25px -5px rgba(99, 102, 241, 0.15), 0 8px 10px -6px rgba(99, 102, 241, 0.1)',
        padding: '2.5rem',
        transition: 'all 0.25s ease'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
            {isCashier ? <UserCheck size={26} /> : <ShieldCheck size={26} />}
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em', margin: 0 }}>
            Create Staff Account
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', marginTop: '0.35rem', margin: 0 }}>
            Select your assigned supermarket role and register your credentials
          </p>
        </div>

        {/* Role Selection Cards */}
        <div style={{ marginBottom: '1.75rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.65rem' }}>
            Choose Account Role *
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            {/* Cashier Option */}
            <div
              onClick={() => setSelectedRole('CASHIER')}
              style={{
                border: `2px solid ${isCashier ? 'var(--success)' : 'var(--border-color)'}`,
                backgroundColor: isCashier ? 'rgba(16, 185, 129, 0.05)' : '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              {isCashier && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--success)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CheckCircle2 size={12} />
                </div>
              )}
              <div>
                <div style={{
                  display: 'inline-flex',
                  padding: '0.4rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  color: 'var(--success)',
                  marginBottom: '0.5rem'
                }}>
                  <UserCheck size={18} />
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--slate-900)' }}>
                  Cashier Staff
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', margin: '0.25rem 0 0 0', lineHeight: 1.4 }}>
                  POS billing register, item scanning, bill creation &amp; receipt printing.
                </p>
              </div>
              <span style={{
                marginTop: '0.75rem',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'var(--success)',
                display: 'block'
              }}>
                Instant Access
              </span>
            </div>

            {/* Admin Option */}
            <div
              onClick={() => setSelectedRole('ADMIN')}
              style={{
                border: `2px solid ${!isCashier ? 'var(--primary)' : 'var(--border-color)'}`,
                backgroundColor: !isCashier ? 'rgba(99, 102, 241, 0.05)' : '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              {!isCashier && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CheckCircle2 size={12} />
                </div>
              )}
              <div>
                <div style={{
                  display: 'inline-flex',
                  padding: '0.4rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  color: 'var(--primary)',
                  marginBottom: '0.5rem'
                }}>
                  <ShieldCheck size={18} />
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--slate-900)' }}>
                  Administrator
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', margin: '0.25rem 0 0 0', lineHeight: 1.4 }}>
                  Full store authority, inventory CRUD, revenue reports &amp; AI engines.
                </p>
              </div>
              <span style={{
                marginTop: '0.75rem',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: 'var(--primary)',
                display: 'block'
              }}>
                Requires Master Key
              </span>
            </div>
          </div>
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

        <form onSubmit={handleSignup}>
          {/* Conditional Admin Secret Key Input */}
          {!isCashier && (
            <div style={{
              marginBottom: '1.25rem',
              padding: '1.25rem',
              backgroundColor: 'rgba(99, 102, 241, 0.05)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(99, 102, 241, 0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-800)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <KeyRound size={15} color="var(--primary)" /> Administrator Master Key *
                </label>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, adminSecretKey: 'ADMIN@BILLMASTER2026' }))}
                  style={{
                    fontSize: '0.725rem',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Insert Demo Master Key
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  name="adminSecretKey"
                  value={formData.adminSecretKey}
                  onChange={handleChange}
                  placeholder="Enter Master Security Key (e.g. ADMIN@BILLMASTER2026)"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${errors.adminSecretKey ? 'var(--danger)' : 'var(--border-color)'}`,
                    fontSize: '0.875rem',
                    backgroundColor: '#ffffff',
                    outline: 'none'
                  }}
                />
                <KeyRound size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
              {errors.adminSecretKey && (
                <span style={{ fontSize: '0.75rem', color: 'var(--danger)', display: 'block', marginTop: '0.25rem' }}>
                  {errors.adminSecretKey}
                </span>
              )}
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', display: 'block', marginTop: '0.4rem' }}>
                Authorized passkey required to prevent unauthorized executive registrations. Demo Key: <code>ADMIN@BILLMASTER2026</code>
              </span>
            </div>
          )}

          {/* Name */}
          <div style={{ marginBottom: '1.15rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
              Full Name *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={isCashier ? 'e.g. Jane Doe (Cashier)' : 'e.g. Robert Smith (Store Admin)'}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${errors.name ? 'var(--danger)' : 'var(--border-color)'}`,
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
              <User size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            {errors.name && (
              <span style={{ fontSize: '0.75rem', color: 'var(--danger)', display: 'block', marginTop: '0.25rem' }}>
                {errors.name}
              </span>
            )}
          </div>

          {/* Email */}
          <div style={{ marginBottom: '1.15rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
              Work Email Address *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={isCashier ? 'jane.cashier@supermarket.com' : 'robert.admin@supermarket.com'}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${errors.email ? 'var(--danger)' : 'var(--border-color)'}`,
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
              <Mail size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
            {errors.email && (
              <span style={{ fontSize: '0.75rem', color: 'var(--danger)', display: 'block', marginTop: '0.25rem' }}>
                {errors.email}
              </span>
            )}
          </div>

          {/* Password Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="min. 6 chars"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem 0.65rem 2.2rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${errors.password ? 'var(--danger)' : 'var(--border-color)'}`,
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
                <Lock size={15} color="var(--slate-400)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
              {errors.password && (
                <span style={{ fontSize: '0.725rem', color: 'var(--danger)', display: 'block', marginTop: '0.25rem' }}>
                  {errors.password}
                </span>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                Confirm Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="re-enter password"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem 0.65rem 2.2rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${errors.confirmPassword ? 'var(--danger)' : 'var(--border-color)'}`,
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
                <Lock size={15} color="var(--slate-400)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
              {errors.confirmPassword && (
                <span style={{ fontSize: '0.725rem', color: 'var(--danger)', display: 'block', marginTop: '0.25rem' }}>
                  {errors.confirmPassword}
                </span>
              )}
            </div>
          </div>

          {/* Submit */}
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
                <span>Registering Account in Database...</span>
              </>
            ) : (
              <>
                <span>Register as {isCashier ? 'Cashier Staff' : 'Store Administrator'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--slate-500)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
