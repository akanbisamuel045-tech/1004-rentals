# Lagos Rentals — Architecture Document

> Version: 2.0 (Updated post-audit)
> Stage: Production
> Last Updated: 2026-09-16

---

## 1. Project Overview

**1004 Rentals (Lagos Rentals)** is a production-ready apartment rental platform exclusively focused on **1004 Estate, Victoria Island, Lagos, Nigeria**. It connects prospective tenants with verified high-rise flats, executive studios, multi-floor maisonettes, and luxury penthouses across 1004 Estate clusters.

The platform is managed on-site by dedicated leasing agent **Mrs. Joke Popoola** (Direct Phone / WhatsApp: `+234 703 846 2284`).

---

## 2. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend Framework | React (Vite) | 19.x |
| Backend Framework | Node.js + Express | 4.x |
| Language | JavaScript | ES6+ |
| Styling | CSS (Custom variables/utility classes) | — |
| Database | JSON File Store (`server/data/store.json`) | — |
| Authentication | JWT (JSON Web Tokens) | 9.x |
| Password Hashing | bcryptjs | 3.x |
| Image Upload | multer (local uploads) | 2.x |

---

## 3. Project Structure

```
lagos-rentals/
├── client/                     # Frontend Vite + React application
│   ├── public/                 # Static assets (images, logo, icons)
│   ├── src/                    
│   │   ├── components/         # Reusable React components (Navbar, Footer, Modals, Cards)
│   │   ├── context/            # React Context (AuthContext)
│   │   ├── pages/              # Route components (Home, Admin, User Dashboard, Property Details)
│   │   ├── styles/             # Global CSS (`index.css`)
│   │   ├── utils/              # Helper functions (e.g., image loading utils)
│   │   ├── App.jsx             # React Router setup
│   │   └── main.jsx            # Entry point
│   └── package.json            # Client dependencies
│
├── server/                     # Backend Express API
│   ├── data/                   
│   │   ├── store.json          # Primary Database File (JSON)
│   │   └── seedData.js         # Initial mock data for seeding
│   ├── src/
│   │   ├── middleware/         # Express middleware (auth.js, security.js)
│   │   ├── models/             # Database interface (`db.js` class reading from store.json)
│   │   ├── routes/             # API routes (auth, property, booking, enquiry, viewing, upload)
│   │   └── server.js           # Express server entry point
│   └── package.json            # Server dependencies
│
├── uploads/                    # Local storage directory for user-uploaded images
└── package.json                # Root concurrently/NPM scripts runner
```

---

## 4. Key Design Decisions

1. **JSON File Store:** The application relies on an in-memory database initialized from `server/data/store.json`, synchronizing writes back to disk. This removes the need for an external DB provider during this phase of the project while maintaining data persistence.
2. **Component-Based Styling:** Pure CSS is used (`client/src/styles/index.css`) with CSS variables to ensure zero dependency bloat for styling and full control over responsive breakpoints.
3. **JWT Authentication:** Stateful user authentication is managed via JWTs stored in localStorage on the client, validated by `verifyToken` and `isAdmin` middleware on protected Express routes.
4. **Local File Uploads:** Property images uploaded via Admin are stored locally in the `/uploads` directory managed by `multer` and served statically via Express.

---

## 5. Deployment

- **Client:** Can be built using `npm run build` inside `/client` and served statically.
- **Server:** Runs via `node server/src/server.js` and requires the `uploads/` folder to persist across restarts.
- **Environment Variables:** Require `JWT_SECRET`, `PORT`, and client proxy setup.
