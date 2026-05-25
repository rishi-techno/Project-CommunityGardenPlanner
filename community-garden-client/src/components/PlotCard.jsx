import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/cards.css';

const statusLabel = { AVAILABLE: 'Available', OCCUPIED: 'Occupied', MAINTENANCE: 'Maintenance' };

const PlotCard = ({ plot, onDelete, isAdmin }) => (
  <div className="plot-card">
    <div className="plot-card-top">
      <div className="plot-number-badge">{plot.plotNumber}</div>
      <span className={`badge badge-${plot.status?.toLowerCase()}`}>
        {statusLabel[plot.status] || plot.status}
      </span>
    </div>

    <div className="plot-card-body">
      <div className="plot-card-row">
        <span className="plot-card-row-icon">📐</span>
        <span>Size: <strong>{plot.size}</strong></span>
      </div>
      <div className="plot-card-row">
        <span className="plot-card-row-icon">👤</span>
        <span>{plot.assignedUserName || <em style={{ color: 'var(--text-light)' }}>Unassigned</em>}</span>
      </div>
    </div>

    {isAdmin && (
      <div className="plot-card-actions">
        <Link to={`/plots/edit/${plot.id}`} className="btn btn-secondary btn-sm">✏️ Edit</Link>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(plot.id)}>🗑 Delete</button>
      </div>
    )}
  </div>
);

export default PlotCard;
