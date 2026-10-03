import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Boxes,
  Receipt,
  BarChart3,
  Brain,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  Users,
  Settings,
  HelpCircle,
  ShoppingBag,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, isAdmin, logout } = useAuth();

  const adminNav = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'POS / Billing', path: '/pos', icon: ShoppingCart },
    { label: 'Products', path: '/products', icon: Package },
    { label: 'Inventory', path: '/inventory', icon: Boxes },
    { label: 'Bills History', path: '/bills', icon: Receipt },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
    { section: 'AI Decision Engine' },
    { label: 'AI Overview', path: '/ai', icon: Brain },
    { label: 'Smart Restock', path: '/ai/smart-restock', icon: RefreshCw },
    { label: 'Anomaly Detection', path: '/ai/anomalies', icon: AlertTriangle },
    { label: 'Demand Forecast', path: '/ai/forecast', icon: TrendingUp },
    { section: 'System Administration' },
    { label: 'User Accounts', path: '/users', icon: Users },
    { label: 'Store Settings', path: '/settings', icon: Settings },
    { label: 'System About', path: '/app/about', icon: HelpCircle }
  ];

  const cashierNav = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'POS / Billing', path: '/pos', icon: ShoppingCart },
    { label: 'My Bills History', path: '/bills', icon: Receipt },
    { label: 'System About', path: '/app/about', icon: HelpCircle }
  ];

  const navItems = isAdmin ? adminNav : cashierNav;

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      flexShrink: 0
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '1.25rem 1.5rem',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff'
        }}>
          <ShoppingBag size={20} />
        </div>
        <div>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Bill<span style={{ color: 'var(--primary)' }}>Master</span>
          </span>
          <span style={{
            display: 'block',
            fontSize: '0.65rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: isAdmin ? 'var(--primary)' : 'var(--accent)'
          }}>
            {isAdmin ? 'Store Admin' : 'Cashier Terminal'}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem 0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem'
      }}>
        {navItems.map((item, index) => {
          if (item.section) {
            return (
              <div
                key={`sec-${index}`}
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--slate-400)',
                  padding: '1rem 0.75rem 0.35rem',
                  marginTop: '0.25rem'
                }}
              >
                {item.section}
              </div>
            );
          }

          const IconComponent = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--primary)' : 'var(--slate-600)',
                backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                transition: 'all var(--transition-fast)'
              })}
            >
              <IconComponent size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* User Info & Logout Footer */}
      <div style={{
        padding: '1rem 1.25rem',
        borderTop: '1px solid var(--border-color)',
        backgroundColor: 'var(--slate-50)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ overflow: 'hidden' }}>
          <div style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--slate-800)',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden'
          }}>
            {user?.name || 'User'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
            {user?.role}
          </div>
        </div>
        <button
          onClick={logout}
          title="Logout"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--slate-400)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color var(--transition-fast)'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--slate-400)')}
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
