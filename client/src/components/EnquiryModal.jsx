import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function EnquiryModal({ isOpen, onClose, property }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: property ? `Hi, I am interested in inquiring about ${property.title} located at ${property.location}. Please get back to me with more details.` : ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.submitEnquiry({
        ...formData,
        propertyId: property ? property.id : null,
        propertyTitle: property ? property.title : 'General Inquiry'
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.25rem', color: '#0f172a' }}>
            {property ? `Enquire about Property` : `Contact Leasing Agent`}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {property && (
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
            <p style={{ fontWeight: '700', fontSize: '0.95rem', color: '#0f766e' }}>{property.title}</p>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{property.location} • ₦{Number(property.price).toLocaleString()} / yr</p>
          </div>
        )}

        {success ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <CheckCircle2 size={48} color="#0f766e" style={{ margin: '0 auto 16px' }} />
            <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Enquiry Submitted!</h4>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '20px' }}>
              Thank you! Our Lagos leasing consultant will contact you via phone and email shortly.
            </p>
            <button className="btn btn-primary" onClick={onClose}>
              Done
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
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
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
              <label className="form-label">Phone Number (WhatsApp preferred)</label>
              <input
                type="tel"
                placeholder="+234 9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message *</label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="form-textarea"
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-block">
              {loading ? 'Submitting...' : <><Send size={16} /> Send Enquiry</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
