# Lagos Rentals — Architecture Document

> Version: 1.0  
> Stage: 1 — Project Audit & Architecture  
> Last Updated: 2026-09-04

---

## 1. Project Overview

**1004 Rentals (Lagos Rentals)** is a production-ready apartment rental platform exclusively focused on **1004 Estate, Victoria Island, Lagos, Nigeria**. It connects prospective tenants with verified high-rise flats, executive studios, multi-floor maisonettes, and luxury penthouses across 1004 Estate clusters (Clusters A, B, C, D, and High-Rise Towers).

The platform is managed on-site by dedicated leasing hostess **Mrs. Joke Popoola** (Direct Phone / WhatsApp: `+234 703 846 2284`).

Rather than overwhelming visitors with an unstructured collection of individual properties on the landing page, the user experience is purposefully architected around **database-driven apartment categories**, guiding tenants seamlessly from category exploration to dedicated listing views, apartment details, and instant inspection booking.

---

## 2. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.x |
| Language | TypeScript | 5.x (strict mode) |
| UI | React | 19.x |
| Styling | Tailwind CSS | 4.x |
| Database | PostgreSQL | 15+ |
| ORM | Prisma | 6.x |
| Authentication | NextAuth v5 (Auth.js) | 5.x beta |
| Validation | Zod | 3.x |
| Forms | React Hook Form + @hookform/resolvers | 7.x |
| Image Storage | Cloudinary or local /uploads (configurable) | — |
| Password Hashing | bcryptjs | 3.x |
| Utilities | clsx, tailwind-merge | latest |

---

## 3. Project Structure

```
lagos-rentals/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Migration history
│   └── seed.ts                # Seed data (realistic Lagos properties)
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (public)/          # Public-facing routes (no auth required)
│   │   │   ├── page.tsx       # Home page
│   │   │   ├── properties/
│   │   │   │   ├── page.tsx   # Property listing + search
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx  # Property details
│   │   │   ├── locations/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx  # Neighborhood listings
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   └── contact/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (auth)/            # Authentication routes
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── account/           # Authenticated user routes
│   │   │   ├── layout.tsx     # Auth guard layout
│   │   │   ├── favorites/
│   │   │   │   └── page.tsx
│   │   │   └── enquiries/
│   │   │       └── page.tsx
│   │   │
│   │   ├── admin/             # Admin-only routes
│   │   │   ├── layout.tsx     # Admin auth guard layout
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── properties/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx
│   │   │   ├── enquiries/
│   │   │   │   └── page.tsx
│   │   │   └── viewing-requests/
│   │   │       └── page.tsx
│   │   │
│   │   └── api/               # API routes
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts
│   │       ├── properties/
│   │       │   ├── route.ts           # GET list, POST create
│   │       │   └── [id]/
│   │       │       └── route.ts       # GET, PUT, DELETE single
│   │       ├── enquiries/
│   │       │   └── route.ts
│   │       ├── viewing-requests/
│   │       │   └── route.ts
│   │       ├── favorites/
│   │       │   └── route.ts
│   │       └── upload/
│   │           └── route.ts
│   │
│   ├── components/            # Shared UI components
│   │   ├── ui/                # Primitive design-system components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── ErrorState.tsx
│   │   │
│   │   ├── layout/            # Layout shell components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Container.tsx
│   │   │
│   │   ├── property/          # Property-specific components
│   │   │   ├── PropertyCard.tsx
│   │   │   ├── PropertyGrid.tsx
│   │   │   ├── PropertyFilters.tsx
│   │   │   ├── PropertyImageGallery.tsx
│   │   │   ├── PropertyMap.tsx
│   │   │   └── PropertyAmenities.tsx
│   │   │
│   │   └── forms/             # Form components
│   │       ├── EnquiryForm.tsx
│   │       ├── ViewingRequestForm.tsx
│   │       └── SearchForm.tsx
│   │
│   ├── lib/                   # Shared utilities and services
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── db.ts              # Prisma client singleton
│   │   ├── utils.ts           # General utilities (cn, formatPrice, etc.)
│   │   ├── validations/       # Zod schemas
│   │   │   ├── property.ts
│   │   │   ├── enquiry.ts
│   │   │   ├── viewing-request.ts
│   │   │   └── auth.ts
│   │   └── errors.ts          # Error handling utilities
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useProperties.ts
│   │   ├── useFavorites.ts
│   │   └── useDebounce.ts
│   │
│   └── types/                 # TypeScript type definitions
│       ├── property.ts
│       ├── user.ts
│       └── api.ts
│
├── public/
│   └── images/                # Static public images
│
├── .env                       # Environment variables (never commit)
├── .env.example               # Example env (committed, no secrets)
├── ARCHITECTURE.md            # This file
├── next.config.ts
├── tailwind.config.ts         # (auto-generated by Tailwind v4)
├── tsconfig.json
├── eslint.config.mjs
└── package.json
```

