const Experience = require('../models/Experience')
const User = require('../models/User')
const prisma = require('../utils/prismaClient')

function startOfUtcDay(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

async function getCommonQuestions(req, res) {
  const { company } = req.params
  const docs = await Experience.find({ company: { $regex: `^${company}$`, $options: 'i' } })
    .select({ questions: 1 })
    .lean()

  if (docs.length === 0) {
    return res.status(404).json({ success: false, message: `No experiences found for ${company}` })
  }

  const allQuestions = docs.flatMap(e => Array.isArray(e.questions) ? e.questions : [])
  const frequency = {}
  allQuestions.forEach(q => {
    frequency[q] = (frequency[q] || 0) + 1
  })

  res.json({ company, totalExperiences: docs.length, questionFrequency: frequency })
}

async function getDifficultySummary(req, res) {
  const data = await Experience.find().select({ difficulty: 1 }).lean()
  const summary = { Easy: 0, Medium: 0, Hard: 0 }

  data.forEach(e => {
    if (e.difficulty <= 2) summary.Easy++
    else if (e.difficulty === 3) summary.Medium++
    else summary.Hard++
  })

  res.json({ totalExperiences: data.length, summary })
}

async function createDailySnapshot(req, res) {
  try {
    const [expCount, userCount] = await Promise.all([
      Experience.countDocuments(),
      User.countDocuments()
    ])

    const day = startOfUtcDay(new Date())
    const snapshot = await prisma.dailyStats.upsert({
      where: { day },
      update: { totalExperiences: expCount, totalUsers: userCount },
      create: { day, totalExperiences: expCount, totalUsers: userCount }
    })

    res.json({ success: true, data: snapshot })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

async function getDailySnapshots(req, res) {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 30, 180)
    const data = await prisma.dailyStats.findMany({
      orderBy: { day: 'desc' },
      take: limit
    })
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getCommonQuestions, getDifficultySummary, createDailySnapshot, getDailySnapshots }