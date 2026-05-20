require('dotenv').config()
const mongoose = require('mongoose')
const http = require('http')

const app = require('./app')
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

// Admin unflag action
app.post('/admin/experiences/:id/unflag', async (req, res) => {
  try {
    const Experience = require('./models/Experience')
    const exp = await Experience.findById(req.params.id)
    if (!exp) return res.redirect('/admin/report')
    exp.flagged = false
    await exp.save()
    res.redirect('/admin/report')
  } catch (err) {
    res.status(500).send('Failed to unflag')
  }
})

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