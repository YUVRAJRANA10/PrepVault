require('dotenv').config()
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const Experience = require('../models/Experience')
const User = require('../models/User')

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')

    const existingCount = await Experience.countDocuments()
    if (existingCount > 0) {
      console.log(`Skipped seeding because ${existingCount} experiences already exist.`)
      await mongoose.disconnect()
      return
    }

    let demoUser = await User.findOne({ email: 'demo@prepvault.com' })
    if (!demoUser) {
      demoUser = await User.create({
        username: 'demouser',
        email: 'demo@prepvault.com',
        password: 'demo123456'
      })
      console.log('Demo user created: demo@prepvault.com')
    }

    const dataPath = path.join(__dirname, '../data/experiences.json')
    const sampleData = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    const experiences = sampleData.map(({ id, submittedBy, ...experience }) => ({
      ...experience,
      submittedBy: demoUser._id
    }))

    const created = await Experience.insertMany(experiences)
    console.log(`Seeded ${created.length} experiences.`)
    console.log('Demo user credentials: demo@prepvault.com / demo123456')

    await mongoose.disconnect()
  } catch (error) {
    console.error('Seeding failed:', error.message)
    await mongoose.disconnect().catch(() => {})
    process.exit(1)
  }
}

seedDatabase()
