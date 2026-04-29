const express = require('express')

const router = express.Router();

const validateExperience = require('../middleware/validationMiddleware')
const authMiddleware = require('../middleware/authMiddleware')
const { getAllExperiences, createExperience, updateExperience, deleteExperience } = require('../controllers/experienceController')

// Multer for attachments
const multer = require('multer')
const upload = multer({ dest: './prepvault-backend/public/uploads/' })

router.get('/', getAllExperiences)
// allow file uploads via multipart/form-data (attachments[])
router.post('/', authMiddleware, upload.array('attachments', 6), validateExperience, createExperience)
router.put('/:id', authMiddleware, validateExperience, updateExperience)
router.delete('/:id', authMiddleware, deleteExperience)

// attach files to an existing experience (alternative endpoint)
router.post('/:id/attachments', authMiddleware, upload.array('attachments', 6), async (req, res) => {
	try {
		const Experience = require('../models/Experience')
		const exp = await Experience.findById(req.params.id)
		if (!exp) return res.status(404).json({ success: false, message: 'Experience not found' })
		for (const f of req.files) {
			exp.attachments.push({ filename: f.originalname, url: `/uploads/${f.filename}`, mime: f.mimetype })
		}
		await exp.save()
		res.json({ success: true, data: exp })
	} catch (err) {
		res.status(500).json({ success: false, message: err.message })
	}
})

module.exports = router


