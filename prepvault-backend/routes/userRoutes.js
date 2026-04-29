const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const { getMe, getUserExperiences, toggleFavorite } = require('../controllers/userController')

router.get('/me', authMiddleware, getMe)
router.get('/my-experiences', authMiddleware, getUserExperiences)
router.post('/toggle-favorite', authMiddleware, toggleFavorite)

module.exports = router
