import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import FilterBar from '../components/FilterBar';

export default function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || 'all',
    propertyType: searchParams.get('propertyType') || 'all',
    bedrooms: searchParams.get('bedrooms') || 'all',
    sort: searchParams.get('sort') || 'newest',
  });

  useEffect(() => {
    async function fetchLocations() {
      try {
        const res = await api.getLocations();
        setLocations(res.data || []);
      } catch (err) {
        console.error('Error fetching locations:', err);
      }
    }
    fetchLocations();
  }, []);

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      try {
        const res = await api.getProperties(filters);
        setProperties(res.data || []);
      } catch (err) {
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, [filters]);

  const handleReset = () => {
    setFilters({
      search: '',
      location: 'all',
      propertyType: 'all',
      bedrooms: 'all',
      sort: 'newest',
    });
    setSearchParams({});
  };

  return (
    <div className="section" style={{ paddingTop: '40px' }}>
      <div className="container">
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>Available Rentals in Lagos</h1>
          <p style={{ color: '#64748b' }}>
            Showing {properties.length} verified apartments, flats, and duplexes ready for occupancy
          </p>
        </div>

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          onReset={handleReset}
          locations={locations}
        />

        {/* Listings Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b' }}>
            Loading properties...
          </div>
        ) : properties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No properties matched your search</h3>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>
              Try adjusting or resetting your filter criteria to see available listings.
            </p>
            <button onClick={handleReset} className="btn btn-primary">
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="property-grid">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
