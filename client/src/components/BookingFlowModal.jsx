import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { formatPriceNGN } from './PropertyCard';

export default function BookingFlowModal() {
  const { user, bookingModalOpen, closeBookingModal, selectedBookingProperty, openAuthModal } = useAuth();

  const [properties, setProperties] = useState([]);
  const [selectedPropId, setSelectedPropId] = useState('');
  const [inspectionDate, setInspectionDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Fetch properties list if modal opens without a pre-selected property
  useEffect(() => {
    if (bookingModalOpen) {
      setSuccess(false);
      setError('');
      if (selectedBookingProperty) {
        setSelectedPropId(selectedBookingProperty.id);
      } else {
        api.getProperties().then((res) => {
          setProperties(res.data || []);
          if (res.data && res.data.length > 0) {
            setSelectedPropId(res.data[0].id);
          }
        });
      }
    }
  }, [bookingModalOpen, selectedBookingProperty]);

  if (!bookingModalOpen) return null;

  // If user is not logged in, prompt to login/signup
  if (!user) {
    return (
      <div className="modal-backdrop" onClick={closeBookingModal}>
        <div className="modal-content" style={{ maxWidth: '440px', textAlign: 'center', padding: '36px' }} onClick={(e) => e.stopPropagation()}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', background: '#fff7ed', border: '1px solid #fed7aa' }}>
            <img src="/jk-cube-icon.png" alt="JK - CUBE" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
          </div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '8px' }}>Sign In to Book</h3>
          <p style={{ color: '#6b7280', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '24px' }}>
            Sign in to schedule an in-person apartment inspection with a licensed <strong>JK - CUBE MULTIVENTURES LIMITED</strong> leasing agent.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => { closeBookingModal(); openAuthModal('login'); }}
              className="btn-black-block"
            >
              Sign In to Existing Account
            </button>
            <button
              onClick={() => { closeBookingModal(); openAuthModal('register'); }}
              style={{
                width: '100%',
                padding: '12px',
                background: '#f3f4f6',
                color: '#111111',
                borderRadius: '10px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Create New Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeProperty = selectedBookingProperty || properties.find((p) => p.id === selectedPropId);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!activeProperty) {
      setError('Please select an apartment to book.');
      return;
    }
    if (!inspectionDate) {
      setError('Please select a preferred inspection date.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.createBooking({
        propertyId: activeProperty.id,
        propertyTitle: activeProperty.title,
        userName: user.name,
        userEmail: user.email,
        userPhone: user.phone || '+234 800 000 0000',
        inspectionDate,
        timeSlot,
        notes
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to complete booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={closeBookingModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>
            Book Apartment Inspection
          </h3>
          <button className="modal-close" onClick={closeBookingModal}>
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <CheckCircle2 size={48} color="#16a34a" style={{ margin: '0 auto 16px' }} />
            <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '8px' }}>Booking Confirmed!</h4>
            <p style={{ color: '#6b7280', fontSize: '0.92rem', marginBottom: '24px' }}>
              Your inspection request for <strong>{activeProperty?.title}</strong> on <strong>{inspectionDate} ({timeSlot})</strong> has been saved to your account.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={closeBookingModal}
                className="btn-black-block"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit}>
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Property Selector if not already preselected */}
            {!selectedBookingProperty ? (
              <div className="form-group">
                <label className="form-label">Select Apartment to Inspect *</label>
                <select
                  value={selectedPropId}
                  onChange={(e) => setSelectedPropId(e.target.value)}
                  className="form-select"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.location}) — ₦{Number(p.price).toLocaleString()}/yr
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', marginBottom: '18px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#000000' }}>{activeProperty.title}</div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '2px' }}>
                  {activeProperty.location} • {formatPriceNGN(activeProperty.price)}/yr
                </div>
              </div>
            )}

            {/* Applicant Details (Auto-filled from user profile) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Applicant Name</label>
                <input
                  type="text"
                  disabled
                  value={user.name}
                  className="form-input"
                  style={{ background: '#f3f4f6', cursor: 'not-allowed' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="form-input"
                  style={{ background: '#f3f4f6', cursor: 'not-allowed' }}
                />
              </div>
            </div>

            {/* Date & Time Slot */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Inspection Date *</label>
                <input
                  type="date"
                  required
                  value={inspectionDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setInspectionDate(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Time Slot *</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="form-select"
                >
                  <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                  <option value="12:00 PM - 02:00 PM">12:00 PM - 02:00 PM</option>
                  <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                  <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Special Arrival Notes (Optional)</label>
              <textarea
                rows={2}
                placeholder="Any special requests or inquiries for the leasing agent"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-textarea"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-black-block"
              style={{ marginTop: '12px' }}
            >
              {loading ? 'Processing Booking...' : 'Confirm Apartment Booking'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
