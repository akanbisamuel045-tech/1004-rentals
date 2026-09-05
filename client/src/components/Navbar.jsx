import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Lock, User, LogOut, ChevronDown, Calendar, Heart, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { user, logout, openAuthModal, openBookingModal } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="container nav-container">
        {/* Brand / Logo */}
        <Link to="/" className="nav-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span>Realco</span>
        </Link>

        {/* Center Pill Menu Segmented Controls */}
        <nav className="nav-pill-menu">
          <Link to="/" className={`nav-pill-item ${isActive('/') ? 'active' : ''}`}>
            <Home size={15} />
            <span>Home</span>
          </Link>
          <Link to="/about" className={`nav-pill-item ${isActive('/about') ? 'active' : ''}`}>
            About Us
          </Link>
          <Link to="/properties" className={`nav-pill-item ${isActive('/properties') ? 'active' : ''}`}>
            Listing
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
                      color: '#111111',
                      transition: 'background 0.15s'
                    }}
                    className="dropdown-item"
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
            /* Logged Out Login Button */
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
            className="btn-add-listing"
          >
            <Calendar size={15} /> Book Now
          </button>
        </div>
      </div>
    </header>
  );
}
