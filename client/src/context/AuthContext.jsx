import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('lagos_auth_token'));
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedBookingProperty, setSelectedBookingProperty] = useState(null);

  // Load user on startup
  useEffect(() => {
    async function loadUser() {
      const savedToken = localStorage.getItem('lagos_auth_token');
      if (savedToken) {
        try {
          const res = await api.getMe();
          if (res.user) {
            setUser(res.user);
            // Load favorites
            try {
              const favRes = await api.getMyFavorites();
              setFavoriteIds(favRes.favoriteIds || []);
            } catch (_) {}
          }
        } catch (err) {
          console.warn('Session expired or invalid, logging out:', err);
          logout();
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.token && res.user) {
      localStorage.setItem('lagos_auth_token', res.token);
      setToken(res.token);
      setUser(res.user);
      // Load favorites
      try {
        const favRes = await api.getMyFavorites();
        setFavoriteIds(favRes.favoriteIds || []);
      } catch (_) {}
      setAuthModalOpen(false);
      return res.user;
    }
  };

  const register = async (name, email, phone, password) => {
    const res = await api.register({ name, email, phone, password });
    if (res.token && res.user) {
      localStorage.setItem('lagos_auth_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setFavoriteIds([]);
      setAuthModalOpen(false);
      return res.user;
    }
  };

  const logout = () => {
    localStorage.removeItem('lagos_auth_token');
    setToken(null);
    setUser(null);
    setFavoriteIds([]);
  };

  const updateProfile = async (profileData) => {
    const res = await api.updateProfile(profileData);
    if (res.user) {
      setUser(res.user);
      return res.user;
    }
  };

  const toggleFavorite = async (propertyId) => {
    if (!user) {
      openAuthModal('login');
      return false;
    }
    try {
      const res = await api.toggleFavorite(propertyId);
      setFavoriteIds(res.favoriteIds || []);
      return res.isSaved;
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
      return false;
    }
  };

  const isFavorite = (propertyId) => {
    return favoriteIds.includes(propertyId);
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const openBookingModal = (property = null) => {
    setSelectedBookingProperty(property);
    setBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setBookingModalOpen(false);
    setSelectedBookingProperty(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        favoriteIds,
        toggleFavorite,
        isFavorite,
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        bookingModalOpen,
        selectedBookingProperty,
        openBookingModal,
        closeBookingModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
