import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import eventService from '../services/eventService';
import Loader from '../components/Loader';
import '../styles/forms.css';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    eventName: '', description: '', eventDate: '', eventTime: '09:00', location: '',
  });
  const [errors, setErrors]   = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    eventService.getById(id)
      .then(ev => {
        const dt = new Date(ev.eventDate);
        setForm({
          eventName:   ev.eventName   || '',
          description: ev.description || '',
          eventDate:   dt.toISOString().slice(0, 10),
          eventTime:   dt.toTimeString().slice(0, 5),
          location:    ev.location    || '',
        });
      })
      .catch(() => setApiError('Failed to load event.'))
      .finally(() => setLoading(false));
  }, [id]);

  const validate = () => {
    const e = {};
    if (!form.eventName.trim()) e.eventName = 'Event name is required';
    if (!form.eventDate)        e.eventDate = 'Date is required';
    if (!form.location.trim())  e.location  = 'Location is required';
    return e;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    setApiError('');
    try {
      const eventDate = `${form.eventDate}T${form.eventTime}:00`;
      await eventService.update(id, {
        eventName:   form.eventName,
        description: form.description,
        eventDate,
        location:    form.location,
      });
      navigate('/events');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to update event.');
    } finally {
      setSaving(false);
    }
  };

  const set = (field) => (evt) => {
    setForm(f => ({ ...f, [field]: evt.target.value }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  if (loading) return <Loader text="Loading event…" />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Event</h1>
          <p className="page-subtitle">Update event details</p>
        </div>
        <Link to="/events" className="btn btn-secondary">← Back to Events</Link>
      </div>

      <div className="form-card">
        <h2 className="form-card-title">{form.eventName || 'Event Details'}</h2>
        <p className="form-card-subtitle">Edit the information for this event.</p>

        {apiError && <div className="alert alert-error">⚠️ {apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Event Name *</label>
            <input type="text" className={`form-input ${errors.eventName ? 'error' : ''}`}
              value={form.eventName} onChange={set('eventName')} />
            {errors.eventName && <span className="form-error">⚠ {errors.eventName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea"
              value={form.description} onChange={set('description')} />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input type="date" className={`form-input ${errors.eventDate ? 'error' : ''}`}
                value={form.eventDate} onChange={set('eventDate')} />
              {errors.eventDate && <span className="form-error">⚠ {errors.eventDate}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Time</label>
              <input type="time" className="form-input"
                value={form.eventTime} onChange={set('eventTime')} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Location *</label>
            <input type="text" className={`form-input ${errors.location ? 'error' : ''}`}
              value={form.location} onChange={set('location')} />
            {errors.location && <span className="form-error">⚠ {errors.location}</span>}
          </div>

          <div className="form-actions">
            <Link to="/events" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : '✔ Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
