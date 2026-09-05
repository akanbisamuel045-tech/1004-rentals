import React from 'react';
import { Search, Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';

export default function FilterBar({ filters, setFilters, onReset, locations = [] }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="filter-bar">
      <div className="filter-inputs">
        <div className="form-group" style={{ minWidth: '220px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              name="search"
              placeholder="Search Lekki, Penthouse, etc..."
              value={filters.search || ''}
              onChange={handleChange}
              className="form-input"
              style={{ paddingLeft: '36px' }}
            />
            <Search
              size={16}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            />
          </div>
        </div>

        <div className="form-group">
          <select name="location" value={filters.location || 'all'} onChange={handleChange} className="form-select">
            <option value="all">All Locations</option>
            {locations.map((loc) => (
              <option key={loc.id || loc.slug} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <select name="propertyType" value={filters.propertyType || 'all'} onChange={handleChange} className="form-select">
            <option value="all">Property Type</option>
            <option value="Apartment">Apartment</option>
            <option value="Penthouse">Penthouse</option>
            <option value="Duplex">Duplex</option>
            <option value="Flat">Flat</option>
            <option value="Studio">Studio</option>
          </select>
        </div>

        <div className="form-group">
          <select name="bedrooms" value={filters.bedrooms || 'all'} onChange={handleChange} className="form-select">
            <option value="all">Bedrooms</option>
            <option value="1">1 Bedroom</option>
            <option value="2">2 Bedrooms</option>
            <option value="3">3 Bedrooms</option>
            <option value="4">4+ Bedrooms</option>
          </select>
        </div>

        <div className="form-group">
          <select name="sort" value={filters.sort || 'newest'} onChange={handleChange} className="form-select">
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="views">Most Popular</option>
          </select>
        </div>
      </div>

      <div>
        <button onClick={onReset} className="btn btn-secondary btn-sm" title="Reset all filters">
          <RotateCcw size={14} /> Reset
        </button>
      </div>
    </div>
  );
}
