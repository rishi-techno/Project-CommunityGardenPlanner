import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/forms.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm]   = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading]   = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email)    e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setApiError('');
    try {
      await login(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Invalid email or password');
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
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-brand">
          <span className="auth-brand-icon">🌱</span>
          <h1 className="auth-brand-title">Community Garden Management</h1>
          <p className="auth-brand-desc">
            Grow together — manage plots, plants, events and watering schedules all in one place.
          </p>

          <div className="auth-features">
            {[['🌾','Manage garden plots'],['🌿','Track plant growth'],['💧','Schedule watering'],['📅','Organize events']].map(([icon, label]) => (
              <div className="auth-feature" key={label}>
                <div className="auth-feature-icon">{icon}</div>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <h2 className="auth-form-title">Welcome back</h2>
            <p className="auth-form-subtitle">Sign in to your garden account</p>
          </div>

          {apiError && <div className="alert alert-error">⚠️ {apiError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={set('email')}
              />
              {errors.email && <span className="form-error">⚠ {errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="••••••••"
                value={form.password}
                onChange={set('password')}
              />
              {errors.password && <span className="form-error">⚠ {errors.password}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 4 }}
            >
              {loading ? 'Signing in…' : '🌿 Sign In'}
            </button>
          </form>

          <div className="auth-form-footer">
            Don't have an account? <Link to="/register">Create one →</Link>
          </div>

          {/* Demo hint */}
          <div style={{ marginTop: 24, padding: '12px 16px', background: 'var(--green-50)', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', color: 'var(--green-700)', border: '1px solid var(--green-300)' }}>
            <strong>Demo credentials:</strong><br/>
            Admin: admin@garden.com / admin123<br/>
            Member: alice@garden.com / member123
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
