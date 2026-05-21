const express = require('express')
const path = require('path')
const fs = require('fs/promises')

const router = express.Router();

const validateExperience = require('../middleware/validationMiddleware')
const authMiddleware = require('../middleware/authMiddleware')
const { getAllExperiences, createExperience, updateExperience, deleteExperience, addComment, upvoteExperience } = require('../controllers/experienceController')

// Multer for attachments. Use Cloudinary (memory storage) when configured, else disk storage for demo.
const multer = require('multer')
const uploadsDir = path.join(__dirname, '../public/uploads')

// Ensure uploads directory exists for disk fallback
fs.mkdir(uploadsDir, { recursive: true }).catch(err => console.warn('Could not create uploads dir:', err.message))

const useCloudinary = Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
let upload
if (useCloudinary) {
	// store in memory so we can upload buffers to Cloudinary
	upload = multer({ storage: multer.memoryStorage() })
} else {
	// Custom storage engine to preserve original filenames
	const storage = multer.diskStorage({
		destination: (req, file, cb) => cb(null, uploadsDir),
		filename: (req, file, cb) => cb(null, file.originalname)
	})
	upload = multer({ storage })
}

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
		// If Cloudinary configured, upload buffers
		if (useCloudinary && req.files && req.files[0] && req.files[0].buffer) {
			const cloud = require('../utils/cloudinary')
			for (const f of req.files) {
				try {
					// eslint-disable-next-line no-await-in-loop
					const result = await cloud.uploadBuffer(f.buffer)
					exp.attachments.push({ filename: result.public_id, url: result.secure_url, mime: f.mimetype })
				} catch (err) {
					exp.attachments.push({ filename: f.originalname, url: '', mime: f.mimetype })
				}
			}
		} else {
			for (const f of req.files) {
				exp.attachments.push({ filename: f.originalname, url: `/uploads/${f.originalname}`, mime: f.mimetype })
			}
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


