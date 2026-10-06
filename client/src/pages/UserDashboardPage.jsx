import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar, Heart, User, LogOut, Clock, MapPin,
  CheckCircle2, AlertCircle, ArrowRight, Bed, Bath, Trash2, Edit2,
  MessageSquare, Phone, ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { formatPriceNGN } from '../components/PropertyCard';

export default function UserDashboardPage() {
  const { user, logout, updateProfile, openBookingModal } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'saved' | 'enquiries' | 'profile'
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [viewings, setViewings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Redirect to home if logged out
  useEffect(() => {
    if (!user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const [bRes, fRes, eRes, vRes] = await Promise.allSettled([
        api.getMyBookings(),
        api.getMyFavorites(),
        api.getMyEnquiries(),
        api.getMyViewings()
      ]);
      if (bRes.status === 'fulfilled') setBookings(bRes.value?.data || []);
      if (fRes.status === 'fulfilled') setFavorites(fRes.value?.data || []);
      if (eRes.status === 'fulfilled') setEnquiries(eRes.value?.data || []);
      if (vRes.status === 'fulfilled') setViewings(vRes.value?.data || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name || '', phone: user.phone || '' });
      loadUserData();
    }
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this inspection booking?')) return;
    try {
      await api.updateBookingStatus(bookingId, 'CANCELLED');
      loadUserData();
    } catch (err) {
      alert('Failed to cancel booking');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess('');
    setProfileError('');
    try {
      await updateProfile(profileForm);
      setProfileSuccess('Profile updated successfully!');
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="section" style={{ paddingTop: '32px' }}>
      <div className="container">
        
        {/* User Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--brand-orange)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
              JK - CUBE MULTIVENTURES LIMITED • Client Portal
            </span>
            <h1 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.4rem)', fontWeight: '800', letterSpacing: '-0.03em', marginTop: '4px' }}>
              Welcome, {user.name}
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
              Manage your apartment bookings, saved favorites, and personal details.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => openBookingModal(null)}
              className="btn-add-listing"
            >
              <Calendar size={16} /> Book Inspection
            </button>
            <button
              onClick={logout}
              style={{
                background: '#f3f4f6',
                border: '1px solid #e5e7eb',
                padding: '10px 18px',
                borderRadius: '9999px',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <LogOut size={16} /> Log Out
            </button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="user-dashboard-tabs">
          <button
            onClick={() => setActiveTab('bookings')}
            style={{
              padding: '12px 20px',
              fontWeight: '600',
              fontSize: '0.95rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'bookings' ? '2.5px solid var(--brand-orange)' : '2.5px solid transparent',
              color: activeTab === 'bookings' ? 'var(--brand-orange)' : '#6b7280',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Calendar size={18} /> My Bookings ({bookings.length})
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            style={{
              padding: '12px 20px',
              fontWeight: '600',
              fontSize: '0.95rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'saved' ? '2.5px solid var(--brand-orange)' : '2.5px solid transparent',
              color: activeTab === 'saved' ? 'var(--brand-orange)' : '#6b7280',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Heart size={18} /> Saved Apartments ({favorites.length})
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            style={{
              padding: '12px 20px',
              fontWeight: '600',
              fontSize: '0.95rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'enquiries' ? '2.5px solid var(--brand-orange)' : '2.5px solid transparent',
              color: activeTab === 'enquiries' ? 'var(--brand-orange)' : '#6b7280',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <MessageSquare size={18} /> Inquiries & Viewings ({enquiries.length + viewings.length})
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '12px 20px',
              fontWeight: '600',
              fontSize: '0.95rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'profile' ? '2.5px solid var(--brand-orange)' : '2.5px solid transparent',
              color: activeTab === 'profile' ? 'var(--brand-orange)' : '#6b7280',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <User size={18} /> Account Profile
          </button>
        </div>

        {/* TAB 1: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
                Loading your bookings...
              </div>
            ) : bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '24px', border: '1px solid #e5e7eb' }}>
                <Calendar size={48} color="#9ca3af" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '8px' }}>No apartment bookings yet</h3>
                <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                  Browse our verified Lagos listings and schedule physical inspection visits with an agent.
                </p>
                <button onClick={() => openBookingModal(null)} className="btn-add-listing">
                  Book an Inspection Now
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="user-booking-card"
                  >
                    <img
                      src={booking.propertyImage}
                      alt={booking.propertyTitle}
                      style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '12px' }}
                    />

                    <div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                        <span
                          style={{
                            padding: '3px 10px',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            background:
                              booking.status === 'CONFIRMED' ? '#dcfce7' :
                              booking.status === 'CANCELLED' ? '#fee2e2' : '#fef3c7',
                            color:
                              booking.status === 'CONFIRMED' ? '#15803d' :
                              booking.status === 'CANCELLED' ? '#b91c1c' : '#b45309'
                          }}
                        >
                          {booking.status}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                          Booked on {new Date(booking.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '4px' }}>
                        {booking.propertyTitle}
                      </h3>

                      <div style={{ display: 'flex', gap: '16px', fontSize: '0.88rem', color: '#6b7280', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={14} /> Inspection: <strong>{booking.inspectionDate}</strong>
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={14} /> Time: <strong>{booking.timeSlot}</strong>
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={14} /> {booking.propertyLocation}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                      <Link
                        to={`/properties/${booking.propertyId}`}
                        style={{
                          padding: '8px 16px',
                          background: '#f3f4f6',
                          borderRadius: '9999px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          color: '#111111',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        View Apartment <ArrowRight size={14} />
                      </Link>

                      {booking.status === 'PENDING' && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            fontSize: '0.82rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SAVED APARTMENTS */}
        {activeTab === 'saved' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
                Loading saved apartments...
              </div>
            ) : favorites.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '24px', border: '1px solid #e5e7eb' }}>
                <Heart size={48} color="#9ca3af" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '8px' }}>No saved apartments</h3>
                <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                  Click the <strong>♡ Save</strong> button on any property listing to save it here for quick inspection booking.
                </p>
                <Link to="/properties" className="btn-add-listing">
                  Explore Lagos Listings
                </Link>
              </div>
            ) : (
              <div className="property-grid-clean">
                {favorites.map((prop) => (
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
                      </div>

                      <div className="clean-card-footer">
                        <div className="clean-card-price-wrap">
                          <span className="clean-price-num">{formatPriceNGN(prop.price)}</span>
                          <span className="clean-price-unit">/yr</span>
                        </div>

                        <button
                          onClick={() => openBookingModal(prop)}
                          className="btn-view-pill btn-book-pill"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: INQUIRIES & VIEWINGS */}
        {activeTab === 'enquiries' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
                Loading your enquiries and viewing requests...
              </div>
            ) : enquiries.length === 0 && viewings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '24px', border: '1px solid #e5e7eb' }}>
                <MessageSquare size={48} style={{ color: '#d1d5db', margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>No Active Inquiries Yet</h3>
                <p style={{ color: '#6b7280', maxWidth: '420px', margin: '0 auto 20px', fontSize: '0.92rem' }}>
                  Have questions about an apartment in 1004 Estate? Enquire on any property page or schedule an inspection to see your requests tracked here.
                </p>
                <Link to="/apartments" className="btn-add-listing" style={{ display: 'inline-flex' }}>
                  Browse 1004 Estate Apartments
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Enquiries List */}
                {enquiries.map((enq) => {
                  const statusColors = {
                    NEW: { bg: '#fef3c7', text: '#b45309', label: 'New Request' },
                    CONTACTED: { bg: '#dbeafe', text: '#1d4ed8', label: 'Agent Contacted' },
                    VIEWING_SCHEDULED: { bg: '#f3e8ff', text: '#7e22ce', label: 'Viewing Scheduled' },
                    NEGOTIATING: { bg: '#fef9c3', text: '#a16207', label: 'In Negotiation' },
                    BOOKED: { bg: '#dcfce7', text: '#15803d', label: 'Successfully Booked' },
                    CLOSED: { bg: '#f3f4f6', text: '#4b5563', label: 'Closed' }
                  };
                  const cfg = statusColors[enq.status] || { bg: '#f3f4f6', text: '#4b5563', label: enq.status };
                  const agentPhone = '2348023139377';
                  const waText = encodeURIComponent(
                    `Hello JK - CUBE MULTIVENTURES desk, I am following up on my enquiry #${enq.id} regarding "${enq.propertyTitle || '1004 Estate Apartment'}".`
                  );

                  return (
                    <div
                      key={enq.id}
                      style={{
                        background: '#ffffff',
                        borderRadius: '20px',
                        border: '1px solid #e5e7eb',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <span style={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Enquiry #{enq.id} • {new Date(enq.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#111827', margin: '4px 0 0 0' }}>
                            {enq.propertyTitle || 'General 1004 Estate Enquiry'}
                          </h4>
                        </div>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '4px 12px',
                            borderRadius: '9999px',
                            fontSize: '0.78rem',
                            fontWeight: '700',
                            background: cfg.bg,
                            color: cfg.text
                          }}
                        >
                          {cfg.label}
                        </span>
                      </div>

                      {enq.message && (
                        <div
                          style={{
                            background: '#f9fafb',
                            padding: '14px 16px',
                            borderRadius: '12px',
                            fontSize: '0.88rem',
                            color: '#4b5563',
                            borderLeft: '3px solid var(--brand-orange)'
                          }}
                        >
                          "{enq.message}"
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingTop: '8px', borderTop: '1px solid #f3f4f6' }}>
                        <div style={{ fontSize: '0.82rem', color: '#6b7280' }}>
                          Assigned to: <strong style={{ color: '#111827' }}>JK - CUBE Dedicated 1004 Desk</strong>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                          <a
                            href={`https://wa.me/${agentPhone}?text=${waText}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: '#25D366',
                              color: '#ffffff',
                              padding: '8px 14px',
                              borderRadius: '8px',
                              fontSize: '0.85rem',
                              fontWeight: '700',
                              textDecoration: 'none'
                            }}
                          >
                            <Phone size={14} /> WhatsApp Desk
                          </a>
                          {enq.propertyId && (
                            <Link
                              to={`/properties/${enq.propertyId}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: '#f3f4f6',
                                color: '#374151',
                                padding: '8px 14px',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                textDecoration: 'none'
                              }}
                            >
                              <ExternalLink size={14} /> View Apartment
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Viewings List */}
                {viewings.map((vw) => (
                  <div
                    key={vw.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '20px',
                      border: '1px solid #e5e7eb',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <span style={{ fontSize: '0.78rem', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Viewing Appointment #{vw.id}
                        </span>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#111827', margin: '4px 0 0 0' }}>
                          {vw.propertyTitle || '1004 Estate Physical Inspection'}
                        </h4>
                      </div>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          fontSize: '0.78rem',
                          fontWeight: '700',
                          background: vw.status === 'CONFIRMED' ? '#dcfce7' : '#fef3c7',
                          color: vw.status === 'CONFIRMED' ? '#15803d' : '#b45309'
                        }}
                      >
                        {vw.status || 'PENDING'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '0.88rem', color: '#4b5563' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={16} style={{ color: 'var(--brand-orange)' }} /> {vw.preferredDate || 'TBD'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={16} style={{ color: 'var(--brand-orange)' }} /> {vw.preferredTime || 'Morning (10:00 AM - 1:00 PM)'}
                      </span>
                    </div>

                    {vw.notes && (
                      <div style={{ background: '#f9fafb', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', color: '#6b7280' }}>
                        Note: {vw.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ACCOUNT PROFILE */}
        {activeTab === 'profile' && (
          <div style={{ background: '#ffffff', padding: '36px', borderRadius: '24px', border: '1px solid #e5e7eb', maxWidth: '640px' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '20px' }}>Personal Information</h3>

            {profileSuccess && (
              <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', color: '#15803d', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Read-only)</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="form-input"
                  style={{ background: '#f3f4f6', cursor: 'not-allowed' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+234 9876543210"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="form-input"
                />
              </div>

              <button
                type="submit"
                disabled={profileSaving}
                className="btn-add-listing"
                style={{ marginTop: '8px' }}
              >
                {profileSaving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
