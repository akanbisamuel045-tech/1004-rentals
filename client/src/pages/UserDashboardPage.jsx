import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar, Heart, User, LogOut, Clock, MapPin,
  CheckCircle2, AlertCircle, ArrowRight, Bed, Bath, Trash2, Edit2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { formatPriceNGN } from '../components/PropertyCard';

export default function UserDashboardPage() {
  const { user, logout, updateProfile, openBookingModal } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'saved' | 'profile'
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
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
      const [bRes, fRes] = await Promise.all([
        api.getMyBookings(),
        api.getMyFavorites(),
      ]);
      setBookings(bRes.data || []);
      setFavorites(fRes.data || []);
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
            <h1 style={{ fontSize: '2.4rem', fontWeight: '800', letterSpacing: '-0.03em', marginTop: '4px' }}>
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
        <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #e5e7eb', marginBottom: '32px' }}>
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
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '18px',
                      padding: '24px',
                      display: 'grid',
                      gridTemplateColumns: '120px 1fr auto',
                      gap: '24px',
                      alignItems: 'center'
                    }}
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
