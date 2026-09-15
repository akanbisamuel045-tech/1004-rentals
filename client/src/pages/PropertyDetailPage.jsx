import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Bed, Bath, ArrowLeft, Heart, CheckCircle2, Shield, Phone, Mail, Zap, Droplet, User, Calendar, Share2, Layers, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { api } from '../services/api';
import { formatPriceNGN } from '../components/PropertyCard';
import { useAuth } from '../context/AuthContext';
import { handleImageError, FALLBACK_IMAGES } from '../utils/imageUtils';
import EnquiryModal from '../components/EnquiryModal';
import SEO from '../components/SEO';

/* ─── Lightbox Component ─── */
function Lightbox({ images, startIndex, onClose }) {
  const [current, setCurrent] = useState(startIndex || 0);

  const prev = (e) => {
    e.stopPropagation();
    setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  };
  const next = (e) => {
    e.stopPropagation();
    setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
      if (e.key === 'ArrowRight') setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [images.length, onClose]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.95)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
      }}
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'fixed', top: '20px', right: '20px',
          background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%',
          width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#ffffff', zIndex: 10000
        }}
      >
        <X size={22} />
      </button>

      {/* Counter */}
      <div style={{ position: 'fixed', top: '22px', left: '50%', transform: 'translateX(-50%)', color: '#a1a1aa', fontSize: '0.88rem', fontWeight: '600', zIndex: 10000 }}>
        {current + 1} / {images.length}
      </div>

      {/* Main Image */}
      <div
        style={{ position: 'relative', width: '100%', maxWidth: '1100px', padding: '0 72px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={prev}
          style={{
            position: 'absolute', left: '12px',
            background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%',
            width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#ffffff'
          }}
        >
          <ChevronLeft size={26} />
        </button>

        <img
          src={images[current]}
          alt={`Photo ${current + 1}`}
          style={{
            maxWidth: '100%', maxHeight: '78vh',
            objectFit: 'contain', borderRadius: '12px',
            boxShadow: '0 24px 80px rgba(0,0,0,0.6)'
          }}
          onError={(e) => handleImageError(e, FALLBACK_IMAGES[0])}
        />

        <button
          onClick={next}
          style={{
            position: 'absolute', right: '12px',
            background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%',
            width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#ffffff'
          }}
        >
          <ChevronRight size={26} />
        </button>
      </div>

      {/* Thumbnail Strip */}
      <div
        style={{
          display: 'flex', gap: '8px', marginTop: '20px', overflowX: 'auto',
          padding: '4px 16px', maxWidth: '100vw',
          scrollbarWidth: 'thin'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {images.map((src, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            style={{
              flexShrink: 0, width: '72px', height: '54px', padding: 0,
              border: idx === current ? '2.5px solid #f0833a' : '2px solid transparent',
              borderRadius: '8px', overflow: 'hidden', cursor: 'pointer',
              opacity: idx === current ? 1 : 0.55, transition: 'all 0.15s'
            }}
          >
            <img
              src={src}
              alt={`Thumbnail ${idx + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => handleImageError(e, FALLBACK_IMAGES[0])}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PropertyDetailPage() {
  const { id } = useParams();
  const { user, isFavorite, toggleFavorite, openBookingModal } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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

  const openLightbox = (index = 0) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
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

  // ✅ Use the actual image count
  const totalPhotoCount = imgs.length;
  const saved = isFavorite(property.id);

  const displayDescription = property.description && property.description.trim().length > 0
    ? property.description
    : `A tastefully finished and fully serviced ${property.bedrooms}-bedroom apartment located in ${property.location}, 1004 Estate, Victoria Island, Lagos. Features include 24/7 uninterrupted estate turbine electricity, central treated water supply, biometric gated security, high-speed fiber connectivity, dedicated parking bays, and direct access to swimming pools and lawn tennis courts. Professionally managed by JK - CUBE MULTIVENTURES LIMITED with on-site concierge care by Mrs. Joke Popoola.`;

  return (
    <div className="detail-page-wrapper">
      <SEO
        title={property.title}
        description={`${property.bedrooms} Bed, ${property.bathrooms} Bath ${property.propertyType} in ${property.location}, 1004 Estate, Victoria Island. ${displayDescription.slice(0, 150)}...`}
        image={imgs[0]}
        canonicalPath={`/properties/${property.id}`}
        property={property}
      />
      <div className="container">
        
        {/* Navigation & Header */}
        <div style={{ marginBottom: '20px' }}>
          <Link to="/properties" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: '#6b7280', fontWeight: '500', marginBottom: '14px' }}>
            <ArrowLeft size={16} /> Back to listing
          </Link>

          {/* Prominent Apartment Name and Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <span className="explore-badge" style={{ background: 'var(--brand-orange)', color: '#ffffff', fontWeight: '700' }}>
              {property.location}
            </span>
            <span className="badge" style={{ background: '#f3f4f6', color: '#111827', fontWeight: '600' }}>
              {property.propertyType || 'Apartment'}
            </span>
            <span className="badge" style={{ background: '#ecfdf5', color: '#047857', fontWeight: '600' }}>
              {property.availabilityStatus || 'Available'}
            </span>
            <span className="badge" style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' }}>
              {property.bedrooms} Bed • {property.bathrooms} Bath
            </span>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: '800', letterSpacing: '-0.03em', color: 'var(--brand-charcoal)', margin: '0 0 10px 0', lineHeight: 1.25 }}>
            {property.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280', fontSize: '0.95rem' }}>
            <MapPin size={17} color="var(--brand-orange)" />
            <span>{property.address || `${property.location}, Victoria Island, Lagos`}</span>
          </div>
        </div>

        {/* 1. ASYMMETRIC 3-COLUMN MOSAIC GALLERY — Clickable */}
        <div className="mosaic-gallery">
          {/* Main Large Photo */}
          <div
            className="gallery-cell gallery-cell-clickable"
            onClick={() => openLightbox(0)}
            title="Click to view all photos"
          >
            <img
              src={imgs[0]}
              alt={property.title}
              onError={(e) => handleImageError(e, FALLBACK_IMAGES[0])}
            />
            <div className="gallery-zoom-hint"><ZoomIn size={18} /> View Photos</div>
          </div>

          {/* Middle Column (2 Stacked Photos) */}
          <div className="gallery-col-stack">
            <div
              className="gallery-cell gallery-cell-clickable"
              onClick={() => openLightbox(1)}
            >
              <img
                src={imgs[1] || imgs[0]}
                alt={`${property.title} Interior view 1`}
                onError={(e) => handleImageError(e, FALLBACK_IMAGES[1])}
              />
            </div>
            <div
              className="gallery-cell gallery-cell-clickable"
              onClick={() => openLightbox(2)}
            >
              <img
                src={imgs[2] || imgs[0]}
                alt={`${property.title} Interior view 2`}
                onError={(e) => handleImageError(e, FALLBACK_IMAGES[2])}
              />
            </div>
          </div>

          {/* Right Column (Tall Photo with Button Overlay) */}
          <div
            className="gallery-cell gallery-cell-clickable"
            onClick={() => openLightbox(3)}
          >
            <img
              src={imgs[3] || imgs[0]}
              alt={`${property.title} Exterior view`}
              onError={(e) => handleImageError(e, FALLBACK_IMAGES[3])}
            />
            <button
              onClick={(e) => { e.stopPropagation(); openLightbox(0); }}
              className="show-all-photos-btn"
            >
              <span>View All Photos</span>
              <span>{totalPhotoCount} {totalPhotoCount === 1 ? 'photo' : 'photos'}</span>
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

            <button onClick={() => openLightbox(0)} className="action-link-btn">
              <ZoomIn size={18} />
              <span>All {totalPhotoCount} Photos</span>
            </button>
          </div>

          <div className="detail-location-text">
            <MapPin size={16} />
            <span>{property.address || `${property.location}, Victoria Island, Lagos`}</span>
          </div>
        </div>

        {/* 3. SPLIT MAIN DETAILS SECTION */}
        <div className="detail-main-grid">
          
          {/* LEFT COLUMN: Price, Calculation Link, Agency Card */}
          <div>
            <div className="detail-price-huge">
              {formatPriceNGN(property.price)}
              <small style={{ fontSize: '1rem', color: '#6b7280', fontWeight: '500', marginLeft: '6px' }}>/yr</small>
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
              <div className="agency-card-pill" style={{ border: '1px solid #fed7aa', background: '#fffaf5' }}>
                <div style={{ width: '40px', height: '40px', background: '#ffffff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #fed7aa' }}>
                  <img src="/jk-cube-icon.png" alt="JK - CUBE" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                </div>

                <div className="agency-info">
                  <span className="agency-label">Managing Agency</span>
                  <span className="agency-name" style={{ color: '#111827', fontWeight: '700' }}>
                    JK - CUBE MULTIVENTURES LIMITED
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                    Lead Agent: Mrs. Joke Popoola
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
                <span className="stat-num-big">{property.sizesqm || 120}</span>
                <span className="stat-unit-big">m²</span>
              </div>

              <div className="stat-item-big">
                <span className="stat-num-big">{property.totalFloors || 7}</span>
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
                <Zap size={18} color="var(--brand-orange)" />
                <span>24/7 Dedicated Turbine Electricity</span>
              </div>
              <div className="amenity-inline-item">
                <Droplet size={18} color="var(--brand-orange)" />
                <span>Treated Water</span>
              </div>
              <div className="amenity-inline-item">
                <Shield size={18} color="var(--brand-orange)" />
                <span>Uniformed Gate Security</span>
              </div>
              <div className="amenity-inline-item">
                <CheckCircle2 size={18} color="var(--brand-orange)" />
                <span>{property.furnishedStatus || 'Furnished'}</span>
              </div>
            </div>

            {/* Editorial Description Paragraph */}
            <div style={{ marginTop: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '8px', color: '#111827' }}>
                Apartment Overview & Features
              </h3>
              <p className="detail-desc-paragraph" style={{ lineHeight: '1.8', color: '#374151', fontSize: '0.98rem' }}>
                {displayDescription}
              </p>
            </div>
          </div>
        </div>

        {/* 1004 Estate Community & Concierge Overview (Replaces map) */}
        <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #e5e7eb', padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span className="explore-badge" style={{ background: 'var(--brand-orange)', color: '#ffffff', marginBottom: '8px', display: 'inline-block' }}>
                1004 Estate, Victoria Island
              </span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#111827', margin: '4px 0' }}>
                Ready to Tour {property.title}?
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.92rem', maxWidth: '620px', margin: 0 }}>
                Mrs. Joke Popoola and the <strong>JK - CUBE MULTIVENTURES LIMITED</strong> team are on-site daily in 1004 Estate for private viewings and instant tenancy onboarding.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => openBookingModal(property)}
                className="btn-add-listing"
                style={{ padding: '12px 24px', fontWeight: '700' }}
              >
                Schedule In-Person Inspection
              </button>
              <a
                href={`https://wa.me/2347038462284?text=${encodeURIComponent(`Hello Mrs. Popoola, I would like to inspect ${property.title} in 1004 Estate.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-add-listing"
                style={{ background: '#16a34a', color: '#ffffff', padding: '12px 20px', fontWeight: '700' }}
              >
                WhatsApp Agent
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <Lightbox
          images={imgs}
          startIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}

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
