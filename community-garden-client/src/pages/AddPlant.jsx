import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import plantService from '../services/plantService';
import plotService from '../services/plotService';
import '../styles/forms.css';

const AddPlant = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    plantName: '', category: 'Vegetable', plantingDate: '',
    harvestDate: '', growthStatus: 'SEEDLING', plotId: '',
  });
  const [plots, setPlots]     = useState([]);
  const [errors, setErrors]   = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    plotService.getAll().then(setPlots).catch(() => {});
  }, []);

  const validate = () => {
    const e = {};
    if (!form.plantName.trim())  e.plantName   = 'Plant name is required';
    if (!form.category)          e.category    = 'Category is required';
    if (!form.plantingDate)      e.plantingDate = 'Planting date is required';
    if (!form.plotId)            e.plotId      = 'Plot is required';
    return e;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setApiError('');
    try {
      const payload = {
        ...form,
        plotId: parseInt(form.plotId),
        harvestDate: form.harvestDate || null,
      };
      await plantService.create(payload);
      navigate('/plants');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to add plant.');
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
          <h1 className="page-title">Add New Plant</h1>
          <p className="page-subtitle">Record a new plant in a garden plot</p>
        </div>
        <Link to="/plants" className="btn btn-secondary">← Back to Plants</Link>
      </div>

      <div className="form-card">
        <h2 className="form-card-title">Plant Details</h2>
        <p className="form-card-subtitle">Enter the details for your new plant.</p>

        {apiError && <div className="alert alert-error">⚠️ {apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Plant Name *</label>
              <input type="text" className={`form-input ${errors.plantName ? 'error' : ''}`}
                placeholder="e.g. Tomato" value={form.plantName} onChange={set('plantName')} />
              {errors.plantName && <span className="form-error">⚠ {errors.plantName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select className={`form-select ${errors.category ? 'error' : ''}`}
                value={form.category} onChange={set('category')}>
                <option value="Vegetable">🥦 Vegetable</option>
                <option value="Fruit">🍓 Fruit</option>
                <option value="Herb">🌿 Herb</option>
                <option value="Flower">🌸 Flower</option>
                <option value="Other">🌱 Other</option>
              </select>
              {errors.category && <span className="form-error">⚠ {errors.category}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Planting Date *</label>
              <input type="date" className={`form-input ${errors.plantingDate ? 'error' : ''}`}
                value={form.plantingDate} onChange={set('plantingDate')} />
              {errors.plantingDate && <span className="form-error">⚠ {errors.plantingDate}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Expected Harvest Date</label>
              <input type="date" className="form-input"
                value={form.harvestDate} onChange={set('harvestDate')} />
            </div>

            <div className="form-group">
              <label className="form-label">Growth Status</label>
              <select className="form-select" value={form.growthStatus} onChange={set('growthStatus')}>
                <option value="SEEDLING">🌱 Seedling</option>
                <option value="GROWING">🌿 Growing</option>
                <option value="MATURE">🌳 Mature</option>
                <option value="HARVESTED">🧺 Harvested</option>
                <option value="DEAD">💀 Dead</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Assign to Plot *</label>
              <select className={`form-select ${errors.plotId ? 'error' : ''}`}
                value={form.plotId} onChange={set('plotId')}>
                <option value="">— Select a Plot —</option>
                {plots.map(p => (
                  <option key={p.id} value={p.id}>{p.plotNumber} ({p.size}) — {p.status}</option>
                ))}
              </select>
              {errors.plotId && <span className="form-error">⚠ {errors.plotId}</span>}
            </div>
          </div>

          <div className="form-actions">
            <Link to="/plants" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : '🌿 Add Plant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlant;
