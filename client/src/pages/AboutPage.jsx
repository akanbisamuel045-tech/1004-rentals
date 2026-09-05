import React from 'react';
import { Shield, Users, Award, MapPin, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="section" style={{ paddingTop: '50px' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span className="badge badge-featured" style={{ marginBottom: '12px', display: 'inline-block' }}>
            About Lagos Rentals
          </span>
          <h1 style={{ fontSize: '2.6rem', marginBottom: '16px' }}>
            Redefining Apartment Rentals Across Lagos
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.15rem', maxWidth: '720px', margin: '0 auto' }}>
            We connect prospective tenants, working professionals, and families with verified, premium residential apartments and houses with zero hassle.
          </p>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '40px', marginBottom: '40px', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '16px' }}>Our Mission</h2>
          <p style={{ color: '#334155', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '24px' }}>
            Finding an apartment in Lagos has historically been plagued with middlemen issues, unverified listings, unexpected fees, and wasted inspection trips. Lagos Rentals was built by <strong>Akanbi Samuel</strong> to bring modern digital transparency, verified photography, and direct landlord/leasing agent communication to the Lagos real estate market.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginTop: '30px' }}>
            <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <Shield size={28} color="#0f766e" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Strict Verification</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Every listing is physically inspected for water treatment, generator power backup, and legal title.
              </p>
            </div>

            <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <Users size={28} color="#0f766e" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Dedicated Agents</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Professional leasing consultants who accompany you to on-site inspections without high inspection fees.
              </p>
            </div>

            <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <Award size={28} color="#0f766e" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Prime Neighborhoods</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Deep catalog covering Lekki Phase 1, Ikoyi, Victoria Island, Ikeja GRA, Maryland, Surulere, and Yaba.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
