import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sparkles, Shield, Key, Clock, ArrowRight, Building2, MapPin } from 'lucide-react';
import { api } from '../services/api';
import PropertyCard from '../components/PropertyCard';

export default function HomePage() {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick search state
  const [searchLocation, setSearchLocation] = useState('all');
  const [searchType, setSearchType] = useState('all');
  const [searchBedrooms, setSearchBedrooms] = useState('all');

  useEffect(() => {
    async function loadData() {
      try {
        const [propsRes, locsRes] = await Promise.all([
          api.getProperties({ featured: 'true' }),
          api.getLocations()
        ]);
        setFeaturedProperties(propsRes.data || []);
        setLocations(locsRes.data || []);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchLocation !== 'all') params.append('location', searchLocation);
    if (searchType !== 'all') params.append('propertyType', searchType);
    if (searchBedrooms !== 'all') params.append('bedrooms', searchBedrooms);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay-grid"></div>
        <div className="container hero-content">
          <div className="hero-badge">
            <Sparkles size={16} /> #1 Curated Lagos Rental Platform
          </div>

          <h1 className="hero-title">
            Find Your Dream Home in <span>Lagos</span>
          </h1>

          <p className="hero-subtitle">
            Browse verified luxury serviced apartments, penthouses, and duplexes in Lekki, Ikoyi, Victoria Island, Ikeja GRA & beyond.
          </p>
        </div>
      </section>

      {/* Floating Quick Search Card */}
      <div className="container">
        <div className="search-box-card">
          <form onSubmit={handleHeroSearch} className="search-grid">
            <div className="form-group">
              <label className="form-label">Location / Neighborhood</label>
              <select
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="form-select"
              >
                <option value="all">All Lagos Areas</option>
                {locations.map((loc) => (
                  <option key={loc.id || loc.slug} value={loc.name}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Property Type</label>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="form-select"
              >
                <option value="all">Any Property Type</option>
                <option value="Apartment">Apartment</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Duplex">Duplex</option>
                <option value="Flat">Flat</option>
                <option value="Studio">Studio</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Bedrooms</label>
              <select
                value={searchBedrooms}
                onChange={(e) => setSearchBedrooms(e.target.value)}
                className="form-select"
              >
                <option value="all">Any Bedrooms</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
              </select>
            </div>

            <div>
              <button type="submit" className="btn btn-primary btn-block" style={{ height: '44px' }}>
                <Search size={18} /> Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Featured Properties Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Listings</h2>
              <p className="section-desc">Handpicked verified properties with top amenities & guaranteed 24/7 power</p>
            </div>
            <Link to="/properties" className="btn btn-secondary">
              View All Listings <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
              Loading curated Lagos properties...
            </div>
          ) : (
            <div className="property-grid">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Neighborhoods Section */}
      <section className="section" style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Explore by Neighborhood</h2>
              <p className="section-desc">Find apartments in Lagos' most sought-after residential and commercial zones</p>
            </div>
          </div>

          <div className="location-grid">
            {locations.map((loc) => (
              <Link
                key={loc.id || loc.slug}
                to={`/properties?location=${encodeURIComponent(loc.name)}`}
                className="location-card"
              >
                <img src={loc.imageUrl} alt={loc.name} loading="lazy" />
                <div className="location-overlay">
                  <h3 className="location-name">{loc.name}</h3>
                  <span className="location-count">{loc.propertyCount || 1} available properties</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Lagos Rentals */}
      <section className="section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', display: 'block', marginBottom: '48px' }}>
            <h2 className="section-title">Why Rent With Lagos Rentals?</h2>
            <p className="section-desc">We eliminate the stress, fake listings, and hidden agent headaches in Lagos</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            <div style={{ background: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ccfbf1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f766e', marginBottom: '20px' }}>
                <Shield size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>100% Verified Properties</h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Every single apartment, flat, and penthouse undergoes strict physical verification before listing. No ghost properties.
              </p>
            </div>

            <div style={{ background: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', marginBottom: '20px' }}>
                <Clock size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Instant Inspection Booking</h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Schedule a physical inspection slot online in seconds. Our leasing consultants meet you directly on-site.
              </p>
            </div>

            <div style={{ background: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4338ca', marginBottom: '20px' }}>
                <Key size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Transparent Fee Breakdown</h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Clear breakdown of base rent, service charge, caution deposits, and legal fees. No surprise extra charges.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
