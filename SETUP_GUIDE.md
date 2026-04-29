# PrepVault Setup - Step by Step Terminal Commands

## Project Structure
```
E:\project\                    ← Your parent folder
└── PrepVault\                 ← Cloned repository
    ├── prepvault-backend\     ← Node.js/Express backend
    ├── prepvault-frontend\    ← React frontend
    └── SETUP_GUIDE.md         ← This file
```

---

## ⚡ STEP 1: Setup Backend (MongoDB + Authentication)

### 1.1 Navigate to backend folder
```bash
cd E:\project\PrepVault\prepvault-backend
```

### 1.2 Clean up and install dependencies
```bash
# Remove old node_modules if they exist
rmdir /s /q node_modules

# Install all packages
npm install
```
**Wait for completion** - This will install:
- bcryptjs, jsonwebtoken, mongoose, cors, and others

### 1.3 Create .env file
```bash
# Copy the example file
copy .env.example .env
```

**Then EDIT the .env file** - Open it and set:
```
MONGODB_URI=mongodb://localhost:27017/prepvault
PORT=5000
JWT_SECRET=prepvault_secret_key_2026
NODE_ENV=development
```

---

## 🗄️ STEP 2: Set Up MongoDB

### Option A: MongoDB Local (Recommended for Development)

**2A.1 Download & Install:**
- Go to: https://www.mongodb.com/try/download/community
- Download for Windows
- Run installer, follow default settings
- MongoDB will start as a service automatically

**2A.2 Verify MongoDB is running:**
```bash
# Open a NEW terminal and run:
mongosh
```
If you see `test>` prompt, MongoDB is working! Type `exit` to close.

---

### Option B: MongoDB Atlas (Cloud - Recommended for Production)

**2B.1 Create account:**
- Go to: https://www.mongodb.com/cloud/atlas
- Sign up for free
- Create a cluster (M0 Free Tier)

**2B.2 Get connection string:**
- Click "Connect" on your cluster
- Select "Drivers" → Node.js
- Copy the connection string
- Replace `<password>` with your password

**2B.3 Update .env file:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prepvault
```

---

## ✅ STEP 3: Test Backend API

### 3.1 Start the backend server
```bash
# Make sure you're in: E:\project\PrepVault\prepvault-backend
npm run dev
```

**You should see:**
```
✓ MongoDB connected successfully
Server is running on port 5000
```

**IMPORTANT:** Keep this terminal OPEN - the server needs to keep running

---

### 3.2 Test authentication in a NEW terminal

Open a **NEW PowerShell terminal**:

**Test 1: Signup (Create Account)**
```bash
$body = @{
    username = "testuser"
    email = "test@example.com"
    password = "password123"
    confirmPassword = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/signup" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {...}
}
```

**SAVE THE TOKEN** from the response!

---

**Test 2: Login**
```bash
$body = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

---

**Test 3: Create Experience (Protected - requires token)**
```bash
$token = "YOUR_TOKEN_HERE"  # Replace with actual token from signup

$body = @{
    company = "Google"
    role = "Software Engineer"
    difficulty = 4
    questions = @("Design a cache", "Optimize DB")
    rounds = 3
    tags = @("backend", "system-design")
    tips = "Study distributed systems"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/experiences" `
  -Method POST `
  -Headers @{
    "Content-Type"="application/json"
    "Authorization"="Bearer $token"
  } `
  -Body $body
```

---

**Test 4: Get All Experiences (Public)**
```bash
Invoke-WebRequest -Uri "http://localhost:5000/api/experiences" `
  -Method GET
```

---

## 🎨 STEP 4: Setup Frontend (React)

### 4.1 Open a NEW terminal and navigate to frontend
```bash
cd E:\project\PrepVault\prepvault-frontend
```

### 4.2 Install dependencies
```bash
npm install
```

### 4.3 Update API configuration
- Open: `src/api/index.js`
- Make sure it has the backend URL:
```javascript
const API_URL = 'http://localhost:5000/api'
```

### 4.4 Start React development server
```bash
npm run dev
```

**You should see:**
```
VITE v... ready in ... ms

➜ Local:   http://localhost:5173/
➜ press h to show help
```

---

## 🚀 STEP 5: Update React Components for Auth

### 5.1 Create a login component
Location: `prepvault-frontend/src/components/LoginModal.jsx`

```jsx
import { useState } from 'react'

export default function LoginModal({ onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await response.json()
    if (data.success) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      onClose()
    }
  }

  return (
    <div>
      <input 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}
```

### 5.2 Update AddExperienceModal.jsx
Add token to the API call:

```javascript
const token = localStorage.getItem('token')

const response = await fetch('http://localhost:5000/api/experiences', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`  // ← Add this line
  },
  body: JSON.stringify(experienceData)
})
```

---

## ✨ STEP 6: Running Everything Together

You now need **3 terminal windows open**:

### Terminal 1: MongoDB (if using local)
```bash
# Only if using local MongoDB
mongosh
```

### Terminal 2: Backend Server
```bash
cd E:\project\PrepVault\prepvault-backend
npm run dev
```

### Terminal 3: Frontend Server
```bash
cd E:\project\PrepVault\prepvault-frontend
npm run dev
```

Then open browser: http://localhost:5173

---

## 🎯 Quick Command Reference

| Task | Command |
|------|---------|
| Install backend deps | `cd prepvault-backend && npm install` |
| Install frontend deps | `cd prepvault-frontend && npm install` |
| Start backend | `npm run dev` (from prepvault-backend) |
| Start frontend | `npm run dev` (from prepvault-frontend) |
| Test API | Use PowerShell commands from Step 3 |
| View MongoDB | `mongosh` in terminal |

---

## ⚠️ Common Issues & Fixes

### Issue: "MongoDB connection failed"
**Fix:** Make sure MongoDB is running:
```bash
mongosh  # Should show prompt without error
```

### Issue: "Port 5000 already in use"
**Fix:** Change PORT in `.env` to 5001 or kill the process

### Issue: "npm install fails"
**Fix:** 
```bash
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Issue: CORS errors in frontend
**Fix:** Make sure `cors` is imported in server.js and running

---

## 📝 Summary

✅ Backend with MongoDB + Authentication  
✅ User login/signup functionality  
✅ Protected experience endpoints  
✅ Frontend React app ready  

Next: Update React components to use the new auth system!
