import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Trash2, Edit3, MessageSquare, Calendar, Check, X, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { formatPriceNGN } from '../components/PropertyCard';

export default function AdminDashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeTab, setActiveTab] = useState('properties'); // 'properties' | 'enquiries' | 'viewings' | 'new-property'
  
  const [properties, setProperties] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [viewings, setViewings] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  // New Property Form State
  const [newProp, setNewProp] = useState({
    title: '',
    description: '',
    price: '',
    location: 'Lekki Phase 1',
    propertyType: 'Apartment',
    bedrooms: '2',
    bathrooms: '2',
    furnishedStatus: 'Furnished',
    address: '',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    amenities: '24/7 Electricity, Treated Water Supply, Uniformed Security, Fitted Kitchen'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, eRes, vRes, lRes] = await Promise.all([
        api.getProperties(),
        api.getEnquiries(),
        api.getViewings(),
        api.getLocations()
      ]);
      setProperties(pRes.data || []);
      setEnquiries(eRes.data || []);
      setViewings(vRes.data || []);
      setLocations(lRes.data || []);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await api.deleteProperty(id);
      fetchData();
    } catch (err) {
      alert('Failed to delete property');
    }
  };

  const handleUpdateEnquiry = async (id, status) => {
    try {
      await api.updateEnquiryStatus(id, status);
      fetchData();
    } catch (err) {
      alert('Failed to update enquiry status');
    }
  };

  const handleUpdateViewing = async (id, status) => {
    try {
      await api.updateViewingStatus(id, status);
      fetchData();
    } catch (err) {
      alert('Failed to update viewing status');
    }
  };

  const handleCreateProperty = async (e) => {
    e.preventDefault();
    try {
      await api.createProperty({
        title: newProp.title,
        description: newProp.description,
        price: parseFloat(newProp.price),
        location: newProp.location,
        propertyType: newProp.propertyType,
        bedrooms: parseInt(newProp.bedrooms, 10),
        bathrooms: parseInt(newProp.bathrooms, 10),
        furnishedStatus: newProp.furnishedStatus,
        address: newProp.address,
        images: [newProp.imageUrl],
        amenities: newProp.amenities.split(',').map((s) => s.trim()).filter(Boolean),
        isFeatured: false,
        agent: {
          name: 'Samuel Akanbi',
          phone: '+234 802 345 6789',
          email: 'akanbisamuel045@gmail.com'
        }
      });
      alert('Property listed successfully!');
      setActiveTab('properties');
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to create listing');
    }
  };

  return (
    <div className="section" style={{ paddingTop: '40px' }}>
      <div className="container">
        <div className="admin-header">
          <div>
            <span className="badge badge-featured" style={{ marginBottom: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} /> Admin Portal
            </span>
            <h1 style={{ fontSize: '2rem' }}>Lagos Rentals Control Center</h1>
            <p style={{ color: '#64748b' }}>Logged in as <strong>Akanbi Samuel</strong> (akanbisamuel045@gmail.com)</p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={fetchData} className="btn btn-secondary btn-sm">
              <RefreshCw size={14} /> Refresh
            </button>
            <button onClick={() => setActiveTab('new-property')} className="btn btn-primary btn-sm">
              <Plus size={16} /> Add New Listing
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'properties' ? 'active' : ''}`}
            onClick={() => setActiveTab('properties')}
          >
            Listings ({properties.length})
          </button>
          <button
            className={`admin-tab ${activeTab === 'enquiries' ? 'active' : ''}`}
            onClick={() => setActiveTab('enquiries')}
          >
            Tenant Enquiries ({enquiries.length})
          </button>
          <button
            className={`admin-tab ${activeTab === 'viewings' ? 'active' : ''}`}
            onClick={() => setActiveTab('viewings')}
          >
            Viewing Bookings ({viewings.length})
          </button>
          <button
            className={`admin-tab ${activeTab === 'new-property' ? 'active' : ''}`}
            onClick={() => setActiveTab('new-property')}
          >
            + Create Property
          </button>
        </div>

        {/* TAB 1: PROPERTIES */}
        {activeTab === 'properties' && (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Rent (NGN)</th>
                  <th>Views</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((prop) => (
                  <tr key={prop.id}>
                    <td style={{ fontWeight: '600' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={prop.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=100&q=80'}
                          alt={prop.title}
                          style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <span>{prop.title}</span>
                      </div>
                    </td>
                    <td>{prop.location}</td>
                    <td>{prop.propertyType} ({prop.bedrooms} Bed)</td>
                    <td style={{ fontWeight: '700', color: '#0f766e' }}>{formatPriceNGN(prop.price)}</td>
                    <td>{prop.viewCount || 0}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteProperty(prop.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                        title="Delete Property"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="admin-table-wrapper">
            {enquiries.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                No tenant enquiries submitted yet. When users submit the enquiry form, they will appear here.
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Tenant Name</th>
                    <th>Email / Phone</th>
                    <th>Property Title</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((enq) => (
                    <tr key={enq.id}>
                      <td style={{ fontWeight: '600' }}>{enq.name}</td>
                      <td>
                        <div>{enq.email}</div>
                        <small style={{ color: '#64748b' }}>{enq.phone}</small>
                      </td>
                      <td>{enq.propertyTitle}</td>
                      <td style={{ maxWidth: '280px', fontSize: '0.85rem' }}>{enq.message}</td>
                      <td>
                        <span className="badge" style={{
                          background: enq.status === 'NEW' ? '#fef3c7' : '#ccfbf1',
                          color: enq.status === 'NEW' ? '#b45309' : '#0f766e'
                        }}>
                          {enq.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleUpdateEnquiry(enq.id, 'RESPONDED')}
                          className="btn btn-secondary btn-sm"
                          style={{ marginRight: '6px' }}
                        >
                          <Check size={12} /> Mark Done
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 3: VIEWINGS */}
        {activeTab === 'viewings' && (
          <div className="admin-table-wrapper">
            {viewings.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                No inspection bookings logged yet.
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Phone / Email</th>
                    <th>Property</th>
                    <th>Inspection Date & Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {viewings.map((view) => (
                    <tr key={view.id}>
                      <td style={{ fontWeight: '600' }}>{view.name}</td>
                      <td>
                        <div>{view.phone}</div>
                        <small style={{ color: '#64748b' }}>{view.email}</small>
                      </td>
                      <td>{view.propertyTitle}</td>
                      <td>
                        <div>{view.preferredDate}</div>
                        <small style={{ color: '#0f766e', fontWeight: '600' }}>{view.preferredTime}</small>
                      </td>
                      <td>
                        <span className="badge" style={{
                          background: view.status === 'PENDING' ? '#fef3c7' : '#ccfbf1',
                          color: view.status === 'PENDING' ? '#b45309' : '#0f766e'
                        }}>
                          {view.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleUpdateViewing(view.id, 'CONFIRMED')}
                          className="btn btn-primary btn-sm"
                          style={{ marginRight: '6px' }}
                        >
                          Confirm
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 4: NEW PROPERTY FORM */}
        {activeTab === 'new-property' && (
          <div style={{ background: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', maxWidth: '800px' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Create New Lagos Rental Listing</h3>

            <form onSubmit={handleCreateProperty} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Property Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern 3-Bedroom Serviced Apartment with Pool"
                  value={newProp.title}
                  onChange={(e) => setNewProp({ ...newProp, title: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Annual Rent Price (NGN ₦) *</label>
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
                  <label className="form-label">Location / Neighborhood *</label>
                  <select
                    value={newProp.location}
                    onChange={(e) => setNewProp({ ...newProp, location: e.target.value })}
                    className="form-select"
                  >
                    {locations.map((loc) => (
                      <option key={loc.id || loc.slug} value={loc.name}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Property Type</label>
                  <select
                    value={newProp.propertyType}
                    onChange={(e) => setNewProp({ ...newProp, propertyType: e.target.value })}
                    className="form-select"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Duplex">Duplex</option>
                    <option value="Flat">Flat</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Bedrooms</label>
                  <select
                    value={newProp.bedrooms}
                    onChange={(e) => setNewProp({ ...newProp, bedrooms: e.target.value })}
                    className="form-select"
                  >
                    <option value="1">1 Bed</option>
                    <option value="2">2 Beds</option>
                    <option value="3">3 Beds</option>
                    <option value="4">4 Beds</option>
                    <option value="5">5+ Beds</option>
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
              </div>

              <div className="form-group">
                <label className="form-label">Street Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Admiralty Way, Lekki Phase 1, Lagos"
                  value={newProp.address}
                  onChange={(e) => setNewProp({ ...newProp, address: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL (Unsplash or direct link)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newProp.imageUrl}
                  onChange={(e) => setNewProp({ ...newProp, imageUrl: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Amenities (comma-separated)</label>
                <input
                  type="text"
                  placeholder="24/7 Electricity, Swimming Pool, Gym, Security"
                  value={newProp.amenities}
                  onChange={(e) => setNewProp({ ...newProp, amenities: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe the interior, neighborhood features, power supply, security..."
                  value={newProp.description}
                  onChange={(e) => setNewProp({ ...newProp, description: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                <Plus size={16} /> Publish Property Listing
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
