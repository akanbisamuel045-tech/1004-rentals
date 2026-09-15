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
              <strong>JK - CUBE MULTIVENTURES LIMITED</strong> — Curated luxury apartments, penthouses, and serviced flats exclusively in 1004 Estate, Victoria Island, Lagos.
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
              <li><Link to="/admin" className="footer-link-item" style={{ color: 'var(--brand-orange)', fontWeight: '700' }}>Agent Admin Portal</Link></li>
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
            © {new Date().getFullYear()} JK - CUBE MULTIVENTURES LIMITED. All rights reserved. Managed by Mrs. Joke Popoola.
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
