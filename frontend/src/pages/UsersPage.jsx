import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Shield,
  UserCheck,
  UserX,
  Mail,
  Lock,
  User as UserIcon,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { usersApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';

const UsersPage = () => {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await usersApi.getAll();
      setUsers(response.data || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load user accounts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateCashier = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      showToast('All fields are required', 'warning');
      return;
    }
    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters long', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      await usersApi.createCashier({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      });
      showToast(`Cashier account created for ${formData.name}!`, 'success');
      setIsModalOpen(false);
      setFormData({ name: '', email: '', password: '' });
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create cashier account';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (user) => {
    if (user.id === currentUser?.id) {
      showToast('You cannot deactivate your own active admin account', 'warning');
      return;
    }

    try {
      const response = await usersApi.toggleStatus(user.id);
      showToast(response.data?.message || 'User status updated', 'success');
      fetchUsers();
    } catch (err) {
      showToast('Failed to change user status', 'error');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const cashierCount = users.filter(u => u.role === 'CASHIER').length;
  const activeCount = users.filter(u => u.active).length;

  if (loading && users.length === 0) {
    return <LoadingSpinner message="Loading Staff &amp; Access Controls..." minHeight="60vh" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em', margin: 0 }}>
            User Management &amp; Access Control
          </h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem', marginTop: '0.35rem', margin: 0 }}>
            Provision cashier credentials, manage permissions, and audit staff accounts
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={fetchUsers}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1rem',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--slate-700)',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} /> Refresh
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.25rem',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <UserPlus size={16} /> Add Cashier
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem'
      }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          border: '1px solid var(--border-color)'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
            Total Staff
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '0.25rem' }}>
            {totalUsers}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            Registered system accounts
          </span>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          border: '1px solid var(--border-color)'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase' }}>
            Administrators
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>
            {adminCount}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            Full system authority
          </span>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          border: '1px solid var(--border-color)'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0d9488', textTransform: 'uppercase' }}>
            Cashiers
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0d9488', marginTop: '0.25rem' }}>
            {cashierCount}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            POS &amp; checkout operators
          </span>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          border: '1px solid var(--border-color)'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--success)', textTransform: 'uppercase' }}>
            Active Accounts
          </span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.25rem' }}>
            {activeCount}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
            Permitted to authenticate
          </span>
        </div>
      </div>

      {/* Filter and Table Container */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-color)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        {/* Filter Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.875rem 0.6rem 2.4rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-main)',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: 600 }}>Role:</span>
            {['ALL', 'ADMIN', 'CASHIER'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                style={{
                  padding: '0.45rem 0.9rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: roleFilter === role ? 'var(--primary)' : 'var(--bg-main)',
                  color: roleFilter === role ? '#ffffff' : 'var(--slate-600)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)' }}>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--slate-700)' }}>User</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--slate-700)' }}>Email</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--slate-700)', textAlign: 'center' }}>Role</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--slate-700)', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--slate-700)' }}>Created At</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--slate-700)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  const isSelf = u.id === currentUser?.id;
                  return (
                    <tr
                      key={u.id}
                      style={{ borderBottom: '1px solid var(--border-color)' }}
                    >
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: u.role === 'ADMIN' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(13, 148, 136, 0.15)',
                            color: u.role === 'ADMIN' ? 'var(--primary)' : '#0d9488',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.9rem'
                          }}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>
                              {u.name} {isSelf && <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>(You)</span>}
                            </div>
                            <div style={{ fontSize: '0.775rem', color: 'var(--slate-500)' }}>ID #{u.id}</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '1rem', color: 'var(--slate-600)' }}>
                        {u.email}
                      </td>

                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.25rem 0.65rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.775rem',
                          fontWeight: 700,
                          backgroundColor: u.role === 'ADMIN' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(13, 148, 136, 0.1)',
                          color: u.role === 'ADMIN' ? 'var(--primary)' : '#0d9488'
                        }}>
                          {u.role === 'ADMIN' ? <Shield size={12} /> : <UserCheck size={12} />}
                          {u.role}
                        </span>
                      </td>

                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span style={{
                          padding: '0.25rem 0.65rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.775rem',
                          fontWeight: 700,
                          backgroundColor: u.active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: u.active ? 'var(--success)' : 'var(--danger)'
                        }}>
                          {u.active ? 'ACTIVE' : 'DEACTIVATED'}
                        </span>
                      </td>

                      <td style={{ padding: '1rem', color: 'var(--slate-500)', fontSize: '0.8rem' }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'System Initialized'}
                      </td>

                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        {isSelf ? (
                          <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)', fontStyle: 'italic' }}>
                            Current Admin
                          </span>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(u)}
                            style={{
                              padding: '0.35rem 0.75rem',
                              borderRadius: 'var(--radius-md)',
                              border: `1px solid ${u.active ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                              backgroundColor: u.active ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)',
                              color: u.active ? 'var(--danger)' : 'var(--success)',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem'
                            }}
                          >
                            {u.active ? <UserX size={13} /> : <UserCheck size={13} />}
                            {u.active ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center' }}>
                    <EmptyState
                      title="No Users Found"
                      description="No user accounts match your search filters."
                      icon={Users}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Cashier Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Provision New Cashier Account"
        maxWidth="500px"
      >
        <form onSubmit={handleCreateCashier} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{
            padding: '0.85rem 1rem',
            backgroundColor: 'rgba(99, 102, 241, 0.06)',
            borderRadius: 'var(--radius-md)',
            borderLeft: '3px solid var(--primary)',
            fontSize: '0.85rem',
            color: 'var(--slate-700)',
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center'
          }}>
            <AlertCircle size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
            <span>
              Cashiers are granted checkout POS and transaction query permissions. They cannot access system settings or managerial analytics.
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
              Full Name *
            </label>
            <div style={{ position: 'relative' }}>
              <UserIcon size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              <input
                type="text"
                required
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.875rem 0.65rem 2.4rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
              Email Address *
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              <input
                type="email"
                required
                placeholder="cashier@supermarket.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.875rem 0.65rem 2.4rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
              Temporary Password * (min 6 characters)
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.875rem 0.65rem 2.4rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'transparent',
                color: 'var(--slate-700)',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '0.65rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              {submitting ? 'Creating...' : 'Create Cashier Account'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UsersPage;
