const express = require('express')
const router = express.Router()
const { getCommonQuestions, getDifficultySummary, createDailySnapshot, getDailySnapshots } = require('../controllers/analyticsController')

router.get('/common-questions/:company', getCommonQuestions)
router.get('/difficulty-summary', getDifficultySummary)
router.post('/daily-snapshot', createDailySnapshot)
router.get('/daily-snapshot', getDailySnapshots)
module.exports = router