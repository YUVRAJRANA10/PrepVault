# PrepVault 🔐

A community-driven interview experience vault. Browse, filter, and share real interview experiences from top companies.

---

## Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org/) (v18 or above)
- npm (comes with Node.js)

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

## Environment

Create `prepvault-backend/.env` with at least:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
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

---

## Tech Stack

- **Backend** — Node.js, Express.js v5, fs/promises, Morgan, dotenv
- **Frontend** — React (Vite), React Router, Framer Motion, Axios
- **Storage** — MongoDB (Mongoose)
