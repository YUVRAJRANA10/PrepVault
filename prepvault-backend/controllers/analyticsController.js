const Experience = require('../models/Experience')

async function getCommonQuestions(req, res) {
  try {
    const { company } = req.params

    // Find all experiences for this company from MongoDB
    const experiences = await Experience.find({ 
      company: { $regex: company, $options: 'i' } 
    })

    if (experiences.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: `No experiences found for ${company}` 
      })
    }

    // Flatten all questions into one array
    const allQuestions = experiences.flatMap(e => e.questions)

    // Count frequency of each question
    const frequency = {}
    allQuestions.forEach(q => {
      frequency[q] = (frequency[q] || 0) + 1
    })

    res.json({ 
      success: true,
      company, 
      totalExperiences: experiences.length, 
      questionFrequency: frequency 
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

async function getDifficultySummary(req, res) {
  try {
    // Get all experiences from MongoDB
    const experiences = await Experience.find()

    const summary = { Easy: 0, Medium: 0, Hard: 0 }

    experiences.forEach(e => {
      if (e.difficulty <= 2) summary.Easy++
      else if (e.difficulty === 3) summary.Medium++
      else summary.Hard++
    })

    res.json({ 
      success: true,
      totalExperiences: experiences.length, 
      summary 
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = { getCommonQuestions, getDifficultySummary }