const { readExperiences } = require('../utils/fileStorage.js')

async function getCommonQuestions(req, res) {
  const data = await readExperiences()

  const { company } = req.params  // comes from URL: /common-questions/Amazon

  const filtered = data.filter(e => e.company.toLowerCase() === company.toLowerCase())

  if (filtered.length === 0) {
    return res.status(404).json({ success: false, message: `No experiences found for ${company}` })
  }

  // flatten all question arrays into one array
  const allQuestions = filtered.flatMap(e => e.questions)

  // count how many times each question appears
  const frequency = {}
  allQuestions.forEach(q => {
    frequency[q] = (frequency[q] || 0) + 1
  })

  res.json({ company, totalExperiences: filtered.length, questionFrequency: frequency })
}

async function getDifficultySummary(req, res) {
  const data = await readExperiences()

  const summary = { Easy: 0, Medium: 0, Hard: 0 }

  data.forEach(e => {
    if (e.difficulty <= 2) summary.Easy++
    else if (e.difficulty === 3) summary.Medium++
    else summary.Hard++
  })

  res.json({ totalExperiences: data.length, summary })
}

module.exports = { getCommonQuestions, getDifficultySummary }