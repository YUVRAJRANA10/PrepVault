const Experience = require('../models/Experience')

async function getAllExperiences(req, res) {
  try {
    const experiences = await Experience.find().populate('submittedBy', 'username email')
    res.json({ success: true, data: experiences })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

async function createExperience(req, res) {
  try {
    const { company, role, difficulty, questions } = req.body

    const newExperience = await Experience.create({
      company,
      role,
      difficulty,
      questions,
      rounds: req.body.rounds || 1,
      tags: req.body.tags || [],
      tips: req.body.tips || '',
      submittedBy: req.userId // from auth middleware
    })

    const populatedExperience = await newExperience.populate('submittedBy', 'username email')

    res.status(201).json({ success: true, data: populatedExperience })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

async function updateExperience(req, res) {
  try {
    const { id } = req.params

    const experience = await Experience.findById(id)

    if (!experience) {
      return res.status(404).json({ success: false, message: 'Experience not found' })
    }

    // Check if user is the owner
    if (experience.submittedBy.toString() !== req.userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this experience' })
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'submittedBy' && key !== '_id') {
        experience[key] = req.body[key]
      }
    })

    await experience.save()
    const updatedExperience = await experience.populate('submittedBy', 'username email')

    res.json({ success: true, data: updatedExperience })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

async function deleteExperience(req, res) {
  try {
    const { id } = req.params

    const experience = await Experience.findById(id)

    if (!experience) {
      return res.status(404).json({ success: false, message: 'Experience not found' })
    }

    // Check if user is the owner
    if (experience.submittedBy.toString() !== req.userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this experience' })
    }

    await Experience.findByIdAndDelete(id)

    res.json({ success: true, data: experience })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}



module.exports = {
  getAllExperiences,
  createExperience,
  updateExperience,
  deleteExperience
}