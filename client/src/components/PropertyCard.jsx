import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Car, ArrowRight, CheckCircle2 } from 'lucide-react';

export function formatPriceNGN(val) {
  if (!val) return '₦0';
  return '₦' + Number(val).toLocaleString('en-NG');
}

export default function PropertyCard({ property }) {
  const primaryImg = property.images && property.images.length > 0
    ? property.images[0]
    : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="property-card">
      <div className="card-img-wrapper">
        <img src={primaryImg} alt={property.title} className="card-img" loading="lazy" />
        <div className="card-badge-top">
          {property.isFeatured && (
            <span className="badge badge-featured">Featured</span>
          )}
          <span className="badge badge-type">{property.propertyType}</span>
        </div>
      </div>

      <div className="card-body">
        <div className="card-location">
          <MapPin size={14} />
          <span>{property.location}, Lagos</span>
        </div>

        <h3 className="card-title">
          <Link to={`/properties/${property.id || property.slug}`}>
            {property.title}
          </Link>
        </h3>

        <div className="card-specs">
          <div className="spec-item" title="Bedrooms">
            <Bed size={16} />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="spec-item" title="Bathrooms">
            <Bath size={16} />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="spec-item" title="Parking Spaces">
            <Car size={16} />
            <span>{property.parkingSpaces || 1} Parking</span>
          </div>
        </div>

        <div className="card-footer">
          <div className="price-tag">
            <span className="price-val">{formatPriceNGN(property.price)}</span>
            <span className="price-period">per annum</span>
          </div>

          <Link to={`/properties/${property.id || property.slug}`} className="btn btn-secondary btn-sm">
            View Details <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
