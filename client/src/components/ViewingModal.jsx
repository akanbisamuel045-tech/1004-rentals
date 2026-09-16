import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function ViewingModal({ isOpen, onClose, property }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '10:00 AM - 12:00 PM',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !property) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.scheduleViewing({
        ...formData,
        propertyId: property.id,
        propertyTitle: property.title
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to schedule viewing inspection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.25rem', color: '#0f172a' }}>
            Book Physical Inspection
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
          <p style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0f766e' }}>{property.title}</p>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{property.address || property.location}</p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <CheckCircle2 size={48} color="#0f766e" style={{ margin: '0 auto 16px' }} />
            <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Inspection Requested!</h4>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '20px' }}>
              Your viewing request for <strong>{property.title}</strong> has been logged. Our leasing agent will call you to confirm gate entry and timing.
            </p>
            <button className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Your Name *</label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+234 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Preferred Date *</label>
                <input
                  type="date"
                  required
                  value={formData.preferredDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Time Slot *</label>
                <select
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
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
              <label className="form-label">Special Requests / Notes</label>
              <textarea
                rows={2}
                placeholder="Any questions or specific arrival notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="form-textarea"
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-accent btn-block">
              {loading ? 'Scheduling...' : <><Calendar size={16} /> Confirm Viewing Schedule</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
