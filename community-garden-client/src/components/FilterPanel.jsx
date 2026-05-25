import React from 'react';

/**
 * Reusable filter panel — renders a row of filter buttons.
 * options: [{ label, value }]
 * active: currently selected value
 * onChange: callback(value)
 */
const FilterPanel = ({ options, active, onChange, label = 'Filter:' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
    {label && (
      <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </span>
    )}
    {options.map((opt) => (
      <button
        key={opt.value}
        onClick={() => onChange(opt.value)}
        style={{
          padding: '6px 16px',
          borderRadius: 100,
          border: '1.5px solid',
          borderColor: active === opt.value ? 'var(--green-600)' : 'var(--cream-dark)',
          background: active === opt.value ? 'var(--green-700)' : 'var(--white)',
          color: active === opt.value ? 'var(--white)' : 'var(--text-mid)',
          fontSize: '0.8rem',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.18s',
          fontFamily: 'var(--font-body)',
        }}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

export default FilterPanel;
