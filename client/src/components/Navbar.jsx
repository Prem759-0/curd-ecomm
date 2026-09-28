import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useCart } from '../AuthContext';
import CartSidebar from './CartSidebar';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount, cartOpen, setCartOpen } = useCart();
  const nav = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  async function signOut() {
    await logout();
    nav('/');
  }

  return (
    <>
      <header className={`nav${scrolled ? ' scrolled' : ''}`}>
        <Link to="/" className="logo">
          <span className="logo-leaf">🌿</span>
          GreenCart
        </Link>
        <nav>
          <NavLink to="/shop">Shop</NavLink>
          {user ? (
            <>
              <NavLink to="/products/new">Sell</NavLink>
              <span className="who">{user.name.split(' ')[0]}</span>
              <button
                id="cart-toggle-btn"
                className="btn ghost sm cart-btn"
                onClick={() => setCartOpen(true)}
                aria-label="Open cart"
              >
                🛒 Cart
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>
              <button className="btn ghost sm" onClick={signOut}>Sign out</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Sign in</NavLink>
              <Link to="/register" className="btn sm">Start selling</Link>
            </>
          )}
        </nav>
      </header>

      <CartSidebar />
      <div
        className={`cart-overlay${cartOpen ? ' open' : ''}`}
        onClick={() => setCartOpen(false)}
      />
    </>
  );
}
