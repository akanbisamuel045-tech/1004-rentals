import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { Search, MapPin, Bed, Bath, Car, ArrowLeft, Layers, X, CheckCircle2, Shield, Calendar, ArrowUpDown } from 'lucide-react';
import { api } from '../services/api';
import { formatPriceNGN } from '../components/PropertyCard';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import { trackEvent } from '../utils/analytics';

const CATEGORY_CONFIG = {
  '1-bedroom': {
    title: '1-Bedroom Executive Apartments in 1004 Estate',
    shortIntro: 'Modern 1-bedroom executive flats and corporate studio apartments in 1004 Estate, Victoria Island. High-speed fiber Wi-Fi, 24/7 dedicated turbine power, and convenient elevator access.',
    filter: (p) => p.bedrooms === 1
  },
  '2-bedroom': {
    title: '2-Bedroom Serviced Flats in 1004 Estate',
    shortIntro: 'Spacious 2-bedroom flats in 1004 Estate Clusters A, B, C, D and High-Rise Towers. Move-in-ready serviced options with balcony views, swimming pool access, and covered parking bays.',
    filter: (p) => p.bedrooms === 2
  },
  '3-bedroom': {
    title: '3-Bedroom Family Flats in 1004 Estate',
    shortIntro: 'Classic single-level 3-bedroom family flats commanding panoramic views of Five Cowries Creek lagoon and the Victoria Island skyline with central industrial water treatment.',
    filter: (p) => p.bedrooms === 3 && p.propertyType !== 'Maisonette' && p.propertyType !== 'Duplex' && !p.title.toLowerCase().includes('maisonette')
  },
  '3-bedroom-maisonette': {
    title: '3-Bedroom Split-Level Maisonettes in 1004 Estate',
    shortIntro: 'Two-floor duplex maisonette apartments featuring high-volume living salons, internal private stairs, and family lounges nestled in quiet residential clusters.',
    filter: (p) => p.bedrooms === 3 && (p.propertyType === 'Maisonette' || p.propertyType === 'Duplex' || p.title.toLowerCase().includes('maisonette'))
  },
  '4-bedroom': {
    title: '4-Bedroom Executive Corner Flats in 1004 Estate',
    shortIntro: 'Expansive 4-bedroom corner apartments with all en-suite bedrooms, dual living salons, large balconies, and 3 covered parking bays for corporate directors and growing families.',
    filter: (p) => p.bedrooms >= 4
  },
  'available-now': {
    title: 'Available Now: Move-In Ready 1004 Estate Apartments',
    shortIntro: 'Apartments physically inspected, verified, and ready for immediate lease and move-in today. Managed on-site with verified 24/7 turbine electricity.',
    filter: (p) => (p.availabilityStatus || 'Available').toLowerCase() === 'available'
  },
  'furnished': {
    title: 'Furnished Serviced Apartments in 1004 Estate',
    shortIntro: 'Turnkey fully furnished apartments with contemporary Scandinavian decor, energy-efficient inverter ACs, fitted kitchens, smart TVs, and pre-installed fiber broadband.',
    filter: (p) => (p.furnishedStatus || '').toLowerCase() === 'furnished'
  },
  'unfurnished': {
    title: 'Unfurnished Apartments in 1004 Estate',
    shortIntro: 'Clean, freshly renovated unfurnished flats in 1004 Estate ready for your personalized furniture, bespoke interior setup, and family living.',
    filter: (p) => (p.furnishedStatus || '').toLowerCase() === 'unfurnished'
  },
  'serviced': {
    title: 'Serviced Apartments in 1004 Estate',
    shortIntro: 'Apartments with comprehensive estate servicing including 24/7 turbine electricity, central treated water supply, 24/7 gate security, and facilities maintenance.',
    filter: (p) => (p.furnishedStatus || '').toLowerCase() === 'furnished' || (p.serviceCharge && p.serviceCharge > 0)
  }
};

const CLUSTERS = ['All', '1004 High-Rise Towers', '1004 Cluster A', '1004 Cluster B', '1004 Cluster C', '1004 Cluster D'];

