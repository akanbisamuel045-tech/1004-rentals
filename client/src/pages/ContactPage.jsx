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
        propertyTitle: '1004 Estate General Inquiry'
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
          <span className="explore-badge" style={{ background: '#f3f4f6', color: '#111111', marginBottom: '8px', display: 'inline-block' }}>
            On-Site Leasing Desk
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '12px' }}>
            Contact 1004 Estate Hostess Desk
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.05rem' }}>
            Looking to inspect an apartment in 1004 Estate today or have questions about estate guidelines?
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px' }}>
          {/* Hostess Info */}
          <div style={{ background: '#ffffff', padding: '36px', borderRadius: '24px', border: '1px solid #e5e7eb', boxShadow: 'var(--shadow-subtle)' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>On-Site Office & Contact</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <MapPin size={22} color="#000000" />
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>Estate Location</h4>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                    1004 Estate, Adetokunbo Ademola / Ozumba Mbadiwe Way, Victoria Island, Lagos
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <Phone size={22} color="#000000" />
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>Direct Phone / WhatsApp</h4>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>+234 802 345 6789</p>
                  <small style={{ color: '#16a34a', fontWeight: '600' }}>Available 8:00 AM – 7:00 PM Daily</small>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <Mail size={22} color="#000000" />
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>Email Hostess</h4>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>akanbisamuel045@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Action */}
            <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #f3f4f6' }}>
              <a
                href="https://wa.me/2348023456789?text=Hello%20Mrs.%20Akanbi,%20I%20am%20interested%20in%20inspecting%20an%20apartment%20in%201004%20Estate,%20Victoria%20Island."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-add-listing"
                style={{ width: '100%', justifyContent: 'center', background: '#16a34a' }}
              >
                Chat with 1004 Hostess on WhatsApp
              </a>
            </div>
          </div>

          {/* Form */}
          <div style={{ background: '#ffffff', padding: '36px', borderRadius: '24px', border: '1px solid #e5e7eb', boxShadow: 'var(--shadow-subtle)' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '20px' }}>Send Inspection Message</h3>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <CheckCircle2 size={48} color="#16a34a" style={{ margin: '0 auto 16px' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Message Received!</h4>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '8px' }}>
                  Mrs. Folashade Akanbi or the on-site leasing team will reach out to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Your Full Name</label>
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
                  <label className="form-label">Phone Number (WhatsApp)</label>
                  <input
                    type="tel"
                    placeholder="+234 802 345 6789"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message / Preferred Flat Type</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="e.g. I am looking for a 2-bedroom serviced flat in Cluster A or High-Rise Tower..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-textarea"
                  />
                </div>

                <button type="submit" disabled={loading} className="btn-black-block">
                  {loading ? 'Sending...' : <><Send size={16} /> Send Message to Hostess</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
