import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Auth from './pages/Auth';
import ProductForm from './pages/ProductForm';
import ProductPage from './pages/ProductPage';

function Protected({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return null;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/login" element={<Auth key="login" mode="login" />} />
          <Route path="/register" element={<Auth key="register" mode="register" />} />
          <Route path="/products/new" element={<Protected><ProductForm key="new" /></Protected>} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/products/:id/edit" element={<Protected><ProductForm key="edit" /></Protected>} />
          <Route
            path="*"
            element={
              <div className="wrap" style={{ textAlign: 'center', paddingTop: '8rem' }}>
                <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🌿</div>
                <h1 className="page-title">Page not found</h1>
                <p style={{ color: 'var(--ink-muted)', margin: '1rem 0 2rem' }}>This path doesn't grow here.</p>
                <Link to="/shop" className="btn">Browse produce</Link>
              </div>
            }
          />
        </Routes>
      </main>

      <footer className="foot">
        <div className="foot-grid">
          <div className="foot-brand">
            <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--display)', background: 'linear-gradient(135deg, var(--green), var(--lime))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              🌿 GreenCart
            </div>
            <p>Farm-direct produce from growers along the Konkan coast. Fresh, honest, zero middlemen.</p>
            <div className="foot-social">
              <a href="#" aria-label="Instagram">📸</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="WhatsApp">💬</a>
            </div>
          </div>
          <div className="foot-col">
            <h4>Shop</h4>
            <ul>
              <li><Link to="/shop">All produce</Link></li>
              <li><Link to="/shop?category=Fruits">Fruits</Link></li>
              <li><Link to="/shop?category=Vegetables">Vegetables</Link></li>
              <li><Link to="/shop?category=Herbs">Herbs</Link></li>
              <li><Link to="/shop?category=Pantry">Pantry</Link></li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>Growers</h4>
            <ul>
              <li><Link to="/register">Start selling</Link></li>
              <li><Link to="/products/new">Add a product</Link></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Grower guide</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About us</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Privacy policy</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} GreenCart. Built for growers around Panvel and the Konkan coast.</span>
          <span>Made with 🌿 in India</span>
        </div>
      </footer>
    </>
  );
}
