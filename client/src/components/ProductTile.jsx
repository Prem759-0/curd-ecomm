import { Link } from 'react-router-dom';
import { useCart } from '../AuthContext';
import OwnerActions from './OwnerActions';

// Use first image from the images[] array, fall back to legacy image field
export const picture = (p) => (p.images?.length ? p.images[0] : p.image) || '/products/fallback.svg';

const STARS = '★★★★★';

export default function ProductTile({ p, mine, onDelete }) {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const isWished = wishlist.has(p._id);

  return (
    <article className="tile">
      <Link to={`/products/${p._id}`} className="tile-art" aria-label={p.name}>
        <img src={picture(p)} alt="" loading="lazy" onError={e => { e.currentTarget.src = '/products/fallback.svg'; }} />
        <div className="tile-art-overlay" />
        {p.stock === 0 && <span className="sold">Sold out</span>}
        <span className="badge-cat">{p.category}</span>
        {p.stock > 0 && (
          <button
            id={`quick-add-${p._id}`}
            className="btn sm tile-quick-add"
            onClick={e => { e.preventDefault(); e.stopPropagation(); addToCart(p); }}
          >
            + Add to cart
          </button>
        )}
      </Link>
      <button
        className={`wish-btn${isWished ? ' active' : ''}`}
        onClick={() => toggleWishlist(p._id)}
        aria-label={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
        title={isWished ? 'Wishlisted ❤️' : 'Add to wishlist'}
      >
        {isWished ? '❤️' : '🤍'}
      </button>
      <div className="tile-body">
        <h3><Link to={`/products/${p._id}`}>{p.name}</Link></h3>
        <p className="meta">{p.category} · by {p.createdBy?.name || 'a local grower'}</p>
        <div className="stars" title="4.8 stars">{STARS.slice(0, 5)}</div>
        <div className="tile-row">
          <div>
            <strong className="price">₹{p.price}</strong>
          </div>
          <span className={p.stock > 0 ? 'stock' : 'stock out'}>
            {p.stock > 0 ? `${p.stock} left` : 'Out of stock'}
          </span>
        </div>
        {mine && <OwnerActions id={p._id} onDelete={onDelete} />}
      </div>
    </article>
  );
}
