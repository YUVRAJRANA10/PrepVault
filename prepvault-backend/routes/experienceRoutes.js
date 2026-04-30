const express = require('express')
const path = require('path')
const fs = require('fs/promises')

const router = express.Router();

const validateExperience = require('../middleware/validationMiddleware')
const authMiddleware = require('../middleware/authMiddleware')
const { getAllExperiences, createExperience, updateExperience, deleteExperience, addComment, upvoteExperience } = require('../controllers/experienceController')

// Multer for attachments with custom storage to preserve filenames
const multer = require('multer')
const uploadsDir = path.join(__dirname, '../public/uploads')

// Ensure uploads directory exists
fs.mkdir(uploadsDir, { recursive: true }).catch(err => console.warn('Could not create uploads dir:', err.message))

// Custom storage engine to preserve original filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    // Preserve original filename with extension
    cb(null, file.originalname)
  }
})

const upload = multer({ storage })

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
			// Use original filename in URL for proper downloads
			exp.attachments.push({ filename: f.originalname, url: `/uploads/${f.originalname}`, mime: f.mimetype })
		}
		await exp.save()
		res.json({ success: true, data: exp })
	} catch (err) {
		res.status(500).json({ success: false, message: err.message })
	}
})

// comments and upvotes
router.post('/:id/comments', authMiddleware, addComment)
router.post('/:id/upvote', authMiddleware, upvoteExperience)

module.exports = router


