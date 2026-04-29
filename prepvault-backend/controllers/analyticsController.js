const Experience = require('../models/Experience')

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

module.exports = { getCommonQuestions, getDifficultySummary }