import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.875rem 2rem'
    }}>
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)'
          }}>
            <ShoppingBag size={20} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--slate-900)' }}>
              Bill<span style={{ color: 'var(--primary)' }}>Master</span>
            </span>
            <span style={{
              display: 'block',
              fontSize: '0.65rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--accent)'
            }}>
              AI POS & Intelligence
            </span>
          </div>
        </Link>

        {/* Public Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', fontSize: '0.925rem', fontWeight: 500 }}>
          <Link
            to="/"
            style={{
              color: isActive('/') ? 'var(--primary)' : 'var(--slate-600)',
              fontWeight: isActive('/') ? 600 : 500,
              transition: 'color var(--transition-fast)'
            }}
          >
            Home
          </Link>
          <Link
            to="/about"
            style={{
              color: isActive('/about') ? 'var(--primary)' : 'var(--slate-600)',
              fontWeight: isActive('/about') ? 600 : 500,
              transition: 'color var(--transition-fast)'
            }}
          >
            About
          </Link>
          <Link
            to="/contact"
            style={{
              color: isActive('/contact') ? 'var(--primary)' : 'var(--slate-600)',
              fontWeight: isActive('/contact') ? 600 : 500,
              transition: 'color var(--transition-fast)'
            }}
          >
            Contact
          </Link>
        </nav>

        {/* Auth CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--slate-600)' }}>
                Hi, <strong>{user?.name}</strong> ({user?.role})
              </span>
              <Link
                to="/dashboard"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 1.25rem',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                Go to Dashboard <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  color: 'var(--slate-700)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  padding: '0.5rem 1rem'
                }}
              >
                Login
              </Link>
              <Link
                to="/signup"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 1.25rem',
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  boxShadow: '0 2px 4px rgba(79, 70, 229, 0.25)',
                  transition: 'background-color var(--transition-fast)'
                }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
