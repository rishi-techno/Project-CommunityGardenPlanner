import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PlotCard from '../components/PlotCard';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import Loader from '../components/Loader';
import plotService from '../services/plotService';

const STATUS_FILTERS = [
  { label: 'All',         value: 'ALL' },
  { label: '🟢 Available', value: 'AVAILABLE' },
  { label: '🟠 Occupied',  value: 'OCCUPIED' },
  { label: '🔴 Maintenance', value: 'MAINTENANCE' },
];

const GardenPlots = () => {
  const { isAdmin } = useAuth();
  const [plots, setPlots]   = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await plotService.getAll();
      setPlots(data);
      setFiltered(data);
    } catch {
      setError('Failed to load plots.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Apply filters whenever search/status changes
  useEffect(() => {
    let result = [...plots];
    if (statusFilter !== 'ALL') result = result.filter(p => p.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.plotNumber?.toLowerCase().includes(q) ||
        p.size?.toLowerCase().includes(q) ||
        p.assignedUserName?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [plots, search, statusFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this plot?')) return;
    try {
      await plotService.remove(id);
      setPlots(ps => ps.filter(p => p.id !== id));
    } catch {
      alert('Failed to delete plot.');
    }
  };

  if (loading) return <Loader text="Loading plots…" />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Garden Plots</h1>
          <p className="page-subtitle">{filtered.length} plot{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
        {isAdmin() && (
          <Link to="/plots/add" className="btn btn-primary">+ Add Plot</Link>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by plot number, size, member…" />
        <FilterPanel options={STATUS_FILTERS} active={statusFilter} onChange={setStatusFilter} label="Status:" />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🌾</div>
          <h3>No plots found</h3>
          <p>Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="grid-3">
          {filtered.map(plot => (
            <PlotCard key={plot.id} plot={plot} onDelete={handleDelete} isAdmin={isAdmin()} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GardenPlots;
