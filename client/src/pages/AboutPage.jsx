import React from 'react';
import { Shield, Users, Award, MapPin, CheckCircle, Zap, Droplet, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="section" style={{ paddingTop: '50px' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span className="explore-badge" style={{ background: '#000000', color: '#ffffff', marginBottom: '12px', display: 'inline-block' }}>
            About 1004 Estate Rentals
          </span>
          <h1 style={{ fontSize: '2.6rem', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '16px' }}>
            Exclusive Apartments in 1004 Estate, Victoria Island
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.15rem', maxWidth: '720px', margin: '0 auto' }}>
            Managed by <strong>Mrs. Joke Popoola</strong>, your dedicated leasing hostess for verified high-rise flats, executive studios, and luxury penthouses in 1004 Estate.
          </p>
        </div>

        {/* Story Section */}
        <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e5e7eb', padding: '40px', marginBottom: '40px', boxShadow: 'var(--shadow-subtle)' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '16px' }}>Why 1004 Estate, Victoria Island?</h2>
          <p style={{ color: '#374151', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '24px' }}>
            Situated right in the heart of Victoria Island along Ozumba Mbadiwe Way and Adetokunbo Ademola, <strong>1004 Estate</strong> is one of Lagos' most prestigious and iconic residential communities. Whether you are an expatriate, a banker on Victoria Island, a tech executive, or a family seeking central luxury living, 1004 offers unmatched convenience.
          </p>

          <p style={{ color: '#374151', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '32px' }}>
            Our hostess desk ensures every apartment in our portfolio is fully serviced, furnished or semi-furnished, with guaranteed 24/7 electricity, industrial water purification, high-speed fiber internet, and immediate physical inspection assistance.
          </p>

          {/* Key Advantages */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '24px', background: '#f9fafb', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
              <Zap size={26} color="#000000" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>24/7 Dedicated Power</h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Independent turbine generators ensuring round-the-clock uninterrupted electricity for all flats.
              </p>
            </div>

            <div style={{ padding: '24px', background: '#f9fafb', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
              <Shield size={26} color="#000000" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>Gated Access Control</h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Biometric cards, 24/7 security patrol, CCTV monitoring, and strict visitor verification.
              </p>
            </div>

            <div style={{ padding: '24px', background: '#f9fafb', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
              <Sparkles size={26} color="#000000" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>Direct Hostess Care</h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Zero middleman drama. Direct landlord liaison, swift tenancy onboarding, and hassle-free renewals.
              </p>
            </div>
          </div>
        </div>

        {/* Hostess Card */}
        <div style={{ background: '#000000', color: '#ffffff', borderRadius: '24px', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px' }}>Meet Your 1004 Estate Hostess</h3>
            <p style={{ color: '#a1a1aa', fontSize: '0.95rem', maxWidth: '500px' }}>
              <strong>Mrs. Joke Popoola</strong> is on-site daily in 1004 Estate to guide you through property tours, lease agreements, and move-in logistics.
            </p>
          </div>
          <Link to="/contact" className="btn-add-listing" style={{ background: '#ffffff', color: '#000000', padding: '12px 24px' }}>
            Schedule an On-site Meeting
          </Link>
        </div>

      </div>
    </div>
  );
}
