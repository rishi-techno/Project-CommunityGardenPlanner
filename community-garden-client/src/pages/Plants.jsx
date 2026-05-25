import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PlantCard from '../components/PlantCard';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import Loader from '../components/Loader';
import plantService from '../services/plantService';

const CATEGORY_FILTERS = [
  { label: 'All',       value: 'ALL' },
  { label: '🥦 Vegetable', value: 'Vegetable' },
  { label: '🍓 Fruit',    value: 'Fruit' },
  { label: '🌿 Herb',     value: 'Herb' },
  { label: '🌸 Flower',   value: 'Flower' },
];

const Plants = () => {
  const [plants, setPlants]     = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('ALL');
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await plantService.getAll();
      setPlants(data);
      setFiltered(data);
    } catch {
      setError('Failed to load plants.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    let result = [...plants];
    if (category !== 'ALL') result = result.filter(p => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.plantName?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.growthStatus?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [plants, search, category]);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this plant?')) return;
    try {
      await plantService.remove(id);
      setPlants(ps => ps.filter(p => p.id !== id));
    } catch {
      alert('Failed to delete plant.');
    }
  };

  if (loading) return <Loader text="Loading plants…" />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Plants</h1>
          <p className="page-subtitle">{filtered.length} plant{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
        <Link to="/plants/add" className="btn btn-primary">+ Add Plant</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search plants…" />
        <FilterPanel options={CATEGORY_FILTERS} active={category} onChange={setCategory} label="Category:" />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🌱</div>
          <h3>No plants found</h3>
          <p>Try a different filter or add your first plant.</p>
        </div>
      ) : (
        <div className="grid-3">
          {filtered.map(plant => (
            <PlantCard key={plant.id} plant={plant} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Plants;
