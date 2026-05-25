import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import plotService from '../services/plotService';
import memberService from '../services/memberService';
import Loader from '../components/Loader';
import '../styles/forms.css';

const EditPlot = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    plotNumber: '', size: '', status: 'AVAILABLE', assignedUserId: '',
  });
  const [members, setMembers] = useState([]);
  const [errors, setErrors]   = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading]  = useState(true);
  const [saving, setSaving]    = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [plot, mems] = await Promise.all([
          plotService.getById(id),
          memberService.getAll().catch(() => []),
        ]);
        setForm({
          plotNumber: plot.plotNumber || '',
          size: plot.size || '',
          status: plot.status || 'AVAILABLE',
          assignedUserId: plot.assignedUserId || '',
        });
        setMembers(mems);
      } catch {
        setApiError('Failed to load plot data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const validate = () => {
    const e = {};
    if (!form.plotNumber.trim()) e.plotNumber = 'Plot number is required';
    if (!form.size.trim())       e.size       = 'Size is required';
    return e;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    setApiError('');
    try {
      const payload = { ...form, assignedUserId: form.assignedUserId || null };
      await plotService.update(id, payload);
      navigate('/plots');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to update plot.');
    } finally {
      setSaving(false);
    }
  };

  const set = (field) => (evt) => {
    setForm(f => ({ ...f, [field]: evt.target.value }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  if (loading) return <Loader text="Loading plot…" />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Plot</h1>
          <p className="page-subtitle">Update garden plot details</p>
        </div>
        <Link to="/plots" className="btn btn-secondary">← Back to Plots</Link>
      </div>

      <div className="form-card">
        <h2 className="form-card-title">Plot Details</h2>
        <p className="form-card-subtitle">Update the information for this garden plot.</p>

        {apiError && <div className="alert alert-error">⚠️ {apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Plot Number *</label>
              <input type="text" className={`form-input ${errors.plotNumber ? 'error' : ''}`}
                value={form.plotNumber} onChange={set('plotNumber')} />
              {errors.plotNumber && <span className="form-error">⚠ {errors.plotNumber}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Size *</label>
              <input type="text" className={`form-input ${errors.size ? 'error' : ''}`}
                value={form.size} onChange={set('size')} />
              {errors.size && <span className="form-error">⚠ {errors.size}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={set('status')}>
                <option value="AVAILABLE">Available</option>
                <option value="OCCUPIED">Occupied</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
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
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : '✔ Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPlot;
