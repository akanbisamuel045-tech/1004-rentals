import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Lock, Plus, Menu, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

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
          <Link to="/properties" className={`nav-pill-item ${isActive('/properties') ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Property <ChevronDown size={14} />
          </Link>
        </nav>

        {/* Right Nav Action Elements */}
        <div className="nav-actions">
          <Link to="/admin" className="nav-login-link">
            <Lock size={15} />
            <span>Login/Sign up</span>
          </Link>

          <Link to="/admin" className="btn-add-listing">
            Add listing
          </Link>

          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }} title="Menu">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
