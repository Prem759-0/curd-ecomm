import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, readError } from '../api';
import { useAuth } from '../AuthContext';
import { useCart } from '../AuthContext';
import OwnerActions from '../components/OwnerActions';
import { picture } from '../components/ProductTile';

// Returns full images array
function getImages(p) {
  if (p.images?.length) return p.images;
  if (p.image) return [p.image];
  return ['/products/fallback.svg'];
}

// Fake but consistent rating from product name
const fakeRating = (p) => Math.min(5.0, parseFloat((4.2 + (p.name?.length % 8) * 0.1).toFixed(1)));
const fakeReviews = (p) => 12 + ((p.name?.length || 5) * 7) % 120;

// Freshness from createdAt
function freshnessInfo(p) {
  if (!p.createdAt) return { label: 'Fresh stock', days: null };
  const days = Math.floor((Date.now() - new Date(p.createdAt)) / 86400000);
  if (days === 0) return { label: 'Picked today', days: 0, badge: '✨ Super fresh' };
  if (days <= 2) return { label: `Listed ${days} day${days > 1 ? 's' : ''} ago`, days };
  if (days <= 7) return { label: 'Listed this week', days };
  return { label: 'In stock', days };
}

// Review list data (mock)
const MOCK_REVIEWS = [
  { name: 'Priya M.', rating: 5, text: 'Absolutely fresh! Came exactly as described, delivery was quick.', date: '3 days ago' },
  { name: 'Rajan K.', rating: 4, text: 'Great quality. Will order again. Packaging could be a bit better.', date: '1 week ago' },
  { name: 'Anita S.', rating: 5, text: 'Perfect for my kitchen! The flavor is incredible — nothing like store-bought.', date: '2 weeks ago' },
];

// Delivery estimate
const deliveryDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
};

// Stars
function Stars({ rating, size = 'md' }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className={`stars-row stars-${size}`} title={`${rating} out of 5`}>
      {Array.from({ length: full }).map((_, i) => <span key={i} className="star full">★</span>)}
      {half && <span className="star half">★</span>}
      {Array.from({ length: 5 - full - (half ? 1 : 0) }).map((_, i) => <span key={i} className="star empty">☆</span>)}
    </span>
  );
}

// Stat card
function StatCard({ icon, value, label }) {
  return (
    <div className="detail-stat-card">
      <span className="detail-stat-icon">{icon}</span>
      <span className="detail-stat-value">{value}</span>
      <span className="detail-stat-label">{label}</span>
    </div>
  );
}

