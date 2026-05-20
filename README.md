# PrepVault 🔐

A community-driven interview experience vault. Browse, filter, and share real interview experiences from top companies.

---

## Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org/) (v18 or above)
- npm (comes with Node.js)

---

## ⚡ Quick Start (2 Terminal Windows)

**Terminal 1 — Backend:**
```bash
cd prepvault-backend
npm install
npm run dev
# Backend runs on port 5000
```

**Terminal 2 — Frontend:**
```bash
cd prepvault-frontend
npm install
npm run dev
# Frontend runs on port 5173
```

Then open **http://localhost:5173** in your browser.

---

## Project Structure

```
PrepVault/
├── prepvault-backend/    ← Express API (Port 5000)
└── prepvault-frontend/   ← React + Vite app (Port 5173)
```

---

## Setup & Run

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd PrepVault
```

---

### 2. Backend

```bash
cd prepvault-backend
npm install
```

Create a `.env` file inside `prepvault-backend/`:

```
PORT=5000
```

Start the backend:

```bash
npm run dev
```

Backend runs at → `http://localhost:5000`

---

### 3. Frontend

Open a **new terminal**, then:

```bash
cd prepvault-frontend
npm install
npm run dev
```

Frontend runs at → `http://localhost:5173`

---

## Ports Configuration (Important!)

| Service | Port | URL | Notes |
|---------|------|-----|-------|
| **Backend API** | 5000 | `http://localhost:5000` | Express server, APIs, file serving |
| **Socket.IO** | 5000 | `http://localhost:5000/socket.io` | Real-time events (same as backend) |
| **Frontend** | 5173 | `http://localhost:5173` | Vite dev server (React app) |

**Vite Proxy:** The frontend automatically proxies requests to the backend:
- `/api/*` → `http://localhost:5000/api/*`
- `/uploads/*` → `http://localhost:5000/uploads/*`

**Important:** All team members must use these exact ports for the app to work correctly.

---

## Environment

Create `prepvault-backend/.env` with at least:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
POSTGRES_URL=postgresql://username:password@localhost:5432/prepvault_analytics
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

The backend now creates `prepvault-backend/logs/` automatically if it does not exist, so teammates do not need to create the folder manually.

---

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/experiences` | Get all experiences |
| POST | `/api/experiences` | Submit a new experience |
| PUT | `/api/experiences/:id` | Update an experience |
| DELETE | `/api/experiences/:id` | Delete an experience |
| GET | `/api/analytics/difficulty-summary` | Difficulty breakdown |
| GET | `/api/analytics/common-questions/:company` | Top questions by company |
| POST | `/api/analytics/daily-snapshot` | Save daily analytics snapshot (PostgreSQL) |
| GET | `/api/analytics/daily-snapshot?limit=30` | Read analytics snapshots (PostgreSQL) |

---

## Tech Stack

- **Backend** — Node.js, Express.js v5, fs/promises, Morgan, dotenv
- **Frontend** — React (Vite), React Router, Framer Motion, Axios
- **Storage** — MongoDB (Mongoose)
- **Analytics** — PostgreSQL + Prisma
- **Uploads** — Multer + Cloudinary

---

## Testing (Jest)

Run backend unit tests:

```bash
cd prepvault-backend
npm test
```

---

## Deployment (Vercel + Render)

**Frontend (Vercel)**
- Build command: `npm run build`
- Output directory: `dist`

**Backend (Render)**
- Start command: `node server.js`
- Add env vars from `.env` (MONGO_URI, JWT_SECRET, POSTGRES_URL, Cloudinary keys)
