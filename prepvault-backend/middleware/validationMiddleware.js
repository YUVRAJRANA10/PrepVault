function validateExperience(req, res, next) {
  const { company, role, difficulty, questions } = req.body

  if (!company || !role) {
    return res.status(400).json({ success: false, message: 'company and role are required' })
  }

  if (!difficulty || typeof difficulty !== 'number' || difficulty < 1 || difficulty > 5) {
    return res.status(400).json({ success: false, message: 'difficulty must be a number between 1 and 5' })
  }

  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ success: false, message: 'questions must be a non-empty array' })
  }

  next()
}

module.exports = validateExperience