// Tab component
function Tabs({ tabs, active, onChange }) {
  return (
    <div className="detail-tabs">
      {tabs.map(t => (
        <button
          key={t.id}
          className={`detail-tab${active === t.id ? ' active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.icon} {t.label}
        </button>
      ))}
    </div>
  );
}

// Rating bar
function RatingBar({ label, percent }) {
  return (
    <div className="rating-bar-row">
      <span className="rating-bar-label">{label}</span>
      <div className="rating-bar-track">
        <div className="rating-bar-fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="rating-bar-pct">{percent}%</span>
    </div>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const nav = useNavigate();

  const [p, setP] = useState(null);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(r => { setP(r.data.product); setActiveImg(0); setQty(1); })
      .catch(e => setError(readError(e).message));
  }, [id]);

  async function remove() {
    try { await api.delete(`/products/${id}`); nav('/shop'); }
    catch (e) { setError(readError(e).message); }
  }

  function handleAddToCart() {
    for (let i = 0; i < qty; i++) addToCart(p);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (error) return (
    <div className="wrap">
      <p className="notice bad">{error}</p>
      <Link to="/shop" className="textlink">← Back to shop</Link>
    </div>
  );

  if (!p) return (
    <div className="wrap" style={{ paddingTop: '8rem', textAlign: 'center' }}>
      <div style={{ width: 48, height: 48, border: '3px solid var(--line)', borderTopColor: 'var(--green)', borderRadius: '50%', animation: 'spin 0.9s linear infinite', margin: '0 auto 1rem' }} />
      <p style={{ color: 'var(--ink-muted)' }}>Loading product…</p>
    </div>
  );

  const images = getImages(p);
  const mine = user && p.createdBy?._id === user._id;
  const isWished = wishlist.has(p._id);
  const rating = fakeRating(p);
  const reviews = fakeReviews(p);
  const fresh = freshnessInfo(p);
  const sellerName = p.createdBy?.name || 'Local Grower';
  const sellerInitials = sellerName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const TABS = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'details', label: 'Details', icon: '🔍' },
    { id: 'reviews', label: `Reviews (${reviews})`, icon: '⭐' },
    { id: 'delivery', label: 'Delivery', icon: '🚚' },
  ];

  return (
    <div className="wrap">
      {/* ── BREADCRUMB ── */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/" className="breadcrumb-link">🏠 Home</Link>
        <span className="breadcrumb-sep">›</span>
        <Link to="/shop" className="breadcrumb-link">Shop</Link>
        <span className="breadcrumb-sep">›</span>
        <Link to={`/shop?category=${p.category}`} className="breadcrumb-link">{p.category}</Link>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">{p.name}</span>
      </nav>

      <div className="detail">
        {/* ══ LEFT: IMAGE GALLERY ══ */}
        <div className="detail-art">
          {/* Main image */}
          <div className="detail-art-frame">
            <img
              key={activeImg}
              src={images[activeImg]}
              alt={`${p.name} – image ${activeImg + 1}`}
              style={{ animation: 'fade 0.25s ease' }}
              onError={e => { e.currentTarget.src = '/products/fallback.svg'; }}
            />
            {images.length > 1 && <span className="gallery-counter">{activeImg + 1} / {images.length}</span>}
            {p.stock < 10 && p.stock > 0 && (
              <span className="gallery-low-stock">⚠️ Only {p.stock} left!</span>
            )}
            {images.length > 1 && (
              <>
                <button className="gallery-arrow gallery-arrow-prev" onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)} aria-label="Previous image">‹</button>
                <button className="gallery-arrow gallery-arrow-next" onClick={() => setActiveImg(i => (i + 1) % images.length)} aria-label="Next image">›</button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="detail-thumbnails">
              {images.map((src, i) => (
                <button key={i} className={`detail-thumb${i === activeImg ? ' active' : ''}`} onClick={() => setActiveImg(i)} aria-label={`View image ${i + 1}`}>
                  <img src={src} alt="" onError={e => { e.currentTarget.src = '/products/fallback.svg'; }} />
                  {i === 0 && <span className="thumb-cover-label">Cover</span>}
                </button>
              ))}
            </div>
          )}

          {/* Dots */}
          {images.length > 1 && (
            <div className="gallery-dots">
              {images.map((_, i) => (
                <button key={i} className={`gallery-dot${i === activeImg ? ' active' : ''}`} onClick={() => setActiveImg(i)} aria-label={`Image ${i + 1}`} />
              ))}
            </div>
          )}

          {/* ── STAT CARDS ── */}
          <div className="detail-stats-row">
            <StatCard icon="⭐" value={rating} label="Rating" />
            <StatCard icon="💬" value={reviews} label="Reviews" />
            <StatCard icon="📦" value={p.stock} label="In stock" />
            <StatCard icon="🚚" value="2–3d" label="Delivery" />
          </div>

          {/* ── SHARE ROW ── */}
          <div className="share-row">
            <span className="share-label">Share:</span>
            <a href={`https://wa.me/?text=Check out ${encodeURIComponent(p.name)} on GreenCart!`} target="_blank" rel="noreferrer" className="share-btn whatsapp">💬 WhatsApp</a>
            <button className="share-btn copy" onClick={() => { navigator.clipboard?.writeText(window.location.href); }}>🔗 Copy link</button>
          </div>
        </div>

        {/* ══ RIGHT: PRODUCT INFO ══ */}
        <div className="detail-info">
          {/* Category + badges */}
          <div className="detail-badges">
            <span className="badge-cat" style={{ position: 'static', display: 'inline-block' }}>{p.category}</span>
            {fresh.badge && <span className="fresh-badge">{fresh.badge}</span>}
            {p.stock > 0 && <span className="organic-badge">🌱 Farm Direct</span>}
          </div>

          {/* Title */}
          <h1>{p.name}</h1>

          {/* Rating */}
          <div className="detail-rating">
            <Stars rating={rating} size="lg" />
            <span className="rating-num-lg">{rating}</span>
            <span className="count">({reviews} verified reviews)</span>
            <span className="detail-sku">SKU: GC-{p._id?.slice(-6).toUpperCase()}</span>
          </div>

          {/* Price block */}
          <div className="price-block">
            <span className="big-price">₹{p.price}</span>
            <span className="price-unit-tag">per unit</span>
            <span className="price-mrp">MRP ₹{Math.round(p.price * 1.15)}</span>
            <span className="price-discount-tag">15% off</span>
          </div>

          {/* Stock status */}
          <div className={`stock-status${p.stock === 0 ? ' out' : p.stock < 10 ? ' low' : ''}`}>
            {p.stock === 0
              ? <><span className="status-dot" />❌ Out of stock</>
              : p.stock < 10
                ? <><span className="status-dot pulse" />⚠️ Hurry! Only {p.stock} units left</>
                : <><span className="status-dot" />✅ In stock — {p.stock} units available</>
            }
          </div>

          {/* ── TABS ── */}
          <Tabs tabs={TABS} active={tab} onChange={setTab} />

          {/* TAB: OVERVIEW */}
          {tab === 'overview' && (
            <div className="tab-content">
              {p.description
                ? <p className="desc">{p.description}</p>
                : <p className="desc" style={{ color: 'var(--ink-faint)', fontStyle: 'italic' }}>No description provided by the grower.</p>
              }
              <div className="highlights-grid">
                <div className="highlight-card">
                  <span className="highlight-icon">🌾</span>
                  <span className="highlight-label">Origin</span>
                  <span className="highlight-value">Konkan Coast, Maharashtra</span>
                </div>
                <div className="highlight-card">
                  <span className="highlight-icon">🧪</span>
                  <span className="highlight-label">Pesticides</span>
                  <span className="highlight-value">Zero / Minimal</span>
                </div>
                <div className="highlight-card">
                  <span className="highlight-icon">📦</span>
                  <span className="highlight-label">Packaging</span>
                  <span className="highlight-value">Eco-friendly</span>
                </div>
                <div className="highlight-card">
                  <span className="highlight-icon">❄️</span>
                  <span className="highlight-label">Storage</span>
                  <span className="highlight-value">Cool, dry place</span>
                </div>
                <div className="highlight-card">
                  <span className="highlight-icon">🗓️</span>
                  <span className="highlight-label">Listed</span>
                  <span className="highlight-value">{fresh.label}</span>
                </div>
                <div className="highlight-card">
                  <span className="highlight-icon">🚚</span>
                  <span className="highlight-label">Ships by</span>
                  <span className="highlight-value">Within 24 hrs of order</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DETAILS */}
          {tab === 'details' && (
            <div className="tab-content">
              <table className="detail-table">
                <tbody>
                  <tr><td>📛 Name</td><td>{p.name}</td></tr>
                  <tr><td>📂 Category</td><td>{p.category}</td></tr>
                  <tr><td>💰 Price</td><td>₹{p.price} / unit</td></tr>
                  <tr><td>📦 Stock</td><td>{p.stock} units</td></tr>
                  <tr><td>🌾 Region</td><td>Konkan Coast, Maharashtra</td></tr>
                  <tr><td>🌱 Farming</td><td>Sustainable, farm-direct</td></tr>
                  <tr><td>🧪 Chemicals</td><td>Zero / Minimal pesticide use</td></tr>
                  <tr><td>📦 Pack type</td><td>Biodegradable, eco-friendly</td></tr>
                  <tr><td>❄️ Storage</td><td>Store in a cool, dry place</td></tr>
                  <tr><td>🚚 Dispatch</td><td>Within 24 hrs of order placement</td></tr>
                  <tr><td>🔖 SKU</td><td>GC-{p._id?.slice(-8).toUpperCase()}</td></tr>
                  <tr><td>🗓️ Listed</td><td>{p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: REVIEWS */}
          {tab === 'reviews' && (
            <div className="tab-content">
              {/* Rating summary */}
              <div className="reviews-summary">
                <div className="reviews-big-num">{rating}</div>
                <div className="reviews-summary-right">
                  <Stars rating={rating} size="lg" />
                  <p style={{ color: 'var(--ink-muted)', fontSize: '0.88rem' }}>Based on {reviews} reviews</p>
                  <div className="rating-bars">
                    <RatingBar label="5★" percent={72} />
                    <RatingBar label="4★" percent={18} />
                    <RatingBar label="3★" percent={7} />
                    <RatingBar label="2★" percent={2} />
                    <RatingBar label="1★" percent={1} />
                  </div>
                </div>
              </div>
              {/* Individual reviews */}
              <div className="review-list">
                {MOCK_REVIEWS.map((r, i) => (
                  <div key={i} className="review-card">
                    <div className="review-header">
                      <div className="review-avatar">{r.name[0]}</div>
                      <div>
                        <div className="review-name">{r.name}</div>
                        <div className="review-date">{r.date}</div>
                      </div>
                      <Stars rating={r.rating} size="sm" />
                    </div>
                    <p className="review-text">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: DELIVERY */}
          {tab === 'delivery' && (
            <div className="tab-content">
              <div className="delivery-timeline">
                <div className="delivery-step done">
                  <div className="delivery-dot" />
                  <div className="delivery-step-info">
                    <strong>Order placed</strong>
                    <span>Grower notified within minutes</span>
                  </div>
                </div>
                <div className="delivery-step done">
                  <div className="delivery-dot" />
                  <div className="delivery-step-info">
                    <strong>Packed & dispatched</strong>
                    <span>Within 24 hours of your order</span>
                  </div>
                </div>
                <div className="delivery-step">
                  <div className="delivery-dot pending" />
                  <div className="delivery-step-info">
                    <strong>Out for delivery</strong>
                    <span>Estimated: {deliveryDate()}</span>
                  </div>
                </div>
                <div className="delivery-step">
                  <div className="delivery-dot pending" />
                  <div className="delivery-step-info">
                    <strong>Delivered 🎉</strong>
                    <span>Fresh at your doorstep</span>
                  </div>
                </div>
              </div>
              <div className="delivery-info-cards">
                <div className="delivery-info-card">
                  <span>🚚</span>
                  <div>
                    <strong>Standard Delivery</strong>
                    <p>₹40 · 2–3 business days</p>
                  </div>
                </div>
                <div className="delivery-info-card">
                  <span>⚡</span>
                  <div>
                    <strong>Express Delivery</strong>
                    <p>₹80 · Next business day</p>
                  </div>
                </div>
                <div className="delivery-info-card">
                  <span>💚</span>
                  <div>
                    <strong>Free Delivery</strong>
                    <p>On orders above ₹500</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── QTY + CART ── */}
          {p.stock > 0 && !mine && (
            <div className="qty-row">
              <div className="qty-selector">
                <button id="qty-dec" onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease">−</button>
                <span>{qty}</span>
                <button id="qty-inc" onClick={() => setQty(q => Math.min(p.stock, q + 1))} aria-label="Increase">+</button>
              </div>
              <button id="add-to-cart-btn" className="btn" style={{ flex: 1 }} onClick={handleAddToCart} disabled={added}>
                {added ? '✅ Added to cart!' : `🛒 Add ${qty > 1 ? qty + 'x ' : ''}to cart`}
              </button>
              <button
                id="wishlist-btn"
                className={`btn ghost icon-only${isWished ? ' danger' : ''}`}
                onClick={() => toggleWishlist(p._id)}
                title={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                {isWished ? '❤️' : '🤍'}
              </button>
            </div>
          )}

          {/* Total price preview */}
          {p.stock > 0 && !mine && qty > 1 && (
            <p className="qty-total">
              Total: <strong style={{ color: 'var(--green)' }}>₹{p.price * qty}</strong>
              <span style={{ color: 'var(--ink-muted)', fontSize: '0.85rem' }}> for {qty} units</span>
            </p>
          )}

          {/* ── SELLER CARD ── */}
          <div className="seller-card">
            <div className="seller-avatar">{sellerInitials}</div>
            <div style={{ flex: 1 }}>
              <div className="seller-name">{sellerName}</div>
              <div className="seller-tag">🌱 Verified Grower · Konkan Coast</div>
              <div className="seller-meta">
                <span>📦 12 products listed</span>
                <span>⭐ 4.8 seller rating</span>
              </div>
            </div>
          </div>

          {/* ── TRUST BADGES ── */}
          <div className="trust-badges">
            <div className="trust-badge"><span>🔒</span><span>Secure payment</span></div>
            <div className="trust-badge"><span>↩️</span><span>Easy returns</span></div>
            <div className="trust-badge"><span>✅</span><span>Quality checked</span></div>
            <div className="trust-badge"><span>🌿</span><span>Farm certified</span></div>
          </div>

          {/* Owner controls */}
          {mine && (
            <div className="detail owner">
              <OwnerActions id={p._id} onDelete={remove} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
