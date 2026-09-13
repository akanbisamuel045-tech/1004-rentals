import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Lock, User, LogOut, ChevronDown, Calendar, Heart, ShieldCheck, Menu, X, Info, Building2, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, openAuthModal, openBookingModal } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const isHomeActive = location.pathname === '/' && !location.hash;
  const isAboutActive = location.pathname === '/about' || (location.pathname === '/' && location.hash === '#about');

  const handleAboutClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById('about');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      window.history.pushState(null, '', '#about');
    } else {
      navigate('/#about');
    }
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        {/* Brand / Logo */}
        <Link to="/" className="nav-brand" onClick={() => setMobileMenuOpen(false)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span>1004</span>Rentals
        </Link>

        {/* Center Pill Menu Segmented Controls */}
        <nav className="nav-pill-menu">
          <Link to="/" className={`nav-pill-item ${isHomeActive ? 'active' : ''}`}>
            <Home size={15} />
            <span>Home</span>
          </Link>
          <a
            href="/#about"
            onClick={handleAboutClick}
            className={`nav-pill-item ${isAboutActive ? 'active' : ''}`}
            style={{ textDecoration: 'none', cursor: 'pointer' }}
          >
            About 1004
          </a>
          <Link to="/properties" className={`nav-pill-item ${isActive('/properties') ? 'active' : ''}`}>
            Apartments
          </Link>
          <Link to="/contact" className={`nav-pill-item ${isActive('/contact') ? 'active' : ''}`}>
            Contact
          </Link>
        </nav>

        {/* Right Nav Action Elements */}
        <div className="nav-actions">
          {user ? (
            /* Logged In User Dropdown */
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  background: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  padding: '8px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.88rem',
                  fontWeight: '600',
                  color: '#111111',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#000000', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700' }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span>{user.name.split(' ')[0]}</span>
                <ChevronDown size={14} />
              </button>

              {dropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    width: '210px',
                    padding: '8px',
                    zIndex: 200
                  }}
                  onClick={() => setDropdownOpen(false)}
                >
                  <Link
                    to="/dashboard"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      fontSize: '0.88rem',
                      fontWeight: '600',
                      color: '#111111'
                    }}
                  >
                    <Calendar size={16} /> My Bookings
                  </Link>

                  <Link
                    to="/dashboard"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      fontSize: '0.88rem',
                      fontWeight: '600',
                      color: '#111111'
                    }}
                  >
                    <Heart size={16} /> Saved Homes
                  </Link>

                  <Link
                    to="/dashboard"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      fontSize: '0.88rem',
                      fontWeight: '600',
                      color: '#111111'
                    }}
                  >
                    <User size={16} /> Account Profile
                  </Link>

                  {user.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        fontSize: '0.88rem',
                        fontWeight: '600',
                        color: '#0f766e'
                      }}
                    >
                      <ShieldCheck size={16} /> Admin Portal
                    </Link>
                  )}

                  <div style={{ height: '1px', background: '#f3f4f6', margin: '4px 0' }} />

                  <button
                    onClick={logout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      fontSize: '0.88rem',
                      fontWeight: '600',
                      color: '#ef4444',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="nav-login-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <Lock size={15} />
              <span>Login/Sign up</span>
            </button>
          )}

          {/* Top-Right "Book Now" Button */}
          <button
            onClick={() => openBookingModal(null)}
            className="btn-add-listing btn-desktop-only"
          >
            <Calendar size={15} /> Book Now
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="nav-mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="nav-mobile-drawer">
          <Link
            to="/"
            className={`nav-mobile-item ${isHomeActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Home size={18} />
            <span>Home</span>
          </Link>

          <a
            href="/#about"
            onClick={handleAboutClick}
            className={`nav-mobile-item ${isAboutActive ? 'active' : ''}`}
          >
            <Info size={18} />
            <span>About 1004</span>
          </a>

          <Link
            to="/properties"
            className={`nav-mobile-item ${isActive('/properties') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Building2 size={18} />
            <span>1004 Apartments</span>
          </Link>

          <Link
            to="/contact"
            className={`nav-mobile-item ${isActive('/contact') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Phone size={18} />
            <span>Contact Concierge</span>
          </Link>

          <div style={{ height: '1px', background: '#e5e7eb', margin: '6px 0' }} />

          {user ? (
            <>
              <Link
                to="/dashboard"
                className="nav-mobile-item"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Calendar size={18} />
                <span>My Bookings & Favorites</span>
              </Link>
              {user.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="nav-mobile-item"
                  style={{ color: '#0f766e', fontWeight: '600' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShieldCheck size={18} />
                  <span>Admin Control Center</span>
                </Link>
              )}
              <button
                onClick={() => { setMobileMenuOpen(false); logout(); }}
                className="nav-mobile-item"
                style={{ color: '#ef4444', background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
              >
                <LogOut size={18} />
                <span>Log Out ({user.name.split(' ')[0]})</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => { setMobileMenuOpen(false); openAuthModal('login'); }}
              className="nav-mobile-item"
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
            >
              <Lock size={18} />
              <span>Login / Sign up</span>
            </button>
          )}

          <button
            onClick={() => { setMobileMenuOpen(false); openBookingModal(null); }}
            className="btn-add-listing"
            style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
          >
            <Calendar size={16} /> Book Inspection Now
          </button>
        </div>
      )}
    </header>
  );
}
