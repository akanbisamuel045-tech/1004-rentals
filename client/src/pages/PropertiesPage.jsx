import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { Search, MapPin, Bed, Bath, Car, ArrowLeft, Layers, X, Grid, Map as MapIcon, Columns } from 'lucide-react';
import { api } from '../services/api';
import { formatPriceNGN } from '../components/PropertyCard';
import { useAuth } from '../context/AuthContext';
import EstateMap from '../components/EstateMap';
import SEO from '../components/SEO';

export default function PropertiesPage() {
  const { openBookingModal } = useAuth();
  const [searchParams] = useSearchParams();
  const { categorySlug } = useParams();
  const categoryParam = searchParams.get('category') || categorySlug;

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLoc, setSelectedLoc] = useState(searchParams.get('location') || 'All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'split' | 'map'

  const clusters = ['All', '1004 High-Rise Towers', '1004 Cluster A', '1004 Cluster B', '1004 Cluster C & D'];
  const types = ['All', 'Apartment', 'Penthouse', 'Duplex', 'Studio'];

  const categoryTitles = {
    '1-bedroom': '1-Bedroom Executive Apartments',
    '2-bedroom': '2-Bedroom Serviced Flats',
    '3-bedroom': '3-Bedroom Family Flats',
    '3-bedroom-maisonette': '3-Bedroom Maisonettes',
    '4-bedroom': '4-Bedroom Luxury Penthouses'
  };

  const activeCategoryTitle = categoryParam ? categoryTitles[categoryParam] : null;

  useEffect(() => {
    async function loadProperties() {
      setLoading(true);
      try {
        const res = await api.getProperties();
        setProperties(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, []);

  const filtered = properties.filter((p) => {
    const matchesSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());

    const matchesType = selectedType === 'All' || p.propertyType?.toLowerCase() === selectedType.toLowerCase();
    const matchesLoc = selectedLoc === 'All' || p.location?.toLowerCase() === selectedLoc.toLowerCase();

    let matchesCategory = true;
    if (categoryParam === '1-bedroom') {
      matchesCategory = p.bedrooms === 1;
    } else if (categoryParam === '2-bedroom') {
      matchesCategory = p.bedrooms === 2;
    } else if (categoryParam === '3-bedroom') {
      matchesCategory = p.bedrooms === 3 && p.propertyType !== 'Maisonette' && !p.title.toLowerCase().includes('maisonette');
    } else if (categoryParam === '3-bedroom-maisonette') {
      matchesCategory = p.bedrooms === 3 && (p.propertyType === 'Maisonette' || p.propertyType === 'Duplex' || p.title.toLowerCase().includes('maisonette'));
    } else if (categoryParam === '4-bedroom') {
      matchesCategory = p.bedrooms >= 4;
    }

    return matchesSearch && matchesType && matchesLoc && matchesCategory;
  });

  return (
    <div className="section" style={{ paddingTop: '24px' }}>
      <SEO
        title={activeCategoryTitle || '1004 Estate Apartment Listings'}
        description={`Browse ${filtered.length} verified ${activeCategoryTitle ? activeCategoryTitle.toLowerCase() : 'apartments and flats'} for rent in 1004 Estate, Victoria Island, Lagos. 24/7 power, treated water, and on-site agent management.`}
        canonicalPath={categoryParam ? `/apartments/${categoryParam}` : '/properties'}
      />
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span className="explore-badge" style={{ background: '#f3f4f6', color: '#111111', display: 'inline-block' }}>
              Victoria Island, Lagos
            </span>
            {activeCategoryTitle && (
              <span className="badge" style={{ background: '#000000', color: '#ffffff', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={12} /> {activeCategoryTitle}
                <Link to="/properties" style={{ color: '#a1a1aa', display: 'flex', alignItems: 'center', marginLeft: '4px' }} title="Clear category filter">
                  <X size={13} />
                </Link>
              </span>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '2.4rem', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '8px' }}>
                {activeCategoryTitle ? activeCategoryTitle : '1004 Estate Apartment Listings'}
              </h1>
              <p style={{ color: '#6b7280', margin: 0 }}>
                Showing {filtered.length} verified {activeCategoryTitle ? activeCategoryTitle.toLowerCase() : 'apartments, flats, and penthouses'} in 1004 Estate
              </p>
            </div>

            {/* View Mode Segmented Switcher */}
            <div style={{
              display: 'flex',
              background: '#f3f4f6',
              padding: '4px',
              borderRadius: '9999px',
              border: '1px solid #e5e7eb'
            }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  background: viewMode === 'grid' ? '#000000' : 'transparent',
                  color: viewMode === 'grid' ? '#ffffff' : '#4b5563',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Grid size={14} /> Grid
              </button>
              <button
                onClick={() => setViewMode('split')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  background: viewMode === 'split' ? '#000000' : 'transparent',
                  color: viewMode === 'split' ? '#ffffff' : '#4b5563',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Columns size={14} /> Split View
              </button>
              <button
                onClick={() => setViewMode('map')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  border: 'none',
                  cursor: 'pointer',
                  background: viewMode === 'map' ? '#000000' : 'transparent',
                  color: viewMode === 'map' ? '#ffffff' : '#4b5563',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <MapIcon size={14} /> Cluster Map
              </button>
            </div>
          </div>
        </div>

        {/* Search & Cluster Filter Bar */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '20px', border: '1px solid #e5e7eb', marginBottom: '32px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '260px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                placeholder="Search High-Rise, Studio, Penthouse..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 16px 10px 38px',
                  borderRadius: '9999px',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {clusters.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedLoc(c)}
                className={`filter-pill-btn ${selectedLoc === c ? 'active' : ''}`}
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
              >
                {c === 'All' ? 'All Clusters' : c.replace('1004 ', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Display Modes */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
            Loading 1004 apartments...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '24px', border: '1px solid #e5e7eb' }}>
            <h3>No apartments found in this cluster</h3>
            <p style={{ color: '#6b7280', marginTop: '6px' }}>Try selecting "All Clusters" or resetting your search</p>
          </div>
        ) : viewMode === 'map' ? (
          /* FULL MAP VIEW */
          <div style={{ marginBottom: '40px' }}>
            <EstateMap
              properties={filtered}
              activeCluster={selectedLoc}
              height="620px"
              showClusterControls={true}
            />
          </div>
        ) : viewMode === 'split' ? (
          /* SPLIT VIEW (Cards + Sticky Map) */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px', marginBottom: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {filtered.map((prop) => (
                <div key={prop.id} className="clean-card" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                  <div className="clean-card-img-wrap" style={{ width: '200px', minWidth: '180px', flexShrink: 0 }}>
                    <img
                      src={prop.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'}
                      alt={prop.title}
                      loading="lazy"
                      style={{ height: '100%', objectFit: 'cover' }}
                    />
                    <span className="clean-card-badge">{prop.location}</span>
                  </div>

                  <div className="clean-card-body" style={{ flex: 1, padding: '16px' }}>
                    <h3 className="clean-card-title" style={{ fontSize: '1.05rem', marginBottom: '6px' }}>
                      <Link to={`/properties/${prop.id || prop.slug}`}>
                        {prop.title}
                      </Link>
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '10px' }}>
                      {prop.bedrooms} Bed • {prop.bathrooms} Bath • {prop.furnishedStatus}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="clean-price-num">{formatPriceNGN(prop.price)}<small style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '400' }}>/yr</small></span>
                      <Link to={`/properties/${prop.id || prop.slug}`} className="btn-view-pill">
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ position: 'sticky', top: '90px', height: 'fit-content' }}>
              <EstateMap
                properties={filtered}
                activeCluster={selectedLoc}
                height="620px"
                showClusterControls={true}
              />
            </div>
          </div>
        ) : (
          /* CLASSIC GRID VIEW */
          <div className="property-grid-clean">
            {filtered.map((prop) => (
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
                    <div className="clean-card-price-wrap">
                      <span className="clean-price-num">{formatPriceNGN(prop.price)}</span>
                      <span className="clean-price-unit">/yr</span>
                    </div>

                    <div className="clean-card-actions">
                      <button
                        onClick={() => openBookingModal(prop)}
                        className="btn-view-pill btn-book-pill"
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
    </div>
  );
}
