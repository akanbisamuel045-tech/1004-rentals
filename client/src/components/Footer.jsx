import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top-grid">
          {/* Brand Info */}
          <div>
            <div className="footer-brand-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span>Realco</span>
            </div>
            <p className="footer-brand-desc">
              Discover verified luxury serviced apartments, penthouses, and duplexes across prime Lagos residential zones.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-link-list">
              <li><Link to="/" className="footer-link-item">Home</Link></li>
              <li><Link to="/properties" className="footer-link-item">Properties</Link></li>
              <li><Link to="/about" className="footer-link-item">About Us</Link></li>
              <li><Link to="/contact" className="footer-link-item">Contact</Link></li>
              <li><Link to="/admin" className="footer-link-item">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Lagos Areas */}
          <div>
            <h4 className="footer-heading">Locations</h4>
            <ul className="footer-link-list">
              <li><Link to="/properties?location=Lekki+Phase+1" className="footer-link-item">Lekki Phase 1</Link></li>
              <li><Link to="/properties?location=Ikoyi" className="footer-link-item">Ikoyi Waterfront</Link></li>
              <li><Link to="/properties?location=Victoria+Island" className="footer-link-item">Victoria Island</Link></li>
              <li><Link to="/properties?location=Ikeja+GRA" className="footer-link-item">Ikeja GRA</Link></li>
              <li><Link to="/properties?location=Yaba" className="footer-link-item">Yaba</Link></li>
            </ul>
          </div>

          {/* Contact Support */}
          <div>
            <h4 className="footer-heading">Contact Desk</h4>
            <ul className="footer-link-list">
              <li style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Admiralty Way, Lekki Phase 1, Lagos</li>
              <li style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: '600' }}>+234 802 345 6789</li>
              <li style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>akanbisamuel045@gmail.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div>
            © {new Date().getFullYear()} Realco Lagos Rentals. Developed by Akanbi Samuel.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span style={{ cursor: 'pointer' }}>Terms of Service</span>
            <span style={{ cursor: 'pointer' }}>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
