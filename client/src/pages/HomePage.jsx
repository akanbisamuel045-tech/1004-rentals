import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bed, Bath, Car, MapPin, Check } from 'lucide-react';
import { api } from '../services/api';
import { formatPriceNGN } from '../components/PropertyCard';

export default function HomePage() {
  const [properties, setProperties] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Exclusive');
  const [activeType, setActiveType] = useState('All');
  const [loading, setLoading] = useState(true);

  const heroTags = ['House', 'Apartment', 'Residential'];
  const categoryPills = ['Exclusive', 'Property', 'Real-estate', 'Listing', 'Lekki', 'Ikoyi'];

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
    if (activeType === 'All') return true;
    return p.propertyType?.toLowerCase() === activeType.toLowerCase();
  });

  return (
    <div>
      {/* 1. HERO SECTION (Matches Reference Layout) */}
      <section className="hero-wrapper">
        <div className="container">
          <div className="hero-grid">
            
            {/* Left Column: Big Rounded Image with Floating Glass Tags */}
            <div className="hero-img-container">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Modern Architecture"
              />
              <div className="hero-floating-tags">
                {heroTags.map((tag, idx) => (
                  <span key={idx} className="tag-pill-glass">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Clean Large Typography, Pills, and Dark Highlight Card */}
            <div className="hero-right-col">
              <div>
                <h1 className="hero-main-title">
                  Discover your ideal property Connect with buyers
                </h1>

                {/* Filter Pill Chips */}
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

              {/* Dark Banner Card */}
              <div className="hero-dark-card">
                <div>
                  <span className="explore-badge">Explore</span>
                  <h3 className="hero-dark-title">Discover Property Listing</h3>
                  <p className="hero-dark-desc">
                    Our mission is to make your real estate experience as smooth and fulfilling as possible.
                  </p>
                  <Link
                    to="/properties"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      marginTop: '12px'
                    }}
                  >
                    Browse all listings <ArrowRight size={14} />
                  </Link>
                </div>

                <div className="hero-dark-thumb">
                  <img
                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80"
                    alt="Property Preview"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. "FIND THE BEST PLACE" SECTION */}
      <section className="listing-section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 className="section-title-clean">Find the best place</h2>
              <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
                Explore verified luxury properties in prime Lagos neighborhoods
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
              Loading listings...
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
                    <span className="clean-card-badge">{prop.propertyType}</span>
                  </div>

                  <div className="clean-card-body">
                    <div className="clean-card-loc">
                      <MapPin size={13} />
                      <span>{prop.location}, Lagos</span>
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

                      <Link to={`/properties/${prop.id || prop.slug}`} className="btn-view-pill">
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. CLEAN FOOTER */}
      <footer className="footer-clean">
        <div className="container footer-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '1.15rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Realco</span>
          </div>

          <div style={{ display: 'flex', gap: '24px', fontSize: '0.88rem', color: '#6b7280' }}>
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/properties">Listing</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/admin">Admin</Link>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
            © {new Date().getFullYear()} Realco Lagos Rentals. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
