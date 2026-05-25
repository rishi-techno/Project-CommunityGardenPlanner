import React, { useState, useEffect, useCallback } from 'react';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';
import memberService from '../services/memberService';
import '../styles/cards.css';

const Members = () => {
  const [members, setMembers]   = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await memberService.getAll();
      setMembers(data);
      setFiltered(data);
    } catch {
      setError('Failed to load members. Make sure you have admin access.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!search.trim()) { setFiltered(members); return; }
    const q = search.toLowerCase();
    setFiltered(members.filter(m =>
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.role?.toLowerCase().includes(q)
    ));
  }, [members, search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this member?')) return;
    try {
      await memberService.remove(id);
      setMembers(ms => ms.filter(m => m.id !== id));
    } catch {
      alert('Failed to remove member.');
    }
  };

  const initials = (name) => name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?';

  const avatarColor = (role) => role === 'ADMIN' ? 'var(--green-900)' : 'var(--green-700)';

  if (loading) return <Loader text="Loading members…" />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Members</h1>
          <p className="page-subtitle">{filtered.length} member{filtered.length !== 1 ? 's' : ''} registered</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, email or role…" />
      </div>

      {/* Summary row */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Members', value: members.length, icon: '👥' },
          { label: 'Admins',        value: members.filter(m => m.role === 'ADMIN').length,  icon: '🛡' },
          { label: 'Regular Members', value: members.filter(m => m.role === 'MEMBER').length, icon: '🌿' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: '2rem' }}>{s.icon}</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--green-900)', lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Member list */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No members found</h3>
          <p>Try a different search term.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(member => (
            <div key={member.id} className="member-row">
              <div className="member-avatar" style={{ background: avatarColor(member.role) }}>
                {initials(member.name)}
              </div>
              <div className="member-info">
                <div className="member-name">{member.name}</div>
                <div className="member-email">{member.email}</div>
              </div>
              <span className={`badge badge-${member.role?.toLowerCase()}`}>{member.role}</span>
              <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(member.id)}
                >
                  🗑 Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Members;
