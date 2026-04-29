require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/database')

const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors())
app.use(express.json())

const loggerMiddleware = require('./middleware/loggerMiddleware')
app.use(loggerMiddleware)

app.use(express.static('public'))

// Routes
const authRoutes = require('./routes/authRoutes')
const experienceRoutes = require('./routes/experienceRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')

app.use('/api/auth', authRoutes)
app.use('/api/experiences', experienceRoutes)
app.use('/api/analytics', analyticsRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'PrepVault API is running' })
})

const errorMiddleware = require('./middleware/errorMiddleware')
app.use(errorMiddleware)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})