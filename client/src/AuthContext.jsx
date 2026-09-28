import { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { api, refreshAccessToken, setAccessToken } from './api';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

// Cart context
const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find(i => i._id === action.item._id);
      if (existing) return state.map(i => i._id === action.item._id ? { ...i, qty: i.qty + 1 } : i);
      return [...state, { ...action.item, qty: 1 }];
    }
    case 'REMOVE': return state.filter(i => i._id !== action.id);
    case 'UPDATE_QTY': return state.map(i => i._id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i);
    case 'CLEAR': return [];
    default: return state;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState(new Set());

  useEffect(() => {
    refreshAccessToken()
      .then(() => api.get('/auth/me'))
      .then((r) => setUser(r.data.user))
      .catch(() => setUser(null))
      .finally(() => setReady(true));
  }, []);

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
  }

  async function logout() {
    try { await api.post('/auth/logout'); }
    finally { setAccessToken(null); setUser(null); }
  }

  function addToCart(item) {
    dispatch({ type: 'ADD', item });
    setCartOpen(true);
  }
  function removeFromCart(id) { dispatch({ type: 'REMOVE', id }); }
  function updateQty(id, qty) { dispatch({ type: 'UPDATE_QTY', id, qty }); }
  function toggleWishlist(id) {
    setWishlist(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  }
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartCtx.Provider value={{ cart, cartOpen, setCartOpen, addToCart, removeFromCart, updateQty, cartTotal, cartCount, wishlist, toggleWishlist }}>
      <Ctx.Provider value={{ user, ready, login, logout }}>
        {children}
      </Ctx.Provider>
    </CartCtx.Provider>
  );
}
