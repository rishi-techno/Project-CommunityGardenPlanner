import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import plotService from '../services/plotService';
import memberService from '../services/memberService';
import '../styles/forms.css';

const AddPlot = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    plotNumber: '', size: '', status: 'AVAILABLE', assignedUserId: '',
  });
  const [members, setMembers] = useState([]);
  const [errors, setErrors]   = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading]  = useState(false);

  useEffect(() => {
    memberService.getAll()
      .then(setMembers)
      .catch(() => {});
  }, []);

  const validate = () => {
    const e = {};
    if (!form.plotNumber.trim()) e.plotNumber = 'Plot number is required';
    if (!form.size.trim())       e.size       = 'Size is required';
    if (!form.status)            e.status     = 'Status is required';
    return e;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setApiError('');
    try {
      const payload = { ...form, assignedUserId: form.assignedUserId || null };
      await plotService.create(payload);
      navigate('/plots');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to create plot.');
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (evt) => {
    setForm(f => ({ ...f, [field]: evt.target.value }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Add New Plot</h1>
          <p className="page-subtitle">Register a new garden plot</p>
        </div>
        <Link to="/plots" className="btn btn-secondary">← Back to Plots</Link>
      </div>

      <div className="form-card">
        <h2 className="form-card-title">Plot Details</h2>
        <p className="form-card-subtitle">Fill in the information for the new garden plot.</p>

        {apiError && <div className="alert alert-error">⚠️ {apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Plot Number *</label>
              <input type="text" className={`form-input ${errors.plotNumber ? 'error' : ''}`}
                placeholder="e.g. A-01" value={form.plotNumber} onChange={set('plotNumber')} />
              {errors.plotNumber && <span className="form-error">⚠ {errors.plotNumber}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Size *</label>
              <input type="text" className={`form-input ${errors.size ? 'error' : ''}`}
                placeholder="e.g. 10x10" value={form.size} onChange={set('size')} />
              {errors.size && <span className="form-error">⚠ {errors.size}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Status *</label>
              <select className={`form-select ${errors.status ? 'error' : ''}`}
                value={form.status} onChange={set('status')}>
                <option value="AVAILABLE">Available</option>
                <option value="OCCUPIED">Occupied</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
              {errors.status && <span className="form-error">⚠ {errors.status}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Assign Member</label>
              <select className="form-select" value={form.assignedUserId} onChange={set('assignedUserId')}>
                <option value="">— Unassigned —</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <Link to="/plots" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : '🌾 Create Plot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlot;
