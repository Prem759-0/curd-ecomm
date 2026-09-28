import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, readError } from '../api';
import { useAuth } from '../AuthContext';
import ProductTile from '../components/ProductTile';

const CATEGORIES = ['All', 'Fruits', 'Vegetables', 'Herbs', 'Pantry'];
const CATEGORY_ICONS = { All: '✨', Fruits: '🍎', Vegetables: '🥦', Herbs: '🌿', Pantry: '🫙' };

function SkeletonGrid() {
  return (
    <div className="grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="skeleton-tile">
          <div className="skeleton sk-img" />
          <div className="skeleton sk-text" />
          <div className="skeleton sk-sub" />
        </div>
      ))}
    </div>
  );
}

export default function Shop() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = setTimeout(() => { setQ(search.trim()); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    setError('');
    const params = { page, limit: 8 };
    if (q) params.search = q;
    if (category !== 'All') params.category = category;
    api.get('/products', { params })
      .then((r) => setData(r.data))
      .catch((e) => setError(readError(e).message))
      .finally(() => setLoading(false));
  }, [q, category, page]);

  async function remove(id) {
    try {
      await api.delete(`/products/${id}`);
      setData((d) => ({ ...d, items: d.items.filter((p) => p._id !== id) }));
    } catch (e) {
      setError(readError(e).message);
    }
  }

  return (
    <div className="wrap">
      <div className="section-head">
        <div>
          <div className="section-label">Marketplace</div>
          <h1 className="page-title">Fresh produce</h1>
        </div>
        {user && <Link to="/products/new" className="btn" id="add-product-btn">+ Add a product</Link>}
      </div>

      <div className="toolbar">
        <div className="pills">
          {CATEGORIES.map((c) => (
            <button key={c} id={`cat-${c.toLowerCase()}`} className="pill" aria-pressed={category === c}
              onClick={() => { setCategory(c); setPage(1); }}>
              {CATEGORY_ICONS[c]} {c}
            </button>
          ))}
        </div>
        <div className="search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            id="search-input"
            type="search"
            placeholder="Search by name…"
            aria-label="Search products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="notice bad" role="alert">{error}</p>}

      {loading && !data.items.length && <SkeletonGrid />}

      {!loading && !error && !data.items.length && (
        <div className="empty">
          <div className="empty-icon">🌿</div>
          <p>Nothing matches yet.</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.4rem', color: 'var(--ink-muted)' }}>
            Clear the search or pick another category.
          </p>
        </div>
      )}

      <div className="grid">
        {data.items.map((p) => (
          <ProductTile key={p._id} p={p} mine={user && p.createdBy?._id === user._id} onDelete={remove} />
        ))}
      </div>

      {data.pages > 1 && (
        <div className="pager">
          <button id="prev-page-btn" className="btn ghost sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>← Previous</button>
          <span>Page <strong>{page}</strong> of {data.pages}</span>
          <button id="next-page-btn" className="btn ghost sm" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
}
