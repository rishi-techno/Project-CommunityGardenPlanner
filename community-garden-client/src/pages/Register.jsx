import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/forms.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())           e.name     = 'Full name is required';
    if (!form.email)                 e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password)              e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'At least 6 characters';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setApiError('');
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (evt) => {
    setForm(f => ({ ...f, [field]: evt.target.value }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <span className="auth-brand-icon">🌱</span>
          <h1 className="auth-brand-title">Join the Garden Community</h1>
          <p className="auth-brand-desc">
            Register to get your own plot, track your plants, and participate in community events.
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <h2 className="auth-form-title">Create account</h2>
            <p className="auth-form-subtitle">Start your gardening journey today</p>
          </div>

          {apiError && <div className="alert alert-error">⚠️ {apiError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Alice Green" value={form.name} onChange={set('name')} />
              {errors.name && <span className="form-error">⚠ {errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email address</label>
              <input type="email" className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="alice@example.com" value={form.email} onChange={set('email')} />
              {errors.email && <span className="form-error">⚠ {errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Min. 6 characters" value={form.password} onChange={set('password')} />
              {errors.password && <span className="form-error">⚠ {errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" className={`form-input ${errors.confirm ? 'error' : ''}`}
                placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} />
              {errors.confirm && <span className="form-error">⚠ {errors.confirm}</span>}
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 4 }}>
              {loading ? 'Creating account…' : '🌱 Create Account'}
            </button>
          </form>

          <div className="auth-form-footer">
            Already have an account? <Link to="/login">Sign in →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
