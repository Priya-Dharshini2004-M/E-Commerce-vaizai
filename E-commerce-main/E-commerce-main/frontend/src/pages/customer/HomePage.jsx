import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiShield,
  FiTruck,
  FiShoppingBag,
  FiZap,
  FiStar,
  FiPackage,
  FiRefreshCw,
  FiHeadphones,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

/* ─── Design tokens (kept local for copy-paste portability) ─── */
const TOKEN = {
  indigo: '#4f46e5',
  indigoDark: '#3730a3',
  indigoLight: '#eef2ff',
  violet: '#7c3aed',
  slate900: '#0f172a',
  slate800: '#1e293b',
  slate600: '#475569',
  slate400: '#94a3b8',
  slate100: '#f1f5f9',
  slate50: '#f8fafc',
  white: '#ffffff',
  emerald: '#10b981',
  amber: '#f59e0b',
  rose: '#f43f5e',
};

/* ─── Hero slides ─── */
const HERO_SLIDES = [
  {
    eyebrow: 'New Season Collection',
    headline: 'Discover Products You Love',
    sub: 'Premium selections from verified vendors — all in one place.',
    cta: { label: 'Shop Collection', to: '/products' },
    accent: '#4f46e5',
    img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900&auto=format&q=80',
  },
  {
    eyebrow: 'Electronics Week',
    headline: 'Gadgets That\nChange Everything',
    sub: 'Curated tech from the worlds top brands at unbeatable prices.',
    cta: { label: 'Browse Gadgets', to: '/products?category=electronics' },
    accent: '#0ea5e9',
    img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=900&auto=format&q=80',
  },
  {
    eyebrow: 'Fashion Forward',
    headline: 'Style That Speaks\nFor Itself',
    sub: 'Fresh fashion drops — trendy, sustainable, and fairly priced.',
    cta: { label: 'Explore Fashion', to: '/products?category=clothing' },
    accent: '#e879f9',
    img: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=900&auto=format&q=80',
  },
];

/* ─── Category tiles ─── */
const CATEGORIES = [
  { value: 'electronics', label: 'Electronics', emoji: '⚡', color: '#dbeafe', text: '#1e40af' },
  { value: 'clothing', label: 'Fashion', emoji: '🧥', color: '#fce7f3', text: '#9d174d' },
  { value: 'home', label: 'Home & Living', emoji: '🏡', color: '#d1fae5', text: '#065f46' },
  { value: 'beauty', label: 'Beauty', emoji: '✨', color: '#ede9fe', text: '#5b21b6' },
  { value: 'toys', label: 'Toys & Games', emoji: '🎮', color: '#ffedd5', text: '#7c2d12' },
  { value: 'books', label: 'Books', emoji: '📚', color: '#fef9c3', text: '#713f12' },
];

/* ─── Trust badges ─── */
const TRUST = [
  { icon: FiTruck, label: 'Free Delivery', detail: 'On all orders above ₹499' },
  { icon: FiShield, label: 'Secure Payments', detail: 'Razorpay-powered encryption' },
  { icon: FiRefreshCw, label: 'Easy Returns', detail: '7-day hassle-free returns' },
  { icon: FiHeadphones, label: '24/7 Support', detail: 'We are always here for you' },
];

