import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import BookingFlowModal from './components/BookingFlowModal';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import UserDashboardPage from './pages/UserDashboardPage';
import ContactPage from './pages/ContactPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

import ApartmentRouteDispatcher from './components/ApartmentRouteDispatcher';
import EstateHubPage from './pages/EstateHubPage';

export default function App() {
  return (
    <AuthProvider>
      <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Core Estate Hub & Guides */}
            <Route path="/1004-estate" element={<EstateHubPage />} />
            <Route path="/1004-estate/:section" element={<EstateHubPage />} />
            <Route path="/guide" element={<Navigate to="/1004-estate/guide" replace />} />
            <Route path="/apartment-types" element={<Navigate to="/1004-estate/apartment-types" replace />} />
            <Route path="/rental-prices" element={<Navigate to="/1004-estate/rental-prices" replace />} />
            <Route path="/facilities" element={<Navigate to="/1004-estate/facilities" replace />} />
            <Route path="/location" element={<Navigate to="/1004-estate/location" replace />} />
            <Route path="/faqs" element={<Navigate to="/1004-estate/faqs" replace />} />

            {/* Apartments & Categories (Canonical URLs) */}
            <Route path="/apartments" element={<PropertiesPage />} />
            <Route path="/apartments/:categoryOrSlug" element={<ApartmentRouteDispatcher />} />

            {/* Backward-compatible legacy routes */}
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/properties/:id" element={<PropertyDetailPage />} />

            {/* User & Admin Portals */}
            <Route path="/dashboard" element={<UserDashboardPage />} />
            <Route path="/about" element={<Navigate to="/#about" replace />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
        <AuthModal />
        <BookingFlowModal />
      </div>
    </AuthProvider>
  );
}
