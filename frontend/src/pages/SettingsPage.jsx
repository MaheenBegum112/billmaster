import React, { useState, useEffect } from 'react';
import {
  Settings,
  Store,
  Receipt,
  Cpu,
  Save,
  RefreshCw,
  Percent,
  DollarSign,
  Phone,
  MapPin,
  Clock,
  Shield,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { settingsApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';

const SettingsPage = () => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    storeName: '',
    storeAddress: '',
    storePhone: '',
    currency: '$',
    taxRate: 5.0,
    defaultDiscount: 0.0,
    restockHorizonDays: 7,
    anomalyThresholdSigma: 2.0,
    forecastPeriodDays: 7
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await settingsApi.get();
      if (res.data) {
        setSettings(res.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load store settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!settings.storeName?.trim()) {
      showToast('Store name is required', 'warning');
      return;
    }

    setSaving(true);
    try {
      const res = await settingsApi.update(settings);
      setSettings(res.data);
      showToast('Store settings saved successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to update settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading Store Configurations..." minHeight="60vh" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em', margin: 0 }}>
            Store &amp; System Configuration
          </h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem', marginTop: '0.35rem', margin: 0 }}>
            Configure store receipts, tax formulas, default currencies, and statistical AI parameters
          </p>
        </div>

        <button
          onClick={fetchSettings}
          disabled={loading || saving}
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
          <RefreshCw size={15} className={loading ? 'spin' : ''} /> Discard Changes
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Section 1: Store Profile & Receipts */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Store size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                Store Identity &amp; Printed Receipts
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', margin: '0.2rem 0 0 0' }}>
                This information appears prominently on invoices and customer checkout receipts
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
                Store Business Name *
              </label>
              <div style={{ position: 'relative' }}>
                <Store size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                <input
                  type="text"
                  required
                  name="storeName"
                  value={settings.storeName || ''}
                  onChange={handleChange}
                  placeholder="e.g. BillMaster Supermarket"
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
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
                Contact Phone Number
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                <input
                  type="text"
                  name="storePhone"
                  value={settings.storePhone || ''}
                  onChange={handleChange}
                  placeholder="+1 (555) 019-2834"
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

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
                Physical Address
              </label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                <input
                  type="text"
                  name="storeAddress"
                  value={settings.storeAddress || ''}
                  onChange={handleChange}
                  placeholder="123 Retail Boulevard, Downtown District, Suite 100"
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
          </div>
        </div>

        {/* Section 2: Taxation & Currency */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Receipt size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                Financial Rules &amp; Taxation
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', margin: '0.2rem 0 0 0' }}>
                Configure statutory sales tax calculation and default currency representation
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
                Currency Symbol
              </label>
              <select
                name="currency"
                value={settings.currency || '$'}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.875rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  outline: 'none'
                }}
              >
                <option value="$">$ - US Dollar</option>
                <option value="₹">₹ - Indian Rupee</option>
                <option value="€">€ - Euro</option>
                <option value="£">£ - British Pound</option>
                <option value="¥">¥ - Japanese Yen</option>
                <option value="C$">C$ - Canadian Dollar</option>
                <option value="A$">A$ - Australian Dollar</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
                Sales Tax Rate (%)
              </label>
              <div style={{ position: 'relative' }}>
                <Percent size={16} style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  name="taxRate"
                  value={settings.taxRate !== undefined ? settings.taxRate : 5.0}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.65rem 2rem 0.65rem 0.875rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
                Default POS Discount (%)
              </label>
              <div style={{ position: 'relative' }}>
                <Percent size={16} style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  name="defaultDiscount"
                  value={settings.defaultDiscount !== undefined ? settings.defaultDiscount : 0.0}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.65rem 2rem 0.65rem 0.875rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: AI Engine Hyperparameters */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
                Empirical AI Engine Calibration
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', margin: '0.2rem 0 0 0' }}>
                Fine-tune mathematical thresholds, standard deviation multipliers, and lead horizons
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            <div style={{
              padding: '1.25rem',
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-800)' }}>
                  Restock Horizon (Days)
                </label>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>Smart Restock</span>
              </div>
              <input
                type="number"
                min="1"
                max="60"
                name="restockHorizonDays"
                value={settings.restockHorizonDays || 7}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  outline: 'none'
                }}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', margin: '0.5rem 0 0 0' }}>
                Burn rate projection window. If days of inventory &lt; horizon, alert is triggered.
              </p>
            </div>

            <div style={{
              padding: '1.25rem',
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-800)' }}>
                  Anomaly Threshold (σ)
                </label>
                <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700 }}>Z-Score Engine</span>
              </div>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                name="anomalyThresholdSigma"
                value={settings.anomalyThresholdSigma || 2.0}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  outline: 'none'
                }}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', margin: '0.5rem 0 0 0' }}>
                Standard deviations above the mean (Z &gt; σ). Standard statistical practice is 2.0σ (95.4% interval).
              </p>
            </div>

            <div style={{
              padding: '1.25rem',
              backgroundColor: 'var(--bg-main)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-800)' }}>
                  Default Forecast Horizon
                </label>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>Forecasting</span>
              </div>
              <input
                type="number"
                min="3"
                max="90"
                name="forecastPeriodDays"
                value={settings.forecastPeriodDays || 7}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  outline: 'none'
                }}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', margin: '0.5rem 0 0 0' }}>
                Default projected horizon days displayed on managerial reports and stock buffer calculations.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.85rem 2rem',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-md)',
              transition: 'background-color 0.15s ease'
            }}
          >
            <Save size={18} />
            {saving ? 'Saving System Changes...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
