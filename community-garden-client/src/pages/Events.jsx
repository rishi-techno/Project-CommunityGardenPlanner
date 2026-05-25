import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import Loader from '../components/Loader';
import eventService from '../services/eventService';

const TIME_FILTERS = [
  { label: 'All Events',    value: 'ALL' },
  { label: '🔜 Upcoming',   value: 'UPCOMING' },
  { label: '⏮ Past',       value: 'PAST' },
];

const Events = () => {
  const { isAdmin } = useAuth();
  const [events, setEvents]     = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch]     = useState('');
  const [timeFilter, setTimeFilter] = useState('ALL');
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await eventService.getAll();
      // Sort by date ascending
      data.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
      setEvents(data);
      setFiltered(data);
    } catch {
      setError('Failed to load events.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const now = new Date();
    let result = [...events];

    if (timeFilter === 'UPCOMING') result = result.filter(e => new Date(e.eventDate) >= now);
    else if (timeFilter === 'PAST') result = result.filter(e => new Date(e.eventDate) < now);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(e =>
        e.eventName?.toLowerCase().includes(q) ||
        e.location?.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [events, search, timeFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await eventService.remove(id);
      setEvents(es => es.filter(e => e.id !== id));
    } catch {
      alert('Failed to delete event.');
    }
  };

  if (loading) return <Loader text="Loading events…" />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Community Events</h1>
          <p className="page-subtitle">{filtered.length} event{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        {isAdmin() && (
          <Link to="/events/add" className="btn btn-primary">+ Add Event</Link>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search events…" />
        <FilterPanel options={TIME_FILTERS} active={timeFilter} onChange={setTimeFilter} label="Show:" />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>No events found</h3>
          <p>Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="grid-3">
          {filtered.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onDelete={handleDelete}
              isAdmin={isAdmin()}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
