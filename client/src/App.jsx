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

export default function App() {
  return (
    <AuthProvider>
      <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/properties/:id" element={<PropertyDetailPage />} />
            <Route path="/apartments" element={<PropertiesPage />} />
            <Route path="/apartments/:categorySlug" element={<PropertiesPage />} />
            <Route path="/dashboard" element={<UserDashboardPage />} />
            <Route path="/about" element={<Navigate to="/#about" replace />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Routes>
        </main>
        <Footer />
        <AuthModal />
        <BookingFlowModal />
      </div>
    </AuthProvider>
  );
}
