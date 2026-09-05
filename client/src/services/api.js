const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('lagos_auth_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth
  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async login(credentials) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to get user profile');
    return res.json();
  },

  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update profile');
    return data;
  },

  // Bookings
  async createBooking(bookingData) {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create booking');
    return data;
  },

  async getMyBookings() {
    const res = await fetch(`${API_BASE}/bookings/my`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch your bookings');
    return res.json();
  },

  async updateBookingStatus(id, status) {
    const res = await fetch(`${API_BASE}/bookings/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  // Favorites
  async getMyFavorites() {
    const res = await fetch(`${API_BASE}/favorites/my`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch saved apartments');
    return res.json();
  },

  async toggleFavorite(propertyId) {
    const res = await fetch(`${API_BASE}/favorites/toggle`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ propertyId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to toggle favorite');
    return data;
  },

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
    if (!res.ok) throw new Error('Property not found');
    return res.json();
  },

  async createProperty(propertyData) {
    const res = await fetch(`${API_BASE}/properties`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(propertyData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create property');
    }
    return res.json();
  },

  async deleteProperty(id) {
    const res = await fetch(`${API_BASE}/properties/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
      body: JSON.stringify(enquiryData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to submit enquiry');
    return data;
  },

  async getEnquiries() {
    const res = await fetch(`${API_BASE}/enquiries`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch enquiries');
    return res.json();
  }
};
