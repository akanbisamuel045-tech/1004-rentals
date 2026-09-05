import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="nav-brand" style={{ color: '#5eead4', marginBottom: '16px' }}>
              <Home size={26} />
              <span>LAGOS</span>RENTALS
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.7', maxWidth: '340px' }}>
              Your trusted partner for verified, premium residential apartments, duplexes, and penthouses across Lagos Island and Mainland.
            </p>
          </div>

          <div>
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/properties">All Properties</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Support</Link></li>
              <li><Link to="/admin">Admin Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Popular Areas</h4>
            <ul className="footer-links">
              <li><Link to="/properties?location=Lekki+Phase+1">Lekki Phase 1</Link></li>
              <li><Link to="/properties?location=Ikoyi">Ikoyi Waterfront</Link></li>
              <li><Link to="/properties?location=Victoria+Island">Victoria Island</Link></li>
              <li><Link to="/properties?location=Ikeja+GRA">Ikeja GRA</Link></li>
              <li><Link to="/properties?location=Yaba">Yaba Tech Hub</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Contact Office</h4>
            <ul className="footer-links" style={{ gap: '14px' }}>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <MapPin size={18} color="#5eead4" /> Admiralty Way, Lekki Phase 1, Lagos
              </li>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Phone size={18} color="#5eead4" /> +234 802 345 6789
              </li>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Mail size={18} color="#5eead4" /> akanbisamuel045@gmail.com
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Lagos Rentals. Developed by Akanbi Samuel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
