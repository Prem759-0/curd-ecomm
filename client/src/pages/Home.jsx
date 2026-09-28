import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import ProductTile from '../components/ProductTile';

const Hero3D = lazy(() => import('../components/Hero3D'));

const TICKER_ITEMS = [
  '🥭 Alphonso Mangoes from Ratnagiri',
  '🌿 Fresh Curry Leaves picked today',
  '🥥 Organic Coconuts, Konkan coast',
  '🌶️ Kokum & Drumsticks — seasonal special',
  '🍋 Turmeric root, zero pesticides',
  '🫚 Cold-pressed coconut oil, farm direct',
];

const CATEGORIES = [
  { icon: '🍎', name: 'Fruits' },
  { icon: '🥦', name: 'Vegetables' },
  { icon: '🌿', name: 'Herbs' },
  { icon: '🫙', name: 'Pantry' },
];

const TESTIMONIALS = [
  { name: 'Priya Nair', loc: 'Mumbai', text: 'I found the freshest kokum here — straight from a farmer in Ratnagiri. The quality is unreal, nothing like what you get in stores.', initials: 'PN' },
  { name: 'Rajan Kulkarni', loc: 'Pune', text: 'As a grower, GreenCart gave me a platform to sell my turmeric directly. No middlemen, fair prices. My income doubled in one season.', initials: 'RK' },
  { name: 'Meena Shetty', loc: 'Panvel', text: 'The drumsticks and curry leaves arrive so fresh I thought they were from my own backyard. This is exactly what local food should be.', initials: 'MS' },
];

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function RevealSection({ children, className = '', delay = '' }) {
  const ref = useReveal();
  return <div ref={ref} className={`reveal ${delay} ${className}`}>{children}</div>;
}

