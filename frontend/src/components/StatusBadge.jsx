import React from 'react';

const StatusBadge = ({ status, size = 'md' }) => {
  if (!status) return null;

  const s = status.toUpperCase();

  let bg = '#f1f5f9';
  let color = '#475569';
  let border = '#cbd5e1';

  if (s === 'IN STOCK' || s === 'HEALTHY' || s === 'INCREASING') {
    bg = '#ecfdf5';
    color = '#065f46';
    border = '#a7f3d0';
  } else if (s === 'LOW STOCK' || s === 'RESTOCK SOON' || s === 'MEDIUM') {
    bg = '#fffbeb';
    color = '#92400e';
    border = '#fde68a';
  } else if (s === 'OUT OF STOCK' || s === 'CRITICAL' || s === 'HIGH' || s === 'SPIKE') {
    bg = '#fef2f2';
    color = '#991b1b';
    border = '#fecaca';
  } else if (s === 'DROP' || s === 'DECREASING') {
    bg = '#eff6ff';
    color = '#1e40af';
    border = '#bfdbfe';
  } else if (s === 'INSUFFICIENT DATA' || s === 'INSUFFICIENT') {
    bg = '#fff7ed';
    color = '#9a3412';
    border = '#ffedd5';
  }

  const isSmall = size === 'sm';

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: isSmall ? '2px 6px' : '3px 10px',
      borderRadius: 'var(--radius-full)',
      fontSize: isSmall ? '0.7rem' : '0.75rem',
      fontWeight: 700,
      letterSpacing: '0.02em',
      backgroundColor: bg,
      color: color,
      border: `1px solid ${border}`,
      whiteSpace: 'nowrap'
    }}>
      {status}
    </span>
  );
};

export default StatusBadge;
