import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/sidebar.css';

const navLinks = [
  { to: '/dashboard',  icon: '🏡', label: 'Dashboard' },
  { to: '/plots',      icon: '🌾', label: 'Garden Plots' },
  { to: '/plants',     icon: '🌿', label: 'Plants' },
  { to: '/watering',   icon: '💧', label: 'Watering' },
  { to: '/events',     icon: '📅', label: 'Events' },
  { to: '/members',    icon: '👥', label: 'Members',   adminOnly: true },
  { to: '/profile',    icon: '👤', label: 'Profile' },
];

const Sidebar = ({ open, onClose }) => {
  const { isAdmin } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${open ? 'visible' : ''}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        {/* Logo */}
        <NavLink to="/dashboard" className="sidebar-logo" onClick={onClose}>
          <div className="sidebar-logo-icon">🌱</div>
          <div className="sidebar-logo-text">
            <span className="sidebar-logo-title">GardenMS</span>
            <span className="sidebar-logo-subtitle">Management System</span>
          </div>
        </NavLink>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Main Menu</div>

          {navLinks.map((link) => {
            if (link.adminOnly && !isAdmin()) return null;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <span className="sidebar-link-icon">{link.icon}</span>
                <span className="sidebar-link-label">{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <NavLink
            to="/profile"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span className="sidebar-link-icon">⚙️</span>
            <span className="sidebar-link-label">Settings</span>
          </NavLink>
          <div className="sidebar-version">v1.0.0 · © 2025 GardenMS</div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
