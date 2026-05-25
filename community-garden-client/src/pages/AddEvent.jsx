import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import eventService from '../services/eventService';
import '../styles/forms.css';

const AddEvent = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    eventName: '', description: '', eventDate: '', eventTime: '09:00', location: '',
  });
  const [errors, setErrors]   = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.eventName.trim()) e.eventName = 'Event name is required';
    if (!form.eventDate)        e.eventDate = 'Date is required';
    if (!form.eventTime)        e.eventTime = 'Time is required';
    if (!form.location.trim())  e.location  = 'Location is required';
    return e;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setApiError('');
    try {
      // Combine date + time into ISO datetime for the backend
      const eventDate = `${form.eventDate}T${form.eventTime}:00`;
      await eventService.create({
        eventName:   form.eventName,
        description: form.description,
        eventDate,
        location:    form.location,
      });
      navigate('/events');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to create event.');
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
          <h1 className="page-title">Add New Event</h1>
          <p className="page-subtitle">Schedule a community garden event</p>
        </div>
        <Link to="/events" className="btn btn-secondary">← Back to Events</Link>
      </div>

      <div className="form-card">
        <h2 className="form-card-title">Event Details</h2>
        <p className="form-card-subtitle">Fill in the details for the community event.</p>

        {apiError && <div className="alert alert-error">⚠️ {apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Event Name *</label>
            <input type="text" className={`form-input ${errors.eventName ? 'error' : ''}`}
              placeholder="e.g. Spring Planting Workshop"
              value={form.eventName} onChange={set('eventName')} />
            {errors.eventName && <span className="form-error">⚠ {errors.eventName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea"
              placeholder="Brief description of the event…"
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
              <label className="form-label">Time *</label>
              <input type="time" className={`form-input ${errors.eventTime ? 'error' : ''}`}
                value={form.eventTime} onChange={set('eventTime')} />
              {errors.eventTime && <span className="form-error">⚠ {errors.eventTime}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Location *</label>
            <input type="text" className={`form-input ${errors.location ? 'error' : ''}`}
              placeholder="e.g. Main Garden Hall"
              value={form.location} onChange={set('location')} />
            {errors.location && <span className="form-error">⚠ {errors.location}</span>}
          </div>

          <div className="form-actions">
            <Link to="/events" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : '📅 Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;
