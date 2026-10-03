import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Clock, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { settingsApi } from '../services/api';

const TopNav = () => {
  const { user, isAdmin } = useAuth();
  const [storeName, setStoreName] = useState('BillMaster Supermarket');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    settingsApi.get()
      .then((res) => {
        if (res.data?.storeName) setStoreName(res.data.storeName);
      })
      .catch(() => {});
  }, []);

  return (
    <header style={{
      height: '64px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 1.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 30
    }}>
      {/* Store Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-800)' }}>
          {storeName}
        </h2>
        <span style={{
          fontSize: '0.72rem',
          padding: '2px 8px',
          borderRadius: 'var(--radius-full)',
          background: isAdmin ? 'var(--primary-light)' : '#ecfdf5',
          color: isAdmin ? 'var(--primary)' : 'var(--success)',
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {isAdmin ? <Shield size={12} /> : <UserCheck size={12} />}
          {user?.role} ACCESS
        </span>
      </div>

      {/* Right Tools: Live Clock & Quick Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {/* Live Clock */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem',
          color: 'var(--slate-500)',
          fontFamily: 'var(--font-mono)'
        }}>
          <Clock size={16} />
          <span>
            {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} &bull; {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>

        {/* Quick Launch POS Button */}
        <Link
          to="/pos"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.45rem 1rem',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.825rem',
            fontWeight: 600,
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <ShoppingCart size={15} />
          <span>Launch POS</span>
        </Link>
      </div>
    </header>
  );
};

export default TopNav;
