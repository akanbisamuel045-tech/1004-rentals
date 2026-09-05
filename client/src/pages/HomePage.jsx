import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bed, Bath, Car, MapPin, Sparkles, Shield, Zap, Droplet } from 'lucide-react';
import { api } from '../services/api';
import { formatPriceNGN } from '../components/PropertyCard';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { openBookingModal } = useAuth();
  const [properties, setProperties] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All 1004 Units');
  const [activeType, setActiveType] = useState('All');
  const [loading, setLoading] = useState(true);

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

            {/* Right Column: Clean Large Typography, Cluster Pills, and Hostess Highlight Card */}
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
                      onClick={() => setActiveCategory(pill)}
                      className={`filter-pill-btn ${activeCategory === pill ? 'active' : ''}`}
                    >
                      {pill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dark Hostess Highlight Banner Card */}
              <div className="hero-dark-card">
                <div>
                  <span className="explore-badge">1004 Hostess Desk</span>
                  <h3 className="hero-dark-title">Direct 1004 Estate Rentals</h3>
                  <p className="hero-dark-desc">
                    Managed by lead hostess Mrs. Folashade Akanbi. 24/7 turbine power, treated water, swimming pools, tennis courts, and verified security.
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

      {/* 2. "FIND THE BEST PLACE IN 1004" SECTION */}
      <section className="listing-section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 className="section-title-clean">Curated 1004 Estate Apartments</h2>
              <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                Handpicked 1-bed studios, 2-bed flats, 3-bed family suites, and 4-bed penthouses
              </p>
            </div>

            {/* Quick Type Filter Tabs */}
            <div className="category-tabs-bar" style={{ marginBottom: 0 }}>
              {['All', 'Apartment', 'Penthouse', 'Duplex', 'Studio'].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveType(t)}
                  className={`filter-pill-btn ${activeType === t ? 'active' : ''}`}
                  style={{ padding: '6px 16px', fontSize: '0.85rem' }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
              Loading 1004 Estate listings...
            </div>
          ) : filteredProperties.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '24px', border: '1px solid #e5e7eb' }}>
              <h3>No apartments match this selection</h3>
              <p style={{ color: '#6b7280', marginTop: '6px' }}>Try selecting "All 1004 Units" or resetting your filter</p>
            </div>
          ) : (
            <div className="property-grid-clean">
              {filteredProperties.map((prop) => (
                <div key={prop.id} className="clean-card">
                  <div className="clean-card-img-wrap">
                    <img
                      src={prop.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'}
                      alt={prop.title}
                      loading="lazy"
                    />
                    <span className="clean-card-badge">{prop.location}</span>
                  </div>

                  <div className="clean-card-body">
                    <div className="clean-card-loc">
                      <MapPin size={13} />
                      <span>{prop.address || `${prop.location}, Victoria Island`}</span>
                    </div>

                    <h3 className="clean-card-title">
                      <Link to={`/properties/${prop.id || prop.slug}`}>
                        {prop.title}
                      </Link>
                    </h3>

                    <div className="clean-card-specs">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Bed size={15} /> {prop.bedrooms} Beds
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Bath size={15} /> {prop.bathrooms} Baths
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Car size={15} /> {prop.parkingSpaces || 1} Park
                      </span>
                    </div>

                    <div className="clean-card-footer">
                      <div>
                        <span className="clean-price-num">{formatPriceNGN(prop.price)}</span>
                        <span className="clean-price-unit">/yr</span>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => openBookingModal(prop)}
                          className="btn-view-pill"
                          style={{ background: '#000000', color: '#ffffff' }}
                        >
                          Book Now
                        </button>
                        <Link to={`/properties/${prop.id || prop.slug}`} className="btn-view-pill">
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. 1004 ESTATE HIGHLIGHTS BAR */}
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
