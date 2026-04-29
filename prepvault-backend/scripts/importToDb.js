require('dotenv').config()
const fs = require('fs/promises')
const path = require('path')
const mongoose = require('mongoose')
const Experience = require('../models/Experience')

async function run() {
  const uri = process.env.MONGO_URI || process.env.DATABASE_URL
  if (!uri) {
    throw new Error('MONGO_URI is missing in .env')
  }

  await mongoose.connect(uri)

  const dataPath = path.join(__dirname, '../data/experiences.json')
  const raw = await fs.readFile(dataPath, 'utf8')
  const docs = JSON.parse(raw)

  if (!Array.isArray(docs) || docs.length === 0) {
    throw new Error('No documents found in data/experiences.json')
  }

  await Experience.deleteMany({})
  await Experience.insertMany(docs)

  console.log(`Imported ${docs.length} experiences into MongoDB`) 
  await mongoose.disconnect()
}

run().catch(async (err) => {
  console.error('Import failed:', err.message)
  try {
    await mongoose.disconnect()
  } catch {}
  process.exit(1)
})
