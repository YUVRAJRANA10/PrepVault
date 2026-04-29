const express = require('express')

const router = express.Router();

const validateExperience = require('../middleware/validationMiddleware')
const authenticate = require('../middleware/authMiddleware')
const { getAllExperiences, createExperience, updateExperience, deleteExperience } = require('../controllers/experienceController')

// Get all experiences (public)
router.get('/', getAllExperiences)

// Create experience (protected - requires login)
router.post('/', authenticate, validateExperience, createExperience)

// Update experience (protected - requires login)
router.put('/:id', authenticate, validateExperience, updateExperience)

// Delete experience (protected - requires login)
router.delete('/:id', authenticate, deleteExperience)

module.exports = router


