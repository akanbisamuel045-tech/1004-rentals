import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Car, ArrowRight, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { handleImageError } from '../utils/imageUtils';

export function formatPriceNGN(val) {
  if (!val) return '₦0';
  return '₦' + Number(val).toLocaleString('en-NG');
}

export default function PropertyCard({ property }) {
  const { isFavorite, toggleFavorite, openBookingModal } = useAuth();
  const saved = isFavorite(property.id);

  const primaryImg = property.images && property.images.length > 0
    ? property.images[0]
    : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(property.id);
  };

  const handleBookClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openBookingModal(property);
  };

  return (
    <div className="clean-card">
      <div className="clean-card-img-wrap">
        <img
          src={primaryImg}
          alt={property.title}
          loading="lazy"
          onError={handleImageError}
        />
        <span className="clean-card-badge">{property.propertyType}</span>

        {/* Floating Heart Button */}
        <button
          onClick={handleFavoriteClick}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(6px)',
            border: 'none',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: saved ? '#ef4444' : '#111111',
            transition: 'transform 0.15s'
          }}
          title={saved ? 'Remove from Saved' : 'Save Apartment'}
        >
          <Heart size={16} fill={saved ? '#ef4444' : 'none'} />
        </button>
      </div>

      <div className="clean-card-body">
        <div className="clean-card-loc">
          <MapPin size={13} />
          <span>{property.location}, Lagos</span>
        </div>

        <h3 className="clean-card-title">
          <Link to={`/properties/${property.id || property.slug}`}>
            {property.title}
          </Link>
        </h3>

        <div className="clean-card-specs">
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Bed size={15} /> {property.bedrooms} Beds
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Bath size={15} /> {property.bathrooms} Baths
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Car size={15} /> {property.parkingSpaces || 1} Park
          </span>
        </div>

        <div className="clean-card-footer">
          <div className="clean-card-price-wrap">
            <span className="clean-price-num">{formatPriceNGN(property.price)}</span>
            <span className="clean-price-unit">/yr</span>
          </div>

          <div className="clean-card-actions">
            <button onClick={handleBookClick} className="btn-view-pill btn-book-pill">
              Book Now
            </button>
            <Link to={`/properties/${property.id || property.slug}`} className="btn-view-pill">
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
