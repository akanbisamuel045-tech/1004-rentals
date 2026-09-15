import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { authModalOpen, authModalMode, closeAuthModal, openAuthModal, login, register } = useAuth();

  const [mode, setMode] = useState(authModalMode || 'login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sync mode with context if changed
  React.useEffect(() => {
    if (authModalMode) setMode(authModalMode);
    setError('');
  }, [authModalMode, authModalOpen]);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.phone, formData.password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={closeAuthModal}>
      <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        {/* Brand Logo Header */}
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <img
            src="/jk-cube-logo.png"
            alt="JK - CUBE MULTIVENTURES LIMITED"
            style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
          />
        </div>

        {/* Header Tabs */}
        <div className="modal-header" style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => { setMode('login'); setError(''); }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.2rem',
                fontWeight: mode === 'login' ? '800' : '500',
                color: mode === 'login' ? 'var(--brand-charcoal)' : '#9ca3af',
                cursor: 'pointer',
                paddingBottom: '4px',
                borderBottom: mode === 'login' ? '2.5px solid var(--brand-orange)' : 'none',
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.2rem',
                fontWeight: mode === 'register' ? '800' : '500',
                color: mode === 'register' ? 'var(--brand-charcoal)' : '#9ca3af',
                cursor: 'pointer',
                paddingBottom: '4px',
                borderBottom: mode === 'register' ? '2.5px solid var(--brand-orange)' : 'none',
                marginLeft: '12px'
              }}
            >
              Create Account
            </button>
          </div>

          <button className="modal-close" onClick={closeAuthModal}>
            <X size={18} />
          </button>
        </div>

        <p style={{ color: '#6b7280', fontSize: '0.88rem', marginBottom: '20px' }}>
          {mode === 'login'
            ? 'Sign in to access your booked apartments, saved properties, and profile.'
            : 'Create a free account to book inspections and save favorite Lagos apartments.'}
        </p>

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    placeholder="Samuel Akanbi"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    style={{ paddingLeft: '38px' }}
                  />
                  <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="tel"
                    placeholder="+234 802 345 6789"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-input"
                    style={{ paddingLeft: '38px' }}
                  />
                  <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="akanbisamuel045@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="form-input"
                style={{ paddingLeft: '38px' }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="form-input"
                style={{ paddingLeft: '38px' }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-black-block"
            style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {loading ? 'Processing...' : (
              <>
                <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#6b7280' }}>
          {mode === 'login' ? (
            <span>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => { setMode('register'); setError(''); }}
                style={{ background: 'none', border: 'none', fontWeight: '700', color: 'var(--brand-orange)', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Sign up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                style={{ background: 'none', border: 'none', fontWeight: '700', color: 'var(--brand-orange)', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Sign in
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
