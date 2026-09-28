import { useCart } from '../AuthContext';
import { picture } from './ProductTile';

export default function CartSidebar() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQty, cartTotal } = useCart();

  return (
    <aside className={`cart-sidebar${cartOpen ? ' open' : ''}`} aria-label="Shopping cart">
      <div className="cart-header">
        <h3>🛒 Your Cart</h3>
        <button className="cart-close" onClick={() => setCartOpen(false)} aria-label="Close cart">✕</button>
      </div>

      <div className="cart-items">
        {cart.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🌿</div>
            <p>Your cart is empty.</p>
            <p style={{ marginTop: '0.4rem', fontSize: '0.85rem' }}>Add fresh produce from the shop!</p>
          </div>
        ) : (
          cart.map(item => (
            <div className="cart-item" key={item._id}>
              <img src={picture(item)} alt={item.name} onError={e => { e.currentTarget.src = '/products/fallback.svg'; }} />
              <div>
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-price">₹{(item.price * item.qty).toLocaleString()}</div>
                <div className="cart-item-qty">
                  <button onClick={() => updateQty(item._id, item.qty - 1)} disabled={item.qty <= 1}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
                </div>
              </div>
              <button className="cart-remove" onClick={() => removeFromCart(item._id)} aria-label="Remove item">✕</button>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="cart-footer">
          <div className="cart-total">
            <span>Total</span>
            <span>₹{cartTotal.toLocaleString()}</span>
          </div>
          <button className="btn block">Proceed to Checkout →</button>
          <button className="btn ghost block" style={{ marginTop: 0 }} onClick={() => setCartOpen(false)}>
            Continue Shopping
          </button>
        </div>
      )}
    </aside>
  );
}
