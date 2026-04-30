require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const http = require('http')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 5000

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || process.env.DATABASE_URL
async function connectDB() {
  if (!MONGO_URI) {
    console.warn('MONGO_URI not set — running without database connection')
    return
  }
  await mongoose.connect(MONGO_URI)
  console.log('Connected to MongoDB')
}

app.use(express.json()) // middleware: parses incoming JSON request bodies

// View engine for small server-rendered pages (EJS admin/report)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const loggerMiddlewear = require('./middleware/loggerMiddleware')
app.use(loggerMiddlewear)

app.use(express.static('public')) // serves public/index.html at http://localhost:5000/

// Handle file downloads with correct headers
app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename
  const filepath = path.join(__dirname, 'public/uploads', filename)
  
  // Security: prevent directory traversal
  const normalizedPath = path.normalize(filepath)
  if (!normalizedPath.startsWith(path.join(__dirname, 'public/uploads'))) {
    return res.status(403).json({ success: false, message: 'Access denied' })
  }
  
  res.download(filepath, filename, (err) => {
    if (err && !res.headersSent) {
      res.status(404).json({ success: false, message: 'File not found' })
    }
  })
})

const experienceRoutes = require('./routes/experienceRoutes')
app.use('/api/experiences', experienceRoutes)

const analyticsRoutes = require('./routes/analyticsRoutes')
app.use('/api/analytics', analyticsRoutes)

const authRoutes = require('./routes/authRoutes')
app.use('/api/auth', authRoutes)

const userRoutes = require('./routes/userRoutes')
app.use('/api/user', userRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'PrepVault API is running' })
})

// Admin report example (EJS)
app.get('/admin/report', async (req, res) => {
  try {
    const Experience = require('./models/Experience')
    const User = require('./models/User')
    const expCount = await Experience.countDocuments()
    const userCount = await User.countDocuments()
    const exps = await Experience.find().sort({ createdAt: -1 }).limit(20).lean()
    res.render('report', { stats: { expCount, userCount, exps } })
  } catch (err) {
    res.status(500).send('Unable to render report')
  }
})

// Admin actions for report (delete / flag)
app.post('/admin/experiences/:id/delete', async (req, res) => {
  try {
    const Experience = require('./models/Experience')
    await Experience.findByIdAndDelete(req.params.id)
    res.redirect('/admin/report')
  } catch (err) {
    res.status(500).send('Failed to delete')
  }
})

app.post('/admin/experiences/:id/flag', async (req, res) => {
  try {
    const Experience = require('./models/Experience')
    const exp = await Experience.findById(req.params.id)
    if (!exp) return res.redirect('/admin/report')
    exp.flagged = true
    await exp.save()
    res.redirect('/admin/report')
  } catch (err) {
    res.status(500).send('Failed to flag')
  }
})

const errorMiddleware = require('./middleware/errorMiddleware')
app.use(errorMiddleware) // must be last

// Create HTTP server and initialize Socket.IO
const server = http.createServer(app)
const socketHelper = require('./socket')

connectDB().then(() => {
  // initialize sockets after DB connect
  try { socketHelper.init(server) } catch (e) { console.warn('Socket init failed', e.message) }

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}).catch(err => {
  console.error('DB connection error', err.message)
  process.exit(1)
})