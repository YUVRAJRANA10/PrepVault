function validateExperience(req, res, next) {
  const { company, role, difficulty, questions } = req.body

  if (!company || !role || !String(company).trim() || !String(role).trim()) {
    return res.status(400).json({ success: false, message: 'company and role are required' })
  }

  if (!difficulty || typeof difficulty !== 'number' || difficulty < 1 || difficulty > 5) {
    return res.status(400).json({ success: false, message: 'difficulty must be a number between 1 and 5' })
  }

  if (req.body.rounds !== undefined) {
    if (!Number.isInteger(req.body.rounds) || req.body.rounds < 1 || req.body.rounds > 12) {
      return res.status(400).json({ success: false, message: 'rounds must be an integer between 1 and 12' })
    }
  }
  
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ success: false, message: 'questions must be a non-empty array' })
  }

  const hasInvalidQuestion = questions.some((q) => typeof q !== 'string' || q.trim().length === 0)
  if (hasInvalidQuestion) {
    return res.status(400).json({ success: false, message: 'every question must be a non-empty string' })
  }

  next()
}


module.exports = validateExperience