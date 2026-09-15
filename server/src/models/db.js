import { properties as initialProperties, locations as initialLocations, amenitiesList } from "../data/seedData.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Save outside of src to avoid triggering node --watch restarts
const DATA_FILE = path.join(__dirname, "../../data/store.json");

class DatabaseStore {
  constructor() {
    this.data = {
      users: [
        {
          id: "user-admin",
          name: "Akanbi Samuel",
          email: "jkcube85@gmail.com",
          phone: "+234 802 345 6789",
          passwordHash: bcrypt.hashSync("admin123", 10),
          role: "ADMIN",
          createdAt: new Date().toISOString()
        }
      ],
      properties: [...initialProperties],
      locations: [...initialLocations],
      amenities: [...amenitiesList],
      enquiries: [],
      viewings: [],
      bookings: [],
      favorites: {} // userId -> array of propertyIds
    };
    this.loadFromDisk();
  }

  loadFromDisk() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        this.data = {
          ...this.data,
          ...parsed,
          users: parsed.users && parsed.users.length > 0 ? parsed.users : this.data.users,
          bookings: parsed.bookings || [],
          favorites: parsed.favorites || {}
        };
      }
    } catch (err) {
      console.warn("Could not load store from disk, using default seed:", err.message);
    }
  }

  saveToDisk() {
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to save store to disk:", err.message);
    }
  }

  // ===================================
  // User Management & Authentication
  // ===================================
  async createUser({ name, email, phone, password }) {
    const existing = this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error("An account with this email address already exists.");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : "",
      passwordHash,
      role: "USER",
      createdAt: new Date().toISOString()
    };

    this.data.users.push(newUser);
    this.saveToDisk();

    const { passwordHash: _, ...safeUser } = newUser;
    return safeUser;
  }

  async validateUser(email, password) {
    const user = this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return null;

    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  getUserById(id) {
    const user = this.data.users.find((u) => u.id === id);
    if (!user) return null;
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  updateUserProfile(id, { name, phone }) {
    const user = this.data.users.find((u) => u.id === id);
    if (!user) return null;

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    user.updatedAt = new Date().toISOString();

    this.saveToDisk();
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  // ===================================
  // Bookings System
  // ===================================
  createBooking(bookingData) {
    const property = this.data.properties.find((p) => p.id === bookingData.propertyId);
    
    const booking = {
      id: `bk-${Date.now()}`,
      userId: bookingData.userId || null,
      userName: bookingData.userName,
      userEmail: bookingData.userEmail,
      userPhone: bookingData.userPhone,
      propertyId: bookingData.propertyId,
      propertyTitle: property ? property.title : bookingData.propertyTitle || "Apartment Inspection",
      propertyLocation: property ? property.location : "Lagos",
      propertyPrice: property ? property.price : 0,
      propertyImage: property?.images?.[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      inspectionDate: bookingData.inspectionDate,
      timeSlot: bookingData.timeSlot || "10:00 AM - 12:00 PM",
      status: "PENDING",
      notes: bookingData.notes || "",
      createdAt: new Date().toISOString()
    };

    this.data.bookings.unshift(booking);
    this.saveToDisk();
    return booking;
  }

  getUserBookings(userId, userEmail) {
    return this.data.bookings.filter(
      (b) => (userId && b.userId === userId) || (userEmail && b.userEmail?.toLowerCase() === userEmail.toLowerCase())
    );
  }

  getAllBookings() {
    return this.data.bookings;
  }

  updateBookingStatus(id, status) {
    const booking = this.data.bookings.find((b) => b.id === id);
    if (!booking) return null;
    booking.status = status;
    booking.updatedAt = new Date().toISOString();
    this.saveToDisk();
    return booking;
  }

  // ===================================
  // Saved Favorites System
  // ===================================
  toggleFavorite(userId, propertyId) {
    if (!this.data.favorites[userId]) {
      this.data.favorites[userId] = [];
    }

    const index = this.data.favorites[userId].indexOf(propertyId);
    let isSaved = false;

    if (index > -1) {
      this.data.favorites[userId].splice(index, 1);
      isSaved = false;
    } else {
      this.data.favorites[userId].push(propertyId);
      isSaved = true;
    }

    this.saveToDisk();
    return { isSaved, propertyIds: this.data.favorites[userId] };
  }

  getUserFavorites(userId) {
    const propertyIds = this.data.favorites[userId] || [];
    return this.data.properties.filter((p) => propertyIds.includes(p.id));
  }

  getUserFavoriteIds(userId) {
    return this.data.favorites[userId] || [];
  }

  // ===================================
  // Properties Queries
  // ===================================
  getProperties(filters = {}) {
    let result = [...this.data.properties];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (filters.location && filters.location !== "all") {
      result = result.filter((p) => p.location.toLowerCase() === filters.location.toLowerCase());
    }

    if (filters.propertyType && filters.propertyType !== "all") {
      result = result.filter((p) => p.propertyType.toLowerCase() === filters.propertyType.toLowerCase());
    }

    if (filters.bedrooms && filters.bedrooms !== "all") {
      const beds = parseInt(filters.bedrooms, 10);
      result = result.filter((p) => (beds >= 4 ? p.bedrooms >= 4 : p.bedrooms === beds));
    }

    if (filters.furnishedStatus && filters.furnishedStatus !== "all") {
      result = result.filter((p) => p.furnishedStatus.toLowerCase() === filters.furnishedStatus.toLowerCase());
    }

    if (filters.minPrice) {
      result = result.filter((p) => p.price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      result = result.filter((p) => p.price <= parseFloat(filters.maxPrice));
    }

    if (filters.featured === "true") {
      result = result.filter((p) => p.isFeatured);
    }

    if (filters.sort === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sort === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sort === "views") {
      result.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }

  getPropertyById(id) {
    const prop = this.data.properties.find((p) => p.id === id || p.slug === id);
    if (prop) {
      prop.viewCount = (prop.viewCount || 0) + 1;
      this.saveToDisk();
    }
    return prop;
  }

  createProperty(propertyData) {
    const newProperty = {
      id: `prop-${Date.now()}`,
      slug: propertyData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      viewCount: 0,
      createdAt: new Date().toISOString(),
      ...propertyData
    };
    this.data.properties.unshift(newProperty);
    this.saveToDisk();
    return newProperty;
  }

  updateProperty(id, updateData) {
    const index = this.data.properties.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.data.properties[index] = {
      ...this.data.properties[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    this.saveToDisk();
    return this.data.properties[index];
  }

  deleteProperty(id) {
    const index = this.data.properties.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.data.properties.splice(index, 1);
    this.saveToDisk();
    return true;
  }

  getLocations() {
    return this.data.locations.map((loc) => {
      const count = this.data.properties.filter(
        (p) => p.location.toLowerCase() === loc.name.toLowerCase()
      ).length;
      return { ...loc, propertyCount: count };
    });
  }

  createEnquiry(enquiryData) {
    const enquiry = {
      id: `enq-${Date.now()}`,
      status: "NEW",
      createdAt: new Date().toISOString(),
      ...enquiryData
    };
    this.data.enquiries.unshift(enquiry);
    this.saveToDisk();
    return enquiry;
  }

  getEnquiries() {
    return this.data.enquiries;
  }

  updateEnquiryStatus(id, status) {
    const enquiry = this.data.enquiries.find((e) => e.id === id);
    if (!enquiry) return null;
    enquiry.status = status;
    this.saveToDisk();
    return enquiry;
  }

  createViewing(viewingData) {
    const viewing = {
      id: `view-${Date.now()}`,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      ...viewingData
    };
    this.data.viewings.unshift(viewing);
    this.saveToDisk();
    return viewing;
  }

  getViewings() {
    return this.data.viewings;
  }

  updateViewingStatus(id, status) {
    const viewing = this.data.viewings.find((v) => v.id === id);
    if (!viewing) return null;
    viewing.status = status;
    this.saveToDisk();
    return viewing;
  }
}

export const db = new DatabaseStore();
