const Experience = require('../models/Experience')
let cloudinaryUtil = null
try { cloudinaryUtil = require('../utils/cloudinary') } catch (e) { cloudinaryUtil = null }

async function getAllExperiences(req, res) {
  // By default hide flagged experiences from public listings.
  // Pass `?includeFlagged=true` to include flagged items (for admin tools).
  const includeFlagged = String(req.query.includeFlagged || '').toLowerCase() === 'true'
  const filter = includeFlagged ? {} : { flagged: { $ne: true } }
  const data = await Experience.find(filter).sort({ createdAt: -1 }).lean()
  res.json(data)
}

async function createExperience(req, res) {
  const { company, role, difficulty, questions } = req.body
  // Support multipart/form-data (attachments) and JSON bodies
  const attachments = []
  if (req.files && req.files.length) {
    // If Cloudinary is configured, files will be in memory buffers
    if (cloudinaryUtil && req.files[0] && req.files[0].buffer) {
      for (const f of req.files) {
        try {
          // upload buffer to Cloudinary
          // eslint-disable-next-line no-await-in-loop
          const result = await cloudinaryUtil.uploadBuffer(f.buffer)
          attachments.push({ filename: result.public_id, url: result.secure_url, mime: f.mimetype })
        } catch (err) {
          // fallback: still push originalname with no remote url
          attachments.push({ filename: f.originalname, url: '', mime: f.mimetype })
        }
      }
    } else {
      for (const f of req.files) {
        attachments.push({ filename: f.originalname, url: `/uploads/${f.originalname}`, mime: f.mimetype })
      }
    }
  }

  // Parse stringified JSON arrays from multipart/form-data
  let tags = req.body.tags || []
  if (typeof tags === 'string') {
    try {
      tags = JSON.parse(tags)
    } catch (e) {
      tags = []
    }
  }

  const doc = new Experience({
    company,
    role,
    difficulty,
    questions,
    rounds: req.body.rounds || 1,
    tags,
    tips: req.body.tips || '',
    notes: req.body.notes || '',
    links: req.body.links ? (typeof req.body.links === 'string' ? JSON.parse(req.body.links) : req.body.links) : [],
    resources: req.body.resources ? (typeof req.body.resources === 'string' ? JSON.parse(req.body.resources) : req.body.resources) : [],
    checklist: req.body.checklist ? (typeof req.body.checklist === 'string' ? JSON.parse(req.body.checklist) : req.body.checklist) : [],
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

async function addComment(req, res) {
  try {
    const { id } = req.params
    const { text } = req.body
    if (!text || String(text).trim().length === 0) return res.status(400).json({ success: false, message: 'Comment text required' })
    const exp = await Experience.findById(id)
    if (!exp) return res.status(404).json({ success: false, message: 'Experience not found' })
    const user = (req.user && req.user.name) || req.body.user || 'Anonymous'
    const comment = { user, text: String(text).trim(), createdAt: new Date() }
    exp.comments.push(comment)
    await exp.save()
    // emit updated experience
    try { require('../socket').getIO().to(`exp:${exp._id}`).emit('experience-updated', exp) } catch (e) {}
    res.json({ success: true, data: comment })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

async function upvoteExperience(req, res) {
  try {
    const { id } = req.params
    const exp = await Experience.findById(id)
    if (!exp) return res.status(404).json({ success: false, message: 'Experience not found' })
    const userId = (req.user && (req.user.id || req.user._id)) ? String(req.user.id || req.user._id) : null
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required to upvote' })
    exp.upvoters = exp.upvoters || []
    const already = exp.upvoters.map(String).includes(userId)
    if (already) {
      // toggle: remove upvote
      exp.upvoters = exp.upvoters.filter(u => String(u) !== userId)
    } else {
      exp.upvoters.push(userId)
    }
    exp.upvotes = exp.upvoters.length
    await exp.save()
    try { require('../socket').getIO().to(`exp:${exp._id}`).emit('experience-updated', exp) } catch (e) {}
    res.json({ success: true, data: { upvotes: exp.upvotes, liked: !already } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getAllExperiences, createExperience, updateExperience, deleteExperience, addComment, upvoteExperience }

