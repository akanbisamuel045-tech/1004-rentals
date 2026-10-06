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
        <Link to="/" className="nav-brand" onClick={() => setMobileMenuOpen(false)} title="JK - CUBE MULTIVENTURES LIMITED">
          <img
            src="/jk-cube-logo.png"
            alt="JK - CUBE MULTIVENTURES LIMITED"
            className="nav-brand-logo"
          />
        </Link>

        {/* Center Pill Menu Segmented Controls */}
        <nav className="nav-pill-menu">
          <Link to="/" className={`nav-pill-item ${isHomeActive ? 'active' : ''}`}>
            <Home size={15} />
            <span>Home</span>
          </Link>
          <Link to="/apartments" className={`nav-pill-item ${location.pathname.startsWith('/apartments') || location.pathname.startsWith('/properties') ? 'active' : ''}`}>
            Apartments
          </Link>
          <Link to="/apartments/available-now" className={`nav-pill-item ${location.pathname === '/apartments/available-now' ? 'active' : ''}`} style={{ color: '#16a34a' }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a', marginRight: '4px' }}></span>
            Available Now
          </Link>
          <Link to="/1004-estate" className={`nav-pill-item ${location.pathname.startsWith('/1004-estate') ? 'active' : ''}`}>
            1004 Estate Guide
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

          <Link
            to="/apartments"
            className={`nav-mobile-item ${location.pathname.startsWith('/apartments') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Building2 size={18} />
            <span>1004 Apartments</span>
          </Link>

          <Link
            to="/apartments/available-now"
            className={`nav-mobile-item ${location.pathname === '/apartments/available-now' ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#16a34a' }}
          >
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a', marginRight: '6px' }}></span>
            <span>Available Now</span>
          </Link>

          <Link
            to="/1004-estate"
            className={`nav-mobile-item ${location.pathname.startsWith('/1004-estate') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Info size={18} />
            <span>1004 Estate Guide</span>
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