export default function PropertiesPage() {
  const { openBookingModal } = useAuth();
  const [searchParams] = useSearchParams();
  const { categorySlug, categoryOrSlug } = useParams();
  const categoryParam = categorySlug || categoryOrSlug || searchParams.get('category');

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCluster, setSelectedCluster] = useState(searchParams.get('cluster') || searchParams.get('location') || 'All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'price-asc' | 'price-desc'

  const currentCategoryConfig = categoryParam ? CATEGORY_CONFIG[categoryParam] : null;
  const pageTitle = currentCategoryConfig ? currentCategoryConfig.title : '1004 Estate Apartment Listings';
  const pageIntro = currentCategoryConfig
    ? currentCategoryConfig.shortIntro
    : 'Discover verified 1, 2, 3, and 4-bedroom flats, serviced apartments, and split-level maisonettes for rent exclusively in 1004 Estate, Victoria Island, Lagos by JK - CUBE MULTIVENTURES LIMITED.';

  useEffect(() => {
    async function loadProperties() {
      setLoading(true);
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

    trackEvent('apartment_category_view', {
      category: categoryParam || 'all_apartments',
      cluster: selectedCluster
    });
  }, [categoryParam, selectedCluster]);

  const filtered = properties.filter((p) => {
    const matchesSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.location && p.location.toLowerCase().includes(search.toLowerCase())) ||
      (p.cluster && p.cluster.toLowerCase().includes(search.toLowerCase())) ||
      (p.address && p.address.toLowerCase().includes(search.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));

    const matchesCluster = selectedCluster === 'All' ||
      (p.cluster && p.cluster.toLowerCase().includes(selectedCluster.replace('1004 ', '').toLowerCase())) ||
      (p.location && p.location.toLowerCase().includes(selectedCluster.replace('1004 ', '').toLowerCase()));

    const matchesCategory = currentCategoryConfig ? currentCategoryConfig.filter(p) : true;

    return matchesSearch && matchesCluster && matchesCategory;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const breadcrumbsItems = [
    { label: 'Apartments', path: '/apartments' },
    ...(categoryParam ? [{ label: currentCategoryConfig?.title.split(' in ')[0] || categoryParam, path: `/apartments/${categoryParam}` }] : [])
  ];

  return (
    <div className="section" style={{ paddingTop: '24px' }}>
      <SEO
        title={pageTitle}
        description={`${pageIntro} Browse ${filtered.length} verified listings in 1004 Estate with 24/7 electricity, industrial water, and professional management.`}
        canonicalPath={categoryParam ? `/apartments/${categoryParam}` : '/apartments'}
        breadcrumbs={breadcrumbsItems}
      />
      <div className="container">
        
        {/* Breadcrumbs Trail */}
        <Breadcrumbs items={breadcrumbsItems} />

        {/* Category Header & Editorial Intro */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <span className="explore-badge" style={{ background: '#f3f4f6', color: '#111111', display: 'inline-block' }}>
              1004 Estate • Victoria Island
            </span>

            {categoryParam && (
              <span className="badge" style={{ background: '#000000', color: '#ffffff', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={12} /> {categoryParam.replace('-', ' ').toUpperCase()}
                <Link to="/apartments" style={{ color: '#a1a1aa', display: 'flex', alignItems: 'center', marginLeft: '4px' }} title="Clear category filter">
                  <X size={13} />
                </Link>
              </span>
            )}

            {categoryParam === 'available-now' && (
              <span className="badge" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
                Immediate Move-In Ready
              </span>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ maxWidth: '820px' }}>
              <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '8px', color: '#111827' }}>
                {pageTitle}
              </h1>
              <p style={{ color: '#4b5563', fontSize: '0.98rem', lineHeight: '1.6', margin: '0 0 6px 0' }}>
                {pageIntro}
              </p>
              <div style={{ fontSize: '0.86rem', color: '#6b7280', fontWeight: '500' }}>
                Showing <strong>{filtered.length} verified</strong> {categoryParam ? 'matching' : 'available'} unit{filtered.length === 1 ? '' : 's'}
              </div>
            </div>

            {/* Cross-Link to 1004 Estate Guide */}
            <div>
              <Link
                to="/1004-estate/rental-prices"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.86rem',
                  fontWeight: '600',
                  color: 'var(--brand-orange)',
                  background: '#fff7ed',
                  padding: '8px 14px',
                  borderRadius: '9999px',
                  border: '1px solid #fed7aa',
                  textDecoration: 'none'
                }}
              >
                <span>View 1004 Rental Price Guide</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Category Switcher Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: '10px', marginBottom: '16px' }}>
          <Link
            to="/apartments"
            className={`filter-pill-btn ${!categoryParam ? 'active' : ''}`}
            style={{ textDecoration: 'none', padding: '6px 14px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
          >
            All Units
          </Link>
          <Link
            to="/apartments/available-now"
            className={`filter-pill-btn ${categoryParam === 'available-now' ? 'active' : ''}`}
            style={{ textDecoration: 'none', padding: '6px 14px', fontSize: '0.82rem', whiteSpace: 'nowrap', color: '#16a34a' }}
          >
            ● Available Now
          </Link>
          <Link
            to="/apartments/1-bedroom"
            className={`filter-pill-btn ${categoryParam === '1-bedroom' ? 'active' : ''}`}
            style={{ textDecoration: 'none', padding: '6px 14px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
          >
            1 Bedroom
          </Link>
          <Link
            to="/apartments/2-bedroom"
            className={`filter-pill-btn ${categoryParam === '2-bedroom' ? 'active' : ''}`}
            style={{ textDecoration: 'none', padding: '6px 14px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
          >
            2 Bedroom
          </Link>
          <Link
            to="/apartments/3-bedroom"
            className={`filter-pill-btn ${categoryParam === '3-bedroom' ? 'active' : ''}`}
            style={{ textDecoration: 'none', padding: '6px 14px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
          >
            3 Bedroom Flat
          </Link>
          <Link
            to="/apartments/3-bedroom-maisonette"
            className={`filter-pill-btn ${categoryParam === '3-bedroom-maisonette' ? 'active' : ''}`}
            style={{ textDecoration: 'none', padding: '6px 14px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
          >
            3 Bed Maisonette
          </Link>
          <Link
            to="/apartments/4-bedroom"
            className={`filter-pill-btn ${categoryParam === '4-bedroom' ? 'active' : ''}`}
            style={{ textDecoration: 'none', padding: '6px 14px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
          >
            4 Bedroom Flat
          </Link>
          <Link
            to="/apartments/furnished"
            className={`filter-pill-btn ${categoryParam === 'furnished' ? 'active' : ''}`}
            style={{ textDecoration: 'none', padding: '6px 14px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
          >
            Furnished
          </Link>
        </div>

        {/* Search, Cluster Filters & Sort Bar */}
        <div style={{ background: '#ffffff', padding: '16px', borderRadius: '18px', border: '1px solid #e5e7eb', marginBottom: '28px', display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '10px', flex: 1, minWidth: 'min(100%, 260px)' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                placeholder="Search High-Rise, Cluster, Block..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 16px 10px 38px',
                  borderRadius: '9999px',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            </div>
          </div>

          {/* Cluster Filter Buttons */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            {CLUSTERS.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCluster(c)}
                className={`filter-pill-btn ${selectedCluster === c ? 'active' : ''}`}
                style={{ padding: '6px 12px', fontSize: '0.82rem' }}
              >
                {c === 'All' ? 'All Clusters' : c.replace('1004 ', '')}
              </button>
            ))}

            {/* Sort Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '6px' }}>
              <ArrowUpDown size={14} color="#6b7280" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  fontSize: '0.82rem',
                  background: '#f9fafb',
                  color: '#374151',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
            Loading 1004 Estate verified apartments...
          </div>
        ) : sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '24px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>No apartments found in this category / cluster</h3>
            <p style={{ color: '#6b7280', margin: '0 0 16px 0' }}>Try switching clusters, clearing filters, or contacting our concierge desk directly for offline units.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link to="/apartments" className="btn-add-listing">
                View All 1004 Apartments
              </Link>
              <Link to="/contact" className="btn-add-listing" style={{ background: '#f3f4f6', color: '#111827', border: '1px solid #e5e7eb' }}>
                Contact Leasing Desk
              </Link>
            </div>
          </div>
        ) : (
          <div className="property-grid-clean">
            {sorted.map((prop) => {
              const detailUrl = `/apartments/${prop.slug || prop.id}`;
              const isAvailable = (prop.availabilityStatus || 'Available').toLowerCase() === 'available';
              const verifiedDate = prop.last_verified_at ? new Date(prop.last_verified_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Recent';

              return (
                <div key={prop.id} className="clean-card">
                  <div className="clean-card-img-wrap">
                    <img
                      src={prop.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'}
                      alt={`${prop.title} in 1004 Estate, Victoria Island`}
                      loading="lazy"
                    />
                    <span className="clean-card-badge">{prop.location || prop.cluster}</span>
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '10px',
                        background: 'rgba(0,0,0,0.75)',
                        backdropFilter: 'blur(4px)',
                        color: '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: '600',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Shield size={11} color="#4ade80" /> Verified: {verifiedDate}
                    </span>
                  </div>

                  <div className="clean-card-body">
                    <div className="clean-card-loc">
                      <MapPin size={13} />
                      <span>{prop.address || `${prop.location}, Victoria Island`}</span>
                    </div>

                    <h3 className="clean-card-title">
                      <Link to={detailUrl}>
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
                      <div className="clean-card-price-wrap">
                        <span className="clean-price-num">{formatPriceNGN(prop.price)}</span>
                        <span className="clean-price-unit">/yr</span>
                      </div>

                      <div className="clean-card-actions">
                        {isAvailable ? (
                          <button
                            onClick={() => openBookingModal(prop)}
                            className="btn-view-pill btn-book-pill"
                          >
                            Book Now
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#b45309', background: '#fef3c7', padding: '6px 10px', borderRadius: '9999px' }}>
                            {prop.availabilityStatus || 'Reserved'}
                          </span>
                        )}
                        <Link to={detailUrl} className="btn-view-pill">
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
