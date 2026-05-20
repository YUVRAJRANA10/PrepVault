require('dotenv').config()
const express = require('express')
const path = require('path')

const app = express()

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

const errorMiddleware = require('./middleware/errorMiddleware')
app.use(errorMiddleware) // must be last

module.exports = app