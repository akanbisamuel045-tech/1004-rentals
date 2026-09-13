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
              <span>1004</span>Rentals
            </div>
            <p className="footer-brand-desc">
              Curated luxury apartments, penthouses, and serviced flats exclusively in 1004 Estate, Victoria Island, Lagos.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-link-list">
              <li><Link to="/" className="footer-link-item">Home</Link></li>
              <li><Link to="/#about" className="footer-link-item">About 1004 Estate</Link></li>
              <li><Link to="/properties" className="footer-link-item">1004 Apartments</Link></li>
              <li><Link to="/contact" className="footer-link-item">Contact Desk</Link></li>
              <li><Link to="/dashboard" className="footer-link-item">User Dashboard</Link></li>
              <li><Link to="/admin" className="footer-link-item" style={{ color: '#facc15', fontWeight: '600' }}>Hostess Admin Portal</Link></li>
            </ul>
          </div>

          {/* 1004 Clusters */}
          <div>
            <h4 className="footer-heading">1004 Clusters</h4>
            <ul className="footer-link-list">
              <li><Link to="/properties?location=1004+High-Rise+Towers" className="footer-link-item">High-Rise Towers</Link></li>
              <li><Link to="/properties?location=1004+Cluster+A" className="footer-link-item">Cluster A (Recreation)</Link></li>
              <li><Link to="/properties?location=1004+Cluster+B" className="footer-link-item">Cluster B (Executive)</Link></li>
              <li><Link to="/properties?location=1004+Cluster+C+%26+D" className="footer-link-item">Cluster C & D (Family Wing)</Link></li>
            </ul>
          </div>

          {/* Contact Support */}
          <div>
            <h4 className="footer-heading">Hostess Desk</h4>
            <ul className="footer-link-list">
              <li style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>1004 Estate, Adetokunbo Ademola, Victoria Island, Lagos</li>
              <li style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: '600' }}>+234 703 846 2284</li>
              <li style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>akanbisamuel045@gmail.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div>
            © {new Date().getFullYear()} 1004 Rentals, Victoria Island. Hosted by Mrs. Joke Popoola.
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
