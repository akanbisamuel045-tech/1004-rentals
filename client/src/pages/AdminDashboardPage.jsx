import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit3,
  MessageSquare,
  Calendar,
  Check,
  X,
  RefreshCw,
  Phone,
  Mail,
  Eye,
  ExternalLink,
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Layers,
  Filter,
  SlidersHorizontal,
  Home,
  UserCheck
} from 'lucide-react';
import { api } from '../services/api';
import { formatPriceNGN } from '../components/PropertyCard';
import { useAuth } from '../context/AuthContext';
import ImageUploader from '../components/ImageUploader';

const DEFAULT_AMENITIES = [
  '24/7 Uninterrupted Electricity (Independent Power Plant)',
  'Central Industrial Water Treatment',
  'Olympic-Sized Swimming Pools (2 Pools)',
  'Lawn Tennis & Basketball Courts',
  'High-Speed Fiber-Optic Wi-Fi',
  'Access Card Gate Security & CCTV',
  'Modern Fitted Kitchen (Gas Hob, Oven, Microwave)',
  'Dedicated Covered Parking Bays',
  'Passenger & Service Elevators',
  "Children's Play Park & Green Lawn",
  'Lagoon & City View Balconies'
];

const CLUSTERS = [
  '1004 High-Rise Towers',
  '1004 Cluster A',
  '1004 Cluster B',
  '1004 Cluster C & D'
];

const CATEGORIES = [
  { slug: '1-bedroom', label: '1-Bedroom Apartment' },
  { slug: '2-bedroom', label: '2-Bedroom Apartment' },
  { slug: '3-bedroom', label: '3-Bedroom Apartment' },
  { slug: '3-bedroom-maisonette', label: '3-Bedroom Maisonette' },
  { slug: '4-bedroom', label: '4-Bedroom Luxury Penthouse' }
];

