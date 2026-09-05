import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.submitEnquiry({
        ...formData,
        propertyTitle: 'General Contact Request'
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section" style={{ paddingTop: '50px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>Get in Touch</h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem' }}>
            Have questions about a property or need help finding an apartment in Lagos? Reach out to our leasing team.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px' }}>
          <div style={{ background: '#ffffff', padding: '36px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>Contact Information</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <MapPin size={22} color="#0f766e" />
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>Office Address</h4>
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Admiralty Way, Lekki Phase 1, Lagos, Nigeria</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <Phone size={22} color="#0f766e" />
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>Direct Call / WhatsApp</h4>
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>+234 802 345 6789</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <Mail size={22} color="#0f766e" />
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>Email Support</h4>
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>akanbisamuel045@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '36px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>Send Us a Message</h3>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <CheckCircle2 size={48} color="#0f766e" style={{ margin: '0 auto 16px' }} />
                <h4>Message Received!</h4>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '8px' }}>
                  Thank you for reaching out. We will respond within 2-4 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+234 802 345 6789"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Your Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we help you today?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-textarea"
                  />
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary btn-block">
                  {loading ? 'Sending...' : <><Send size={16} /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
