const express = require('express')

const router = express.Router();

const validateExperience = require('../middleware/validationMiddleware')
const { getAllExperiences, createExperience, updateExperience, deleteExperience } = require('../controllers/experienceController')

router.get('/',getAllExperiences)
router.post('/',validateExperience,createExperience)
router.put('/:id',validateExperience,updateExperience)
router.delete('/:id',deleteExperience)

module.exports = router


