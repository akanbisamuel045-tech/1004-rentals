import { properties as initialProperties, locations as initialLocations, amenitiesList } from "../data/seedData.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Save outside of src to avoid triggering node --watch restarts
const BUNDLED_DATA_FILE = path.join(__dirname, "../../data/store.json");
const DATA_FILE = process.env.VERCEL
  ? path.join("/tmp", "store.json")
  : BUNDLED_DATA_FILE;

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
      favorites: {}, // userId -> array of propertyIds
      analyticsEvents: []
    };
    this.loadFromDisk();
  }

  loadFromDisk() {
    try {
      if (process.env.VERCEL && !fs.existsSync(DATA_FILE) && fs.existsSync(BUNDLED_DATA_FILE)) {
        try {
          fs.writeFileSync(DATA_FILE, fs.readFileSync(BUNDLED_DATA_FILE, "utf-8"), "utf-8");
        } catch (e) {
          // ignore error if copy fails
        }
      }
      const fileToRead = fs.existsSync(DATA_FILE) ? DATA_FILE : (fs.existsSync(BUNDLED_DATA_FILE) ? BUNDLED_DATA_FILE : null);
      if (fileToRead) {
        const raw = fs.readFileSync(fileToRead, "utf-8");
        const parsed = JSON.parse(raw);
        this.data = {
          ...this.data,
          ...parsed,
          users: parsed.users && parsed.users.length > 0 ? parsed.users : this.data.users,
          properties: (parsed.properties || this.data.properties).map((p) => ({
            ...p,
            cluster: p.cluster || p.location || "1004 High-Rise Towers",
            availabilityStatus: p.availabilityStatus || "Available",
            last_verified_at: p.last_verified_at || "2026-09-15T12:00:00.000Z",
            available_from: p.available_from || "2026-09-16T00:00:00.000Z"
          })),
          bookings: parsed.bookings || [],
          favorites: parsed.favorites || {},
          analyticsEvents: parsed.analyticsEvents || []
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
    if (!property) {
      throw new Error("Invalid property ID. This apartment does not exist.");
    }
    const propStatus = (property.availabilityStatus || property.availability || "Available").toLowerCase();
    if (propStatus !== "available") {
      throw new Error(`This apartment is currently marked as ${property.availabilityStatus || 'Unavailable'} and cannot be booked for inspection at this time.`);
    }
    
    // Optional double booking check for the same user/property/date
    const existingBooking = this.data.bookings.find(b => 
      b.propertyId === bookingData.propertyId && 
      b.inspectionDate === bookingData.inspectionDate && 
      (b.userId === bookingData.userId || b.userEmail === bookingData.userEmail)
    );
    if (existingBooking) {
      throw new Error("You already have an inspection scheduled for this apartment on this date.");
    }
    
    const booking = {
      id: `bk-${Date.now()}`,
      userId: bookingData.userId || null,
      userName: bookingData.userName,
      userEmail: bookingData.userEmail,
      userPhone: bookingData.userPhone,
      propertyId: property.id,
      propertyTitle: property.title,
      propertyLocation: property.location,
      propertyPrice: property.price,
      propertyImage: property.images?.[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
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
    this.loadFromDisk();
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

    if (filters.cluster && filters.cluster !== "all") {
      const c = filters.cluster.toLowerCase();
      result = result.filter((p) =>
        (p.cluster && p.cluster.toLowerCase().includes(c)) ||
        (p.location && p.location.toLowerCase().includes(c))
      );
    }

    if (filters.availabilityStatus && filters.availabilityStatus !== "all") {
      result = result.filter((p) =>
        (p.availabilityStatus || "Available").toLowerCase() === filters.availabilityStatus.toLowerCase()
      );
    }

    if (filters.category && filters.category !== "all") {
      const cat = filters.category.toLowerCase();
      if (cat === "1-bedroom") {
        result = result.filter((p) => p.bedrooms === 1);
      } else if (cat === "2-bedroom") {
        result = result.filter((p) => p.bedrooms === 2);
      } else if (cat === "3-bedroom") {
        result = result.filter((p) => p.bedrooms === 3 && p.propertyType !== "Duplex" && p.propertyType !== "Maisonette" && !p.title.toLowerCase().includes("maisonette"));
      } else if (cat === "3-bedroom-maisonette") {
        result = result.filter((p) => p.bedrooms === 3 && (p.propertyType === "Duplex" || p.propertyType === "Maisonette" || p.title.toLowerCase().includes("maisonette")));
      } else if (cat === "4-bedroom") {
        result = result.filter((p) => p.bedrooms >= 4);
      } else if (cat === "available-now") {
        result = result.filter((p) => (p.availabilityStatus || "Available").toLowerCase() === "available");
      } else if (cat === "furnished") {
        result = result.filter((p) => (p.furnishedStatus || "").toLowerCase() === "furnished");
      } else if (cat === "unfurnished") {
        result = result.filter((p) => (p.furnishedStatus || "").toLowerCase() === "unfurnished");
      } else if (cat === "serviced") {
        result = result.filter((p) => (p.furnishedStatus || "").toLowerCase() === "furnished" || (p.serviceCharge && p.serviceCharge > 0) || (p.amenities && p.amenities.some(a => a.toLowerCase().includes("electricity"))));
      }
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
    this.loadFromDisk();
    const prop = this.data.properties.find((p) => p.id === id || p.slug === id);
    if (prop) {
      prop.viewCount = (prop.viewCount || 0) + 1;
      this.saveToDisk();
    }
    return prop;
  }

  createProperty(propertyData) {
    const slugBase = propertyData.slug || propertyData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const newProperty = {
      id: `prop-${Date.now()}`,
      slug: slugBase,
      viewCount: 0,
      cluster: propertyData.cluster || propertyData.location || "1004 High-Rise Towers",
      availabilityStatus: propertyData.availabilityStatus || "Available",
      last_verified_at: propertyData.last_verified_at || new Date().toISOString(),
      available_from: propertyData.available_from || new Date().toISOString(),
      seoTitle: propertyData.seoTitle || "",
      seoDescription: propertyData.seoDescription || "",
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

  // ===================================
  // Dynamic Rental Price Statistics
  // ===================================
  getRentalPriceStats() {
    this.loadFromDisk();
    const categories = [
      {
        slug: "1-bedroom",
        label: "1 Bedroom Executive Apartment",
        description: "Ideal for single executives, consultants, and young corporate professionals.",
        filter: (p) => p.bedrooms === 1
      },
      {
        slug: "2-bedroom",
        label: "2 Bedroom Serviced Flat",
        description: "Popular with couples and executives seeking dedicated home office space.",
        filter: (p) => p.bedrooms === 2
      },
      {
        slug: "3-bedroom",
        label: "3 Bedroom Standard Flat",
        description: "Single-level family flats in 1004 High-Rise Towers & Clusters A through D.",
        filter: (p) => p.bedrooms === 3 && p.propertyType !== "Duplex" && p.propertyType !== "Maisonette" && !p.title.toLowerCase().includes("maisonette")
      },
      {
        slug: "3-bedroom-maisonette",
        label: "3 Bedroom Split-Level Maisonette",
        description: "Two-floor duplex units with high ceilings, large living areas, and internal staircases.",
        filter: (p) => p.bedrooms === 3 && (p.propertyType === "Duplex" || p.propertyType === "Maisonette" || p.title.toLowerCase().includes("maisonette"))
      },
      {
        slug: "4-bedroom",
        label: "4 Bedroom Executive Corner Flat",
        description: "Spacious combined and corner residential units suitable for larger families.",
        filter: (p) => p.bedrooms >= 4
      }
    ];

    const categoryStats = categories.map((cat) => {
      const matching = this.data.properties.filter(cat.filter);
      const prices = matching.map((p) => p.price).filter(Boolean);
      const minPrice = prices.length > 0 ? Math.min(...prices) : null;
      const maxPrice = prices.length > 0 ? Math.max(...prices) : null;
      const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : null;
      const availableCount = matching.filter(
        (p) => (p.availabilityStatus || "Available").toLowerCase() === "available"
      ).length;

      return {
        slug: cat.slug,
        label: cat.label,
        description: cat.description,
        totalInventory: matching.length,
        availableCount,
        minPrice,
        maxPrice,
        avgPrice
      };
    });

    const allPrices = this.data.properties.map((p) => p.price).filter(Boolean);
    const serviceCharges = this.data.properties.map((p) => p.serviceCharge).filter(Boolean);
    const cautionFees = this.data.properties.map((p) => p.cautionFee).filter(Boolean);

    return {
      lastUpdated: new Date().toISOString(),
      estateName: "1004 Estate, Victoria Island, Lagos",
      managingAgency: "JK - CUBE MULTIVENTURES LIMITED",
      totalUnitsTracked: this.data.properties.length,
      availableUnitsCount: this.data.properties.filter(
        (p) => (p.availabilityStatus || "Available").toLowerCase() === "available"
      ).length,
      categories: categoryStats,
      marketOverview: {
        lowestEntryRent: allPrices.length > 0 ? Math.min(...allPrices) : 4800000,
        highestRent: allPrices.length > 0 ? Math.max(...allPrices) : 22000000,
        typicalServiceCharge: serviceCharges.length > 0 ? Math.round(serviceCharges.reduce((a, b) => a + b, 0) / serviceCharges.length) : 1000000,
        typicalCautionDeposit: cautionFees.length > 0 ? Math.round(cautionFees.reduce((a, b) => a + b, 0) / cautionFees.length) : 500000
      }
    };
  }

  // ===================================
  // Analytics & Event Tracking System
  // ===================================
  recordAnalyticsEvent(eventData) {
    if (!this.data.analyticsEvents) this.data.analyticsEvents = [];
    const event = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: eventData.name || "generic_event",
      category: eventData.category || "user_action",
      propertyId: eventData.propertyId || null,
      propertyTitle: eventData.propertyTitle || null,
      page: eventData.page || null,
      source: eventData.source || "web",
      metadata: eventData.metadata || {},
      timestamp: new Date().toISOString()
    };
    this.data.analyticsEvents.unshift(event);
    if (this.data.analyticsEvents.length > 2000) {
      this.data.analyticsEvents = this.data.analyticsEvents.slice(0, 2000);
    }
    this.saveToDisk();
    return event;
  }

  getAnalyticsSummary() {
    this.loadFromDisk();
    const events = this.data.analyticsEvents || [];
    return {
      totalEvents: events.length,
      whatsappClicks: events.filter((e) => e.name === "whatsapp_clicked").length,
      callClicks: events.filter((e) => e.name === "call_clicked").length,
      apartmentViews: events.filter((e) => e.name === "apartment_view").length,
      categoryViews: events.filter((e) => e.name === "apartment_category_view").length,
      bookingStarts: events.filter((e) => e.name === "booking_started" || e.name === "book_now_clicked").length,
      bookingsCompleted: events.filter((e) => e.name === "booking_completed").length,
      viewingRequests: events.filter((e) => e.name === "viewing_request_completed").length,
      recentEvents: events.slice(0, 30)
    };
  }
}

export const db = new DatabaseStore();
