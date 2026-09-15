import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Bed, Bath, Car, MapPin, Sparkles, Shield, Zap, Droplet } from 'lucide-react';
import { api } from '../services/api';
import { formatPriceNGN } from '../components/PropertyCard';
import { useAuth } from '../context/AuthContext';
import EstateMap from '../components/EstateMap';
import SEO from '../components/SEO';

export default function HomePage() {
  const { openBookingModal } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All 1004 Units');
  const [activeType, setActiveType] = useState('All');
  const [loading, setLoading] = useState(true);

  // Auto-scroll to #about if navigating to hash
  useEffect(() => {
    if (location.hash === '#about') {
      const timer = setTimeout(() => {
        const el = document.getElementById('about');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const heroTags = ['High-Rise', 'Serviced Flat', '1004 Victoria Island'];
  const categoryPills = ['All 1004 Units', 'High-Rise Towers', 'Cluster A', 'Cluster B', 'Cluster C & D', 'Penthouse'];

  useEffect(() => {
    async function loadProperties() {
      try {
        const res = await api.getProperties();
        setProperties(res.data || []);
      } catch (err) {
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, []);

  const filteredProperties = properties.filter((p) => {
    const matchesCategory =
      activeCategory === 'All 1004 Units' ||
      p.location?.toLowerCase().includes(activeCategory.toLowerCase()) ||
      p.propertyType?.toLowerCase() === activeCategory.toLowerCase();

    const matchesType = activeType === 'All' || p.propertyType?.toLowerCase() === activeType.toLowerCase();

    return matchesCategory && matchesType;
  });

  return (
    <div>
      <SEO
        title="Serviced Apartments & Penthouses in 1004 Estate, Victoria Island"
        description="Explore verified 1, 2, 3-bedroom flats, maisonettes, and luxury penthouses for rent in 1004 Estate, Victoria Island, Lagos. 24/7 dedicated power, treated water, and on-site agent management by Mrs. Joke Popoola."
        canonicalPath="/"
      />
      {/* 1. HERO SECTION (Minimalist Realco Layout for 1004 Estate, Victoria Island) */}
      <section className="hero-wrapper">
        <div className="container">
          <div className="hero-grid">

            {/* Left Column: Iconic 1004 Estate High-Rise Architectural Image with Floating Glass Tags */}
            <div className="hero-img-container">
              <img
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
                alt="1004 Estate High-Rise Architecture, Victoria Island"
              />
              <div className="hero-floating-tags">
                {heroTags.map((tag, idx) => (
                  <span key={idx} className="tag-pill-glass">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Clean Large Typography, Cluster Pills, and Agent Highlight Card */}
            <div className="hero-right-col">
              <div>
                <h1 className="hero-main-title">
                  Discover luxury apartments in 1004 Estate, Victoria Island
                </h1>

                {/* Filter Pill Chips for 1004 Estate Clusters */}
                <div className="hero-filter-pills">
                  {categoryPills.map((pill) => (
                    <button
                      key={pill}
                      onClick={() => {
                        setActiveCategory(pill);
                        if (pill === 'All 1004 Units') navigate('/properties');
                        else if (pill === 'Penthouse') navigate('/apartments/4-bedroom');
                        else navigate(`/properties?location=${encodeURIComponent('1004 ' + pill.replace('1004 ', ''))}`);
                      }}
                      className={`filter-pill-btn ${activeCategory === pill ? 'active' : ''}`}
                    >
                      {pill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dark Agent Highlight Banner Card */}
              <div className="hero-dark-card">
                <div>
                  <span className="explore-badge">JK-Cube Concierge Desk</span>
                  <h3 className="hero-dark-title">Direct 1004 Estate Rentals</h3>
                  <p className="hero-dark-desc">
                    Managed by <strong>JK - CUBE MULTIVENTURES LIMITED</strong> and lead agent Mrs. Joke Popoola. 24/7 turbine power, treated water, swimming pools, tennis courts, and verified security.
                  </p>
                  <button
                    onClick={() => openBookingModal(null)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'none',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      marginTop: '12px',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Schedule an inspection in 1004 <ArrowRight size={14} />
                  </button>
                </div>

                <div className="hero-dark-thumb">
                  <img
                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80"
                    alt="1004 Penthouse Preview"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CURATED COLLECTIONS MOSAIC SECTION (Matched to Reference Layout) */}
      <section className="curated-collections-section">
        <div className="container">
          {/* Header */}
          <div className="curated-header">
            <h2 className="curated-title">Curated Collections</h2>
            <span className="curated-subtitle">
              For waterfront gatherings, nature explorations, and cherished family vacations.
            </span>
          </div>

          {/* 5-Card Asymmetrical Mosaic Grid (1 Large Left Card + 4 Smaller Right Cards) */}
          <div className="curated-mosaic-grid">
            {/* Card 1: Large Featured Left Card (Spans 2 Rows) - 3-Bedroom Maisonettes */}
            <Link to="/apartments/3-bedroom-maisonette" className="curated-card curated-card-large">
              <div className="curated-card-img">
                <img
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
                  alt="3-Bedroom Maisonette Rentals"
                  loading="lazy"
                />
              </div>
              <div className="curated-card-caption">
                <h3 className="curated-card-title">3-Bedroom Maisonette Rentals</h3>
                <p className="curated-card-desc">Iconic split-level multi-floor residences with Five Cowries Creek views</p>
              </div>
            </Link>

            {/* Card 2: Top-Right 1 - 1-Bedroom Executive Apartments */}
            <Link to="/apartments/1-bedroom" className="curated-card curated-card-small">
              <div className="curated-card-img">
                <img
                  src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"
                  alt="1-Bedroom Executive Apartments"
                  loading="lazy"
                />
              </div>
              <div className="curated-card-caption">
                <h3 className="curated-card-title">1-Bedroom Executive Apartments</h3>
                <p className="curated-card-desc">Serviced suites tailored for corporate stays and young executives</p>
              </div>
            </Link>

            {/* Card 3: Top-Right 2 - 2-Bedroom Serviced Flats */}
            <Link to="/apartments/2-bedroom" className="curated-card curated-card-small">
              <div className="curated-card-img">
                <img
                  src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
                  alt="2-Bedroom Serviced Flats"
                  loading="lazy"
                />
              </div>
              <div className="curated-card-caption">
                <h3 className="curated-card-title">2-Bedroom Serviced Flats</h3>
                <p className="curated-card-desc">Modern urban living in serene residential clusters with pool access</p>
              </div>
            </Link>

            {/* Card 4: Bottom-Right 1 - 3-Bedroom Family Flats */}
            <Link to="/apartments/3-bedroom" className="curated-card curated-card-small">
              <div className="curated-card-img">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                  alt="3-Bedroom Family Flats"
                  loading="lazy"
                />
              </div>
              <div className="curated-card-caption">
                <h3 className="curated-card-title">3-Bedroom Family Flats</h3>
                <p className="curated-card-desc">Spacious flats with ensuite master bedrooms, modern kitchens, and tennis courts</p>
              </div>
            </Link>

            {/* Card 5: Bottom-Right 2 - 4-Bedroom Luxury Penthouses */}
            <Link to="/apartments/4-bedroom" className="curated-card curated-card-small">
              <div className="curated-card-img">
                <img
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
                  alt="4-Bedroom Luxury Penthouses"
                  loading="lazy"
                />
              </div>
              <div className="curated-card-caption">
                <h3 className="curated-card-title">4-Bedroom Luxury Penthouses</h3>
                <p className="curated-card-desc">Panoramic lagoon vistas, expansive terraces, and 24/7 dedicated turbine electricity</p>
              </div>
            </Link>
          </div>

          {/* Bottom Centered Explore Button (Matching Reference Image 2) */}
          <div className="curated-btn-wrap">
            <Link to="/properties" className="btn-curated-explore">
              EXPLORE ALL CURATED COLLECTIONS
            </Link>
          </div>
        </div>
      </section>

      {/* 3. ABOUT 1004 ESTATE SECTION (Joined from About Page) */}
      <section id="about" style={{ paddingTop: '70px', paddingBottom: '70px', background: '#fafafa', borderTop: '1px solid #f0f0f0' }}>
        <div className="container" style={{ maxWidth: '1060px' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <span className="explore-badge" style={{ background: 'var(--brand-orange)', color: '#ffffff', marginBottom: '14px', display: 'inline-block' }}>
              JK - CUBE MULTIVENTURES LIMITED
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '14px', color: '#111827' }}>
              Exclusive Living in 1004 Estate, Victoria Island
            </h2>
            <p style={{ color: '#6b7280', fontSize: '1.1rem', maxWidth: '760px', margin: '0 auto', lineHeight: '1.6' }}>
              Managed by <strong>JK - CUBE MULTIVENTURES LIMITED</strong> with lead agent <strong>Mrs. Joke Popoola</strong> — your premier on-site leasing agency for verified high-rise flats, executive suites, and luxury penthouses in 1004 Estate.
            </p>
          </div>

          {/* Story & Lifestyle Card */}
          <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e5e7eb', padding: '36px', marginBottom: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '1.45rem', fontWeight: '700', marginBottom: '14px', color: '#111827' }}>
              Why 1004 Estate, Victoria Island?
            </h3>
            <p style={{ color: '#374151', fontSize: '1rem', lineHeight: '1.8', marginBottom: '18px' }}>
              Situated right in the heart of Victoria Island along Ozumba Mbadiwe Way and Adetokunbo Ademola, <strong>1004 Estate</strong> is one of Lagos' most iconic and interconnected residential communities. Whether you are an expatriate, a financial services professional on VI, a tech leader, or a family seeking central luxury living, 1004 offers unmatched convenience without daily mainland traffic.
            </p>
            <p style={{ color: '#374151', fontSize: '1rem', lineHeight: '1.8', marginBottom: '28px' }}>
              Our agent desk ensures every apartment in our portfolio is fully serviced, verified, with guaranteed 24/7 dedicated electricity, treated water supply, high-speed fiber connectivity, and immediate physical inspection assistance.
            </p>

            {/* Key Advantages 3-Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              <div style={{ padding: '24px', background: '#f9fafb', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                <Zap size={24} color="#000000" style={{ marginBottom: '12px' }} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '6px' }}>24/7 Dedicated Power</h4>
                <p style={{ color: '#6b7280', fontSize: '0.88rem', lineHeight: '1.5' }}>
                  Independent turbine generators ensuring round-the-clock uninterrupted electricity for all flats.
                </p>
              </div>

              <div style={{ padding: '24px', background: '#f9fafb', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                <Shield size={24} color="#000000" style={{ marginBottom: '12px' }} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '6px' }}>Biometric Gate Security</h4>
                <p style={{ color: '#6b7280', fontSize: '0.88rem', lineHeight: '1.5' }}>
                  Biometric access cards, 24/7 patrol officers, CCTV monitoring, and strict guest verification.
                </p>
              </div>

              <div style={{ padding: '24px', background: '#f9fafb', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                <Sparkles size={24} color="#000000" style={{ marginBottom: '12px' }} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '6px' }}>Direct Agent Care</h4>
                <p style={{ color: '#6b7280', fontSize: '0.88rem', lineHeight: '1.5' }}>
                  Zero middleman drama. Direct landlord liaison, swift tenancy onboarding, and hassle-free renewals.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive 1004 Estate Map & Cluster Navigator */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ marginBottom: '16px' }}>
              <span className="explore-badge" style={{ background: '#f3f4f6', color: '#111827', marginBottom: '8px', display: 'inline-block' }}>
                Interactive Cluster Navigation Map
              </span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#111827', margin: 0 }}>
                Explore 1004 Estate Clusters & Landmarks
              </h3>
              <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '0.95rem' }}>
                Click on any cluster to view available apartment listings, swimming pools, tennis courts, and main security gates in Victoria Island.
              </p>
            </div>

            <EstateMap
              properties={properties}
              height="480px"
              showClusterControls={true}
            />
          </div>

          {/* Agent Spotlight Card */}
          <div style={{ background: 'var(--brand-charcoal)', color: '#ffffff', borderRadius: '24px', padding: '36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px', border: '1px solid #3d454e' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
                alt="Mrs. Joke Popoola"
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--brand-orange)' }}
              />
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--brand-orange)', fontWeight: '700' }}>
                  JK - CUBE MULTIVENTURES LIMITED • 1004 Concierge Desk
                </span>
                <h3 style={{ fontSize: '1.45rem', fontWeight: '800', margin: '4px 0 6px 0' }}>
                  Meet Mrs. Joke Popoola
                </h3>
                <p style={{ color: '#cbd5e1', fontSize: '0.92rem', maxWidth: '520px', lineHeight: '1.5', margin: 0 }}>
                  Managing agent with JK - CUBE MULTIVENTURES LIMITED. Ready to personally guide you through property tours, lease agreements, and move-in logistics in 1004 Estate.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => openBookingModal(null)}
                className="btn-add-listing"
                style={{ padding: '12px 24px', fontWeight: '700' }}
              >
                Schedule On-site Tour
              </button>
              <a
                href="https://wa.me/2347038462284?text=Hello%20Mrs.%20Popoola,%20I%20am%20interested%20in%20inspecting%20an%20apartment%20in%201004%20Estate,%20Victoria%20Island."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-add-listing"
                style={{ background: '#16a34a', color: '#ffffff', padding: '12px 20px', fontWeight: '700' }}
              >
                WhatsApp Agent
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 1004 ESTATE HIGHLIGHTS BAR */}
      <section style={{ background: '#ffffff', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6', padding: '40px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', textAlign: 'center' }}>
            <div style={{ padding: '16px' }}>
              <Zap size={24} color="#000000" style={{ margin: '0 auto 10px' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>24/7 Independent Power</h4>
              <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Dedicated estate gas turbine electricity without blackout worries.</p>
            </div>

            <div style={{ padding: '16px' }}>
              <Droplet size={24} color="#000000" style={{ margin: '0 auto 10px' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>Treated Water Supply</h4>
              <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Central industrial water treatment plants for every cluster.</p>
            </div>

            <div style={{ padding: '16px' }}>
              <Shield size={24} color="#000000" style={{ margin: '0 auto 10px' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>Biometric Gate Security</h4>
              <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Access card system and 24-hour uniformed security officers.</p>
            </div>

            <div style={{ padding: '16px' }}>
              <Sparkles size={24} color="#000000" style={{ margin: '0 auto 10px' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>Olympic Pools & Tennis</h4>
              <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Full sports recreation center, lawn tennis courts, and children play area.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
