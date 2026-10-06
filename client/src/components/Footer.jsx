import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top-grid">
          {/* Brand Info */}
          <div>
            <div style={{ background: '#ffffff', display: 'inline-flex', padding: '6px 14px', borderRadius: '12px', marginBottom: '16px' }}>
              <img
                src="/jk-cube-logo.png"
                alt="JK - CUBE MULTIVENTURES LIMITED"
                style={{ height: '38px', width: 'auto', objectFit: 'contain' }}
              />
            </div>
            <p className="footer-brand-desc">
              <strong>JK - CUBE MULTIVENTURES LIMITED</strong> — Curated luxury apartments, maisonettes, and serviced flats exclusively in 1004 Estate, Victoria Island, Lagos.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">1004 Estate Hub</h4>
            <ul className="footer-link-list">
              <li><Link to="/1004-estate" className="footer-link-item">Estate Overview</Link></li>
              <li><Link to="/1004-estate/guide" className="footer-link-item">Resident Handbook</Link></li>
              <li><Link to="/1004-estate/rental-prices" className="footer-link-item">Current Rental Rates</Link></li>
              <li><Link to="/1004-estate/facilities" className="footer-link-item">Turbine Power & Facilities</Link></li>
              <li><Link to="/1004-estate/faqs" className="footer-link-item">Tenancy FAQs</Link></li>
              <li><Link to="/contact" className="footer-link-item">Contact Concierge</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="footer-heading">Apartment Categories</h4>
            <ul className="footer-link-list">
              <li><Link to="/apartments/available-now" className="footer-link-item" style={{ color: '#4ade80' }}>Available Now</Link></li>
              <li><Link to="/apartments/1-bedroom" className="footer-link-item">1-Bedroom Executive</Link></li>
              <li><Link to="/apartments/2-bedroom" className="footer-link-item">2-Bedroom Serviced</Link></li>
              <li><Link to="/apartments/3-bedroom" className="footer-link-item">3-Bedroom Flats</Link></li>
              <li><Link to="/apartments/3-bedroom-maisonette" className="footer-link-item">3-Bedroom Maisonettes</Link></li>
              <li><Link to="/apartments/4-bedroom" className="footer-link-item">4-Bedroom Executive</Link></li>
            </ul>
          </div>

          {/* 1004 Clusters */}
          <div>
            <h4 className="footer-heading">Estate Clusters</h4>
            <ul className="footer-link-list">
              <li><Link to="/apartments?location=1004+High-Rise+Towers" className="footer-link-item">High-Rise Towers</Link></li>
              <li><Link to="/apartments?location=1004+Cluster+A" className="footer-link-item">Cluster A (Recreation Wing)</Link></li>
              <li><Link to="/apartments?location=1004+Cluster+B" className="footer-link-item">Cluster B (Executive Wing)</Link></li>
              <li><Link to="/apartments?location=1004+Cluster+C" className="footer-link-item">Cluster C (Family Wing)</Link></li>
              <li><Link to="/apartments?location=1004+Cluster+D" className="footer-link-item">Cluster D (Family Wing)</Link></li>
            </ul>
          </div>

          {/* Contact Support */}
          <div>
            <h4 className="footer-heading">Agent Desk</h4>
            <ul className="footer-link-list">
              <li style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Suite 337, 3rd Floor, Ikeja Plaza, Ikeja, Lagos</li>
              <li style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: '600' }}>+234 703 846 2284</li>
              <li style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>jkcube85@gmail.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div>
            © {new Date().getFullYear()} JK - CUBE MULTIVENTURES LIMITED. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span style={{ cursor: 'pointer' }}>Estate Guidelines</span>
            <span style={{ cursor: 'pointer' }}>Inspection Terms</span>
            <span style={{ cursor: 'pointer' }}>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
