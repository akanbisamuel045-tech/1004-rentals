import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Bed, Bath, ArrowLeft, Heart, CheckCircle2, Shield, Phone, Mail, Zap, Droplet, User, Calendar, Share2, Layers } from 'lucide-react';
import { api } from '../services/api';
import { formatPriceNGN } from '../components/PropertyCard';
import { useAuth } from '../context/AuthContext';
import EstateMap from '../components/EstateMap';
import EnquiryModal from '../components/EnquiryModal';
import SEO from '../components/SEO';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const { user, isFavorite, toggleFavorite, openBookingModal } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Modals
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [showSpecsModal, setShowSpecsModal] = useState(false);

  useEffect(() => {
    async function loadProperty() {
      setLoading(true);
      try {
        const res = await api.getPropertyById(id);
        setProperty(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProperty();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFavoriteClick = async () => {
    if (property) {
      await toggleFavorite(property.id);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center', color: '#9ca3af' }}>
        Loading property details...
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <h2>Property Not Found</h2>
        <Link to="/properties" className="btn-add-listing" style={{ marginTop: '16px' }}>
          Back to Listings
        </Link>
      </div>
    );
  }

  const imgs = property.images && property.images.length > 0
    ? property.images
    : [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
      ];

  const totalPhotoCount = imgs.length >= 4 ? imgs.length + 12 : 16;
  const saved = isFavorite(property.id);

  return (
    <div className="detail-page-wrapper">
      <SEO
        title={property.title}
        description={`${property.bedrooms} Bed, ${property.bathrooms} Bath ${property.propertyType} in ${property.location}, 1004 Estate, Victoria Island. ${property.description?.slice(0, 150)}...`}
        image={imgs[0]}
        canonicalPath={`/properties/${property.id}`}
        property={property}
      />
      <div className="container">
        
        {/* Navigation Link */}
        <div style={{ marginBottom: '16px' }}>
          <Link to="/properties" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: '#6b7280', fontWeight: '500' }}>
            <ArrowLeft size={16} /> Back to listing
          </Link>
        </div>

        {/* 1. ASYMMETRIC 3-COLUMN MOSAIC GALLERY (Matches Reference Image) */}
        <div className="mosaic-gallery">
          {/* Main Large Photo */}
          <div className="gallery-cell">
            <img src={imgs[0]} alt={property.title} />
          </div>

          {/* Middle Column (2 Stacked Photos) */}
          <div className="gallery-col-stack">
            <div className="gallery-cell">
              <img src={imgs[1] || imgs[0]} alt="Interior view 1" />
            </div>
            <div className="gallery-cell">
              <img src={imgs[2] || imgs[0]} alt="Interior view 2" />
            </div>
          </div>

          {/* Right Column (Tall Photo with Black Button Overlay) */}
          <div className="gallery-cell">
            <img src={imgs[3] || imgs[0]} alt="Exterior view" />
            <button
              onClick={() => openBookingModal(property)}
              className="show-all-photos-btn"
            >
              <span>Book Inspection Now</span>
              <span>{totalPhotoCount} photos</span>
            </button>
          </div>
        </div>

        {/* 2. SUB-ACTION BAR (Save, Share, Location) */}
        <div className="detail-actions-bar">
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button
              onClick={handleFavoriteClick}
              className="action-link-btn"
              style={{ color: saved ? '#ef4444' : '#111111' }}
            >
              <Heart size={18} fill={saved ? '#ef4444' : 'none'} />
              <span>{saved ? 'Saved' : 'Save'}</span>
            </button>

            <button onClick={handleShare} className="action-link-btn">
              <Share2 size={18} />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>

          <div className="detail-location-text">
            <MapPin size={16} />
            <span>{property.address || `${property.location}, Lagos`}</span>
          </div>
        </div>

        {/* 3. SPLIT MAIN DETAILS SECTION (Matches Reference Image) */}
        <div className="detail-main-grid">
          
          {/* LEFT COLUMN: Price, Calculation Link, Agency Card */}
          <div>
            <div className="detail-price-huge">
              {formatPriceNGN(property.price)}
            </div>

            <button
              onClick={() => setShowFeeModal(true)}
              className="detail-underlined-link"
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              Calculate rental breakdown
            </button>

            {/* Estate Agency Pill Card & Booking CTA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="agency-card-pill">
                <div style={{ width: '36px', height: '36px', background: '#000000', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                    <line x1="4" y1="22" x2="4" y2="15"/>
                  </svg>
                </div>

                <div className="agency-info">
                  <span className="agency-label">Estate agency</span>
                  <span className="agency-name">
                    Realco Lagos 🛡️
                  </span>
                </div>

                <button
                  onClick={() => setIsEnquiryOpen(true)}
                  className="btn-contact-black"
                >
                  Contact Agent
                </button>
              </div>

              <div>
                <button
                  onClick={() => openBookingModal(property)}
                  className="btn-add-listing"
                  style={{ width: '100%', padding: '14px', justifyContent: 'center', fontSize: '0.95rem' }}
                >
                  <Calendar size={18} /> Book This Apartment Now
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Key Specs, Specs Link, Icons, Description */}
          <div>
            {/* Big Typography Specs */}
            <div className="detail-stats-row">
              <div className="stat-item-big">
                <span className="stat-num-big">{property.sizesqm || 233}</span>
                <span className="stat-unit-big">m²</span>
              </div>

              <div className="stat-item-big">
                <span className="stat-num-big">{property.totalFloors || 2}</span>
                <span className="stat-unit-big">floors</span>
              </div>

              <div className="stat-item-big">
                <span className="stat-num-big">{property.bedrooms}</span>
                <span className="stat-unit-big">beds</span>
              </div>

              <div className="stat-item-big">
                <span className="stat-num-big">{property.bathrooms}</span>
                <span className="stat-unit-big">baths</span>
              </div>
            </div>

            {/* Technical Specifications Link */}
            <button
              onClick={() => setShowSpecsModal(true)}
              className="detail-underlined-link"
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              All Technical specifications
            </button>

            {/* Feature Tag Icons */}
            <div className="detail-amenities-row">
              <div className="amenity-inline-item">
                <Zap size={18} color="#000000" />
                <span>24/7 Electricity</span>
              </div>
              <div className="amenity-inline-item">
                <Droplet size={18} color="#000000" />
                <span>Treated Water</span>
              </div>
              <div className="amenity-inline-item">
                <Shield size={18} color="#000000" />
                <span>Uniformed Security</span>
              </div>
              <div className="amenity-inline-item">
                <CheckCircle2 size={18} color="#000000" />
                <span>{property.furnishedStatus || 'Furnished'}</span>
              </div>
            </div>

            {/* Editorial Description Paragraph */}
            <p className="detail-desc-paragraph">
              {property.description}
            </p>
          </div>
        </div>

        {/* Interactive Location & Estate Map Section */}
        <div style={{ marginTop: '56px', paddingTop: '40px', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ marginBottom: '20px' }}>
            <span className="explore-badge" style={{ background: '#f3f4f6', color: '#111827', marginBottom: '8px', display: 'inline-block' }}>
              1004 Estate Map & Cluster Layout
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#111827', margin: 0 }}>
              {property.location} Pinpoint & Proximity Map
            </h3>
            <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '0.95rem' }}>
              Located in <strong>{property.location}</strong>, Victoria Island, Lagos. Explore walking distance to Five Cowries Creek lagoon, swimming pools, tennis courts, and security gates.
            </p>
          </div>

          <EstateMap
            properties={[property]}
            activeCluster={property.location}
            selectedPropertyId={property.id}
            height="440px"
            showClusterControls={true}
          />
        </div>

      </div>

      {/* MODAL: RENTAL BREAKDOWN CALCULATOR */}
      {showFeeModal && (
        <div className="modal-backdrop" onClick={() => setShowFeeModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Rental Breakdown</h3>
              <button className="modal-close" onClick={() => setShowFeeModal(false)}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ color: '#6b7280' }}>Base Annual Rent</span>
                <span style={{ fontWeight: '700' }}>{formatPriceNGN(property.price)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ color: '#6b7280' }}>Service Charge (Power/Estate)</span>
                <span style={{ fontWeight: '700' }}>{formatPriceNGN(property.serviceCharge || property.price * 0.12)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ color: '#6b7280' }}>Refundable Caution Deposit</span>
                <span style={{ fontWeight: '700' }}>{formatPriceNGN(property.cautionFee || property.price * 0.05)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ color: '#6b7280' }}>Agency & Legal Fee</span>
                <span style={{ fontWeight: '700' }}>{formatPriceNGN(property.agencyFee || property.price * 0.1)}</span>
              </div>
            </div>
            <button className="btn-black-block" onClick={() => { setShowFeeModal(false); openBookingModal(property); }}>
              Book Inspection Now
            </button>
          </div>
        </div>
      )}

      {/* MODAL: TECHNICAL SPECIFICATIONS */}
      {showSpecsModal && (
        <div className="modal-backdrop" onClick={() => setShowSpecsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Technical Specifications</h3>
              <button className="modal-close" onClick={() => setShowSpecsModal(false)}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
              <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '10px' }}>
                <small style={{ color: '#6b7280' }}>Property Type</small>
                <div style={{ fontWeight: '700' }}>{property.propertyType}</div>
              </div>
              <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '10px' }}>
                <small style={{ color: '#6b7280' }}>Bedrooms</small>
                <div style={{ fontWeight: '700' }}>{property.bedrooms} En-suite</div>
              </div>
              <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '10px' }}>
                <small style={{ color: '#6b7280' }}>Parking Spaces</small>
                <div style={{ fontWeight: '700' }}>{property.parkingSpaces || 2} Dedicated Bays</div>
              </div>
              <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '10px' }}>
                <small style={{ color: '#6b7280' }}>Water Supply</small>
                <div style={{ fontWeight: '700' }}>Industrial Borehole + Osmosis</div>
              </div>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '12px' }}>Included Amenities</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
              {property.amenities && property.amenities.map((a, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
                  <CheckCircle2 size={15} color="#16a34a" /> {a}
                </div>
              ))}
            </div>

            <button className="btn-black-block" onClick={() => setShowSpecsModal(false)}>
              Close Specifications
            </button>
          </div>
        </div>
      )}

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        property={property}
      />
    </div>
  );
}
