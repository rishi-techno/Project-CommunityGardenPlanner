import React from 'react';

const WateringTable = ({ schedules, onStatusChange, onDelete }) => (
  <div className="table-wrapper">
    <table className="data-table">
      <thead>
        <tr>
          <th>Plot</th>
          <th>Date</th>
          <th>Time</th>
          <th>Status</th>
          <th>Notes</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {schedules.length === 0 ? (
          <tr>
            <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
              No watering schedules found.
            </td>
          </tr>
        ) : (
          schedules.map((s) => (
            <tr key={s.id}>
              <td>
                <strong style={{ color: 'var(--green-800)' }}>
                  {s.plotNumber || `Plot #${s.plotId}`}
                </strong>
              </td>
              <td>{s.wateringDate}</td>
              <td>{s.wateringTime}</td>
              <td>
                <span className={`badge badge-${s.status?.toLowerCase()}`}>
                  {s.status}
                </span>
              </td>
              <td style={{ color: 'var(--text-light)', fontStyle: s.notes ? 'normal' : 'italic' }}>
                {s.notes || '—'}
              </td>
              <td>
                <div style={{ display: 'flex', gap: 6 }}>
                  {s.status === 'SCHEDULED' && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onStatusChange(s.id, 'COMPLETED')}
                    >
                      ✔ Done
                    </button>
                  )}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(s.id)}
                  >
                    🗑
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default WateringTable;
