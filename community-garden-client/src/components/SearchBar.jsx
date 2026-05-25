import React from 'react';

const SearchBar = ({ value, onChange, placeholder = 'Search...', style }) => (
  <div style={{ position: 'relative', ...style }}>
    <span style={{
      position: 'absolute', left: 14, top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--text-light)', fontSize: '0.95rem',
      pointerEvents: 'none',
    }}>🔍</span>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '10px 16px 10px 40px',
        border: '1.5px solid var(--cream-dark)',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-body)',
        fontSize: '0.875rem',
        color: 'var(--text-dark)',
        background: 'var(--white)',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        minWidth: 240,
      }}
      onFocus={(e) => {
        e.target.style.borderColor = 'var(--green-600)';
        e.target.style.boxShadow = '0 0 0 3px rgba(82,183,136,0.15)';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = 'var(--cream-dark)';
        e.target.style.boxShadow = 'none';
      }}
    />
  </div>
);

export default SearchBar;
