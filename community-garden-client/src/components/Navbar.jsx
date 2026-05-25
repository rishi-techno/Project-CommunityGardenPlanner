import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="navbar-hamburger" onClick={onToggleSidebar} aria-label="Toggle menu">
          ☰
        </button>
        <span className="navbar-title">Community Garden</span>
      </div>

      <div className="navbar-right">
        {/* Notification bell */}
        <button className="navbar-icon-btn" title="Notifications">
          🔔
          <span className="notification-dot" />
        </button>

        {/* Settings */}
        <button className="navbar-icon-btn" title="Settings">⚙️</button>

        <div className="navbar-divider" />

        {/* User chip */}
        <div className="navbar-user">
          <div className="navbar-avatar">{initials}</div>
          <div className="navbar-user-info">
            <div className="navbar-username">{user?.name || 'User'}</div>
            <div className="navbar-role">{user?.role || ''}</div>
          </div>
        </div>

        {/* Logout */}
        <button className="navbar-logout" onClick={logout}>
          <span>↩</span> Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