---

## 4. Routing Architecture

### Public Routes (no authentication required)

| Route | Purpose |
|-------|---------|
| `/` | Home page (Hero, 1004 Estate intro, Category exploration cards, Location highlights, Hostess WhatsApp CTA) |
| `/apartments/[categorySlug]` | Dedicated category listing page (e.g., `/apartments/1-bedroom`, `/apartments/2-bedroom`) |
| `/properties` | Full properties directory fallback + search + multi-filters |
| `/properties/[id]` | Comprehensive apartment details view + inspection booking |
| `/locations/[slug]` | Neighborhood & cluster property listings (e.g., Cluster A, High-Rise Towers) |
| `/about` | Redirects to `/#about` (joined section on homepage) |
| `/contact` | Contact page & Hostess WhatsApp desk |

#### Dedicated Apartment Category Routes
- `/apartments/1-bedroom` — 1-Bedroom Apartments
- `/apartments/2-bedroom` — 2-Bedroom Apartments
- `/apartments/3-bedroom` — 3-Bedroom Apartments
- `/apartments/3-bedroom-maisonette` — 3-Bedroom Maisonettes
- `/apartments/4-bedroom` — 4-Bedroom Apartments

### Authentication Routes

| Route | Purpose |
|-------|---------|
| `/login` | Login page |
| `/register` | Registration page |

### Account Routes (authenticated users only)

| Route | Purpose |
|-------|---------|
| `/account/favorites` | Saved properties |
| `/account/enquiries` | User's submitted enquiries |

### Admin Routes (admin role only)

| Route | Purpose |
|-------|---------|
| `/admin/dashboard` | Overview dashboard |
| `/admin/properties` | Property list |
| `/admin/properties/new` | Add property |
| `/admin/properties/[id]/edit` | Edit property |
| `/admin/enquiries` | All enquiries |
| `/admin/viewing-requests` | All viewing requests |

### API Routes

| Route | Methods | Auth Required |
|-------|---------|--------------|
| `/api/auth/[...nextauth]` | GET, POST | — |
| `/api/categories` | GET | — |
| `/api/categories/[slug]` | GET | — |
| `/api/properties` | GET, POST | POST: admin |
| `/api/properties/[id]` | GET, PUT, DELETE | PUT/DELETE: admin |
| `/api/enquiries` | GET, POST | GET: admin |
| `/api/viewing-requests` | GET, POST | GET: admin |
| `/api/bookings` | GET, POST | GET: admin, POST: public/auth |
| `/api/favorites` | GET, POST, DELETE | authenticated |
| `/api/upload` | POST | admin |

---

## 4.1 1004 Estate Apartment Categories & Homepage Architecture

### Primary User Flow
The primary user flow is streamlined to prioritize category-based discovery over visual overload:

$$\textbf{Homepage} \longrightarrow \textbf{Apartment Category} \longrightarrow \textbf{Available Apartments} \longrightarrow \textbf{Apartment Details} \longrightarrow \textbf{Book Now}$$

### Apartment Categories
The category system is based on the actual residential configurations of 1004 Estate:
1. **1-Bedroom Apartments** (`/apartments/1-bedroom`)
2. **2-Bedroom Apartments** (`/apartments/2-bedroom`)
3. **3-Bedroom Apartments** (`/apartments/3-bedroom`)
4. **3-Bedroom Maisonettes** (`/apartments/3-bedroom-maisonette`)
5. **4-Bedroom Apartments** (`/apartments/4-bedroom`)

> **Database-Driven Rule:** The category system must be **database-driven** rather than hard-coded into individual frontend components. Categories are stored with dynamic metadata (name, slug, description, image, display order) and associated with properties in the data store.

### Homepage Requirements
The homepage must focus on **apartment categories**, not individual apartment listings.

The homepage displays:
- **Hero section**: Welcoming headline, visual imagery of 1004 Estate, and primary CTA.
- **Short introduction to apartments at 1004 Estate**: Highlighting 24/7 dedicated power, treated water, and on-site hostess management.
- **"Explore Apartments" section**:
  - Grid of Apartment Category Cards
  - Category image
  - Short description for each category
  - "View Apartments" button (linking directly to the dedicated category listing page)
- **Brief 1004 Estate / location section**: Overview of the Victoria Island setting, cluster amenities, and security.
- **Contact / WhatsApp CTA**: Direct connection to lead hostess **Mrs. Joke Popoola** (`+234 703 846 2284`).
- **Book Now CTA**: Direct inspection and tour scheduling trigger.
- **Footer**: Global navigation, cluster shortcuts, and hostess desk details.

