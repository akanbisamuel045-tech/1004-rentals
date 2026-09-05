import { properties as initialProperties, locations as initialLocations, amenitiesList } from "../data/seedData.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "../data/store.json");

class DatabaseStore {
  constructor() {
    this.data = {
      properties: [...initialProperties],
      locations: [...initialLocations],
      amenities: [...amenitiesList],
      enquiries: [],
      viewings: []
    };
    this.loadFromDisk();
  }

  loadFromDisk() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        this.data = { ...this.data, ...parsed };
      }
    } catch (err) {
      console.warn("Could not load store from disk, using seed data:", err.message);
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

  // Property queries
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

    // Sorting
    if (filters.sort === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sort === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sort === "views") {
      result.sort((a, b) => b.viewCount - a.viewCount);
    } else {
      // default: newest
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

  // Location queries
  getLocations() {
    return this.data.locations.map((loc) => {
      const count = this.data.properties.filter(
        (p) => p.location.toLowerCase() === loc.name.toLowerCase()
      ).length;
      return { ...loc, propertyCount: count };
    });
  }

  // Enquiries
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

  // Viewings
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
