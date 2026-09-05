# Lagos Rentals — Architecture Document

> Version: 1.0  
> Stage: 1 — Project Audit & Architecture  
> Last Updated: 2026-09-04

---

## 1. Project Overview

Lagos Rentals is a production-ready apartment rental platform focused on Lagos, Nigeria. It allows prospective tenants to browse, search, filter, and enquire about properties. A secure admin dashboard allows property managers to manage listings, images, enquiries, and viewing requests.

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
| `/` | Home page |
| `/properties` | Property listing + search + filters |
| `/properties/[id]` | Property details |
| `/locations/[slug]` | Neighborhood property listings |
| `/about` | About the agency |
| `/contact` | Contact page |

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
| `/api/properties` | GET, POST | POST: admin |
| `/api/properties/[id]` | GET, PUT, DELETE | PUT/DELETE: admin |
| `/api/enquiries` | GET, POST | GET: admin |
| `/api/viewing-requests` | GET, POST | GET: admin |
| `/api/favorites` | GET, POST, DELETE | authenticated |
| `/api/upload` | POST | admin |

---

## 5. Database Architecture

See `prisma/schema.prisma` for full schema. Key models:

### Models

- **User** — site user, supports roles (USER, ADMIN)
- **Account** — OAuth provider accounts (NextAuth)
- **Session** — user sessions
- **VerificationToken** — email verification
- **Property** — core listing model
- **PropertyImage** — images linked to a property (external URL or local path)
- **Amenity** — master list of amenities
- **PropertyAmenity** — join table (property ↔ amenity)
- **Location** — Lagos neighborhoods (seeded, extensible)
- **Inquiry** — tenant enquiry linked to property
- **ViewingRequest** — viewing appointment request
- **Favorite** — saved property per user

### Key Relationships

```
User          1:N  Inquiry
User          1:N  ViewingRequest
User          1:N  Favorite
User          1:N  Property (as agent/owner)
Property      1:N  PropertyImage
Property      1:N  PropertyAmenity
Property      N:1  Location
Amenity       1:N  PropertyAmenity
Property      1:N  Inquiry
Property      1:N  ViewingRequest
Property      1:N  Favorite
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