> **Visual Constraint:** Do **NOT** display a large collection of individual apartments directly on the homepage. Keep the landing experience focused, welcoming, and uncluttered.

### Category Navigation
Each category leads to a dedicated listing page containing only apartments belonging to that category:
- `/apartments/1-bedroom`
- `/apartments/2-bedroom`
- `/apartments/3-bedroom`
- `/apartments/3-bedroom-maisonette`
- `/apartments/4-bedroom`

### Apartment Listing Cards
Each available apartment card on category and listing pages displays:
- **Main image**
- **Apartment title**
- **Bedrooms count**
- **Bathrooms count**
- **Price** (formatted in NGN ₦)
- **Furnishing status** (Furnished, Semi-Furnished, Unfurnished)
- **Cluster/block** where applicable (Cluster A, Cluster B, Cluster C & D, High-Rise Towers)
- **Availability status** (`Available`, `Reserved`, `Rented`)
- **"View Details" button**

### Apartment Details Specification
The apartment details page provides comprehensive property intelligence:
- **Image gallery** (high-resolution photo carousel/mosaic)
- **Description** (detailed property description)
- **Bedrooms**
- **Bathrooms**
- **Toilets** (guest powder rooms / secondary facilities)
- **Living/dining area**
- **Kitchen**
- **Family lounge** (where applicable, especially in Maisonettes and 4-Bedroom units)
- **Balcony** (where applicable, city/lagoon view)
- **Furnishing status**
- **Amenities checklist** (24/7 electricity, treated water, security, pool, elevator, parking)
- **Cluster/block**
- **Floor level** (where applicable)
- **Price & fee breakdown** (Rent, Caution, Service Charge, Legal/Agency)
- **Availability**
- **Location** (1004 Estate, Victoria Island)
- **"Book Now" button** (triggers inspection scheduling)
- **"Contact / WhatsApp" button** (links directly to hostess WhatsApp with prefilled message)

> **Dynamic Data Rule:** Apartment information must be dynamic and retrieved from the database. Do **not** assume that every apartment has identical layouts, renovations, facilities, or amenities.

### Filters Strategy
Keep the homepage simple and uncluttered. Advanced filter features such as:
- Furnished / unfurnished
- Serviced / unserviced
- Price range
- Bedrooms
- Bathrooms
- Cluster / block
- Availability

must be implemented as **filters within the apartment listing pages** where appropriate, rather than making the homepage visually crowded.

### Design Direction
The category section and overall UI must strictly maintain the website's existing design direction:
- **Simple** — clear hierarchies without cognitive friction
- **Light & Clean** — modern whitespace and typography
- **Spacious** — breathable card layouts and section padding
- **Modern & Professional** — crisp outlines and elegant badges
- **Premium but not excessive** — understated luxury tailored to 1004 Estate standards

---

## 5. Database Architecture

See `prisma/schema.prisma` for full schema. Key models:

### Models

- **User** — site user, supports roles (USER, ADMIN)
- **Account** — OAuth provider accounts (NextAuth)
- **Session** — user sessions
- **VerificationToken** — email verification
- **ApartmentCategory** — 1004 Estate category (1-Bed, 2-Bed, 3-Bed, 3-Bed Maisonette, 4-Bed) with name, slug, description, image, and sortOrder
- **Property** — core listing model (includes dynamic layout attributes: bedrooms, bathrooms, toilets, living/dining, kitchen, family lounge, balcony, cluster, floor, furnishing status, availability, rent, fees)
- **PropertyImage** — images linked to a property (external URL or local path)
- **Amenity** — master list of amenities (24/7 power, treated water, security, pool, etc.)
- **PropertyAmenity** — join table (property ↔ amenity)
- **Location** — 1004 Estate clusters & VI location metadata
- **Inquiry** — tenant enquiry linked to property
- **ViewingRequest / Booking** — physical inspection appointment request
- **Favorite** — saved property per user

### Key Relationships

```
ApartmentCategory 1:N Property
User              1:N Inquiry
User              1:N ViewingRequest / Booking
User              1:N Favorite
User              1:N Property (as agent/hostess)
Property          1:N PropertyImage
Property          1:N PropertyAmenity
Property          N:1 Location
Property          N:1 ApartmentCategory
Amenity           1:N PropertyAmenity
Property          1:N Inquiry
Property          1:N ViewingRequest / Booking
Property          1:N Favorite
```

---

## 6. Authentication Architecture

