const mongoose = require('mongoose')

async function connectDB() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/prepvault'
    
    await mongoose.connect(MONGODB_URI)
    
    console.log('✓ MongoDB connected successfully')
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

module.exports = connectDB
