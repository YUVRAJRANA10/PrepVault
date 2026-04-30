function validateExperience(req, res, next) {
  let { company, role, difficulty, questions } = req.body

  // Parse numeric fields that come as strings from multipart/form-data
  difficulty = parseInt(difficulty, 10)
  if (req.body.rounds !== undefined) {
    req.body.rounds = parseInt(req.body.rounds, 10)
  }

  // Parse stringified JSON arrays from multipart/form-data
  if (typeof questions === 'string') {
    try {
      questions = JSON.parse(questions)
    } catch (e) {
      // If not valid JSON, treat as single question
      questions = questions.length > 0 ? [questions] : []
    }
  }

  if (!company || !role || !String(company).trim() || !String(role).trim()) {
    return res.status(400).json({ success: false, message: 'company and role are required' })
  }

  if (isNaN(difficulty) || difficulty < 1 || difficulty > 5) {
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

  // Store parsed values back in req.body for the controller
  req.body.questions = questions
  req.body.difficulty = difficulty

  next()
}


module.exports = validateExperience