- **Provider:** NextAuth v5 (Auth.js)
- **Adapter:** `@auth/prisma-adapter` (session stored in DB)
- **Strategy:** JWT sessions + database sessions hybrid
- **Credentials:** Email + password (bcryptjs hashed, minimum 8 chars)
- **OAuth:** Google (optional, configured via env)
- **Roles:** `USER` and `ADMIN` stored on `User.role`
- **Guards:** Middleware-based route protection for `/admin/*` and `/account/*`

### Security Rules

- Passwords are NEVER returned from API routes
- Admin routes are protected server-side (middleware + server-side checks)
- Session secrets stored in environment variables only
- `NEXTAUTH_SECRET` required — never hard-coded

---

## 7. Image Management Strategy

- **Stage 11 will implement full image management**
- For early stages: property images are stored as URLs in `PropertyImage.url`
- Seed data uses Unsplash URLs (high-quality, royalty-free)
- Future: Cloudinary upload integration for production
- File validation: type (jpeg, png, webp only), max size 5MB per image
- Images are never stored as binary in PostgreSQL

---

## 8. Validation Strategy

All user input is validated at **two layers**:

1. **Client-side:** React Hook Form + Zod resolver (immediate feedback)
2. **Server-side:** Zod schema validation inside API route handlers (security)

A failed server-side validation always returns a structured error response — never a raw error message exposed to the client.

---

## 9. Error Handling Strategy

- API routes return consistent JSON error shapes: `{ error: string, details?: ZodError }`
- HTTP status codes used properly (400, 401, 403, 404, 409, 422, 500)
- Server errors are logged server-side; generic messages returned to client
- React Error Boundaries used for client-side component errors
- `not-found.tsx` and `error.tsx` at app level
- Loading states via `loading.tsx` (Next.js streaming)

---

## 10. State Management Strategy

- **Server state:** React Server Components fetch data directly via Prisma
- **Client state:** React `useState` / `useReducer` for UI state
- **URL state:** Search/filter params stored in URL query string (`useSearchParams`)
- **No global client state manager** (Redux/Zustand) needed for this scope
- **Form state:** React Hook Form manages all form state

---

## 11. Environment Variables

### Server-only (never exposed to browser)

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_CLOUD_NAME=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### Public (safe to expose, prefix with NEXT_PUBLIC_)

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
```

---

## 12. Performance Strategy

- React Server Components for all data-fetching pages (no client-side fetch waterfall)
- `next/image` for all property images (automatic optimization, WebP, lazy loading)
- Proper Prisma indexes on frequently queried fields
- Pagination on property listings (default 12 per page)
- Route-level code splitting (automatic with App Router)
- Static generation where possible; dynamic rendering for search/filter pages

---

## 13. SEO Strategy

- `generateMetadata()` for all public pages
- Open Graph tags on all pages
- Property-specific structured data (JSON-LD)
- `sitemap.ts` (auto-generated)
- `robots.ts`
- Canonical URLs
- Semantic HTML throughout

---

## 14. Accessibility Strategy

- Semantic HTML (landmarks, headings, lists)
- Keyboard navigable (all interactive elements reachable via Tab)
- Visible focus indicators
- ARIA attributes only where native HTML is insufficient
- Color contrast WCAG AA minimum
- Alt text on all images
- Form labels associated with inputs

---

## 15. Security Checklist (ongoing)

- [ ] SQL injection: Prisma ORM prevents raw SQL injection
- [ ] XSS: React escapes output; CSP headers via `next.config.ts`
- [ ] CSRF: NextAuth handles CSRF tokens automatically
- [ ] Authentication bypass: Server-side session checks on all protected routes
- [ ] IDOR: All resource access validated against session user ID
- [ ] File upload: Type + size validation before processing
- [ ] Rate limiting: API routes protected against spam (Stage 7+)
- [ ] Environment secrets: Never in frontend bundles
- [ ] Dependency audit: `npm audit` run before each release

---

## 16. Stage Dependencies

| Stage | Depends On |
|-------|-----------|
| 2 (Design System) | 1 (Architecture) |
| 3 (Database) | 1 (Architecture) |
| 4 (Home Page) | 2 (Design), 3 (Database) |
| 5 (Property Listing) | 3 (Database), 4 (Home) |
| 6 (Property Details) | 5 (Listing) |
| 7 (Enquiry System) | 6 (Details) |
| 8 (Auth) | 3 (Database) |
| 9 (Favorites) | 8 (Auth) |
| 10 (Admin) | 8 (Auth), 7 (Enquiry) |
| 11 (Images) | 10 (Admin) |
| 12 (Maps) | 6 (Details) |
| 13 (SEO/Perf) | All prior |
| 14 (Security Audit) | All prior |
| 15 (QA) | All prior |
