import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, readError } from '../api';
import { useAuth } from '../AuthContext';
import { useCart } from '../AuthContext';
import OwnerActions from '../components/OwnerActions';

// Returns the full images array for a product (supports both old and new schema)
function getImages(p) {
  if (p.images?.length) return p.images;
  if (p.image) return [p.image];
  return ['/products/fallback.svg'];
}

const STARS = '★★★★★';

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

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(r => { setP(r.data.product); setActiveImg(0); })
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
      <p style={{ color: 'var(--ink-muted)' }}>Loading…</p>
    </div>
  );

  const images = getImages(p);
  const mine = user && p.createdBy?._id === user._id;
  const isWished = wishlist.has(p._id);
  const sellerInitials = (p.createdBy?.name || 'GC').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="wrap detail">
      {/* IMAGE GALLERY */}
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
          {/* Image counter badge */}
          {images.length > 1 && (
            <span className="gallery-counter">{activeImg + 1} / {images.length}</span>
          )}
          {/* Prev / Next arrows */}
          {images.length > 1 && (
            <>
              <button
                className="gallery-arrow gallery-arrow-prev"
                onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
                aria-label="Previous image"
              >‹</button>
              <button
                className="gallery-arrow gallery-arrow-next"
                onClick={() => setActiveImg(i => (i + 1) % images.length)}
                aria-label="Next image"
              >›</button>
            </>
          )}
        </div>

        {/* Thumbnail strip — only shown when >1 image */}
        {images.length > 1 && (
          <div className="detail-thumbnails">
            {images.map((src, i) => (
              <button
                key={i}
                className={`detail-thumb${i === activeImg ? ' active' : ''}`}
                onClick={() => setActiveImg(i)}
                aria-label={`View image ${i + 1}`}
                title={i === 0 ? 'Cover photo' : `Image ${i + 1}`}
              >
                <img
                  src={src}
                  alt=""
                  onError={e => { e.currentTarget.src = '/products/fallback.svg'; }}
                />
                {i === 0 && <span className="thumb-cover-label">Cover</span>}
              </button>
            ))}
          </div>
        )}

        {/* Image dots indicator */}
        {images.length > 1 && (
          <div className="gallery-dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`gallery-dot${i === activeImg ? ' active' : ''}`}
                onClick={() => setActiveImg(i)}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* PRODUCT INFO */}
      <div className="detail-info">
        <Link to="/shop" className="textlink back">← All produce</Link>

        <span className="badge-cat" style={{ position: 'static', display: 'inline-block', marginBottom: '0.5rem' }}>
          {p.category}
        </span>

        <h1>{p.name}</h1>

        <div className="detail-rating">
          <span className="stars">{STARS}</span>
          <span className="count">(4.9 · 124 reviews)</span>
        </div>

        <p className="big-price">
          ₹{p.price}
          <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--ink-muted)', marginLeft: '0.5rem' }}>per unit</span>
        </p>

        <p className={p.stock ? 'stock' : 'stock out'}>
          {p.stock ? `✅ ${p.stock} available` : '❌ Sold out for now'}
        </p>

        {p.description && <p className="desc">{p.description}</p>}

        {/* QUANTITY + ADD TO CART */}
        {p.stock > 0 && !mine && (
          <div className="qty-row">
            <div className="qty-selector">
              <button id="qty-dec" onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease">−</button>
              <span>{qty}</span>
              <button id="qty-inc" onClick={() => setQty(q => Math.min(p.stock, q + 1))} aria-label="Increase">+</button>
            </div>
            <button
              id="add-to-cart-btn"
              className="btn"
              style={{ flex: 1 }}
              onClick={handleAddToCart}
              disabled={added}
            >
              {added ? '✅ Added to cart!' : '🛒 Add to cart'}
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

        {/* SELLER CARD */}
        <div className="seller-card">
          <div className="seller-avatar">{sellerInitials}</div>
          <div>
            <div className="seller-name">{p.createdBy?.name || 'Local Grower'}</div>
            <div className="seller-tag">🌱 Verified Grower · Konkan Coast</div>
          </div>
        </div>

        {mine && (
          <div className="detail owner">
            <OwnerActions id={p._id} onDelete={remove} />
          </div>
        )}
      </div>
    </div>
  );
}
