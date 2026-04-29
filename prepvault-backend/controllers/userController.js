const User = require('../models/User')
const Experience = require('../models/Experience')

async function getMe(req, res) {
  const user = await User.findById(req.user._id)
    .select('-passwordHash')
    .populate('savedFavorites', 'company role difficulty')
    .lean()
  
  if (!user) return res.status(404).json({ success: false, message: 'User not found' })
  res.json({ success: true, data: user })
}

async function getUserExperiences(req, res) {
  const userId = req.user._id
  const experiences = await Experience.find().select('-__v').lean()
  
  const userSubmitted = experiences.filter(exp => 
    exp.submittedBy && exp.submittedBy.toLowerCase() === req.user.name.toLowerCase()
  )
  
  res.json({ success: true, data: userSubmitted })
}

async function toggleFavorite(req, res) {
  const { experienceId } = req.body
  if (!experienceId) {
    return res.status(400).json({ success: false, message: 'experienceId required' })
  }

  const user = await User.findById(req.user._id)
  if (!user) return res.status(404).json({ success: false, message: 'User not found' })

  const idx = user.savedFavorites.indexOf(experienceId)
  if (idx > -1) {
    user.savedFavorites.splice(idx, 1)
  } else {
    user.savedFavorites.push(experienceId)
  }

  await user.save()
  
  const updated = await user.populate('savedFavorites', 'company role difficulty')
  res.json({ success: true, data: { savedFavorites: updated.savedFavorites } })
}

module.exports = { getMe, getUserExperiences, toggleFavorite }
