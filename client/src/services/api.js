const API_BASE = '/api';

export const api = {
  // Properties
  async getProperties(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '' && val !== 'all') {
        query.append(key, val);
      }
    });
    const url = `${API_BASE}/properties${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error fetching properties: ${res.statusText}`);
    return res.json();
  },

  async getPropertyById(id) {
    const res = await fetch(`${API_BASE}/properties/${id}`);
    if (!res.ok) throw new Error(`Property not found`);
    return res.json();
  },

  async createProperty(propertyData) {
    const res = await fetch(`${API_BASE}/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(propertyData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create property');
    }
    return res.json();
  },

  async updateProperty(id, propertyData) {
    const res = await fetch(`${API_BASE}/properties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(propertyData),
    });
    if (!res.ok) throw new Error('Failed to update property');
    return res.json();
  },

  async deleteProperty(id) {
    const res = await fetch(`${API_BASE}/properties/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete property');
    return res.json();
  },

  // Locations
  async getLocations() {
    const res = await fetch(`${API_BASE}/locations`);
    if (!res.ok) throw new Error('Failed to fetch locations');
    return res.json();
  },

  // Enquiries
  async submitEnquiry(enquiryData) {
    const res = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiryData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to submit enquiry');
    return data;
  },

  async getEnquiries() {
    const res = await fetch(`${API_BASE}/enquiries`);
    if (!res.ok) throw new Error('Failed to fetch enquiries');
    return res.json();
  },

  async updateEnquiryStatus(id, status) {
    const res = await fetch(`${API_BASE}/enquiries/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  // Viewings
  async scheduleViewing(viewingData) {
    const res = await fetch(`${API_BASE}/viewings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(viewingData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to schedule viewing');
    return data;
  },

  async getViewings() {
    const res = await fetch(`${API_BASE}/viewings`);
    if (!res.ok) throw new Error('Failed to fetch viewings');
    return res.json();
  },

  async updateViewingStatus(id, status) {
    const res = await fetch(`${API_BASE}/viewings/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  // Auth
  async login(credentials) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  }
};
