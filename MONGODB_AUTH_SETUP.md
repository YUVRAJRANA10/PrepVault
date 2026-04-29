# MongoDB Setup & Authentication Guide

## Installation Steps:

### 1. Install Dependencies
```bash
cd prepvault-backend
npm install
```
This will install:
- bcryptjs (password hashing)
- jsonwebtoken (JWT tokens)
- mongoose (MongoDB ODM)
- cors (cross-origin requests)

### 2. Set up MongoDB

#### Option A: Local MongoDB (Recommended for development)
- Download MongoDB Community: https://www.mongodb.com/try/download/community
- Install and run MongoDB locally
- In `.env` file, keep: `MONGODB_URI=mongodb://localhost:27017/prepvault`

#### Option B: MongoDB Atlas (Cloud - Recommended for production)
- Go to https://www.mongodb.com/cloud/atlas
- Create a free account
- Create a cluster
- Get your connection string
- In `.env` file, set: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prepvault`

### 3. Create .env File
Copy `.env.example` to `.env` and update values:
```bash
cp .env.example .env
```

### 4. Start the Backend Server
```bash
npm run dev
```
Server will run on http://localhost:5000

### 5. Test the API

#### Signup (Create Account)
```bash
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}

# Response:
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGc...", // Save this token
  "user": {
    "id": "...",
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

#### Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}

# Response includes token
```

#### Create Experience (Protected - Requires Token)
```bash
POST http://localhost:5000/api/experiences
Content-Type: application/json
Authorization: Bearer {token_from_login}

{
  "company": "Google",
  "role": "Software Engineer",
  "difficulty": 4,
  "questions": ["Design a cache system", "Optimize database"],
  "rounds": 3,
  "tags": ["backend", "system-design"],
  "tips": "Study distributed systems"
}
```

#### Get All Experiences (Public)
```bash
GET http://localhost:5000/api/experiences
```

#### Update Experience (Protected - Must be owner)
```bash
PUT http://localhost:5000/api/experiences/{experienceId}
Content-Type: application/json
Authorization: Bearer {token}

{
  "difficulty": 5,
  "tips": "Updated tips"
}
```

#### Delete Experience (Protected - Must be owner)
```bash
DELETE http://localhost:5000/api/experiences/{experienceId}
Authorization: Bearer {token}
```

## Frontend Integration

Update your React frontend API calls:

### Example: Login and Store Token
```javascript
// api/index.js
const API_URL = 'http://localhost:5000/api'

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const data = await response.json()
  if (data.success) {
    localStorage.setItem('token', data.token)
  }
  return data
}

export const createExperience = async (experienceData) => {
  const token = localStorage.getItem('token')
  const response = await fetch(`${API_URL}/experiences`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(experienceData)
  })
  return response.json()
}

export const getAllExperiences = async () => {
  const response = await fetch(`${API_URL}/experiences`)
  return response.json()
}
```

### Example: Update Component to Use Auth
```jsx
// pages/Home.jsx
import { useState, useEffect } from 'react'
import { login } from '../api/index'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
  }

  return (
    <div>
      {isLoggedIn ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <p>Please login to add experiences</p>
      )}
    </div>
  )
}
```

## What's Changed:

✓ User authentication (signup/login)
✓ JWT token-based authorization
✓ MongoDB database (replacing JSON files)
✓ Password hashing with bcryptjs
✓ Protected routes (only logged-in users can create/edit/delete)
✓ User ownership validation (can only edit own experiences)
✓ CORS enabled for frontend communication

## Next Steps:

1. Install MongoDB
2. Run `npm install` in prepvault-backend
3. Create `.env` file with MongoDB connection
4. Start backend: `npm run dev`
5. Test API endpoints using the examples above
6. Update React frontend to handle authentication (see Frontend Integration section)
7. Add login/signup components to your React app
