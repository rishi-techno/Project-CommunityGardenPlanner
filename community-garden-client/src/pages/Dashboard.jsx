import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardCard from '../components/DashboardCard';
import Loader from '../components/Loader';
import plotService from '../services/plotService';
import plantService from '../services/plantService';
import eventService from '../services/eventService';
import wateringService from '../services/wateringService';
import memberService from '../services/memberService';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [upcomingWatering, setUpcomingWatering] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [plots, plants, events, watering] = await Promise.all([
          plotService.getAll(),
          plantService.getAll(),
          eventService.getUpcoming(),
          wateringService.getUpcoming(),
        ]);

        let memberCount = 0;
        if (isAdmin()) {
          const members = await memberService.getAll();
          memberCount = members.length;
        }

        setStats({
          totalPlots:  plots.length,
          available:   plots.filter(p => p.status === 'AVAILABLE').length,
          totalPlants: plants.length,
          mature:      plants.filter(p => p.growthStatus === 'MATURE').length,
          upcomingEvents: events.length,
          scheduledWatering: watering.length,
          members: memberCount,
        });

        setRecentEvents(events.slice(0, 3));
        setUpcomingWatering(watering.slice(0, 4));
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAdmin]);

  if (loading) return <Loader text="Loading dashboard…" />;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div>
      {/* Hero banner */}
      <div className="dashboard-hero">
        <div className="dashboard-hero-greeting">{greeting()}</div>
        <div className="dashboard-hero-title">{user?.name} 🌿</div>
        <div className="dashboard-hero-subtitle">
          Here's what's growing in your community garden today.
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid-4">
        <DashboardCard icon="🌾" label="Total Plots"       value={stats?.totalPlots ?? 0}
          color="var(--green-700)" trend={12} trendUp />
        <DashboardCard icon="🌿" label="Total Plants"      value={stats?.totalPlants ?? 0}
          color="var(--blue-500)" trend={8} trendUp />
        <DashboardCard icon="📅" label="Upcoming Events"   value={stats?.upcomingEvents ?? 0}
          color="var(--orange-500)" />
        <DashboardCard icon="💧" label="Pending Waterings" value={stats?.scheduledWatering ?? 0}
          color="#5b99e0" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 32 }}>

        {/* Upcoming Events */}
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">Upcoming Events</h2>
            <Link to="/events" className="dashboard-section-link">View all →</Link>
          </div>
          <div className="activity-feed">
            {recentEvents.length === 0 ? (
              <div style={{ padding: '28px 20px', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.875rem' }}>
                No upcoming events
              </div>
            ) : recentEvents.map(ev => {
              const d = new Date(ev.eventDate);
              return (
                <div className="activity-item" key={ev.id}>
                  <div className="activity-dot" style={{ background: 'var(--green-500)' }} />
                  <div className="activity-text">
                    <strong>{ev.eventName}</strong><br />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>📍 {ev.location}</span>
                  </div>
                  <div className="activity-time">
                    {d.toLocaleDateString('default', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Watering schedule */}
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <h2 className="dashboard-section-title">Upcoming Waterings</h2>
            <Link to="/watering" className="dashboard-section-link">View all →</Link>
          </div>
          <div className="activity-feed">
            {upcomingWatering.length === 0 ? (
              <div style={{ padding: '28px 20px', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.875rem' }}>
                No scheduled waterings
              </div>
            ) : upcomingWatering.map(w => (
              <div className="activity-item" key={w.id}>
                <div className="activity-dot" style={{ background: 'var(--blue-500)' }} />
                <div className="activity-text">
                  <strong>{w.plotNumber || `Plot #${w.plotId}`}</strong>
                  {w.notes && <><br /><span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>{w.notes}</span></>}
                </div>
                <div className="activity-time">
                  {w.wateringDate}<br />
                  <span style={{ color: 'var(--text-light)', fontSize: '0.72rem' }}>{w.wateringTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Quick links row */}
      <div className="dashboard-section" style={{ marginTop: 32 }}>
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Quick Actions</h2>
        </div>
        <div className="grid-4">
          {[
            { to: '/plots/add',   icon: '🌾', label: 'Add Plot',    color: 'var(--green-700)' },
            { to: '/plants/add',  icon: '🌿', label: 'Add Plant',   color: 'var(--blue-500)' },
            { to: '/watering',    icon: '💧', label: 'Schedule Watering', color: '#5b99e0' },
            { to: '/events/add',  icon: '📅', label: 'Create Event', color: 'var(--orange-500)' },
          ].map(q => (
            <Link key={q.to} to={q.to} style={{ textDecoration: 'none' }}>
              <div className="stat-card" style={{ cursor: 'pointer', textAlign: 'center', padding: '24px 16px' }}>
                <div style={{
                  width: 52, height: 52, margin: '0 auto 12px',
                  background: `${q.color}18`, borderRadius: 'var(--radius-md)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
                }}>{q.icon}</div>
                <div style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.875rem' }}>{q.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
