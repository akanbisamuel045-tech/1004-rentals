# Lagos Rentals 🇳🇬

A full-stack property rental platform tailored for Lagos, Nigeria. Connects prospective tenants with verified, luxury serviced apartments, penthouses, duplexes, and flats in Lekki Phase 1, Ikoyi, Victoria Island, Ikeja GRA, Yaba, and Surulere.

**Author:** Akanbi Samuel (<akanbisamuel045@gmail.com>)

---

## 🛠️ Tech Stack

- **Frontend (`client/`)**: React 19, Vite, React Router v7, Lucide Icons, Pure CSS3 / HTML5
- **Backend (`server/`)**: Node.js, Express.js REST API, CORS, Dotenv
- **Data Layer**: In-Memory & File-backed Store with authentic Lagos listings, prices in Naira (₦), and verified amenities

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Run Locally (Concurrent Client & Server)
```bash
npm run dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🧭 Key Features

- **Hero Search & Filtering**: Filter by Lagos area, property type, budget, and bedroom count.
- **Curated Neighborhoods**: Explore Lekki, Ikoyi, Victoria Island, Ikeja GRA, Yaba, and Surulere.
- **Detailed Property Views**: High-res image gallery, fee breakdown (rent, service charge, caution fee, legal fee), and amenities checklist.
- **Tenant Enquiry System**: Submit online inquiries directly to the leasing desk.
- **Physical Inspection Booking**: Schedule viewing appointments with preferred date and time slots.
- **WhatsApp Integration**: Direct one-tap WhatsApp chat with leasing agent.
- **Admin Control Center** (`/admin`): Manage listings, publish new rentals, and review tenant inquiries and viewing bookings.

---

## 📡 API Endpoints

- `GET /api/properties` — Get all properties (supports `search`, `location`, `propertyType`, `bedrooms`, `sort`)
- `GET /api/properties/:id` — Get single property by ID or slug
- `POST /api/properties` — Create new listing (Admin)
- `DELETE /api/properties/:id` — Delete listing (Admin)
- `GET /api/locations` — Get neighborhood summaries and counts
- `POST /api/enquiries` — Submit tenant inquiry
- `GET /api/enquiries` — View all tenant inquiries (Admin)
- `POST /api/viewings` — Schedule inspection booking
- `GET /api/viewings` — View all inspection bookings (Admin)
