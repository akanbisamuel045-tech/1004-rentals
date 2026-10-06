import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '100px 20px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ fontSize: '4rem', color: '#f36523', marginBottom: '20px' }}>404</h1>
      <h2 style={{ fontSize: '2rem', color: '#1a1a1a', marginBottom: '20px' }}>Page Not Found</h2>
      <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '40px', maxWidth: '500px' }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <Home size={18} />
        Back to Home
      </Link>
    </div>
  );
}
