import React from 'react';
import { Shield, Users, Award, MapPin, CheckCircle, Zap, Droplet, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="section" style={{ paddingTop: '50px' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', background: '#ffffff', padding: '10px 24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <img src="/jk-cube-logo.png" alt="JK - CUBE MULTIVENTURES LIMITED" style={{ height: '48px', width: 'auto', objectFit: 'contain' }} />
          </div>
          <br />
          <span className="explore-badge" style={{ background: 'var(--brand-orange)', color: '#ffffff', marginBottom: '12px', display: 'inline-block' }}>
            Corporate Profile
          </span>
          <h1 style={{ fontSize: '2.6rem', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '16px', color: '#111827' }}>
            JK - CUBE MULTIVENTURES LIMITED
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.15rem', maxWidth: '760px', margin: '0 auto', lineHeight: '1.6' }}>
            Premier real estate agency managing executive residential rentals, high-rise flats, and serviced maisonettes in <strong>1004 Estate, Victoria Island, Lagos</strong>.
          </p>
        </div>

        {/* Story Section */}
        <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e5e7eb', padding: '40px', marginBottom: '40px', boxShadow: 'var(--shadow-subtle)' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '16px', color: '#111827' }}>The JK - CUBE Multiventures Standard</h2>
          <p style={{ color: '#374151', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '24px' }}>
            At <strong>JK - CUBE MULTIVENTURES LIMITED</strong>, we specialize in high-caliber residential leasing within Nigeria’s most iconic urban complexes. Situated right in the heart of Victoria Island along Ozumba Mbadiwe Way, <strong>1004 Estate</strong> represents the pinnacle of interconnected central city living.
          </p>

          <p style={{ color: '#374151', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '32px' }}>
            Our experienced on-site team ensures that every residence in our portfolio is meticulously vetted, fully serviced, and backed by guaranteed 24/7 turbine electricity, treated water, and dedicated concierge care.
          </p>

          {/* Key Advantages */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '24px', background: '#f9fafb', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
              <Zap size={26} color="var(--brand-orange)" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>24/7 Dedicated Power</h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Estate turbine electricity guaranteeing round-the-clock uninterrupted power across all towers.
              </p>
            </div>

            <div style={{ padding: '24px', background: '#f9fafb', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
              <Shield size={26} color="var(--brand-orange)" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>Gated Access Control</h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Biometric security cards, 24/7 armed gate officers, CCTV monitoring, and strict visitor clearance.
              </p>
            </div>

            <div style={{ padding: '24px', background: '#f9fafb', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
              <Sparkles size={26} color="var(--brand-orange)" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>Direct Agent Care</h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Zero intermediary delays. Direct landlord liaison, swift tenancy onboarding, and hassle-free lease renewals.
              </p>
            </div>
          </div>
        </div>

        {/* Corporate Concierge Card */}
        <div style={{ background: 'var(--brand-charcoal)', color: '#ffffff', borderRadius: '24px', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px', border: '1px solid #3d454e' }}>
          <div>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--brand-orange)', fontWeight: '700' }}>
              On-Site Concierge & Management
            </span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '4px 0 8px 0' }}>
              JK - CUBE MULTIVENTURES LIMITED
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', maxWidth: '520px', lineHeight: '1.6' }}>
              Corporate leasing and property management desk for <strong>1004 Estate</strong>. Available on-site daily in 1004 Estate for private apartment viewings, lease inquiries, and tenancy arrangements.
            </p>
          </div>
          <Link to="/contact" className="btn-add-listing" style={{ padding: '14px 28px', fontSize: '0.95rem' }}>
            Schedule an On-site Meeting
          </Link>
        </div>

      </div>
    </div>
  );
}