/* ─── Featured deals ─── */
const DEALS = [
  { id: 1, label: 'Flash Sale', pct: '40%', cat: 'electronics', img: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300&q=80', color: '#eff6ff' },
  { id: 2, label: 'Fashion Drop', pct: '30%', cat: 'clothing', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&q=80', color: '#fdf4ff' },
  { id: 3, label: 'Home Picks', pct: '25%', cat: 'home', img: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=300&q=80', color: '#f0fdf4' },
  { id: 4, label: 'Beauty Edit', pct: '20%', cat: 'beauty', img: 'https://images.pexels.com/photos/11924085/pexels-photo-11924085.jpeg?w=300', color: '#fafafa' },
  { id: 5, label: 'Toy World', pct: '35%', cat: 'toys', img: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=300&q=80', color: '#fff7ed' },
  { id: 6, label: 'Book Fair', pct: '15%', cat: 'books', img: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&q=80', color: '#fefce8' },
];

/* ════════════════════════════════════════════════════════════════
   HomePage Component
════════════════════════════════════════════════════════════════ */
const HomePage = () => {
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroFading, setHeroFading] = useState(false);
  const timerRef = useRef(null);

  /* Auto-rotate hero */
  useEffect(() => {
    timerRef.current = setInterval(() => advance(1), 6000);
    return () => clearInterval(timerRef.current);
  }, [heroIndex]);

  const advance = (dir) => {
    clearInterval(timerRef.current);
    setHeroFading(true);
    setTimeout(() => {
      setHeroIndex((prev) => (prev + dir + HERO_SLIDES.length) % HERO_SLIDES.length);
      setHeroFading(false);
    }, 280);
  };

  const slide = HERO_SLIDES[heroIndex];

  return (
    <div style={{ background: TOKEN.slate50, minHeight: '100vh', fontFamily: 'inherit' }}>

      {/* ══════════════ HERO ══════════════ */}
      <section style={{
        position: 'relative',
        background: TOKEN.slate900,
        overflow: 'hidden',
        minHeight: 540,
        display: 'flex',
        alignItems: 'center',
      }}>
        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${slide.img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: heroFading ? 0 : 0.22,
          transition: 'opacity 0.3s ease',
        }} />
        {/* Left gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(105deg, ${TOKEN.slate900} 38%, transparent 72%)`,
          pointerEvents: 'none',
        }} />

        {/* Content */}
        <div style={{
          position: 'relative', zIndex: 2,
          maxWidth: 1200, margin: '0 auto',
          padding: '80px 24px',
          width: '100%',
          opacity: heroFading ? 0 : 1,
          transform: heroFading ? 'translateY(8px)' : 'translateY(0)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}>
          <span style={{
            display: 'inline-block',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: slide.accent,
            background: `${slide.accent}22`,
            border: `1px solid ${slide.accent}44`,
            borderRadius: 100, padding: '4px 14px',
            marginBottom: 20,
          }}>{slide.eyebrow}</span>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            fontWeight: 900, color: TOKEN.white,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            whiteSpace: 'pre-line',
            marginBottom: 18,
            maxWidth: 560,
          }}>{slide.headline}</h1>

          <p style={{
            fontSize: 16, color: '#94a3b8',
            maxWidth: 420, lineHeight: 1.7,
            marginBottom: 36,
          }}>{slide.sub}</p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to={slide.cta.to} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: TOKEN.indigo,
              color: TOKEN.white,
              fontWeight: 700, fontSize: 14,
              padding: '13px 28px', borderRadius: 12,
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(79,70,229,0.35)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(79,70,229,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 20px rgba(79,70,229,0.35)'; }}
            >
              {slide.cta.label}
              <FiArrowRight style={{ width: 16, height: 16 }} />
            </Link>
            <Link to="/chat" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.13)',
              color: '#cbd5e1',
              fontWeight: 600, fontSize: 14,
              padding: '13px 28px', borderRadius: 12,
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
            >
              Talk to Support
            </Link>
          </div>
        </div>

        {/* Prev / Next */}
        {[{ dir: -1, icon: FiChevronLeft, side: 'left' }, { dir: 1, icon: FiChevronRight, side: 'right' }].map(({ dir, icon: Icon, side }) => (
          <button key={side} onClick={() => advance(dir)} style={{
            position: 'absolute', top: '50%', [side]: 20,
            transform: 'translateY(-50%)',
            zIndex: 3,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: TOKEN.white,
            borderRadius: 10, width: 40, height: 40,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          >
            <Icon style={{ width: 18, height: 18 }} />
          </button>
        ))}

        {/* Dots */}
        <div style={{
          position: 'absolute', bottom: 24, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', gap: 6, zIndex: 3,
        }}>
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => advance(i - heroIndex)} style={{
              width: i === heroIndex ? 24 : 7, height: 7,
              borderRadius: 100,
              background: i === heroIndex ? TOKEN.indigo : 'rgba(255,255,255,0.3)',
              border: 'none', cursor: 'pointer', padding: 0,
              transition: 'all 0.3s',
            }} />
          ))}
        </div>
      </section>

      {/* ══════════════ TRUST BAR ══════════════ */}
      <section style={{
        background: TOKEN.white,
        borderBottom: `1px solid ${TOKEN.slate100}`,
        padding: '0 24px',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 0,
        }}>
          {TRUST.map(({ icon: Icon, label, detail }, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '20px 24px',
              borderRight: i < TRUST.length - 1 ? `1px solid ${TOKEN.slate100}` : 'none',
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 10,
                background: TOKEN.indigoLight,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon style={{ width: 18, height: 18, color: TOKEN.indigo }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: TOKEN.slate800 }}>{label}</div>
                <div style={{ fontSize: 11, color: TOKEN.slate400, marginTop: 2 }}>{detail}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════ DEALS STRIP ══════════════ */}
      <section style={{ padding: '56px 24px 0', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: TOKEN.indigo, marginBottom: 6 }}>
              Limited Time
            </p>
            <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, color: TOKEN.slate900, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              Best Deals Right Now
            </h2>
          </div>
          <Link to="/products" style={{
            fontSize: 13, fontWeight: 700, color: TOKEN.indigo,
            display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}>
            View all <FiArrowRight style={{ width: 14, height: 14 }} />
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 14,
        }}>
          {DEALS.map((deal) => (
            <Link
              key={deal.id}
              to={`/products?category=${deal.cat}`}
              style={{
                background: deal.color,
                border: `1px solid ${TOKEN.slate100}`,
                borderRadius: 16,
                padding: '18px 14px',
                textDecoration: 'none',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 10,
                transition: 'all 0.22s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            >
              <div style={{
                width: 80, height: 80, borderRadius: 12,
                overflow: 'hidden',
                background: TOKEN.white,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
              }}>
                <img src={deal.img} alt={deal.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: TOKEN.slate800, lineHeight: 1.3 }}>{deal.label}</div>
                <div style={{
                  fontSize: 11, fontWeight: 800, color: TOKEN.rose,
                  marginTop: 3,
                }}>Up to {deal.pct} off</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════ CATEGORIES ══════════════ */}
      <section style={{ padding: '64px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: TOKEN.indigo, marginBottom: 8 }}>
            Browse by Category
          </p>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, color: TOKEN.slate900, letterSpacing: '-0.02em' }}>
            What are you looking for?
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: 16,
        }}>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              to={`/products?category=${cat.value}`}
              style={{
                background: TOKEN.white,
                border: `1px solid ${TOKEN.slate100}`,
                borderRadius: 18,
                padding: '28px 16px',
                textDecoration: 'none',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                transition: 'all 0.22s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = TOKEN.indigo + '55';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = `0 8px 24px rgba(79,70,229,0.1)`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = TOKEN.slate100;
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: cat.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
              }}>
                {cat.emoji}
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: TOKEN.slate800 }}>{cat.label}</div>
                <div style={{ fontSize: 11, color: TOKEN.slate400, marginTop: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                  Shop <FiArrowRight style={{ width: 10, height: 10 }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════ VALUE PROPS ══════════════ */}
      <section style={{
        background: TOKEN.slate900,
        padding: '80px 24px',
        margin: '0 0 0 0',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 24,
          }}>
            {[
              {
                icon: FiZap,
                title: 'Thousands of Products',
                body: 'Access a curated catalog from verified vendors across every category you need.',
                color: '#818cf8',
              },
              {
                icon: FiStar,
                title: 'Quality Guaranteed',
                body: 'Every seller is vetted and every product reviewed — so you shop with confidence.',
                color: '#34d399',
              },
              {
                icon: FiPackage,
                title: 'Lightning Delivery',
                body: 'Real-time tracking from checkout to doorstep, with free delivery on qualifying orders.',
                color: '#f472b6',
              },
            ].map(({ icon: Icon, title, body, color }, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20,
                padding: '32px 28px',
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: `${color}22`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20,
                }}>
                  <Icon style={{ width: 22, height: 22, color }} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: TOKEN.white, marginBottom: 10, letterSpacing: '-0.01em' }}>
                  {title}
                </h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CTA BANNER ══════════════ */}
      <section style={{ padding: '64px 24px' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          background: `linear-gradient(135deg, ${TOKEN.indigo} 0%, ${TOKEN.violet} 100%)`,
          borderRadius: 24,
          padding: 'clamp(40px, 6vw, 72px) clamp(24px, 5vw, 80px)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 32,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative circle */}
          <div style={{
            position: 'absolute', right: -60, top: -60,
            width: 260, height: 260, borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', right: 80, bottom: -80,
            width: 200, height: 200, borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: 480 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>
              Elevate Your Shopping
            </div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', fontWeight: 900, color: TOKEN.white, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 14 }}>
              Your Premium<br />Marketplace Awaits
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.72)', lineHeight: 1.65 }}>
              Join thousands of happy customers. Early access deals, exclusive bundles, and lightning-fast checkout.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', zIndex: 1 }}>
            <Link to="/products" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: TOKEN.white,
              color: TOKEN.indigoDark,
              fontWeight: 800, fontSize: 14,
              padding: '15px 36px', borderRadius: 12,
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = ''}
            >
              <FiShoppingBag style={{ width: 16, height: 16 }} />
              Start Shopping
            </Link>
            <Link to="/chat" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              color: 'rgba(255,255,255,0.8)',
              fontSize: 13, fontWeight: 600,
              textDecoration: 'none',
              textAlign: 'center',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = TOKEN.white}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
            >
              <FiHeadphones style={{ width: 14, height: 14 }} />
              Talk to Support
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ FOOTER MINI ══════════════ */}
      <footer style={{
        background: TOKEN.white,
        borderTop: `1px solid ${TOKEN.slate100}`,
        padding: '24px',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: 12, color: TOKEN.slate400 }}>
          © {new Date().getFullYear()} Multi-Vendor Platform · Built with care ·{' '}
          <Link to="/products" style={{ color: TOKEN.indigo, textDecoration: 'none', fontWeight: 600 }}>Shop now</Link>
        </p>
      </footer>

    </div>
  );
};

export default HomePage;