export default function Home() {
  const [items, setItems] = useState([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);

  useEffect(() => {
    api.get('/products', { params: { limit: 5 } }).then((r) => setItems(r.data.items)).catch(() => {});
  }, []);

  const tickerContent = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <>
      {/* PAGE LOADER */}
      <div className="page-loader" aria-hidden="true">
        <div className="logo-spin" />
        <p>Loading fresh produce…</p>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-grid" aria-hidden="true" />
        <div className="hero-copy">
          <h1>
            <span className="line"><span>Grown nearby.</span></span>
            <span className="line"><span>Picked&nbsp;<span className="accent">this week.</span></span></span>
          </h1>
          <p>
            Mangoes, drumsticks, kokum and leafy bunches from growers along the Konkan coast, priced by the people who grew them.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="btn" id="hero-shop-btn">Browse produce →</Link>
            <Link to="/register" className="btn ghost" id="hero-sell-btn">Start selling</Link>
          </div>
          <div className="hero-trust">
            <div className="avatars">
              <span>PK</span><span>MR</span><span>AS</span><span>NS</span>
            </div>
            <span><strong>1,200+ growers</strong> already selling on GreenCart</span>
          </div>
        </div>
        <div className="hero-stage">
          <Suspense fallback={null}><Hero3D /></Suspense>
          <div className="hero-badge b1">
            <span className="badge-icon">🥭</span>
            <div>
              <div>Alphonso Mangoes</div>
              <div className="badge-label">Just listed · ₹280/kg</div>
            </div>
          </div>
          <div className="hero-badge b2">
            <span className="badge-icon">🌿</span>
            <div>
              <div>Curry Leaves</div>
              <div className="badge-label">Picked today</div>
            </div>
          </div>
          <div className="hero-badge b3">
            <span className="badge-icon">⭐</span>
            <div>
              <div>4.9 Rating</div>
              <div className="badge-label">From 800+ reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <RevealSection>
        <div className="stats-bar">
          <div className="stat-item"><div className="stat-num">1,200+</div><div className="stat-label">Active Growers</div></div>
          <div className="stat-item"><div className="stat-num">8,500+</div><div className="stat-label">Products Listed</div></div>
          <div className="stat-item"><div className="stat-num">35K+</div><div className="stat-label">Happy Customers</div></div>
          <div className="stat-item"><div className="stat-num">98%</div><div className="stat-label">Fresh Guarantee</div></div>
        </div>
      </RevealSection>

      {/* TICKER */}
      <div className="ticker-wrap" aria-hidden="true">
        <div className="ticker">
          {tickerContent.map((item, i) => (
            <span key={i} className="ticker-item">
              <span className="ticker-dot">●</span> {item}
            </span>
          ))}
        </div>
      </div>

      {/* FEATURES BANNER */}
      <RevealSection className="wrap" style={{ paddingBottom: 0 }}>
        <div className="features-banner">
          <div className="feature-item">
            <span className="feature-icon">🚚</span>
            <span className="feature-title">Farm-to-door delivery</span>
            <span className="feature-desc">Orders dispatched within 24hrs of harvest</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✅</span>
            <span className="feature-title">Quality guaranteed</span>
            <span className="feature-desc">100% fresh or your money back</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🌱</span>
            <span className="feature-title">Zero middlemen</span>
            <span className="feature-desc">Prices set by the growers themselves</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔒</span>
            <span className="feature-title">Secure payments</span>
            <span className="feature-desc">Encrypted transactions, safe checkout</span>
          </div>
        </div>
      </RevealSection>

      {/* CATEGORY STRIP */}
      <RevealSection className="wrap" style={{ paddingTop: '3rem', paddingBottom: '2rem' }}>
        <div className="section-label">Categories</div>
        <div className="section-head">
          <h2>Shop by category</h2>
          <Link to="/shop" className="textlink">See all</Link>
        </div>
        <div className="cat-strip">
          {CATEGORIES.map(c => (
            <Link key={c.name} to={`/shop?category=${c.name}`} className="cat-card">
              <div className="cat-icon">{c.icon}</div>
              <div className="cat-name">{c.name}</div>
            </Link>
          ))}
        </div>
      </RevealSection>

      {/* FEATURED PRODUCTS */}
      {items.length > 0 && (
        <RevealSection className="wrap" style={{ paddingTop: '2rem' }}>
          <div className="section-label">Just Harvested</div>
          <div className="section-head">
            <h2>Fresh this week</h2>
            <Link to="/shop" className="textlink">See all produce</Link>
          </div>
          <div className="grid feature">
            {items.map((p) => <ProductTile key={p._id} p={p} />)}
          </div>
        </RevealSection>
      )}

      {/* TESTIMONIALS */}
      <section className="testimonials-section">
        <div className="wrap">
          <RevealSection>
            <div className="section-label">Reviews</div>
            <div className="section-head"><h2>What people are saying</h2></div>
          </RevealSection>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <RevealSection key={t.name} delay={`reveal-delay-${i + 1}`}>
                <div className="testimonial-card">
                  <div className="testimonial-quote">"</div>
                  <p className="testimonial-text">{t.text}</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">{t.initials}</div>
                    <div>
                      <div className="testimonial-name">{t.name}</div>
                      <div className="testimonial-location">📍 {t.loc}</div>
                    </div>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <RevealSection className="wrap sell">
        <div className="section-label">For growers</div>
        <h2>Selling here takes three steps</h2>
        <ol>
          <li>
            <strong>Make an account.</strong>
            <p>Name, email and a password. That is all we ask. No listing fees, no commissions.</p>
          </li>
          <li>
            <strong>List what you picked.</strong>
            <p>Add a photo, a price and how many you have. Go live in under 2 minutes.</p>
          </li>
          <li>
            <strong>Keep stock honest.</strong>
            <p>Edit the count as it sells, or take the listing down. Full control, always.</p>
          </li>
        </ol>
      </RevealSection>

      {/* NEWSLETTER */}
      <section className="newsletter-section">
        <div className="wrap" style={{ padding: '3rem clamp(1rem,4vw,2.5rem)' }}>
          <RevealSection>
            <div className="newsletter-inner">
              <div className="section-label" style={{ justifyContent: 'center' }}>Newsletter</div>
              <h2>Get weekly harvest updates</h2>
              <p>Find out what's fresh before it sells out. No spam, just the good stuff.</p>
              {newsletterSent ? (
                <p style={{ color: 'var(--green)', fontWeight: 700, fontSize: '1.05rem' }}>
                  ✅ You're on the list! We'll be in touch.
                </p>
              ) : (
                <form className="newsletter-form" onSubmit={e => { e.preventDefault(); setNewsletterSent(true); }}>
                  <input
                    id="newsletter-email"
                    type="email"
                    placeholder="your@email.com"
                    value={newsletterEmail}
                    onChange={e => setNewsletterEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn">Subscribe</button>
                </form>
              )}
            </div>
          </RevealSection>
        </div>
      </section>
    </>
  );
}
