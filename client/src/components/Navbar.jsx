import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Phone, ShieldCheck, PlusCircle } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-brand">
          <Home className="brand-icon" size={28} />
          <span>LAGOS</span>RENTALS
        </Link>

        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/properties" className={`nav-link ${isActive('/properties') ? 'active' : ''}`}>
                Properties
              </Link>
            </li>
            <li>
              <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div className="nav-actions">
          <Link to="/admin" className="btn btn-secondary btn-sm">
            <ShieldCheck size={16} /> Admin Portal
          </Link>
          <Link to="/properties" className="btn btn-primary btn-sm">
            <Compass size={16} /> Explore Rentals
          </Link>
        </div>
      </div>
    </header>
  );
}
