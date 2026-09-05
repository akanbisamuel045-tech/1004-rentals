import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, Bed, Bath, Car, Maximize2, Shield, Calendar,
  MessageSquare, Phone, Mail, CheckCircle2, ArrowLeft,
  Share2, Eye, Zap, Layers
} from 'lucide-react';
import { api } from '../services/api';
import { formatPriceNGN } from '../components/PropertyCard';
import EnquiryModal from '../components/EnquiryModal';
import ViewingModal from '../components/ViewingModal';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImg, setSelectedImg] = useState(0);

  // Modals
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isViewingOpen, setIsViewingOpen] = useState(false);

  useEffect(() => {
    async function loadProperty() {
      setLoading(true);
      try {
        const res = await api.getPropertyById(id);
        setProperty(res.data);
      } catch (err) {
        setError(err.message || 'Failed to load property');
      } finally {
        setLoading(false);
      }
    }
    loadProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center', color: '#64748b' }}>
        Loading property details...
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '12px' }}>Property Not Found</h2>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>
          The rental listing you are looking for may have been moved or unlisted.
        </p>
        <Link to="/properties" className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Listings
        </Link>
      </div>
    );
  }

  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'];

  return (
    <div className="section" style={{ paddingTop: '32px' }}>
      <div className="container">
        {/* Breadcrumb & Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <Link to="/properties" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#64748b', fontWeight: '600', fontSize: '0.9rem' }}>
            <ArrowLeft size={16} /> Back to search results
          </Link>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#64748b' }}>
              <Eye size={16} /> {property.viewCount || 1} views
            </span>
          </div>
        </div>

        {/* Title Header */}
        <div className="property-detail-header">
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-featured">{property.propertyType}</span>
              <span className="badge badge-type" style={{ background: '#ccfbf1', color: '#0f766e' }}>
                {property.availabilityStatus || 'Available'}
              </span>
              <span className="badge badge-type" style={{ background: '#f1f5f9', color: '#475569' }}>
                {property.furnishedStatus || 'Unfurnished'}
              </span>
            </div>
            <h1 style={{ fontSize: '2.1rem', color: '#0f172a', marginBottom: '8px' }}>{property.title}</h1>
            <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '1rem' }}>
              <MapPin size={18} color="#0f766e" /> {property.address || `${property.location}, Lagos`}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f766e', fontFamily: 'var(--font-heading)' }}>
              {formatPriceNGN(property.price)}
            </span>
            <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b' }}>
              per annum
            </span>
          </div>
        </div>

        {/* Gallery */}
        <div className="gallery-grid">
          <div className="gallery-main">
            <img src={images[selectedImg]} alt={property.title} />
          </div>
          <div className="gallery-thumbs">
            {images.slice(0, 3).map((imgUrl, idx) => (
              <div
                key={idx}
                className="gallery-thumb"
                style={{
                  cursor: 'pointer',
                  border: selectedImg === idx ? '3px solid #0f766e' : 'none',
                  borderRadius: '8px'
                }}
                onClick={() => setSelectedImg(idx)}
              >
                <img src={imgUrl} alt={`Thumb ${idx + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Main Details & Sidebar */}
        <div className="property-layout">
          <div>
            {/* Overview & Key Specs */}
            <div className="detail-section">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Property Overview</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px' }}>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
                  <Bed size={22} color="#0f766e" style={{ margin: '0 auto 8px' }} />
                  <span style={{ display: 'block', fontWeight: '700', fontSize: '1.1rem' }}>{property.bedrooms}</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Bedrooms</span>
                </div>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
                  <Bath size={22} color="#0f766e" style={{ margin: '0 auto 8px' }} />
                  <span style={{ display: 'block', fontWeight: '700', fontSize: '1.1rem' }}>{property.bathrooms}</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Bathrooms</span>
                </div>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
                  <Car size={22} color="#0f766e" style={{ margin: '0 auto 8px' }} />
                  <span style={{ display: 'block', fontWeight: '700', fontSize: '1.1rem' }}>{property.parkingSpaces || 1}</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Parking Bays</span>
                </div>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
                  <Maximize2 size={22} color="#0f766e" style={{ margin: '0 auto 8px' }} />
                  <span style={{ display: 'block', fontWeight: '700', fontSize: '1.1rem' }}>{property.sizesqm ? `${property.sizesqm} m²` : 'Spacious'}</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Floor Size</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="detail-section">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>About this Property</h3>
              <p style={{ color: '#334155', fontSize: '1rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                {property.description}
              </p>
            </div>

            {/* Amenities Checklist */}
            <div className="detail-section">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Features & Amenities</h3>
              <div className="amenities-list-grid">
                {property.amenities && property.amenities.map((item, idx) => (
                  <div key={idx} className="amenity-chip">
                    <CheckCircle2 size={18} color="#0f766e" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cost & Fee Breakdown */}
            <div className="detail-section">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Fee Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b' }}>Annual Rent</span>
                  <span style={{ fontWeight: '700' }}>{formatPriceNGN(property.price)}</span>
                </div>
                {property.serviceCharge && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b' }}>Service Charge (Power/Estate Mgt)</span>
                    <span style={{ fontWeight: '700' }}>{formatPriceNGN(property.serviceCharge)}</span>
                  </div>
                )}
                {property.cautionFee && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b' }}>Refundable Caution Deposit</span>
                    <span style={{ fontWeight: '700' }}>{formatPriceNGN(property.cautionFee)}</span>
                  </div>
                )}
                {property.agencyFee && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ color: '#64748b' }}>Agency & Legal Fee</span>
                    <span style={{ fontWeight: '700' }}>{formatPriceNGN(property.agencyFee)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sticky Booking Sidebar */}
          <div>
            <div className="sidebar-sticky">
              <div className="detail-section" style={{ border: '2px solid #0f766e' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Take Action</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>
                  Ready to inspect this apartment or need more details from our agent?
                </p>

                <button
                  onClick={() => setIsViewingOpen(true)}
                  className="btn btn-accent btn-block btn-lg"
                  style={{ marginBottom: '12px' }}
                >
                  <Calendar size={18} /> Schedule Inspection
                </button>

                <button
                  onClick={() => setIsEnquiryOpen(true)}
                  className="btn btn-primary btn-block btn-lg"
                  style={{ marginBottom: '16px' }}
                >
                  <MessageSquare size={18} /> Send Inquiry
                </button>

                <a
                  href={`https://wa.me/2348023456789?text=Hi,%20I%20am%20interested%20in%20inspecting%20${encodeURIComponent(property.title)}%20(₦${property.price.toLocaleString()}/yr)%20on%20LagosRentals`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-block"
                  style={{ color: '#16a34a', borderColor: '#86efac' }}
                >
                  <Phone size={16} /> Chat on WhatsApp
                </a>
              </div>

              {/* Agent Profile */}
              <div className="detail-section">
                <h4 style={{ fontSize: '1rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                  Listing Agent
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <img
                    src={property.agent?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt="Agent"
                    style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{property.agent?.name || 'Samuel Akanbi'}</h4>
                    <span style={{ fontSize: '0.85rem', color: '#0f766e', fontWeight: '600' }}>Verified Lagos Leasing Agent</span>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} /> +234 802 345 6789
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={14} /> akanbisamuel045@gmail.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        property={property}
      />

      <ViewingModal
        isOpen={isViewingOpen}
        onClose={() => setIsViewingOpen(false)}
        property={property}
      />
    </div>
  );
}
