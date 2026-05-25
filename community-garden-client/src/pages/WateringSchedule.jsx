import React, { useState, useEffect, useCallback } from 'react';
import WateringTable from '../components/WateringTable';
import FilterPanel from '../components/FilterPanel';
import Loader from '../components/Loader';
import wateringService from '../services/wateringService';
import plotService from '../services/plotService';
import '../styles/forms.css';

const STATUS_FILTERS = [
  { label: 'All',         value: 'ALL' },
  { label: '⏰ Scheduled', value: 'SCHEDULED' },
  { label: '✅ Completed', value: 'COMPLETED' },
  { label: '⏭ Skipped',   value: 'SKIPPED' },
];

const WateringSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [plots, setPlots]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState({
    plotId: '', wateringDate: '', wateringTime: '07:00', status: 'SCHEDULED', notes: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving]         = useState(false);
  const [apiError, setApiError]     = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [data, ps] = await Promise.all([
        wateringService.getAll(),
        plotService.getAll().catch(() => []),
      ]);
      setSchedules(data);
      setFiltered(data);
      setPlots(ps);
    } catch {
      setApiError('Failed to load watering schedules.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (statusFilter === 'ALL') setFiltered(schedules);
    else setFiltered(schedules.filter(s => s.status === statusFilter));
  }, [schedules, statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const schedule = schedules.find(s => s.id === id);
      await wateringService.update(id, { ...schedule, status: newStatus });
      setSchedules(ss => ss.map(s => s.id === id ? { ...s, status: newStatus } : s));
    } catch {
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this watering schedule?')) return;
    try {
      await wateringService.remove(id);
      setSchedules(ss => ss.filter(s => s.id !== id));
    } catch {
      alert('Failed to delete schedule.');
    }
  };

  const validateForm = () => {
    const e = {};
    if (!form.plotId)       e.plotId       = 'Plot is required';
    if (!form.wateringDate) e.wateringDate = 'Date is required';
    if (!form.wateringTime) e.wateringTime = 'Time is required';
    return e;
  };

  const handleAddSchedule = async (evt) => {
    evt.preventDefault();
    const e = validateForm();
    if (Object.keys(e).length) { setFormErrors(e); return; }
    setSaving(true);
    try {
      const payload = { ...form, plotId: parseInt(form.plotId) };
      const created = await wateringService.create(payload);
      setSchedules(ss => [created, ...ss]);
      setForm({ plotId: '', wateringDate: '', wateringTime: '07:00', status: 'SCHEDULED', notes: '' });
      setShowForm(false);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to add schedule.');
    } finally {
      setSaving(false);
    }
  };

  const set = (field) => (evt) => {
    setForm(f => ({ ...f, [field]: evt.target.value }));
    setFormErrors(e => ({ ...e, [field]: '' }));
  };

  if (loading) return <Loader text="Loading watering schedules…" />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Watering Schedule</h1>
          <p className="page-subtitle">{filtered.length} schedule{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(f => !f)}>
          {showForm ? '✕ Cancel' : '+ New Schedule'}
        </button>
      </div>

      {apiError && <div className="alert alert-error">{apiError}</div>}

      {/* Inline add form */}
      {showForm && (
        <div className="form-card" style={{ marginBottom: 24 }}>
          <h2 className="form-card-title">New Watering Schedule</h2>
          <form onSubmit={handleAddSchedule} noValidate>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Plot *</label>
                <select className={`form-select ${formErrors.plotId ? 'error' : ''}`}
                  value={form.plotId} onChange={set('plotId')}>
                  <option value="">— Select a Plot —</option>
                  {plots.map(p => (
                    <option key={p.id} value={p.id}>{p.plotNumber} ({p.size})</option>
                  ))}
                </select>
                {formErrors.plotId && <span className="form-error">⚠ {formErrors.plotId}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={set('status')}>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="SKIPPED">Skipped</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Date *</label>
                <input type="date" className={`form-input ${formErrors.wateringDate ? 'error' : ''}`}
                  value={form.wateringDate} onChange={set('wateringDate')} />
                {formErrors.wateringDate && <span className="form-error">⚠ {formErrors.wateringDate}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Time *</label>
                <input type="time" className={`form-input ${formErrors.wateringTime ? 'error' : ''}`}
                  value={form.wateringTime} onChange={set('wateringTime')} />
                {formErrors.wateringTime && <span className="form-error">⚠ {formErrors.wateringTime}</span>}
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Notes</label>
                <input type="text" className="form-input"
                  placeholder="Optional notes…" value={form.notes} onChange={set('notes')} />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Adding…' : '💧 Add Schedule'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="toolbar">
        <FilterPanel options={STATUS_FILTERS} active={statusFilter} onChange={setStatusFilter} label="Status:" />
      </div>

      <WateringTable
        schedules={filtered}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default WateringSchedule;