export default function AdminDashboardPage() {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState('properties'); // 'properties' | 'bookings' | 'enquiries' | 'new-property'
  
  const [properties, setProperties] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter & Search in listings table
  const [clusterFilter, setClusterFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Editing Property State (Modal)
  const [editingProp, setEditingProp] = useState(null);
  const [editForm, setEditForm] = useState(null);

  // New Property Form State
  const [newProp, setNewProp] = useState({
    title: '',
    categorySlug: '2-bedroom',
    description: '',
    price: '',
    serviceCharge: '850000',
    cautionFee: '400000',
    agencyFee: '',
    location: '1004 Cluster A',
    propertyType: 'Apartment',
    bedrooms: '2',
    bathrooms: '2',
    toilets: '2',
    sizesqm: '120',
    totalFloors: '7',
    furnishedStatus: 'Furnished',
    availabilityStatus: 'Available',
    address: 'Block A3, Cluster A, 1004 Estate, Victoria Island, Lagos',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'],
    amenities: [
      '24/7 Uninterrupted Electricity (Independent Power Plant)',
      'Central Industrial Water Treatment',
      'High-Speed Fiber-Optic Wi-Fi',
      'Access Card Gate Security & CCTV'
    ],
    isFeatured: true
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, eRes, bRes, lRes, vRes] = await Promise.allSettled([
        api.getProperties(),
        api.getEnquiries(),
        api.getAllBookings(),
        api.getLocations(),
        api.getViewings()
      ]);

      if (pRes.status === 'fulfilled') setProperties(pRes.value.data || []);
      if (eRes.status === 'fulfilled') setEnquiries(eRes.value.data || []);
      
      // Combine user bookings and general viewing appointments
      let combinedBookings = [];
      if (bRes.status === 'fulfilled' && bRes.value?.data) {
        combinedBookings = [...bRes.value.data];
      }
      if (vRes.status === 'fulfilled' && vRes.value?.data) {
        const mappedViewings = (vRes.value.data || []).map((v) => ({
          id: v.id,
          userName: v.name,
          userPhone: v.phone,
          userEmail: v.email,
          propertyTitle: v.propertyTitle || '1004 Estate Inspection',
          inspectionDate: v.preferredDate,
          timeSlot: v.preferredTime,
          status: v.status || 'PENDING',
          notes: v.notes || '',
          isViewingForm: true,
          createdAt: v.createdAt
        }));
        // Merge without duplicates by ID
        const existingIds = new Set(combinedBookings.map((b) => b.id));
        mappedViewings.forEach((v) => {
          if (!existingIds.has(v.id)) combinedBookings.push(v);
        });
      }
      setBookings(combinedBookings);

      if (lRes.status === 'fulfilled') setLocations(lRes.value.data || []);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Quick Demo Admin Login
  const handleDemoAdminLogin = async () => {
    try {
      await login('akanbisamuel045@gmail.com', 'admin123');
      fetchData();
    } catch (err) {
      alert('Login error: ' + err.message);
    }
  };

  // Delete Property
  const handleDeleteProperty = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete listing:\n"${title}"?`)) return;
    try {
      await api.deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
      alert('Property deleted successfully');
    } catch (err) {
      alert('Failed to delete property: ' + err.message);
    }
  };

  // Inline Quick Toggle Status (Available <-> Reserved <-> Rented)
  const handleToggleStatus = async (prop, newStatus) => {
    try {
      await api.updateProperty(prop.id, { availabilityStatus: newStatus });
      setProperties((prev) =>
        prev.map((p) => (p.id === prop.id ? { ...p, availabilityStatus: newStatus } : p))
      );
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (prop) => {
    setEditingProp(prop);
    setEditForm({
      title: prop.title,
      price: prop.price,
      serviceCharge: prop.serviceCharge || '',
      cautionFee: prop.cautionFee || '',
      agencyFee: prop.agencyFee || '',
      availabilityStatus: prop.availabilityStatus || 'Available',
      furnishedStatus: prop.furnishedStatus || 'Furnished',
      location: prop.location || '1004 High-Rise Towers',
      propertyType: prop.propertyType || 'Apartment',
      bedrooms: prop.bedrooms || 2,
      bathrooms: prop.bathrooms || 2,
      sizesqm: prop.sizesqm || 120,
      description: prop.description || '',
      images: Array.isArray(prop.images) && prop.images.length > 0 ? prop.images : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'],
      amenities: prop.amenities || []
    });
  };

  // Submit Edit Modal
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await api.updateProperty(editingProp.id, {
        ...editForm,
        images: editForm.images && editForm.images.length > 0 ? editForm.images : editingProp.images
      });

      alert('Property updated successfully!');
      setEditingProp(null);
      fetchData();
    } catch (err) {
      alert('Failed to update: ' + err.message);
    }
  };

  // Update Booking Status
  const handleUpdateBookingStatus = async (id, status, isViewingForm) => {
    try {
      if (isViewingForm) {
        await api.updateViewingStatus(id, status);
      } else {
        await api.updateBookingStatus(id, status);
      }
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
    } catch (err) {
      alert('Failed to update booking status: ' + err.message);
    }
  };

  // Update Enquiry Status
  const handleUpdateEnquiry = async (id, status) => {
    try {
      await api.updateEnquiryStatus(id, status);
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e))
      );
    } catch (err) {
      alert('Failed to update enquiry status: ' + err.message);
    }
  };

  // Toggle Amenity in New Property Form
  const toggleNewAmenity = (amenity) => {
    setNewProp((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity]
      };
    });
  };

  // Toggle Amenity in Edit Form
  const toggleEditAmenity = (amenity) => {
    setEditForm((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity]
      };
    });
  };

  // Create New Property
  const handleCreateProperty = async (e) => {
    e.preventDefault();
    try {
      const priceNum = parseFloat(newProp.price);
      const calculatedAgency = newProp.agencyFee ? parseFloat(newProp.agencyFee) : Math.round(priceNum * 0.1);

      await api.createProperty({
        title: newProp.title,
        description: newProp.description,
        price: priceNum,
        serviceCharge: parseFloat(newProp.serviceCharge || 0),
        cautionFee: parseFloat(newProp.cautionFee || 0),
        agencyFee: calculatedAgency,
        rentalPeriod: 'ANNUALLY',
        location: newProp.location,
        area: 'Victoria Island',
        propertyType: newProp.propertyType,
        bedrooms: parseInt(newProp.bedrooms, 10),
        bathrooms: parseInt(newProp.bathrooms, 10),
        toilets: parseInt(newProp.toilets, 10),
        sizesqm: parseInt(newProp.sizesqm || 120, 10),
        totalFloors: parseInt(newProp.totalFloors || 7, 10),
        furnishedStatus: newProp.furnishedStatus,
        availabilityStatus: newProp.availabilityStatus,
        address: newProp.address,
        images: newProp.images.length > 0 ? newProp.images : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'],
        amenities: newProp.amenities,
        isFeatured: newProp.isFeatured,
        agent: {
          name: 'Mrs. Joke Popoola',
          phone: '+234 703 846 2284',
          email: 'akanbisamuel045@gmail.com',
          role: 'Lead Property Agent & Manager, 1004 Estate',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
        }
      });

      alert('1004 Estate listing created successfully!');
      setActiveTab('properties');
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to create listing');
    }
  };

  // Filtered properties for table
  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      searchTerm === '' ||
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCluster = clusterFilter === 'All' || p.location === clusterFilter;
    const matchesStatus = statusFilter === 'All' || p.availabilityStatus === statusFilter;
    return matchesSearch && matchesCluster && matchesStatus;
  });

  // Calculate Metrics
  const totalListings = properties.length;
  const availableCount = properties.filter((p) => p.availabilityStatus === 'Available').length;
  const pendingBookings = bookings.filter((b) => b.status === 'PENDING').length;
  const newEnquiries = enquiries.filter((e) => e.status === 'NEW').length;
  const totalViews = properties.reduce((acc, p) => acc + (p.viewCount || 0), 0);

  return (
    <div className="section" style={{ paddingTop: '32px', minHeight: '80vh', background: '#fafafa' }}>
      <div className="container">
        {/* Admin Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
          paddingBottom: '20px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge" style={{ background: '#000000', color: '#ffffff', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <ShieldCheck size={14} /> 1004 Estate Agent Desk
              </span>
              <span className="explore-badge" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                Victoria Island, Lagos
              </span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-0.03em', color: '#111827', margin: 0 }}>
              Management & Leasing Console
            </h1>
            <p style={{ color: '#4b5563', marginTop: '6px', fontSize: '0.95rem' }}>
              Agent Lead: <strong>Mrs. Joke Popoola</strong> (Direct: +234 703 846 2284) • 1004 Estate Central Administration
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button onClick={fetchData} className="btn btn-secondary btn-sm" title="Refresh all data">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button
              onClick={() => setActiveTab('new-property')}
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={16} /> Add 1004 Listing
            </button>
          </div>
        </div>

        {/* Demo Admin Login Alert (if not logged in as Admin) */}
        {(!user || user.role !== 'ADMIN') && (
          <div style={{
            background: '#fef3c7',
            border: '1px solid #fde68a',
            padding: '14px 20px',
            borderRadius: '10px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#92400e', fontSize: '0.95rem' }}>
              <AlertCircle size={20} />
              <span>You are viewing in review mode. Sign in as <strong>Agent Admin</strong> to activate full verified permissions.</span>
            </div>
            <button
              onClick={handleDemoAdminLogin}
              className="btn btn-primary btn-sm"
              style={{ background: '#78350f', borderColor: '#78350f', color: '#ffffff' }}
            >
              <UserCheck size={14} /> Quick Admin Sign In
            </button>
          </div>
        )}

        {/* Executive Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>
              <span>TOTAL 1004 APARTMENTS</span>
              <Building2 size={18} color="#111827" />
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: '800', color: '#111827' }}>{totalListings}</div>
            <div style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '4px', fontWeight: '600' }}>
              {availableCount} Available for Immediate Lease
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>
              <span>INSPECTION REQUESTS</span>
              <Calendar size={18} color="#0284c7" />
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: '800', color: '#111827' }}>{bookings.length}</div>
            <div style={{ fontSize: '0.8rem', color: pendingBookings > 0 ? '#b45309' : '#6b7280', marginTop: '4px', fontWeight: '600' }}>
              {pendingBookings} Pending Confirmation
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>
              <span>TENANT INQUIRIES</span>
              <MessageSquare size={18} color="#8b5cf6" />
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: '800', color: '#111827' }}>{enquiries.length}</div>
            <div style={{ fontSize: '0.8rem', color: newEnquiries > 0 ? '#ef4444' : '#10b981', marginTop: '4px', fontWeight: '600' }}>
              {newEnquiries} Awaiting Agent Contact
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', fontSize: '0.85rem', fontWeight: '600', marginBottom: '8px' }}>
              <span>ESTATE LISTING VIEWS</span>
              <Eye size={18} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: '800', color: '#111827' }}>{totalViews.toLocaleString()}</div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '4px' }}>
              High-intent tenant engagement
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '2px solid #e5e7eb',
          marginBottom: '24px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}>
          <button
            onClick={() => setActiveTab('properties')}
            style={{
              padding: '10px 18px',
              fontSize: '0.95rem',
              fontWeight: activeTab === 'properties' ? '700' : '500',
              color: activeTab === 'properties' ? '#000000' : '#6b7280',
              borderBottom: activeTab === 'properties' ? '3px solid #000000' : '3px solid transparent',
              background: 'none',
              cursor: 'pointer',
              marginBottom: '-6px'
            }}
          >
            Apartment Listings ({properties.length})
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            style={{
              padding: '10px 18px',
              fontSize: '0.95rem',
              fontWeight: activeTab === 'bookings' ? '700' : '500',
              color: activeTab === 'bookings' ? '#000000' : '#6b7280',
              borderBottom: activeTab === 'bookings' ? '3px solid #000000' : '3px solid transparent',
              background: 'none',
              cursor: 'pointer',
              marginBottom: '-6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Inspection Bookings ({bookings.length})
            {pendingBookings > 0 && (
              <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.75rem', padding: '2px 7px', borderRadius: '10px' }}>
                {pendingBookings}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            style={{
              padding: '10px 18px',
              fontSize: '0.95rem',
              fontWeight: activeTab === 'enquiries' ? '700' : '500',
              color: activeTab === 'enquiries' ? '#000000' : '#6b7280',
              borderBottom: activeTab === 'enquiries' ? '3px solid #000000' : '3px solid transparent',
              background: 'none',
              cursor: 'pointer',
              marginBottom: '-6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Tenant Inquiries ({enquiries.length})
            {newEnquiries > 0 && (
              <span style={{ background: '#f59e0b', color: '#fff', fontSize: '0.75rem', padding: '2px 7px', borderRadius: '10px' }}>
                {newEnquiries}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('new-property')}
            style={{
              padding: '10px 18px',
              fontSize: '0.95rem',
              fontWeight: activeTab === 'new-property' ? '700' : '500',
              color: activeTab === 'new-property' ? '#000000' : '#6b7280',
              borderBottom: activeTab === 'new-property' ? '3px solid #000000' : '3px solid transparent',
              background: 'none',
              cursor: 'pointer',
              marginBottom: '-6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Plus size={15} /> Add New Listing
          </button>
        </div>

        {/* TAB 1: PROPERTIES MANAGEMENT */}
        {activeTab === 'properties' && (
          <div>
            {/* Filter bar */}
            <div style={{
              background: '#ffffff',
              padding: '16px 20px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1', minWidth: '240px' }}>
                <input
                  type="text"
                  placeholder="Search apartment title or block address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                  style={{ maxWidth: '360px', padding: '8px 14px', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: '#4b5563' }}>
                  <Filter size={15} /> Cluster:
                  <select
                    value={clusterFilter}
                    onChange={(e) => setClusterFilter(e.target.value)}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#ffffff', fontSize: '0.88rem' }}
                  >
                    <option value="All">All 1004 Clusters</option>
                    {CLUSTERS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: '#4b5563' }}>
                  Status:
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#ffffff', fontSize: '0.88rem' }}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Rented">Rented</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Listings Table */}
            <div className="admin-table-wrapper" style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
              <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '0.82rem', fontWeight: '700', color: '#4b5563' }}>APARTMENT</th>
                    <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '0.82rem', fontWeight: '700', color: '#4b5563' }}>CLUSTER / BLOCK</th>
                    <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '0.82rem', fontWeight: '700', color: '#4b5563' }}>BEDROOMS</th>
                    <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '0.82rem', fontWeight: '700', color: '#4b5563' }}>ANNUAL RENT</th>
                    <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '0.82rem', fontWeight: '700', color: '#4b5563' }}>STATUS</th>
                    <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '0.82rem', fontWeight: '700', color: '#4b5563' }}>VIEWS</th>
                    <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '0.82rem', fontWeight: '700', color: '#4b5563' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProperties.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                        No apartments match the current filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredProperties.map((prop) => (
                      <tr key={prop.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <img
                              src={prop.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=120&q=80'}
                              alt={prop.title}
                              style={{ width: '56px', height: '42px', objectFit: 'cover', borderRadius: '6px' }}
                            />
                            <div>
                              <div style={{ fontWeight: '700', color: '#111827', fontSize: '0.95rem' }}>
                                {prop.title}
                              </div>
                              <div style={{ fontSize: '0.78rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>{prop.propertyType}</span> • <span>{prop.furnishedStatus}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '0.9rem', color: '#374151' }}>
                          <span className="badge" style={{ background: '#f3f4f6', color: '#1f2937' }}>
                            {prop.location}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '0.9rem', color: '#374151' }}>
                          {prop.bedrooms} Bed • {prop.bathrooms} Bath
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: '700', color: '#000000', fontSize: '0.95rem' }}>
                          {formatPriceNGN(prop.price)}
                          <div style={{ fontSize: '0.75rem', fontWeight: '400', color: '#6b7280' }}>
                            SC: {prop.serviceCharge ? formatPriceNGN(prop.serviceCharge) : '—'}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <select
                            value={prop.availabilityStatus || 'Available'}
                            onChange={(e) => handleToggleStatus(prop, e.target.value)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              border: 'none',
                              cursor: 'pointer',
                              background:
                                prop.availabilityStatus === 'Available'
                                  ? '#dcfce7'
                                  : prop.availabilityStatus === 'Reserved'
                                  ? '#fef3c7'
                                  : '#f3f4f6',
                              color:
                                prop.availabilityStatus === 'Available'
                                  ? '#15803d'
                                  : prop.availabilityStatus === 'Reserved'
                                  ? '#b45309'
                                  : '#4b5563'
                            }}
                          >
                            <option value="Available">Available</option>
                            <option value="Reserved">Reserved</option>
                            <option value="Rented">Rented</option>
                          </select>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '0.9rem', color: '#6b7280' }}>
                          {prop.viewCount || 0}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Link
                              to={`/properties/${prop.id}`}
                              target="_blank"
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '5px 8px', color: '#4b5563' }}
                              title="View live listing in new tab"
                            >
                              <ExternalLink size={14} />
                            </Link>
                            <button
                              onClick={() => handleOpenEdit(prop)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '5px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              title="Edit listing details"
                            >
                              <Edit3 size={14} /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProperty(prop.id, prop.title)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '5px 8px', color: '#ef4444', borderColor: '#fca5a5' }}
                              title="Delete listing"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: INSPECTION BOOKINGS */}
        {activeTab === 'bookings' && (
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#111827', margin: 0 }}>
                  Apartment Inspection & Viewing Appointments
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '4px' }}>
                  Manage scheduled physical inspections across 1004 Estate. Reach out to applicants via WhatsApp or phone call.
                </p>
              </div>
            </div>

            {bookings.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: '#6b7280' }}>
                <Calendar size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                <p>No inspection appointments submitted yet.</p>
              </div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '0.82rem', fontWeight: '700', color: '#4b5563' }}>APPLICANT</th>
                      <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '0.82rem', fontWeight: '700', color: '#4b5563' }}>CONTACT</th>
                      <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '0.82rem', fontWeight: '700', color: '#4b5563' }}>APARTMENT</th>
                      <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '0.82rem', fontWeight: '700', color: '#4b5563' }}>SCHEDULED DATE & TIME</th>
                      <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '0.82rem', fontWeight: '700', color: '#4b5563' }}>STATUS</th>
                      <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '0.82rem', fontWeight: '700', color: '#4b5563' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((bk) => {
                      const cleanPhone = (bk.userPhone || '').replace(/[^0-9]/g, '');
                      const whatsappUrl = cleanPhone
                        ? `https://wa.me/${cleanPhone.startsWith('234') ? cleanPhone : '234' + cleanPhone.replace(/^0/, '')}?text=${encodeURIComponent(
                            `Hello ${bk.userName}, I am Mrs. Joke Popoola from 1004 Estate Management. Regarding your inspection appointment for "${bk.propertyTitle}" on ${bk.inspectionDate} (${bk.timeSlot})...`
                          )}`
                        : null;

                      return (
                        <tr key={bk.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: '700', color: '#111827' }}>{bk.userName}</div>
                            {bk.notes && (
                              <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '3px', fontStyle: 'italic', maxWidth: '240px' }}>
                                Note: {bk.notes}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontSize: '0.9rem', color: '#111827', fontWeight: '600' }}>{bk.userPhone}</div>
                            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{bk.userEmail}</div>
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: '0.9rem', color: '#1f2937', fontWeight: '600' }}>
                            {bk.propertyTitle}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: '700', color: '#111827', fontSize: '0.9rem' }}>{bk.inspectionDate}</div>
                            <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: '600' }}>{bk.timeSlot}</div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span
                              className="badge"
                              style={{
                                background:
                                  bk.status === 'CONFIRMED'
                                    ? '#dcfce7'
                                    : bk.status === 'PENDING'
                                    ? '#fef3c7'
                                    : bk.status === 'COMPLETED'
                                    ? '#e0e7ff'
                                    : '#fee2e2',
                                color:
                                  bk.status === 'CONFIRMED'
                                    ? '#15803d'
                                    : bk.status === 'PENDING'
                                    ? '#b45309'
                                    : bk.status === 'COMPLETED'
                                    ? '#4338ca'
                                    : '#b91c1c'
                              }}
                            >
                              {bk.status}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                              {whatsappUrl && (
                                <a
                                  href={whatsappUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-secondary btn-sm"
                                  style={{
                                    background: '#25D366',
                                    color: '#ffffff',
                                    borderColor: '#25D366',
                                    padding: '5px 10px',
                                    fontSize: '0.8rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                  title="Chat with applicant on WhatsApp"
                                >
                                  <Phone size={13} /> WhatsApp
                                </a>
                              )}

                              {bk.status !== 'CONFIRMED' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(bk.id, 'CONFIRMED', bk.isViewingForm)}
                                  className="btn btn-primary btn-sm"
                                  style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                                >
                                  Confirm
                                </button>
                              )}

                              {bk.status === 'CONFIRMED' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(bk.id, 'COMPLETED', bk.isViewingForm)}
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '5px 10px', fontSize: '0.8rem', color: '#15803d' }}
                                >
                                  Done
                                </button>
                              )}

                              {bk.status !== 'CANCELLED' && (
                                <button
                                  onClick={() => handleUpdateBookingStatus(bk.id, 'CANCELLED', bk.isViewingForm)}
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '5px 8px', fontSize: '0.8rem', color: '#ef4444' }}
                                  title="Cancel inspection"
                                >
                                  <X size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TENANT INQUIRIES */}
        {activeTab === 'enquiries' && (
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#111827', margin: 0 }}>
                  Tenant Inquiry Desk
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '4px' }}>
                  Direct inquiries received from apartment pages or contact forms.
                </p>
              </div>
            </div>

            {enquiries.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: '#6b7280' }}>
                <MessageSquare size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                <p>No tenant enquiries logged yet.</p>
              </div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '0.82rem', fontWeight: '700', color: '#4b5563' }}>TENANT</th>
                      <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '0.82rem', fontWeight: '700', color: '#4b5563' }}>CONTACT</th>
                      <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '0.82rem', fontWeight: '700', color: '#4b5563' }}>PROPERTY</th>
                      <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '0.82rem', fontWeight: '700', color: '#4b5563' }}>MESSAGE</th>
                      <th style={{ textAlign: 'left', padding: '14px 16px', fontSize: '0.82rem', fontWeight: '700', color: '#4b5563' }}>STATUS</th>
                      <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '0.82rem', fontWeight: '700', color: '#4b5563' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.map((enq) => {
                      const cleanPhone = (enq.phone || '').replace(/[^0-9]/g, '');
                      const whatsappUrl = cleanPhone
                        ? `https://wa.me/${cleanPhone.startsWith('234') ? cleanPhone : '234' + cleanPhone.replace(/^0/, '')}?text=${encodeURIComponent(
                            `Hello ${enq.name}, thank you for your enquiry regarding "${enq.propertyTitle}" in 1004 Estate, Victoria Island. How may I assist your apartment search today?`
                          )}`
                        : null;

                      return (
                        <tr key={enq.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '14px 16px', fontWeight: '700', color: '#111827' }}>
                            {enq.name}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontSize: '0.9rem', color: '#111827' }}>{enq.email}</div>
                            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{enq.phone || 'No phone'}</div>
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: '0.9rem', color: '#374151', fontWeight: '600' }}>
                            {enq.propertyTitle}
                          </td>
                          <td style={{ padding: '14px 16px', maxWidth: '300px', fontSize: '0.85rem', color: '#4b5563' }}>
                            {enq.message}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span
                              className="badge"
                              style={{
                                background: enq.status === 'NEW' ? '#fee2e2' : '#dcfce7',
                                color: enq.status === 'NEW' ? '#b91c1c' : '#15803d'
                              }}
                            >
                              {enq.status}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                              {whatsappUrl && (
                                <a
                                  href={whatsappUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-secondary btn-sm"
                                  style={{
                                    background: '#25D366',
                                    color: '#ffffff',
                                    borderColor: '#25D366',
                                    padding: '5px 10px',
                                    fontSize: '0.8rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                  title="Reply on WhatsApp"
                                >
                                  <Phone size={13} /> WhatsApp
                                </a>
                              )}
                              {enq.email && (
                                <a
                                  href={`mailto:${enq.email}?subject=1004 Estate Rental Inquiry: ${encodeURIComponent(enq.propertyTitle || '')}`}
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '5px 8px' }}
                                  title="Send Email"
                                >
                                  <Mail size={13} />
                                </a>
                              )}
                              {enq.status === 'NEW' ? (
                                <button
                                  onClick={() => handleUpdateEnquiry(enq.id, 'RESPONDED')}
                                  className="btn btn-primary btn-sm"
                                  style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                                >
                                  Mark Done
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUpdateEnquiry(enq.id, 'NEW')}
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '5px 8px', fontSize: '0.8rem' }}
                                  title="Reopen enquiry"
                                >
                                  Reopen
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ADD NEW 1004 LISTING */}
        {activeTab === 'new-property' && (
          <div style={{ background: '#ffffff', padding: '36px', borderRadius: '16px', border: '1px solid #e5e7eb', maxWidth: '840px', margin: '0 auto' }}>
            <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', marginBottom: '24px' }}>
              <span className="badge" style={{ background: '#000000', color: '#ffffff', marginBottom: '6px', display: 'inline-block' }}>
                New Listing Form
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#111827', margin: 0 }}>
                Publish New 1004 Estate Apartment
              </h2>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '4px' }}>
                All listings will automatically be attributed to <strong>Mrs. Joke Popoola</strong> with direct WhatsApp inquiry routing.
              </p>
            </div>

            <form onSubmit={handleCreateProperty} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Apartment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern 2-Bedroom Serviced Apartment in Cluster A"
                  value={newProp.title}
                  onChange={(e) => setNewProp({ ...newProp, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    value={newProp.categorySlug}
                    onChange={(e) => {
                      const cat = e.target.value;
                      let beds = '2';
                      let type = 'Apartment';
                      if (cat === '1-bedroom') beds = '1';
                      if (cat === '2-bedroom') beds = '2';
                      if (cat === '3-bedroom') beds = '3';
                      if (cat === '3-bedroom-maisonette') { beds = '3'; type = 'Duplex'; }
                      if (cat === '4-bedroom') { beds = '4'; type = 'Penthouse'; }
                      setNewProp({ ...newProp, categorySlug: cat, bedrooms: beds, propertyType: type });
                    }}
                    className="form-select"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">1004 Estate Cluster / Wing *</label>
                  <select
                    value={newProp.location}
                    onChange={(e) => setNewProp({ ...newProp, location: e.target.value })}
                    className="form-select"
                  >
                    {CLUSTERS.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Annual Rent (NGN ₦) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 7500000"
                    value={newProp.price}
                    onChange={(e) => setNewProp({ ...newProp, price: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Service Charge (NGN ₦)</label>
                  <input
                    type="number"
                    placeholder="e.g. 850000"
                    value={newProp.serviceCharge}
                    onChange={(e) => setNewProp({ ...newProp, serviceCharge: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Caution Deposit (NGN ₦)</label>
                  <input
                    type="number"
                    placeholder="e.g. 400000"
                    value={newProp.cautionFee}
                    onChange={(e) => setNewProp({ ...newProp, cautionFee: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Bedrooms</label>
                  <select
                    value={newProp.bedrooms}
                    onChange={(e) => setNewProp({ ...newProp, bedrooms: e.target.value })}
                    className="form-select"
                  >
                    <option value="1">1 Bedroom</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3 Bedrooms</option>
                    <option value="4">4 Bedrooms</option>
                    <option value="5">5+ Bedrooms</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Bathrooms</label>
                  <select
                    value={newProp.bathrooms}
                    onChange={(e) => setNewProp({ ...newProp, bathrooms: e.target.value })}
                    className="form-select"
                  >
                    <option value="1">1 Bathroom</option>
                    <option value="2">2 Bathrooms</option>
                    <option value="3">3 Bathrooms</option>
                    <option value="4">4 Bathrooms</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Furnishing</label>
                  <select
                    value={newProp.furnishedStatus}
                    onChange={(e) => setNewProp({ ...newProp, furnishedStatus: e.target.value })}
                    className="form-select"
                  >
                    <option value="Furnished">Furnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Availability</label>
                  <select
                    value={newProp.availabilityStatus}
                    onChange={(e) => setNewProp({ ...newProp, availabilityStatus: e.target.value })}
                    className="form-select"
                  >
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Rented">Rented</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Block / Street Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Block A3, Cluster A, 1004 Estate, Victoria Island, Lagos"
                  value={newProp.address}
                  onChange={(e) => setNewProp({ ...newProp, address: e.target.value })}
                  className="form-input"
                />
              </div>

              {/* Media & Image Uploader */}
              <div className="form-group">
                <label className="form-label">Apartment Photos & Media *</label>
                <ImageUploader
                  images={newProp.images}
                  onChange={(updatedImages) => setNewProp({ ...newProp, images: updatedImages })}
                  maxImages={10}
                />
              </div>

              <div className="form-group">
                <label className="form-label">1004 Estate Amenities & Features</label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '8px',
                  background: '#f9fafb',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid #e5e7eb'
                }}>
                  {DEFAULT_AMENITIES.map((amenity) => {
                    const checked = newProp.amenities.includes(amenity);
                    return (
                      <label
                        key={amenity}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          color: '#374151'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleNewAmenity(amenity)}
                          style={{ accentColor: '#000000', width: '16px', height: '16px' }}
                        />
                        {amenity}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Comprehensive Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe unit renovations, natural light, kitchen appointments, lagoon views, proximity to pool/parking..."
                  value={newProp.description}
                  onChange={(e) => setNewProp({ ...newProp, description: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                style={{ padding: '14px', fontSize: '1rem', fontWeight: '700', marginTop: '10px' }}
              >
                <Plus size={18} /> Publish to 1004 Estate Platform
              </button>
            </form>
          </div>
        )}

        {/* EDIT PROPERTY MODAL */}
        {editingProp && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '780px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '14px', marginBottom: '20px' }}>
                <div>
                  <span className="badge" style={{ background: '#000000', color: '#ffffff', marginBottom: '4px' }}>Edit Listing</span>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#111827', margin: 0 }}>
                    {editingProp.title}
                  </h3>
                </div>
                <button
                  onClick={() => setEditingProp(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: '#6b7280' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Apartment Title</label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Annual Rent (NGN ₦)</label>
                    <input
                      type="number"
                      required
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Service Charge (NGN ₦)</label>
                    <input
                      type="number"
                      value={editForm.serviceCharge}
                      onChange={(e) => setEditForm({ ...editForm, serviceCharge: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Caution Deposit (NGN ₦)</label>
                    <input
                      type="number"
                      value={editForm.cautionFee}
                      onChange={(e) => setEditForm({ ...editForm, cautionFee: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Availability Status</label>
                    <select
                      value={editForm.availabilityStatus}
                      onChange={(e) => setEditForm({ ...editForm, availabilityStatus: e.target.value })}
                      className="form-select"
                    >
                      <option value="Available">Available</option>
                      <option value="Reserved">Reserved</option>
                      <option value="Rented">Rented</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Cluster Location</label>
                    <select
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className="form-select"
                    >
                      {CLUSTERS.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Furnishing</label>
                    <select
                      value={editForm.furnishedStatus}
                      onChange={(e) => setEditForm({ ...editForm, furnishedStatus: e.target.value })}
                      className="form-select"
                    >
                      <option value="Furnished">Furnished</option>
                      <option value="Semi-Furnished">Semi-Furnished</option>
                      <option value="Unfurnished">Unfurnished</option>
                    </select>
                  </div>
                </div>

                {/* Edit Form Image Uploader */}
                <div className="form-group">
                  <label className="form-label">Apartment Photos & Media</label>
                  <ImageUploader
                    images={editForm.images}
                    onChange={(updatedImages) => setEditForm({ ...editForm, images: updatedImages })}
                    maxImages={10}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Amenities</label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: '8px',
                    background: '#f9fafb',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    maxHeight: '160px',
                    overflowY: 'auto'
                  }}>
                    {DEFAULT_AMENITIES.map((amenity) => {
                      const checked = editForm.amenities.includes(amenity);
                      return (
                        <label key={amenity} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#374151' }}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleEditAmenity(amenity)}
                            style={{ accentColor: '#000000' }}
                          />
                          {amenity}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    rows={3}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="form-textarea"
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setEditingProp(null)}
                    className="btn btn-secondary btn-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
