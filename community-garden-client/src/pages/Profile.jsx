import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/forms.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Your account information</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 24, maxWidth: 900 }}>

        {/* Avatar card */}
        <div className="card" style={{ padding: '40px 32px', textAlign: 'center' }}>
          <div style={{
            width: 96, height: 96,
            background: 'linear-gradient(135deg, var(--green-700), var(--green-500))',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 700, color: 'var(--white)',
            margin: '0 auto 16px',
            boxShadow: 'var(--shadow-green)',
          }}>
            {initials}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--green-900)', marginBottom: 4 }}>
            {user?.name}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: 16 }}>
            {user?.email}
          </div>
          <span className={`badge badge-${user?.role?.toLowerCase()}`}>{user?.role}</span>

          <div className="divider" style={{ margin: '24px 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ background: 'var(--cream)', borderRadius: 'var(--radius-md)', padding: '10px 14px', textAlign: 'left' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User ID</div>
              <div style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.875rem' }}>#{user?.id}</div>
            </div>
            <div style={{ background: 'var(--cream)', borderRadius: 'var(--radius-md)', padding: '10px 14px', textAlign: 'left' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</div>
              <div style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.875rem' }}>{user?.role}</div>
            </div>
          </div>
        </div>

        {/* Info card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card" style={{ padding: '28px 28px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--green-900)', marginBottom: 20 }}>
              Account Details
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Full Name',  value: user?.name  },
                { label: 'Email',      value: user?.email },
                { label: 'Role',       value: user?.role  },
                { label: 'Account ID', value: `#${user?.id}` },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f5f2ed' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {label}
                  </span>
                  <span style={{ fontWeight: 500, color: 'var(--text-dark)', fontSize: '0.875rem' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Logout section */}
          <div className="card" style={{ padding: '24px 28px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--red-500)', marginBottom: 8 }}>
              Sign Out
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: 16 }}>
              You'll be returned to the login screen and your session will end.
            </p>

            {!showLogoutConfirm ? (
              <button className="btn btn-danger" onClick={() => setShowLogoutConfirm(true)}>
                ↩ Sign Out
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-mid)' }}>Are you sure?</span>
                <button className="btn btn-danger btn-sm" onClick={handleLogout}>Yes, sign out</button>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
