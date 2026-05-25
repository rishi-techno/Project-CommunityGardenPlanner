import React from 'react';
import '../styles/dashboard.css';

/**
 * Reusable analytics stat card for the dashboard.
 */
const DashboardCard = ({ icon, label, value, color = 'var(--green-700)', trend, trendUp = true }) => (
  <div className="stat-card">
    <div className="stat-card-accent" style={{ background: color }} />
    <div className="stat-card-header">
      <div className="stat-card-icon" style={{ background: `${color}18` }}>
        <span style={{ fontSize: '1.4rem' }}>{icon}</span>
      </div>
      {trend !== undefined && (
        <span className={`stat-card-trend ${trendUp ? 'trend-up' : 'trend-down'}`}>
          {trendUp ? '↑' : '↓'} {trend}%
        </span>
      )}
    </div>
    <div className="stat-card-value">{value}</div>
    <div className="stat-card-label">{label}</div>
  </div>
);

export default DashboardCard;
