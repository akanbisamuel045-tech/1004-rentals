import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, Bed, Bath, Car, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import { formatPriceNGN } from '../components/PropertyCard';

export default function PropertiesPage() {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedLoc, setSelectedLoc] = useState('All');

  const locations = ['All', 'Lekki Phase 1', 'Ikoyi', 'Victoria Island', 'Ikeja GRA', 'Yaba', 'Surulere'];
  const types = ['All', 'Apartment', 'Penthouse', 'Duplex', 'Studio', 'Flat'];

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
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'All' || p.propertyType?.toLowerCase() === selectedType.toLowerCase();
    const matchesLoc = selectedLoc === 'All' || p.location?.toLowerCase() === selectedLoc.toLowerCase();
    return matchesSearch && matchesType && matchesLoc;
  });

  return (
    <div className="section" style={{ paddingTop: '24px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.4rem', fontWeight: '700', letterSpacing: '-0.03em', marginBottom: '8px' }}>
            Property Listings
          </h1>
          <p style={{ color: '#6b7280' }}>
            Showing {filtered.length} verified available properties in Lagos
          </p>
        </div>

        {/* Search & Minimalist Filter Bar */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '20px', border: '1px solid #e5e7eb', marginBottom: '36px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '260px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                placeholder="Search Lekki, Penthouse, Duplex..."
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
            {locations.map((loc) => (
              <button
                key={loc}
                onClick={() => setSelectedLoc(loc)}
                className={`filter-pill-btn ${selectedLoc === loc ? 'active' : ''}`}
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
            Loading available properties...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '24px', border: '1px solid #e5e7eb' }}>
            <h3>No properties found</h3>
            <p style={{ color: '#6b7280', marginTop: '6px' }}>Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="property-grid-clean">
            {filtered.map((prop) => (
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
    </div>
  );
}
