const Experience = require('../models/Experience')

async function getAllExperiences(req, res) {
  const data = await Experience.find().sort({ createdAt: -1 }).lean()
  res.json(data)
}

async function createExperience(req, res) {
  const { company, role, difficulty, questions } = req.body
  // Support multipart/form-data (attachments) and JSON bodies
  const attachments = []
  if (req.files && req.files.length) {
    for (const f of req.files) {
      attachments.push({ filename: f.originalname, url: `/uploads/${f.filename}`, mime: f.mimetype })
    }
  }

  const doc = new Experience({
    company,
    role,
    difficulty,
    questions,
    rounds: req.body.rounds || 1,
    tags: req.body.tags || [],
    tips: req.body.tips || '',
    notes: req.body.notes || '',
    links: req.body.links ? JSON.parse(req.body.links) : (req.body.links || []),
    resources: req.body.resources ? JSON.parse(req.body.resources) : (req.body.resources || []),
    checklist: req.body.checklist ? JSON.parse(req.body.checklist) : (req.body.checklist || []),
    attachments,
    submittedBy: (req.user && req.user.name) || req.body.submittedBy || 'Anonymous'
  })
  await doc.save()

  // Emit socket event if available
  try {
    const socketHelper = require('../socket')
    const io = socketHelper.getIO()
    io.emit('new-experience', doc)
  } catch (err) {
    // socket may not be initialized in some environments — ignore silently
  }

  res.status(201).json({ success: true, data: doc })
}

async function updateExperience(req, res) {
  const { id } = req.params
  // allow array/stringified JSON fields in multipart requests
  const updatePayload = { ...req.body }
  if (req.body.links && typeof req.body.links === 'string') {
    try { updatePayload.links = JSON.parse(req.body.links) } catch (e) {}
  }
  if (req.body.resources && typeof req.body.resources === 'string') {
    try { updatePayload.resources = JSON.parse(req.body.resources) } catch (e) {}
  }
  if (req.body.checklist && typeof req.body.checklist === 'string') {
    try { updatePayload.checklist = JSON.parse(req.body.checklist) } catch (e) {}
  }

  const updated = await Experience.findByIdAndUpdate(id, updatePayload, { new: true, runValidators: true }).lean()
  if (!updated) return res.status(404).json({ success: false, message: 'Experience not found' })
  res.json({ success: true, data: updated })
}

async function deleteExperience(req, res) {
  const { id } = req.params
  const deleted = await Experience.findByIdAndDelete(id).lean()
  if (!deleted) return res.status(404).json({ success: false, message: 'Experience not found' })
  res.json({ success: true, data: deleted })
}

module.exports = { getAllExperiences, createExperience, updateExperience, deleteExperience }
