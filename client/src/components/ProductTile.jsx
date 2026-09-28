import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../AuthContext';
import OwnerActions from './OwnerActions';

// Use first image from the images[] array, fall back to legacy image field
export const picture = (p) => (p.images?.length ? p.images[0] : p.image) || '/products/fallback.svg';

// Deterministic fake rating seeded by product name length
const fakeRating = (p) => {
  const base = 4.2 + (p.name?.length % 8) * 0.1;
  return Math.min(5.0, parseFloat(base.toFixed(1)));
};
const fakeReviews = (p) => 12 + ((p.name?.length || 5) * 7) % 120;

// Freshness label derived from createdAt date
function freshnessLabel(p) {
  if (!p.createdAt) return { label: 'Fresh stock', color: 'var(--green)', icon: '🌿' };
  const days = Math.floor((Date.now() - new Date(p.createdAt)) / 86400000);
  if (days === 0) return { label: 'Picked today', color: '#4ade80', icon: '✨' };
  if (days <= 2) return { label: `${days}d ago`, color: 'var(--green)', icon: '🌿' };
  if (days <= 7) return { label: 'This week', color: 'var(--amber)', icon: '📦' };
  return { label: 'In stock', color: 'var(--ink-muted)', icon: '🏪' };
}

// Stars renderer
function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="stars-row" title={`${rating} out of 5`}>
      {Array.from({ length: full }).map((_, i) => <span key={i} className="star full">★</span>)}
      {half && <span className="star half">½</span>}
      {Array.from({ length: 5 - full - (half ? 1 : 0) }).map((_, i) => <span key={i} className="star empty">☆</span>)}
    </span>
  );
}

export default function ProductTile({ p, mine, onDelete }) {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const isWished = wishlist.has(p._id);
  const [justAdded, setJustAdded] = useState(false);
  const rating = fakeRating(p);
  const reviews = fakeReviews(p);
  const fresh = freshnessLabel(p);
  const imageCount = (p.images?.length || 0) + (p.image ? 1 : 0);

  function quickAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(p);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <article className="tile">
      {/* ── IMAGE AREA ── */}
      <Link to={`/products/${p._id}`} className="tile-art" aria-label={p.name}>
        <img
          src={picture(p)}
          alt=""
          loading="lazy"
          onError={e => { e.currentTarget.src = '/products/fallback.svg'; }}
        />
        <div className="tile-art-overlay" />

        {/* Out of stock banner */}
        {p.stock === 0 && <span className="sold">Sold out</span>}

        {/* Category chip */}
        <span className="badge-cat">{p.category}</span>

        {/* Freshness pill */}
        <span className="freshness-pill" style={{ background: `${fresh.color}22`, color: fresh.color, borderColor: `${fresh.color}44` }}>
          {fresh.icon} {fresh.label}
        </span>

        {/* Multiple images indicator */}
        {imageCount > 1 && (
          <span className="tile-img-count">📷 {imageCount}</span>
        )}

        {/* Quick add */}
        {p.stock > 0 && (
          <button
            id={`quick-add-${p._id}`}
            className={`btn sm tile-quick-add${justAdded ? ' added' : ''}`}
            onClick={quickAdd}
          >
            {justAdded ? '✅ Added!' : '🛒 Add to cart'}
          </button>
        )}
      </Link>

      {/* Wishlist button */}
      <button
        className={`wish-btn${isWished ? ' active' : ''}`}
        onClick={() => toggleWishlist(p._id)}
        aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {isWished ? '❤️' : '🤍'}
      </button>

      {/* ── CARD BODY ── */}
      <div className="tile-body">
        {/* Title */}
        <h3><Link to={`/products/${p._id}`}>{p.name}</Link></h3>

        {/* Seller */}
        <div className="tile-seller">
          <span className="tile-seller-avatar">{(p.createdBy?.name || 'G')[0].toUpperCase()}</span>
          <span className="tile-seller-name">by {p.createdBy?.name || 'Local grower'}</span>
          <span className="verified-chip">✓ Verified</span>
        </div>

        {/* Rating row */}
        <div className="tile-rating">
          <Stars rating={rating} />
          <span className="rating-num">{rating}</span>
          <span className="rating-count">({reviews} reviews)</span>
        </div>

        {/* Description snippet */}
        {p.description && (
          <p className="tile-desc">{p.description.slice(0, 72)}{p.description.length > 72 ? '…' : ''}</p>
        )}

        {/* Price + stock row */}
        <div className="tile-price-row">
          <div className="tile-price-group">
            <strong className="price">₹{p.price}</strong>
            <span className="price-unit">/ unit</span>
          </div>
          <span className={`stock-pill${p.stock === 0 ? ' out' : p.stock < 10 ? ' low' : ''}`}>
            {p.stock === 0 ? '❌ Sold out' : p.stock < 10 ? `⚠️ Only ${p.stock} left` : `✅ ${p.stock} in stock`}
          </span>
        </div>

        {/* Feature tags */}
        <div className="tile-tags">
          <span className="tag">🚚 Fast dispatch</span>
          <span className="tag">🌱 Farm direct</span>
          {p.category === 'Fruits' && <span className="tag">🍃 Seasonal</span>}
          {p.category === 'Herbs' && <span className="tag">🌿 Organic</span>}
        </div>

        {/* Owner actions */}
        {mine && <OwnerActions id={p._id} onDelete={onDelete} />}
      </div>
    </article>
  );
}
